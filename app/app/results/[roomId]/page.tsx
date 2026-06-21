'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BADGE_DETAILS, getCompatibilityLabel } from '@/lib/badges';

interface CategoryScores {
  values: number;
  lifestyle: number;
  communication: number;
  personality: number;
  fun: number;
}

interface AIInsights {
  biggestSimilarity: string;
  biggestDifference: string;
  communicationInsight: string;
  funFact: string;
  summary: string;
}

interface AnswerComparison {
  questionText: string;
  category: string;
  player1Answer: string | number;
  player2Answer: string | number;
  matched: boolean;
  player1PredictionCorrect: boolean;
  player2PredictionCorrect: boolean;
}

interface ResultData {
  _id: string;
  roomId: string;
  player1: { userId: string; nickname: string };
  player2: { userId: string; nickname: string };
  overallScore: number;
  categoryScores: CategoryScores;
  badges: string[];
  aiInsights: AIInsights;
  answerComparisons: AnswerComparison[];
  matchingAnswers: number;
  differentAnswers: number;
  predictionAccuracy: number;
}

function CircularProgress({ score, size = 200 }: { score: number; size?: number }) {
  const r = 45;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" fill="none" r={r} stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
        <circle
          cx="50" cy="50" fill="none" r={r}
          stroke="#ffffff" strokeWidth="2" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-inter font-bold text-on-surface shimmer-text"
          style={{ fontSize: size > 150 ? '52px' : '36px', lineHeight: '1', letterSpacing: '-0.04em' }}>
          {score}<span style={{ fontSize: size > 150 ? '24px' : '16px' }}>%</span>
        </span>
      </div>
    </div>
  );
}

const CATEGORY_INFO: Record<string, { label: string; icon: string; weight: string }> = {
  values: { label: 'Values & Ethics', icon: 'favorite', weight: '40%' },
  lifestyle: { label: 'Lifestyle Pace', icon: 'home', weight: '20%' },
  communication: { label: 'Communication Style', icon: 'forum', weight: '15%' },
  personality: { label: 'Personality Traits', icon: 'person', weight: '15%' },
  fun: { label: 'Fun & Spontaneity', icon: 'celebration', weight: '10%' },
};

