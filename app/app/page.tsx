'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-2xl pb-2xl flex flex-col items-center">

        {/* ── Hero Section ── */}
        <section className="text-center w-full max-w-3xl mx-auto py-2xl px-md flex flex-col items-center gap-md relative" id="how-it-works">
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          <div className="relative z-10 animate-fade-in">
            <span className="inline-flex items-center gap-xs px-md py-xs rounded-full border border-white/10 text-label-caps font-inter text-on-surface-variant uppercase tracking-widest mb-md"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="material-symbols-outlined text-tertiary-fixed-dim" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>
                psychiatry
              </span>
              Real-Time Compatibility Game
            </span>

            <h1 className="font-inter font-bold text-on-surface text-glow mb-md"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.15', letterSpacing: '-0.04em' }}>
              Discover how closely<br />your minds match.
            </h1>

            <p className="text-body-lg font-inter text-on-surface-variant max-w-xl mx-auto mb-xl">
              Answer questions separately. Compare thinking styles. Reveal your Mind Match Score in a beautifully crafted analysis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-md">
              <button
                id="hero-create-btn"
                onClick={() => router.push('/create')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-sm bg-primary text-on-primary rounded-full px-xl py-md text-body-md font-inter font-semibold hover:opacity-90 transition-all hover:-translate-y-0.5"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 24px rgba(255,255,255,0.08)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
                Create Room
              </button>
              <button
                id="hero-join-btn"
                onClick={() => router.push('/join')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-sm bg-transparent border border-outline-variant text-on-surface rounded-full px-xl py-md text-body-md font-inter font-semibold hover:bg-white/5 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>key</span>
                Join Room
              </button>
            </div>
          </div>
        </section>

        {/* ── Live Preview Bento Grid ── */}
        <section className="w-full max-w-5xl mx-auto px-md mt-2xl" id="compatibility">
          <div className="text-center mb-xl">
            <span className="text-label-caps font-inter text-on-surface-variant tracking-widest uppercase">Preview</span>
            <h2 className="text-headline-lg font-inter font-semibold text-on-surface mt-sm">
              See what your results look like
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
            {/* Main Score Card */}
            <div className="md:col-span-5 gradient-card rounded-2xl p-xl flex flex-col items-center justify-center gap-lg ambient-glow animate-float">
              <h3 className="text-label-caps font-inter text-on-surface-variant tracking-widest uppercase self-start w-full text-center">
                Global Match Score
              </h3>
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="46" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                  <circle cx="50" cy="50" fill="none" r="46"
                    stroke="#60de8c" strokeWidth="2"
                    strokeDasharray="289" strokeDashoffset="46" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-inter font-bold text-on-surface shimmer-text"
                    style={{ fontSize: '48px', lineHeight: '1', letterSpacing: '-0.04em' }}>
                    84<span style={{ fontSize: '24px' }}>%</span>
                  </span>
                </div>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-xs px-md py-xs rounded-full border border-white/10 text-label-md font-inter text-on-surface"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <span className="material-symbols-outlined text-tertiary-fixed-dim" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>
                    psychiatry
                  </span>
                  Highly Compatible
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-7 flex flex-col gap-lg">
              {/* Category Bars */}
              <div className="gradient-card rounded-2xl p-lg flex flex-col justify-center gap-md">
                <h3 className="text-label-caps font-inter text-on-surface-variant tracking-widest uppercase mb-sm">
                  Similarity Vectors
                </h3>
                {[
                  { label: 'Core Values', pct: 92, color: '#ffffff' },
                  { label: 'Lifestyle & Habits', pct: 78, color: '#c6c6c7' },
                  { label: 'Communication Style', pct: 88, color: '#e2e2e2' },
                  { label: 'Personality Traits', pct: 71, color: '#8e9192' },
                  { label: 'Fun & Spontaneity', pct: 85, color: '#60de8c' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-xs w-full">
                    <div className="flex justify-between text-label-md font-inter">
                      <span className="text-on-surface">{item.label}</span>
                      <span className="text-on-surface-variant">{item.pct}%</span>
                    </div>
                    <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Badges */}
              <div className="gradient-card rounded-2xl p-lg flex flex-col gap-md">
                <h3 className="text-label-caps font-inter text-on-surface-variant tracking-widest uppercase">
                  Earned Badges
                </h3>
                <div className="flex flex-wrap gap-sm">
                  {[
                    { icon: 'neurology', label: 'Mind Readers', color: 'text-primary' },
                    { icon: 'favorite', label: 'Value Aligned', color: 'text-tertiary-fixed-dim' },
                    { icon: 'celebration', label: 'Adventure Pair', color: 'text-primary' },
                  ].map((badge) => (
                    <div key={badge.label}
                      className="flex items-center gap-sm px-md py-sm rounded-lg border border-white/5"
                      style={{ background: '#333539' }}>
                      <span className={`material-symbols-outlined ${badge.color}`}
                        style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
                        {badge.icon}
                      </span>
                      <span className="text-label-md font-inter text-on-surface">{badge.label}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-sm px-md py-sm rounded-lg border border-white/5 opacity-40"
                    style={{ background: '#333539' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock</span>
                    <span className="text-label-md font-inter text-on-surface-variant">Hidden Trait</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="w-full max-w-5xl mx-auto px-md mt-2xl">
          <div className="text-center mb-xl">
            <h2 className="text-headline-lg font-inter font-semibold text-on-surface">
              How MindMatch works
            </h2>
            <p className="text-body-lg font-inter text-on-surface-variant mt-sm max-w-xl mx-auto">
              Three simple steps to discover your compatibility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {[
              { step: '01', icon: 'group_add', title: 'Create a Room', desc: 'Choose your categories and question count. Share the code with your partner.' },
              { step: '02', icon: 'quiz', title: 'Answer Simultaneously', desc: 'Both players answer the same questions independently — you can\'t see each other\'s answers.' },
              { step: '03', icon: 'insights', title: 'Reveal Your Score', desc: 'Get your compatibility score, category breakdown, AI insights, and shareable badges.' },
            ].map((item, idx) => (
              <div key={item.step} className="premium-card rounded-2xl p-lg flex flex-col gap-md"
                style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className="flex items-center gap-md">
                  <span className="text-label-caps font-inter text-on-surface-variant">{item.step}</span>
                  <span className="material-symbols-outlined text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </div>
                <h3 className="text-headline-md font-inter font-semibold text-on-surface">{item.title}</h3>
                <p className="text-body-md font-inter text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Who Can Play ── */}
        <section className="w-full max-w-5xl mx-auto px-md mt-2xl">
          <div className="gradient-card rounded-2xl p-xl text-center">
            <h2 className="text-headline-lg font-inter font-semibold text-on-surface mb-md">
              For any two people
            </h2>
            <p className="text-body-lg font-inter text-on-surface-variant mb-xl max-w-2xl mx-auto">
              MindMatch isn&apos;t just for couples. Discover compatibility with anyone in your life.
            </p>
            <div className="flex flex-wrap justify-center gap-md">
              {['Couples', 'Best Friends', 'Siblings', 'Teammates', 'Parent & Child', 'New Friends'].map((label) => (
                <span key={label}
                  className="px-lg py-sm rounded-full border border-white/10 text-body-md font-inter text-on-surface"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="w-full max-w-3xl mx-auto px-md mt-2xl text-center">
          <h2 className="text-headline-lg font-inter font-semibold text-on-surface mb-md">
            Ready to find your match?
          </h2>
          <p className="text-body-lg font-inter text-on-surface-variant mb-xl">
            Create a room in seconds and invite someone to play.
          </p>
          <button
            onClick={() => router.push('/create')}
            className="inline-flex items-center gap-sm bg-primary text-on-primary rounded-full px-2xl py-md text-body-md font-inter font-semibold hover:opacity-90 transition-all hover:-translate-y-0.5"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 12px 32px rgba(255,255,255,0.1)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
            Start Playing Now
          </button>
        </section>
      </main>
      <Footer />
    </>
  );
}
