'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { Suspense } from 'react';

interface Player {
  userId: string;
  nickname: string;
  ready: boolean;
}

function WaitingRoomContent({ code }: { code: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nickname = searchParams.get('nickname') || localStorage.getItem('mm_nickname') || 'Player';
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomId, setRoomId] = useState('');
  const [myReady, setMyReady] = useState(false);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  const roomIdRef = useRef(roomId);
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    const socket = connectSocket();

    const onConnect = () => {
      setConnected(true);
      socket.emit('join_room', { code, nickname });
    };

    if (socket.connected) {
      onConnect();
    }

    socket.on('connect', onConnect);

    socket.on('room_state', (room: { _id: string; players: Player[] }) => {
      setRoomId(room._id);
      setPlayers(room.players || []);
    });

    socket.on('player_joined', ({ players: updatedPlayers }: { players: Player[] }) => {
      setPlayers(updatedPlayers);
    });

    socket.on('player_ready_update', ({ players: updatedPlayers }: { players: Player[] }) => {
      setPlayers(updatedPlayers);
    });

    socket.on('game_started', ({ question, index, total }: { question: unknown; index: number; total: number }) => {
      sessionStorage.setItem('mm_first_question', JSON.stringify({ question, index, total }));
      router.push(`/game/${roomIdRef.current}?nickname=${encodeURIComponent(nickname)}`);
    });

    socket.on('player_disconnected', ({ nickname: dcNickname }: { nickname: string }) => {
      setPlayers(prev => prev.filter(p => p.nickname !== dcNickname));
    });

    socket.on('error', ({ message }: { message: string }) => {
      setError(message);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('room_state');
      socket.off('player_joined');
      socket.off('player_ready_update');
      socket.off('game_started');
      socket.off('player_disconnected');
      socket.off('error');
    };
  }, [code, nickname, router]);

  const handleReady = () => {
    if (!roomId) return;
    const socket = connectSocket();
    socket.emit('player_ready', { roomId });
    setMyReady(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const player1 = players[0];
  const player2 = players[1];
  const bothConnected = players.length === 2;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-md py-2xl relative"
      style={{ background: '#111317' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-xl">
          <div className="flex items-center justify-center gap-sm mb-sm">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
            <span className="text-headline-md font-inter font-semibold text-on-surface">MindMatch</span>
          </div>
          <span className="text-label-caps font-inter text-on-surface-variant tracking-widest uppercase">
            Waiting Room
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-lg px-md py-sm rounded-lg border border-error/30 text-error text-body-md font-inter text-center"
            style={{ background: 'rgba(255,180,171,0.05)' }}>
            {error}
          </div>
        )}

        {/* Room Code Card */}
        <div className="gradient-card rounded-2xl p-lg mb-lg text-center">
          <span className="text-label-caps font-inter text-on-surface-variant tracking-widest uppercase block mb-sm">
            Room Code
          </span>
          <div className="flex items-center justify-center gap-md">
            <span className="font-inter font-bold text-primary code-input"
              style={{ fontSize: '36px', letterSpacing: '0.3em', lineHeight: '1' }}>
              {code}
            </span>
            <button onClick={handleCopyCode}
              className="p-sm rounded-lg border border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
          <p className="text-body-md font-inter text-on-surface-variant mt-sm">
            Share this code with your partner
          </p>
        </div>

        {/* Players */}
        <div className="gradient-card rounded-2xl p-lg mb-lg">
          <h2 className="text-label-caps font-inter text-on-surface-variant tracking-widest uppercase mb-lg text-center">
            Players
          </h2>
          <div className="grid grid-cols-2 gap-md">
            {/* Player 1 */}
            <div className={`rounded-xl p-lg flex flex-col items-center gap-sm border transition-all ${
              player1 ? 'border-primary/30' : 'border-white/10 opacity-50'
            }`} style={{ background: player1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)' }}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                player1 ? 'border-primary/50 bg-primary/10' : 'border-white/10'
              }`}>
                {player1 ? (
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    person
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant">
                    person_outline
                  </span>
                )}
              </div>
              <span className="text-body-md font-inter font-semibold text-on-surface">
                {player1 ? player1.nickname : 'Waiting...'}
              </span>
              {player1 && (
                <span className={`text-label-caps font-inter tracking-widest uppercase flex items-center gap-xs ${
                  player1.ready ? 'text-tertiary-fixed-dim' : 'text-on-surface-variant'
                }`}>
                  {player1.ready ? (
                    <><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span> Ready</>
                  ) : (
                    <><span className="animate-pulse-ring inline-block w-2 h-2 rounded-full bg-on-surface-variant" /> Waiting</>
                  )}
                </span>
              )}
            </div>

            {/* Player 2 */}
            <div className={`rounded-xl p-lg flex flex-col items-center gap-sm border transition-all ${
              player2 ? 'border-primary/30' : 'border-white/10 opacity-50'
            }`} style={{ background: player2 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)' }}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                player2 ? 'border-primary/50 bg-primary/10' : 'border-white/10'
              }`}>
                {player2 ? (
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    person
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant">
                    person_outline
                  </span>
                )}
              </div>
              <span className="text-body-md font-inter font-semibold text-on-surface">
                {player2 ? player2.nickname : 'Waiting...'}
              </span>
              {player2 ? (
                <span className={`text-label-caps font-inter tracking-widest uppercase flex items-center gap-xs ${
                  player2.ready ? 'text-tertiary-fixed-dim' : 'text-on-surface-variant'
                }`}>
                  {player2.ready ? (
                    <><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span> Ready</>
                  ) : (
                    <><span className="animate-pulse-ring inline-block w-2 h-2 rounded-full bg-on-surface-variant" /> Waiting</>
                  )}
                </span>
              ) : (
                <span className="text-label-caps font-inter text-on-surface-variant tracking-widest uppercase flex items-center gap-xs">
                  <span className="animate-pulse-ring inline-block w-2 h-2 rounded-full bg-on-surface-variant" />
                  Not joined
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Connection status */}
        <div className="flex items-center justify-center gap-sm mb-lg">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-tertiary-fixed-dim' : 'bg-on-surface-variant animate-pulse'}`} />
          <span className="text-label-md font-inter text-on-surface-variant">
            {connected ? 'Connected' : 'Connecting...'}
          </span>
        </div>

        {/* Ready Button */}
        {bothConnected && !myReady && (
          <button
            id="ready-btn"
            onClick={handleReady}
            className="w-full bg-primary text-on-primary font-inter font-semibold text-body-lg py-md rounded-xl flex items-center justify-center gap-sm hover:opacity-90 transition-all hover:-translate-y-0.5"
            style={{ boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), 0 10px 30px rgba(255,255,255,0.08)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
            I&apos;m Ready!
          </button>
        )}

        {myReady && (
          <div className="w-full rounded-xl py-md border border-tertiary-fixed-dim/30 flex items-center justify-center gap-sm text-body-md font-inter text-tertiary-fixed-dim"
            style={{ background: 'rgba(96,222,140,0.05)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            You&apos;re ready! Waiting for partner...
          </div>
        )}

        {!bothConnected && (
          <div className="w-full rounded-xl py-md border border-white/10 flex items-center justify-center gap-sm text-body-md font-inter text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin" style={{ fontSize: '20px' }}>progress_activity</span>
            Waiting for partner to join...
          </div>
        )}
      </div>
    </main>
  );
}

export default function WaitingRoomPage({ params }: { params: Promise<{ code: string }> }) {
  const [code, setCode] = useState('');
  
  useEffect(() => {
    params.then(({ code }) => setCode(code.toUpperCase()));
  }, [params]);

  if (!code) return null;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-on-surface">Loading...</div>}>
      <WaitingRoomContent code={code} />
    </Suspense>
  );
}
