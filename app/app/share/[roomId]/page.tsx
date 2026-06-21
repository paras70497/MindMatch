'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';

interface ResultData {
  overallScore: number;
  categoryScores: {
    values: number;
    lifestyle: number;
    communication: number;
    personality: number;
    fun: number;
  };
  badges: string[];
  player1: { nickname: string };
  player2: { nickname: string };
}

function ShareContent({ resultId }: { resultId: string }) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/results/${resultId}`)
      .then(r => r.json())
      .then(data => { setResult(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [resultId]);

  // 3D tilt effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFine) return;

    const handleMove = (e: MouseEvent) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 60;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 60;
      card.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };
    const handleLeave = () => {
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      card.style.transition = 'transform 0.5s ease';
    };
    const handleEnter = () => { card.style.transition = 'none'; };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
    };
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#000000',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = 'mindmatch-results.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `🧠 We just played MindMatch!\n\nCompatibility: ${result.overallScore}%\nBadge: ${result.badges[0] || 'Compatible Pair'}\n\nDiscover your match at mindmatch.app`;
    
    if (navigator.share) {
      await navigator.share({ text, title: 'MindMatch Results' });
    } else {
      navigator.clipboard.writeText(text);
      alert('Result text copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#111317' }}>
        <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '40px' }}>
          progress_activity
        </span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#111317' }}>
        <p className="text-on-surface-variant font-inter">Results not found</p>
      </div>
    );
  }

  const r = 45;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (result.overallScore / 100) * circumference;

  const topCategory = Object.entries(result.categoryScores).sort((a, b) => b[1] - a[1])[0];
  const bottomCategory = Object.entries(result.categoryScores).sort((a, b) => a[1] - b[1])[0];

  const catLabels: Record<string, string> = {
    values: 'Values',
    lifestyle: 'Lifestyle',
    communication: 'Communication',
    personality: 'Personality',
    fun: 'Fun',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-md"
      style={{ background: '#111317' }}>
      {/* Share Card — 9:16 ratio */}
      <div ref={cardRef}
        className="relative w-full max-w-[380px] gradient-bg border border-white/10 rounded-2xl overflow-hidden flex flex-col items-center justify-between p-xl"
        style={{
          aspectRatio: '9/16',
          background: 'radial-gradient(circle at 50% -20%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,1) 70%)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        }}>
        {/* Top Branding */}
        <header className="w-full text-center mt-md z-10 flex flex-col items-center gap-sm">
          <span className="material-symbols-outlined text-primary opacity-90"
            style={{ fontSize: '36px', fontVariationSettings: "'FILL' 1" }}>
            psychology
          </span>
          <h1 className="font-inter font-semibold text-on-surface" style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>
            MindMatch
          </h1>
          <p className="text-label-caps font-inter text-on-surface-variant uppercase tracking-widest">
            Compatibility Analysis
          </p>
          <p className="text-body-md font-inter text-on-surface-variant mt-xs">
            {result.player1.nickname} & {result.player2.nickname}
          </p>
        </header>

        {/* Score */}
        <section className="relative flex flex-col items-center justify-center w-full my-auto z-10">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r={r} stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
              <circle
                cx="50" cy="50" fill="none" r={r}
                stroke="#ffffff" strokeWidth="2" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>
            <div className="text-center flex flex-col items-center">
              <span className="font-inter font-bold text-primary shimmer-text"
                style={{ fontSize: '72px', lineHeight: '1', letterSpacing: '-0.04em' }}>
                {result.overallScore}<span style={{ fontSize: '32px' }}>%</span>
              </span>
              <span className="text-label-md font-inter text-on-surface-variant mt-sm">
                {result.overallScore >= 80 ? 'Highly Compatible' : result.overallScore >= 60 ? 'Compatible' : 'Unique Dynamic'}
              </span>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="w-full flex flex-col gap-md z-10 mb-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-sm">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>star</span>
              <span className="text-body-md font-inter text-on-surface-variant">Strongest Area</span>
            </div>
            <span className="text-headline-md font-inter font-semibold text-primary">
              {catLabels[topCategory?.[0] || 'values']}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-sm">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>compare_arrows</span>
              <span className="text-body-md font-inter text-on-surface-variant">Growth Area</span>
            </div>
            <span className="text-headline-md font-inter font-semibold text-primary">
              {catLabels[bottomCategory?.[0] || 'personality']}
            </span>
          </div>
          {result.badges[0] && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-tertiary-fixed-dim" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="text-body-md font-inter text-on-surface-variant">Badge</span>
              </div>
              <span className="text-headline-md font-inter font-semibold text-primary">{result.badges[0]}</span>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="w-full text-center z-10">
          <p className="text-label-caps font-inter text-on-surface-variant opacity-60">
            mindmatch.app · Find your compatibility
          </p>
        </footer>

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full pointer-events-none z-0"
          style={{ background: 'rgba(255,255,255,0.04)', filter: 'blur(60px)', mixBlendMode: 'screen' }} />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-md mt-xl animate-slide-up">
        <button
          id="share-story-btn"
          onClick={handleShare}
          className="flex items-center gap-sm bg-primary text-on-primary font-inter text-label-md px-lg py-sm rounded-full hover:opacity-90 transition-opacity"
          style={{ boxShadow: '0 4px 12px rgba(255,255,255,0.1)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>ios_share</span>
          Share Story
        </button>
        <button
          id="save-image-btn"
          onClick={handleDownload}
          className="flex items-center gap-sm border border-outline-variant text-primary font-inter text-label-md px-lg py-sm rounded-full hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
          Save Image
        </button>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-sm border border-white/10 text-on-surface-variant font-inter text-label-md px-lg py-sm rounded-full hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
          Back
        </button>
      </div>
    </div>
  );
}

export default function SharePage({ params }: { params: Promise<{ roomId: string }> }) {
  const [resultId, setResultId] = useState('');

  useEffect(() => {
    params.then(({ roomId }) => setResultId(roomId));
  }, [params]);

  if (!resultId) return null;

  return (
    <Suspense fallback={null}>
      <ShareContent resultId={resultId} />
    </Suspense>
  );
}
