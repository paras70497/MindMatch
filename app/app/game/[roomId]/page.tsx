'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { connectSocket } from '@/lib/socket';

interface QuestionOption {
  text: string;
  value: string | number;
}

interface Question {
  _id: string;
  text: string;
  category: string;
  type: 'multiple_choice' | 'either_or' | 'scale' | 'single_choice';
  options: QuestionOption[];
  isPrediction: boolean;
}

type GamePhase = 'answering' | 'predicting' | 'waiting' | 'transition';

function GameContent({ roomId }: { roomId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nickname = searchParams.get('nickname') || localStorage.getItem('mm_nickname') || 'Player';

  const [question, setQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<string | number | null>(null);
  const [phase, setPhase] = useState<GamePhase>('answering');
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [partnerAnswered, setPartnerAnswered] = useState(false);
  const [predictionMode, setPredictionMode] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const setupSocket = useCallback(() => {
    const socket = connectSocket();

    // Load first question from session storage if available
    const firstQData = sessionStorage.getItem('mm_first_question');
    if (firstQData) {
      const { question: q, index, total } = JSON.parse(firstQData);
      setQuestion(q);
      setQuestionIndex(index);
      setTotalQuestions(total);
      sessionStorage.removeItem('mm_first_question');
    }

    socket.on('question', ({ question: q, index, total }: { question: Question; index: number; total: number }) => {
      setTransitioning(true);
      setTimeout(() => {
        setQuestion(q);
        setQuestionIndex(index);
        setTotalQuestions(total);
        setSelectedAnswer(null);
        setSelectedPrediction(null);
        setPhase('answering');
        setPartnerAnswered(false);
        setTransitioning(false);
      }, 400);
    });

    socket.on('waiting_for_partner', () => {
      if (predictionMode && question?.isPrediction) {
        setPhase('predicting');
      } else {
        setPhase('waiting');
      }
    });

    socket.on('partner_answered', () => {
      setPartnerAnswered(true);
    });

    socket.on('both_answered', () => {
      setPhase('transition');
    });

    socket.on('timer_tick', ({ secondsLeft }: { secondsLeft: number }) => {
      setTimerSeconds(secondsLeft);
    });

    socket.on('game_complete', ({ resultId }: { resultId: string }) => {
      router.push(`/results/${resultId}`);
    });

    // Check if prediction mode is on
    const roomCode = localStorage.getItem('mm_roomCode') || '';
    if (roomCode) {
      fetch(`/api/rooms/${roomCode}`).then(r => r.json()).then(data => {
        if (data.config?.predictionMode) setPredictionMode(true);
      });
    }

    return socket;
  }, [roomId, predictionMode, question, router]);

  useEffect(() => {
    const socket = setupSocket();
    return () => {
      socket.off('question');
      socket.off('waiting_for_partner');
      socket.off('partner_answered');
      socket.off('both_answered');
      socket.off('timer_tick');
      socket.off('game_complete');
    };
  }, [setupSocket]);

  const submitAnswer = (answer: string | number) => {
    if (phase !== 'answering' || !question) return;
    setSelectedAnswer(answer);

    const socket = connectSocket();
    socket.emit('submit_answer', {
      roomId,
      questionId: question._id,
      answer,
      prediction: null,
    });
  };

  const submitPrediction = (prediction: string | number) => {
    if (phase !== 'predicting' || !question) return;
    setSelectedPrediction(prediction);

    const socket = connectSocket();
    socket.emit('submit_answer', {
      roomId,
      questionId: question._id,
      answer: selectedAnswer,
      prediction,
    });
    setPhase('waiting');
  };

  const progressPct = totalQuestions > 0 ? ((questionIndex + 1) / totalQuestions) * 100 : 0;
  const timerPct = timerSeconds !== null ? (timerSeconds / 30) * 100 : 100;

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#111317' }}>
        <div className="text-center">
          <span className="material-symbols-outlined text-primary animate-spin block mb-md" style={{ fontSize: '40px' }}>
            progress_activity
          </span>
          <p className="text-body-lg font-inter text-on-surface-variant">Loading your game...</p>
        </div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-opacity duration-400 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: '#111317' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div className="w-full max-w-[600px] px-lg md:px-2xl py-2xl relative z-10 flex flex-col items-center">
        {/* Header / Progress */}
        <header className="w-full mb-2xl text-center">
          <div className="flex flex-col items-center gap-md">
            <div className="flex items-center gap-md w-full">
              <span className="text-label-caps font-inter text-on-surface-variant tracking-widest uppercase whitespace-nowrap">
                {questionIndex + 1} of {totalQuestions}
              </span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full bg-primary rounded-full progress-bar-fill transition-all duration-500"
                  style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-label-caps font-inter text-on-surface-variant tracking-widest">
                {Math.round(progressPct)}%
              </span>
            </div>

            {/* Timer */}
            {timerSeconds !== null && (
              <div className="flex items-center gap-sm">
                <div className="w-24 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full progress-bar-fill"
                    style={{
                      width: `${timerPct}%`,
                      background: timerSeconds <= 10 ? '#ffb4ab' : '#ffffff',
                    }} />
                </div>
                <span className={`text-label-md font-inter font-semibold ${timerSeconds <= 10 ? 'text-error' : 'text-on-surface-variant'}`}>
                  {timerSeconds}s
                </span>
              </div>
            )}

            {/* Category tag */}
            <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full border border-white/10 text-label-caps font-inter text-on-surface-variant uppercase tracking-widest"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              {question.category}
            </span>
          </div>
        </header>

        {/* Phase indicator */}
        {phase === 'predicting' && (
          <div className="w-full mb-xl px-md py-sm rounded-xl border border-primary/20 text-center"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p className="text-body-md font-inter text-primary font-semibold">
              🧠 Now predict what your partner answered!
            </p>
          </div>
        )}
        {phase === 'waiting' && (
          <div className="w-full mb-xl px-md py-sm rounded-xl border border-white/10 text-center flex items-center justify-center gap-sm"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <span className="material-symbols-outlined text-on-surface-variant animate-spin" style={{ fontSize: '18px' }}>
              progress_activity
            </span>
            <p className="text-body-md font-inter text-on-surface-variant">
              {partnerAnswered ? 'Both answered — moving on...' : 'Waiting for your partner...'}
            </p>
          </div>
        )}
        {phase === 'transition' && (
          <div className="w-full mb-xl px-md py-sm rounded-xl border border-tertiary-fixed-dim/30 text-center"
            style={{ background: 'rgba(96,222,140,0.05)' }}>
            <p className="text-body-md font-inter text-tertiary-fixed-dim font-semibold">
              ✓ Both answered! Next question coming...
            </p>
          </div>
        )}

        {/* Question */}
        <section className="w-full text-center mb-2xl">
          <h1 className="font-inter font-bold text-on-surface"
            style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', lineHeight: '1.3', letterSpacing: '-0.02em' }}>
            {phase === 'predicting' ? `What did your partner answer to: "${question.text}"?` : question.text}
          </h1>
        </section>

        {/* Answers */}
        <section className="w-full flex flex-col gap-md">
          {question.type === 'scale' ? (
            <div className="flex flex-col gap-lg">
              <div className="flex justify-between text-label-md font-inter text-on-surface-variant">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
              <div className="flex gap-md justify-center">
                {[1, 2, 3, 4, 5].map((val) => {
                  const currentSelected = phase === 'predicting' ? selectedPrediction : selectedAnswer;
                  return (
                    <button
                      key={val}
                      onClick={() => phase === 'predicting' ? submitPrediction(val) : submitAnswer(val)}
                      disabled={phase === 'waiting' || phase === 'transition'}
                      className={`w-14 h-14 rounded-xl border text-headline-md font-inter font-semibold transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                        currentSelected === val
                          ? 'bg-primary text-on-primary border-primary'
                          : 'border-white/10 text-on-surface hover:border-white/30 hover:bg-white/5'
                      }`}>
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            question.options.map((option, idx) => {
              const currentSelected = phase === 'predicting' ? selectedPrediction : selectedAnswer;
              const isSelected = currentSelected === option.value;
              const isDisabled = phase === 'waiting' || phase === 'transition';

              return (
                <button
                  key={idx}
                  id={`answer-option-${idx}`}
                  onClick={() => {
                    if (isDisabled) return;
                    phase === 'predicting' ? submitPrediction(option.value) : submitAnswer(option.value);
                  }}
                  disabled={isDisabled}
                  className={`answer-card w-full p-xl rounded-xl text-left flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSelected ? 'selected' : ''
                  }`}>
                  <span className={`text-headline-md font-inter font-semibold transition-colors ${
                    isSelected ? 'text-primary' : 'text-on-surface group-hover:text-primary'
                  }`}>
                    {option.text}
                  </span>
                  {isSelected ? (
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">
                      arrow_forward
                    </span>
                  )}
                </button>
              );
            })
          )}
        </section>

        {/* Nickname indicator */}
        <div className="mt-xl">
          <span className="text-label-md font-inter text-on-surface-variant flex items-center gap-xs">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person</span>
            Playing as <strong className="text-on-surface">{nickname}</strong>
          </span>
        </div>
      </div>
    </main>
  );
}

export default function GamePage({ params }: { params: Promise<{ roomId: string }> }) {
  const [roomId, setRoomId] = useState('');
  
  useEffect(() => {
    params.then(({ roomId }) => setRoomId(roomId));
  }, [params]);

  if (!roomId) return null;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: '#111317' }}>
      <p className="text-on-surface font-inter">Loading...</p>
    </div>}>
      <GameContent roomId={roomId} />
    </Suspense>
  );
}
