import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindmatch';

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
    console.log('🗄️  MongoDB connected');
  }
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  await connectDB();

  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    path: '/api/socket',
  });

  // Import models dynamically to ensure they're registered
  const { default: Room } = await import('./models/Room');
  const { default: Answer } = await import('./models/Answer');
  const { default: Question } = await import('./models/Question');
  const { computeScore } = await import('./lib/scoring');
  const { assignBadges } = await import('./lib/badges');
  const { generateAIInsights } = await import('./lib/ai');
  const { default: Result } = await import('./models/Result');

  // Track active timers per room
  const roomTimers = new Map<string, NodeJS.Timeout>();

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // ---- JOIN ROOM ----
    socket.on('join_room', async ({ code, nickname }: { code: string; nickname: string }) => {
      try {
        const room = await Room.findOne({ code: code.toUpperCase() });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }
        if (room.status === 'finished') {
          socket.emit('error', { message: 'This game has already finished' });
          return;
        }
        if (room.players.length >= 2 && !room.players.find(p => p.nickname === nickname)) {
          socket.emit('error', { message: 'Room is full' });
          return;
        }

        // Add or update player
        const existingPlayerIdx = room.players.findIndex(p => p.nickname === nickname);
        const userId = `${code}-${nickname}`.toLowerCase().replace(/\s+/g, '-');

        if (existingPlayerIdx >= 0) {
          room.players[existingPlayerIdx].socketId = socket.id;
          room.players[existingPlayerIdx].ready = false;
        } else {
          room.players.push({
            userId,
            nickname,
            socketId: socket.id,
            ready: false,
            joinedAt: new Date(),
          });
        }

        await room.save();
        socket.join(room._id.toString());

        // Store room/user info in socket data
        socket.data.roomId = room._id.toString();
        socket.data.userId = userId;
        socket.data.nickname = nickname;

        socket.emit('room_state', room.toObject());
        io.to(room._id.toString()).emit('player_joined', {
          player: { userId, nickname },
          players: room.players,
        });

        console.log(`👤 ${nickname} joined room ${code}`);
      } catch (err) {
        console.error('join_room error:', err);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // ---- PLAYER READY ----
    socket.on('player_ready', async ({ roomId }: { roomId: string }) => {
      try {
        const room = await Room.findById(roomId);
        if (!room) return;

        const player = room.players.find(p => p.socketId === socket.id);
        if (player) {
          player.ready = true;
          await room.save();
        }

        io.to(roomId).emit('player_ready_update', { players: room.players });

        // Check if both players are ready
        const allReady = room.players.length === 2 && room.players.every(p => p.ready);
        if (allReady && room.status === 'waiting') {
          // Start the game
          room.status = 'playing';
          room.currentQuestionIndex = 0;
          await room.save();

          // Fetch first question
          const question = await Question.findById(room.questionIds[0]);
          if (question) {
            io.to(roomId).emit('game_started', {
              question: question.toObject(),
              index: 0,
              total: room.questionIds.length,
            });
            console.log(`🎮 Game started in room ${room.code}`);

            // Start timer if enabled
            if (room.config.timerEnabled) {
              startQuestionTimer(io, roomId, room.config.timerSeconds, room, room.questionIds[0]);
            }
          }
        }
      } catch (err) {
        console.error('player_ready error:', err);
      }
    });

    // ---- SUBMIT ANSWER ----
    socket.on('submit_answer', async ({
      roomId,
      questionId,
      answer,
      prediction,
    }: {
      roomId: string;
      questionId: string;
      answer: string | number;
      prediction?: string | number | null;
    }) => {
      try {
        const room = await Room.findById(roomId);
        if (!room || room.status !== 'playing') return;

        const question = await Question.findById(questionId);
        if (!question) return;

        // Save answer
        await Answer.findOneAndUpdate(
          { roomId, userId: socket.data.userId, questionId },
          {
            roomId,
            userId: socket.data.userId,
            nickname: socket.data.nickname,
            questionId,
            questionIndex: room.currentQuestionIndex,
            answer,
            prediction: prediction ?? null,
            category: question.category,
          },
          { upsert: true, new: true }
        );

        // Calculate how many users have fully answered
        const answers = await Answer.find({ roomId, questionId });
        let fullyAnsweredCount = 0;

        for (const ans of answers) {
          if (ans.answer !== undefined && ans.answer !== null) {
            if (room.config.predictionMode && question.isPrediction) {
              if (ans.prediction !== undefined && ans.prediction !== null) {
                fullyAnsweredCount++;
              }
            } else {
              fullyAnsweredCount++;
            }
          }
        }
        
        socket.emit('answer_received', { questionId });

        if (fullyAnsweredCount === 1) {
          // Notify the answerer that we're waiting for their partner
          socket.emit('waiting_for_partner');
          // Notify the other player
          socket.to(roomId).emit('partner_answered');
        }

        if (fullyAnsweredCount >= 2) {
          // Clear timer for this question
          clearQuestionTimer(roomId);

          io.to(roomId).emit('both_answered', { questionId });

          // Advance to next question after brief delay
          setTimeout(async () => {
            const nextIndex = room.currentQuestionIndex + 1;
            
            if (nextIndex >= room.questionIds.length) {
              // Game over — compute results
              await finalizeGame(io, room, computeScore, assignBadges, generateAIInsights, Answer, Question, Result);
            } else {
              // Next question
              room.currentQuestionIndex = nextIndex;
              await room.save();

              const nextQuestion = await Question.findById(room.questionIds[nextIndex]);
              if (nextQuestion) {
                io.to(roomId).emit('question', {
                  question: nextQuestion.toObject(),
                  index: nextIndex,
                  total: room.questionIds.length,
                });

                // Restart timer if enabled
                if (room.config.timerEnabled) {
                  startQuestionTimer(io, roomId, room.config.timerSeconds, room, room.questionIds[nextIndex]);
                }
              }
            }
          }, 1500);
        }
      } catch (err) {
        console.error('submit_answer error:', err);
        socket.emit('error', { message: 'Failed to submit answer' });
      }
    });

    // ---- DISCONNECT ----
    socket.on('disconnect', async () => {
      try {
        const { roomId, nickname } = socket.data;
        if (roomId) {
          io.to(roomId).emit('player_disconnected', { nickname });
        }
        console.log(`🔌 Client disconnected: ${socket.id} (${nickname || 'unknown'})`);
      } catch (err) {
        console.error('disconnect error:', err);
      }
    });
  });

  // Timer helper
  function startQuestionTimer(
    io: SocketIOServer,
    roomId: string,
    seconds: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    room: any,
    questionId: string
  ) {
    clearQuestionTimer(roomId);
    let timeLeft = seconds;
    
    const interval = setInterval(async () => {
      timeLeft--;
      io.to(roomId).emit('timer_tick', { secondsLeft: timeLeft });
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        roomTimers.delete(roomId);
        
        // Auto-advance: submit empty answers for players who haven't answered
        const answeredCountObj2 = room.answeredCount as Record<string, number>;
        const answeredCount = answeredCountObj2[questionId] || 0;
        if (answeredCount < 2) {
          // Force advance
          const nextIndex = room.currentQuestionIndex + 1;
          if (nextIndex >= room.questionIds.length) {
            await finalizeGame(io, room, computeScore, assignBadges, generateAIInsights, Answer, Question, Result);
          } else {
            room.currentQuestionIndex = nextIndex;
            await room.save();
            const nextQuestion = await Question.findById(room.questionIds[nextIndex]);
            if (nextQuestion) {
              io.to(roomId).emit('question', {
                question: nextQuestion.toObject(),
                index: nextIndex,
                total: room.questionIds.length,
              });
              startQuestionTimer(io, roomId, seconds, room, room.questionIds[nextIndex]);
            }
          }
        }
      }
    }, 1000);

    roomTimers.set(roomId, interval);
  }

  function clearQuestionTimer(roomId: string) {
    const timer = roomTimers.get(roomId);
    if (timer) {
      clearInterval(timer);
      roomTimers.delete(roomId);
    }
  }

  httpServer.once('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  httpServer.listen(port, () => {
    console.log(`🚀 MindMatch server ready at http://${hostname}:${port}`);
  });
});

