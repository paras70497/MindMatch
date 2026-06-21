'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const CATEGORIES = [
  { id: 'values', label: 'Values', icon: 'favorite' },
  { id: 'lifestyle', label: 'Lifestyle', icon: 'home' },
  { id: 'communication', label: 'Communication', icon: 'forum' },
  { id: 'personality', label: 'Personality', icon: 'person' },
  { id: 'fun', label: 'Fun', icon: 'celebration' },
  { id: 'random', label: 'Random Mix', icon: 'shuffle' },
];

const QUESTION_COUNTS = [
  { value: 10, label: '10', sub: 'Quick' },
  { value: 25, label: '25', sub: 'Standard' },
  { value: 50, label: '50', sub: 'Deep Dive' },
];

export default function CreateRoomPage() {
  const router = useRouter();
  const [numQuestions, setNumQuestions] = useState(10);
  const [customNum, setCustomNum] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['values', 'lifestyle', 'communication', 'personality', 'fun']);
  const [predictionMode, setPredictionMode] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdRoom, setCreatedRoom] = useState<{ code: string; roomId: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleCategory = (id: string) => {
    if (id === 'random') {
      setSelectedCategories(['values', 'lifestyle', 'communication', 'personality', 'fun', 'random']);
      return;
    }
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev.filter(c => c !== 'random'), id]
    );
  };

  const handleCreate = async () => {
    if (!nickname.trim()) {
      setError('Please enter your nickname');
      return;
    }
    if (selectedCategories.length === 0) {
      setError('Please select at least one category');
      return;
    }

    setLoading(true);
    setError('');

    const finalNum = showCustom && customNum ? parseInt(customNum) : numQuestions;

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numQuestions: finalNum,
          categories: selectedCategories,
          predictionMode,
          timerEnabled,
          timerSeconds: 30,
          hostNickname: nickname.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create room');

      setCreatedRoom({ code: data.code, roomId: data.roomId });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (createdRoom) {
      navigator.clipboard.writeText(createdRoom.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEnterRoom = () => {
    if (createdRoom) {
      localStorage.setItem('mm_nickname', nickname);
      localStorage.setItem('mm_roomCode', createdRoom.code);
      router.push(`/room/${createdRoom.code}?nickname=${encodeURIComponent(nickname)}`);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-2xl px-md w-full">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

        <div className="relative z-10 w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-xl">
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-inter font-semibold text-on-surface">
              Room Configuration
            </h1>
            <p className="text-body-md font-inter text-on-surface-variant max-w-lg mx-auto mt-sm">
              Fine-tune your session parameters for the perfect compatibility experience.
            </p>
          </div>

          {/* Room Created Modal */}
          {createdRoom && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-md"
              style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
              <div className="gradient-card rounded-2xl p-xl max-w-sm w-full text-center"
                style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                <span className="material-symbols-outlined text-tertiary-fixed-dim mb-md block"
                  style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <h2 className="text-headline-md font-inter font-semibold text-on-surface mb-sm">Room Created!</h2>
                <p className="text-body-md font-inter text-on-surface-variant mb-xl">
                  Share this code with your partner to join the session.
                </p>

                {/* Room Code */}
                <div className="rounded-xl p-lg mb-md border border-white/10 relative"
                  style={{ background: '#0c0e12' }}>
                  <span className="text-label-caps font-inter text-on-surface-variant block mb-sm tracking-widest uppercase">
                    Room Code
                  </span>
                  <span className="font-inter font-bold text-primary code-input block"
                    style={{ fontSize: '40px', letterSpacing: '0.3em', lineHeight: '1' }}>
                    {createdRoom.code}
                  </span>
                </div>

                <div className="flex gap-md">
                  <button
                    onClick={handleCopyCode}
                    className="flex-1 flex items-center justify-center gap-sm border border-outline-variant text-on-surface rounded-lg py-md text-body-md font-inter hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      {copied ? 'check' : 'content_copy'}
                    </span>
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                  <button
                    onClick={handleEnterRoom}
                    className="flex-1 flex items-center justify-center gap-sm bg-primary text-on-primary rounded-lg py-md text-body-md font-inter font-semibold hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                    Enter Room
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Config Card */}
          <div className="w-full rounded-2xl p-lg md:p-xl flex flex-col gap-xl border border-white/8"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%), #1a1c20' }}>

            {/* Nickname */}
            <section className="flex flex-col gap-md">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>person</span>
                <h2 className="text-headline-md font-inter font-semibold text-on-surface">Your Nickname</h2>
              </div>
              <input
                id="nickname-input"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your name..."
                maxLength={20}
                className="input-field w-full rounded-lg px-md py-md text-body-lg font-inter text-on-surface placeholder:text-on-surface-variant/50"
              />
            </section>

            <hr className="border-white/5" />

            {/* Number of Questions */}
            <section className="flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>format_list_numbered</span>
                  <h2 className="text-headline-md font-inter font-semibold text-on-surface">Depth of Assessment</h2>
                </div>
                <span className="text-label-caps font-inter text-on-surface-variant px-sm py-xs border border-white/10 rounded uppercase tracking-widest">
                  Questions
                </span>
              </div>

              <div className="grid grid-cols-3 gap-md p-xs rounded-xl border border-white/5"
                style={{ background: '#111317' }}>
                {QUESTION_COUNTS.map(({ value, label, sub }) => (
                  <button
                    key={value}
                    id={`q-count-${value}`}
                    onClick={() => { setNumQuestions(value); setShowCustom(false); }}
                    className={`py-md rounded-lg text-label-md font-inter flex flex-col items-center justify-center gap-xs transition-all ${
                      numQuestions === value && !showCustom
                        ? 'bg-primary text-on-primary'
                        : 'border border-white/10 text-on-surface-variant hover:bg-white/5'
                    }`}>
                    <span className="text-headline-md font-inter font-semibold">{label}</span>
                    <span className="opacity-70 text-xs">{sub}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowCustom(!showCustom)}
                className="text-label-md font-inter text-on-surface-variant hover:text-on-surface transition-colors self-start flex items-center gap-xs">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  {showCustom ? 'expand_less' : 'expand_more'}
                </span>
                Custom number
              </button>

              {showCustom && (
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={customNum}
                  onChange={(e) => setCustomNum(e.target.value)}
                  placeholder="Enter custom count (5–100)"
                  className="input-field w-full rounded-lg px-md py-sm text-body-md font-inter text-on-surface"
                />
              )}
            </section>

            <hr className="border-white/5" />

            {/* Categories */}
            <section className="flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>category</span>
                  <h2 className="text-headline-md font-inter font-semibold text-on-surface">Psychological Domains</h2>
                </div>
                <span className="text-label-caps font-inter text-on-surface-variant px-sm py-xs border border-white/10 rounded uppercase tracking-widest">
                  Categories
                </span>
              </div>
              <p className="text-body-md font-inter text-on-surface-variant">
                Select the core areas to evaluate during your session.
              </p>
              <div className="flex flex-wrap gap-sm">
                {CATEGORIES.map(({ id, label, icon }) => {
                  const active = selectedCategories.includes(id) ||
                    (id === 'random' && selectedCategories.length === 6);
                  return (
                    <button
                      key={id}
                      id={`cat-${id}`}
                      onClick={() => toggleCategory(id)}
                      className={`px-md py-sm rounded-full text-label-md font-inter flex items-center gap-xs transition-all ${
                        active
                          ? 'bg-primary text-on-primary border border-primary'
                          : 'border border-white/10 text-on-surface-variant hover:border-white/30 hover:text-on-surface'
                      }`}
                      style={active ? { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)' } : {}}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>
                        {icon}
                      </span>
                      {label}
                    </button>
                  );
                })}
              </div>
            </section>

            <hr className="border-white/5" />

            {/* Toggles */}
            <section className="flex flex-col gap-lg">
              {/* Prediction Mode */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-xs pr-md">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>psychology</span>
                    <h3 className="text-headline-md font-inter font-semibold text-on-surface">Prediction Mode</h3>
                  </div>
                  <p className="text-body-md font-inter text-on-surface-variant">
                    Predict what your partner will answer before seeing their response.
                  </p>
                </div>
                <button
                  id="prediction-toggle"
                  onClick={() => setPredictionMode(!predictionMode)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 mt-1 ${
                    predictionMode ? 'bg-primary' : 'bg-surface-container-highest border border-white/10'
                  }`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform ${
                    predictionMode ? 'translate-x-6 bg-on-primary' : 'translate-x-0.5 bg-on-surface-variant'
                  }`} />
                </button>
              </div>

              {/* Timer Mode */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-xs pr-md">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>timer</span>
                    <h3 className="text-headline-md font-inter font-semibold text-on-surface">Timer Mode</h3>
                  </div>
                  <p className="text-body-md font-inter text-on-surface-variant">
                    Apply a 30-second limit per question for instinctual responses.
                  </p>
                </div>
                <button
                  id="timer-toggle"
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 mt-1 ${
                    timerEnabled ? 'bg-primary' : 'bg-surface-container-highest border border-white/10'
                  }`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform ${
                    timerEnabled ? 'translate-x-6 bg-on-primary' : 'translate-x-0.5 bg-on-surface-variant'
                  }`} />
                </button>
              </div>
            </section>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-md px-md py-sm rounded-lg border border-error/30 text-error text-body-md font-inter flex items-center gap-sm"
              style={{ background: 'rgba(255,180,171,0.05)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
              {error}
            </div>
          )}

          {/* CTA */}
          <div className="mt-xl flex flex-col items-center gap-md">
            <button
              id="initialize-room-btn"
              onClick={handleCreate}
              disabled={loading}
              className="w-full md:w-auto bg-primary text-on-primary font-inter font-semibold text-headline-md px-2xl py-md rounded-xl flex items-center justify-center gap-sm hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), 0 10px 30px rgba(255,255,255,0.08)' }}>
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: '20px' }}>progress_activity</span>
                  Creating Room...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                  Initialize Room
                </>
              )}
            </button>
            <p className="text-label-md font-inter text-outline-variant flex items-center gap-xs">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
              Private session — only players with the code can join
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
