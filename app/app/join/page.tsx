'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function JoinRoomPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setError('Please enter your nickname');
      return;
    }
    if (code.length !== 6) {
      setError('Please enter a valid 6-character room code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/rooms/${code.toUpperCase()}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Room not found');
      if (data.status === 'finished') throw new Error('This game has already finished');
      if (data.players?.length >= 2 && !data.players.find((p: { nickname: string }) => p.nickname === nickname)) {
        throw new Error('Room is full');
      }

      localStorage.setItem('mm_nickname', nickname);
      localStorage.setItem('mm_roomCode', code.toUpperCase());
      router.push(`/room/${code.toUpperCase()}?nickname=${encodeURIComponent(nickname.trim())}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center px-lg pt-2xl pb-2xl relative">
        {/* Ambient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-20">
          <div className="w-[800px] h-[800px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div className="relative z-10 w-full max-w-md flex flex-col items-center animate-fade-in">
          <span className="material-symbols-outlined text-primary mb-xl opacity-80"
            style={{ fontSize: '48px', fontVariationSettings: "'FILL' 0" }}>
            key
          </span>

          <h1 className="font-inter font-bold text-on-surface text-center mb-sm"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: '1.2', letterSpacing: '-0.04em' }}>
            Enter Room Code
          </h1>
          <p className="text-body-lg font-inter text-on-surface-variant text-center mb-2xl max-w-sm">
            Enter the 6-character code provided by the room creator to join the session.
          </p>

          <form onSubmit={handleJoin} className="w-full flex flex-col items-center gap-md">
            {/* Nickname input */}
            <div className="w-full">
              <label htmlFor="join-nickname" className="text-label-md font-inter text-on-surface-variant mb-sm block">
                Your Nickname
              </label>
              <input
                id="join-nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your name..."
                maxLength={20}
                className="input-field w-full rounded-lg px-md py-md text-body-lg font-inter text-on-surface placeholder:text-on-surface-variant/50"
              />
            </div>

            {/* Room code input */}
            <div className="w-full">
              <label htmlFor="room-code-input" className="text-label-md font-inter text-on-surface-variant mb-sm block">
                Room Code
              </label>
              <input
                id="room-code-input"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase().slice(0, 6));
                  setError('');
                }}
                placeholder="——————"
                maxLength={6}
                required
                autoComplete="off"
                className="code-input input-field w-full rounded-lg py-md px-md font-inter text-primary placeholder:text-on-surface-variant/30"
                style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '0.4em' }}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="w-full px-md py-sm rounded-lg border border-error/30 text-error text-body-md font-inter flex items-center gap-sm"
                style={{ background: 'rgba(255,180,171,0.05)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                {error}
              </div>
            )}

            <button
              id="join-game-btn"
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-primary text-on-primary font-inter font-semibold text-body-md py-md px-lg rounded-lg flex items-center justify-center gap-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }}>
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>progress_activity</span>
                  Joining...
                </>
              ) : (
                <>
                  Join Game
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-xl text-center">
            <p className="text-body-md font-inter text-on-surface-variant">
              Don&apos;t have a code?{' '}
              <button onClick={() => router.push('/create')}
                className="text-primary hover:underline font-semibold transition-all">
                Create a room
              </button>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
