import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/models/Room';
import Question from '@/models/Question';
import { customAlphabet } from 'nanoid';

const generateCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const {
      numQuestions = 10,
      categories = ['values', 'lifestyle', 'communication', 'personality', 'fun'],
      predictionMode = false,
      timerEnabled = false,
      timerSeconds = 30,
      hostNickname = 'Player 1',
    } = body;

    // Generate unique room code
    let code = generateCode();
    let attempts = 0;
    while (await Room.findOne({ code }) && attempts < 10) {
      code = generateCode();
      attempts++;
    }

    // Fetch questions for this room
    const categoryFilter = categories.includes('random')
      ? {}
      : { category: { $in: categories } };

    const questions = await Question.aggregate([
      { $match: { ...categoryFilter, isActive: true } },
      { $sample: { size: numQuestions } },
    ]);

    if (questions.length === 0) {
      return NextResponse.json({ error: 'No questions available for selected categories' }, { status: 400 });
    }

    const questionIds = questions.map((q: { _id: { toString: () => string } }) => q._id.toString());
    const hostId = `${code}-${hostNickname}`.toLowerCase().replace(/\s+/g, '-');

    const room = await Room.create({
      code,
      hostId,
      config: {
        numQuestions: questions.length,
        categories,
        predictionMode,
        timerEnabled,
        timerSeconds,
      },
      status: 'waiting',
      players: [],
      questionIds,
      currentQuestionIndex: 0,
      answeredCount: {},
    });

    return NextResponse.json({
      roomId: room._id.toString(),
      code: room.code,
      config: room.config,
    });
  } catch (error) {
    console.error('POST /api/rooms error:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const rooms = await Room.find({ status: { $ne: 'finished' } })
      .select('code status players createdAt')
      .sort({ createdAt: -1 })
      .limit(20);
    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('GET /api/rooms error:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}