// Finalize game — compute scores, badges, AI insights
async function finalizeGame(
  io: SocketIOServer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  room: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  computeScore: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assignBadges: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateAIInsights: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Answer: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Question: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Result: any
) {
  try {
    room.status = 'finished';
    await room.save();

    const roomId = room._id.toString();
    const [p1, p2] = room.players;

    const p1Answers = await Answer.find({ roomId, userId: p1.userId });
    const p2Answers = await Answer.find({ roomId, userId: p2.userId });

    // Build question text map
    const allQuestionIds = room.questionIds;
    const questions = await Question.find({ _id: { $in: allQuestionIds } });
    const questionTexts: Record<string, string> = {};
    for (const q of questions) {
      questionTexts[q._id.toString()] = q.text;
    }

    const scoreResult = computeScore(p1Answers, p2Answers, questionTexts);
    const badges = assignBadges(scoreResult.overallScore, scoreResult.categoryScores, scoreResult.predictionAccuracy);

    // Get matching/different question texts for AI
    const matchingQs = scoreResult.answerComparisons
      .filter((a: { matched: boolean }) => a.matched)
      .map((a: { questionText: string }) => a.questionText)
      .slice(0, 5);
    const differentQs = scoreResult.answerComparisons
      .filter((a: { matched: boolean }) => !a.matched)
      .map((a: { questionText: string }) => a.questionText)
      .slice(0, 5);

    // Generate AI insights
    const aiInsights = await generateAIInsights({
      player1Nickname: p1.nickname,
      player2Nickname: p2.nickname,
      overallScore: scoreResult.overallScore,
      categoryScores: scoreResult.categoryScores,
      matchingAnswers: scoreResult.matchingAnswers,
      differentAnswers: scoreResult.differentAnswers,
      predictionAccuracy: scoreResult.predictionAccuracy,
      topMatchingQuestions: matchingQs,
      topDifferentQuestions: differentQs,
      badges,
    });

    // Save result
    const result = await Result.findOneAndUpdate(
      { roomId },
      {
        roomId,
        player1: { userId: p1.userId, nickname: p1.nickname },
        player2: { userId: p2.userId, nickname: p2.nickname },
        overallScore: scoreResult.overallScore,
        categoryScores: scoreResult.categoryScores,
        badges,
        aiInsights,
        answerComparisons: scoreResult.answerComparisons,
        matchingAnswers: scoreResult.matchingAnswers,
        differentAnswers: scoreResult.differentAnswers,
        predictionAccuracy: scoreResult.predictionAccuracy,
      },
      { upsert: true, new: true }
    );

    io.to(roomId).emit('game_complete', { resultId: result._id.toString(), roomId });
    console.log(`🏆 Game finished in room ${room.code} — Score: ${scoreResult.overallScore}%`);
  } catch (err) {
    console.error('finalizeGame error:', err);
    io.to(room._id.toString()).emit('error', { message: 'Failed to compute results' });
  }
}
