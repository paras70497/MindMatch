'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10"
      style={{ background: 'rgba(17,19,23,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-[1200px] mx-auto px-lg py-md flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-xl">
          <Link href="/" className="flex items-center gap-sm group">
            <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
            <span className="text-headline-md font-inter font-semibold tracking-tight text-on-surface group-hover:text-primary transition-colors">
              MindMatch
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-lg">
            <Link href="/#how-it-works"
              className="text-on-surface-variant text-label-md font-inter hover:text-primary transition-colors">
              How it Works
            </Link>
            <Link href="/#compatibility"
              className="text-on-surface-variant text-label-md font-inter hover:text-primary transition-colors">
              Compatibility
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-md">
          <button
            id="nav-join-btn"
            onClick={() => router.push('/join')}
            className="hidden md:inline-flex items-center justify-center bg-transparent border border-outline-variant text-on-surface rounded-full px-lg py-sm text-label-md font-inter hover:bg-white/5 transition-colors">
            Join Room
          </button>
          <button
            id="nav-create-btn"
            onClick={() => router.push('/create')}
            className="inline-flex items-center justify-center bg-primary text-on-primary rounded-full px-lg py-sm text-label-md font-inter hover:opacity-90 transition-opacity"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)' }}>
            Create Room
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-sm text-on-surface"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu">
            <span className="material-symbols-outlined">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-lg py-md flex flex-col gap-md"
          style={{ background: 'rgba(17,19,23,0.95)' }}>
          <Link href="/#how-it-works" className="text-on-surface-variant text-body-md font-inter hover:text-primary transition-colors"
            onClick={() => setMobileOpen(false)}>
            How it Works
          </Link>
          <Link href="/#compatibility" className="text-on-surface-variant text-body-md font-inter hover:text-primary transition-colors"
            onClick={() => setMobileOpen(false)}>
            Compatibility
          </Link>
          <button onClick={() => { router.push('/join'); setMobileOpen(false); }}
            className="text-left text-on-surface text-body-md font-inter hover:text-primary transition-colors">
            Join Room
          </button>
          <button onClick={() => { router.push('/create'); setMobileOpen(false); }}
            className="text-left text-primary text-body-md font-inter font-semibold">
            Create Room
          </button>
        </div>
      )}
    </nav>
  );
}