function ResultsContent({ resultId }: { resultId: string }) {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'answers' | 'ai'>('overview');

  useEffect(() => {
    const fetchResult = async () => {
      // The resultId could be the MongoDB _id or roomId
      try {
        const res = await fetch(`/api/results/${resultId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Results not found');
        setResult(data);
      } catch {
        setError('Results not found or still being computed...');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#111317' }}>
        <div className="text-center animate-fade-in">
          <span className="material-symbols-outlined text-primary animate-spin block mb-md" style={{ fontSize: '48px' }}>
            progress_activity
          </span>
          <h2 className="text-headline-md font-inter font-semibold text-on-surface mb-sm">
            Computing your compatibility...
          </h2>
          <p className="text-body-md font-inter text-on-surface-variant">Generating AI insights</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#111317' }}>
        <div className="text-center">
          <p className="text-body-lg font-inter text-on-surface-variant mb-lg">{error}</p>
          <button onClick={() => router.push('/')}
            className="bg-primary text-on-primary rounded-full px-xl py-sm text-body-md font-inter hover:opacity-90">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const compatLabel = getCompatibilityLabel(result.overallScore);

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-2xl mt-xl px-md md:px-lg max-w-[1200px] mx-auto w-full pb-2xl flex flex-col gap-xl">
        {/* Header */}
        <section className="text-center mt-xl mb-md">
          <p className="text-label-caps font-inter text-primary tracking-widest uppercase mb-sm">
            Analysis Complete
          </p>
          <h1 className="font-inter font-bold text-on-surface"
            style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', lineHeight: '1.15', letterSpacing: '-0.04em' }}>
            Compatibility Results
          </h1>
          <p className="text-body-lg font-inter text-on-surface-variant mt-sm max-w-xl mx-auto">
            {result.player1.nickname} & {result.player2.nickname} — here&apos;s your full analysis
          </p>
        </section>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Score Card */}
          <div className="col-span-1 lg:col-span-5 premium-card rounded-2xl p-lg flex flex-col items-center justify-center min-h-[400px] gap-xl">
            <h2 className="text-headline-md font-inter font-semibold text-on-surface">Match Score</h2>
            <CircularProgress score={result.overallScore} size={220} />
            <div className="text-center">
              <span className="text-label-caps font-inter text-tertiary-fixed-dim tracking-widest uppercase">
                {compatLabel}
              </span>
              <p className="text-body-md font-inter text-on-surface-variant mt-sm">
                {result.matchingAnswers} matching · {result.differentAnswers} different answers
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-gutter">
            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="premium-card rounded-2xl p-md flex flex-col gap-sm">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-label-caps font-inter text-on-surface-variant uppercase">Biggest Similarity</span>
                </div>
                <h3 className="text-headline-md font-inter font-semibold text-on-surface">
                  {Object.entries(result.categoryScores).sort((a, b) => b[1] - a[1])[0]
                    ? CATEGORY_INFO[Object.entries(result.categoryScores).sort((a, b) => b[1] - a[1])[0][0]]?.label || 'Values'
                    : 'Values'}
                </h3>
                <p className="text-body-md font-inter text-on-surface-variant">
                  {result.aiInsights.biggestSimilarity.slice(0, 80)}...
                </p>
              </div>
              <div className="premium-card rounded-2xl p-md flex flex-col gap-sm">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  <span className="text-label-caps font-inter text-on-surface-variant uppercase">Biggest Difference</span>
                </div>
                <h3 className="text-headline-md font-inter font-semibold text-on-surface">
                  {Object.entries(result.categoryScores).sort((a, b) => a[1] - b[1])[0]
                    ? CATEGORY_INFO[Object.entries(result.categoryScores).sort((a, b) => a[1] - b[1])[0][0]]?.label || 'Lifestyle'
                    : 'Lifestyle'}
                </h3>
                <p className="text-body-md font-inter text-on-surface-variant">
                  {result.aiInsights.biggestDifference.slice(0, 80)}...
                </p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="premium-card rounded-2xl p-lg flex-grow flex flex-col justify-center gap-md">
              <h3 className="text-headline-md font-inter font-semibold text-on-surface mb-sm">Category Breakdown</h3>
              {Object.entries(result.categoryScores).map(([cat, score]) => {
                const info = CATEGORY_INFO[cat];
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-label-md font-inter mb-xs">
                      <div className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>
                          {info?.icon || 'circle'}
                        </span>
                        <span className="text-on-surface">{info?.label || cat}</span>
                        <span className="text-on-surface-variant text-xs">({info?.weight})</span>
                      </div>
                      <span className="text-on-surface font-semibold">{score}%</span>
                    </div>
                    <div className="h-[2px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${score}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-sm border-b border-white/10 pb-px">
          {(['overview', 'answers', 'ai'] as const).map((tab) => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-md py-sm text-body-md font-inter rounded-t-lg transition-all ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}>
              {tab === 'overview' ? 'Overview' : tab === 'answers' ? 'Answer Comparison' : 'AI Insights'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter animate-fade-in">
            <div className="premium-card rounded-2xl p-lg text-center">
              <span className="material-symbols-outlined text-tertiary-fixed-dim block mb-sm" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-display font-inter font-bold text-on-surface block">{result.matchingAnswers}</span>
              <span className="text-body-md font-inter text-on-surface-variant">Matching Answers</span>
            </div>
            <div className="premium-card rounded-2xl p-lg text-center">
              <span className="material-symbols-outlined text-outline block mb-sm" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>compare_arrows</span>
              <span className="text-display font-inter font-bold text-on-surface block">{result.differentAnswers}</span>
              <span className="text-body-md font-inter text-on-surface-variant">Different Answers</span>
            </div>
            <div className="premium-card rounded-2xl p-lg text-center">
              <span className="material-symbols-outlined text-primary block mb-sm" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>psychology</span>
              <span className="text-display font-inter font-bold text-on-surface block">{result.predictionAccuracy}%</span>
              <span className="text-body-md font-inter text-on-surface-variant">Prediction Accuracy</span>
            </div>
          </div>
        )}

        {activeTab === 'answers' && (
          <div className="flex flex-col gap-md animate-fade-in">
            <div className="grid grid-cols-3 gap-md text-label-caps font-inter text-on-surface-variant uppercase tracking-widest px-md">
              <span>Question</span>
              <span className="text-center">{result.player1.nickname}</span>
              <span className="text-center">{result.player2.nickname}</span>
            </div>
            {result.answerComparisons.slice(0, 15).map((comparison, idx) => (
              <div key={idx}
                className={`premium-card rounded-xl p-md grid grid-cols-3 gap-md items-center border ${
                  comparison.matched ? 'border-tertiary-fixed-dim/20' : 'border-white/8'
                }`}>
                <div>
                  <span className="text-label-caps font-inter text-on-surface-variant uppercase block mb-xs">{comparison.category}</span>
                  <p className="text-body-md font-inter text-on-surface">{comparison.questionText.slice(0, 60)}...</p>
                </div>
                <div className="text-center">
                  <span className={`text-body-md font-inter px-sm py-xs rounded-md ${comparison.matched ? 'text-tertiary-fixed-dim' : 'text-on-surface'}`}
                    style={{ background: comparison.matched ? 'rgba(96,222,140,0.1)' : 'rgba(255,255,255,0.05)' }}>
                    {String(comparison.player1Answer)}
                  </span>
                </div>
                <div className="text-center">
                  <span className={`text-body-md font-inter px-sm py-xs rounded-md ${comparison.matched ? 'text-tertiary-fixed-dim' : 'text-on-surface'}`}
                    style={{ background: comparison.matched ? 'rgba(96,222,140,0.1)' : 'rgba(255,255,255,0.05)' }}>
                    {String(comparison.player2Answer)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter animate-fade-in">
            {[
              { key: 'biggestSimilarity', icon: 'star', label: 'Biggest Similarity', color: 'text-tertiary-fixed-dim' },
              { key: 'biggestDifference', icon: 'bolt', label: 'Biggest Difference', color: 'text-primary' },
              { key: 'communicationInsight', icon: 'forum', label: 'Communication Insight', color: 'text-primary' },
              { key: 'funFact', icon: 'auto_awesome', label: 'Fun Fact', color: 'text-tertiary-fixed-dim' },
            ].map(({ key, icon, label, color }) => (
              <div key={key} className="premium-card rounded-2xl p-lg flex flex-col gap-sm">
                <div className="flex items-center gap-sm">
                  <span className={`material-symbols-outlined ${color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  <span className="text-label-caps font-inter text-on-surface-variant uppercase tracking-widest">{label}</span>
                </div>
                <p className="text-body-lg font-inter text-on-surface leading-relaxed">
                  {result.aiInsights[key as keyof AIInsights]}
                </p>
              </div>
            ))}
            <div className="md:col-span-2 premium-card rounded-2xl p-lg border border-primary/20"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%), #1e2024' }}>
              <div className="flex items-center gap-sm mb-md">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                <span className="text-label-caps font-inter text-on-surface-variant uppercase tracking-widest">Personalized Summary</span>
              </div>
              <p className="text-body-lg font-inter text-on-surface leading-relaxed">{result.aiInsights.summary}</p>
            </div>
          </div>
        )}

        {/* Badges & CTA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mt-sm">
          <div className="col-span-1 md:col-span-8 premium-card rounded-2xl p-md flex items-center gap-lg overflow-x-auto">
            <span className="text-label-caps font-inter text-on-surface-variant uppercase whitespace-nowrap tracking-widest">Earned</span>
            <div className="flex gap-md flex-wrap">
              {result.badges.map((badgeName) => {
                const badge = BADGE_DETAILS[badgeName];
                return (
                  <div key={badgeName}
                    className="flex items-center gap-sm rounded-full px-md py-sm border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <span className="material-symbols-outlined text-tertiary-fixed-dim" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
                      {badge?.icon || 'star'}
                    </span>
                    <span className="text-label-md font-inter text-on-surface whitespace-nowrap">{badgeName}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-span-1 md:col-span-4 flex items-center justify-end gap-md">
            <Link href={`/share/${resultId}`}
              className="flex-1 md:flex-none font-inter text-label-md bg-primary text-on-primary px-xl py-md rounded-lg flex items-center justify-center gap-sm hover:opacity-90 transition-opacity"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>ios_share</span>
              Share Results
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ResultsPage({ params }: { params: Promise<{ roomId: string }> }) {
  const [resultId, setResultId] = useState('');

  useEffect(() => {
    params.then(({ roomId }) => setResultId(roomId));
  }, [params]);

  if (!resultId) return null;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-on-surface">Loading...</div>}>
      <ResultsContent resultId={resultId} />
    </Suspense>
  );
}
