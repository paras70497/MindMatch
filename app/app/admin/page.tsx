'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Question {
  _id: string;
  text: string;
  category: string;
  type: string;
  options: Array<{ text: string; value: string | number }>;
  isActive: boolean;
  isPrediction: boolean;
}

const CATEGORIES = ['values', 'lifestyle', 'communication', 'personality', 'fun'];
const TYPES = ['multiple_choice', 'either_or', 'scale', 'single_choice'];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    category: 'values',
    type: 'multiple_choice',
    isPrediction: false,
    options: [
      { text: '', value: 'a' },
      { text: '', value: 'b' },
      { text: '', value: 'c' },
      { text: '', value: 'd' },
    ],
  });
  const [stats, setStats] = useState({ total: 0, byCategory: {} as Record<string, number> });

  const fetchQuestions = async (adminKey: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/questions', {
        headers: { 'x-admin-key': adminKey },
      });
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setQuestions(data.questions);
      
      // Compute stats
      const byCategory: Record<string, number> = {};
      for (const q of data.questions) {
        byCategory[q.category] = (byCategory[q.category] || 0) + 1;
      }
      setStats({ total: data.questions.length, byCategory });
    } catch {
      setError('Authentication failed');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticated(true);
    fetchQuestions(password);
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': password,
        },
        body: JSON.stringify({
          ...newQuestion,
          options: newQuestion.type === 'scale'
            ? [1,2,3,4,5].map(n => ({ text: String(n), value: n }))
            : newQuestion.options.filter(o => o.text.trim()),
          isActive: true,
          weight: 1,
        }),
      });
      if (res.ok) {
        setShowAddForm(false);
        fetchQuestions(password);
        setNewQuestion({ text: '', category: 'values', type: 'multiple_choice', isPrediction: false,
          options: [{ text: '', value: 'a' }, { text: '', value: 'b' }, { text: '', value: 'c' }, { text: '', value: 'd' }] });
      }
    } catch {
      setError('Failed to add question');
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/questions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': password },
      body: JSON.stringify({ isActive: !current }),
    });
    fetchQuestions(password);
  };

  if (!authenticated) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-md">
          <div className="w-full max-w-sm">
            <div className="text-center mb-xl">
              <span className="material-symbols-outlined text-primary block mb-md" style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}>
                admin_panel_settings
              </span>
              <h1 className="text-headline-lg font-inter font-semibold text-on-surface">Admin Panel</h1>
              <p className="text-body-md font-inter text-on-surface-variant mt-sm">Enter your admin password to continue</p>
            </div>
            <form onSubmit={handleLogin} className="flex flex-col gap-md">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Admin password"
                className="input-field w-full rounded-lg px-md py-md text-body-lg font-inter text-on-surface"
              />
              {error && <p className="text-error text-body-md font-inter">{error}</p>}
              <button type="submit"
                className="bg-primary text-on-primary font-inter font-semibold py-md rounded-lg hover:opacity-90 transition-opacity">
                Access Admin
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-2xl px-md max-w-[1200px] mx-auto w-full">
        <div className="flex items-center justify-between mb-xl">
          <div>
            <h1 className="text-headline-lg font-inter font-semibold text-on-surface">Admin Panel</h1>
            <p className="text-body-md font-inter text-on-surface-variant mt-xs">Manage questions and view analytics</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-sm bg-primary text-on-primary font-inter font-semibold text-body-md px-lg py-sm rounded-lg hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Add Question
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-md mb-xl">
          <div className="col-span-2 premium-card rounded-xl p-md text-center">
            <span className="text-display font-inter font-bold text-on-surface">{stats.total}</span>
            <p className="text-body-md font-inter text-on-surface-variant">Total Questions</p>
          </div>
          {CATEGORIES.map(cat => (
            <div key={cat} className="premium-card rounded-xl p-md text-center">
              <span className="text-headline-md font-inter font-bold text-on-surface">{stats.byCategory[cat] || 0}</span>
              <p className="text-label-md font-inter text-on-surface-variant capitalize">{cat}</p>
            </div>
          ))}
        </div>

        {/* Add Question Form */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-md"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
            <div className="gradient-card rounded-2xl p-xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
              style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
              <div className="flex items-center justify-between mb-xl">
                <h2 className="text-headline-md font-inter font-semibold text-on-surface">Add New Question</h2>
                <button onClick={() => setShowAddForm(false)}
                  className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleAddQuestion} className="flex flex-col gap-md">
                <textarea
                  value={newQuestion.text}
                  onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  placeholder="Question text..."
                  rows={3}
                  required
                  className="input-field w-full rounded-lg px-md py-md text-body-lg font-inter text-on-surface resize-none"
                />
                <div className="grid grid-cols-2 gap-md">
                  <div>
                    <label className="text-label-md font-inter text-on-surface-variant block mb-sm">Category</label>
                    <select value={newQuestion.category}
                      onChange={e => setNewQuestion({ ...newQuestion, category: e.target.value })}
                      className="input-field w-full rounded-lg px-md py-sm text-body-md font-inter text-on-surface">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-label-md font-inter text-on-surface-variant block mb-sm">Type</label>
                    <select value={newQuestion.type}
                      onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value })}
                      className="input-field w-full rounded-lg px-md py-sm text-body-md font-inter text-on-surface">
                      {TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                </div>
                {newQuestion.type !== 'scale' && (
                  <div className="flex flex-col gap-sm">
                    <label className="text-label-md font-inter text-on-surface-variant">Options</label>
                    {newQuestion.options.map((opt, idx) => (
                      <input key={idx}
                        type="text"
                        value={opt.text}
                        onChange={e => {
                          const opts = [...newQuestion.options];
                          opts[idx] = { ...opts[idx], text: e.target.value };
                          setNewQuestion({ ...newQuestion, options: opts });
                        }}
                        placeholder={`Option ${idx + 1}`}
                        className="input-field w-full rounded-lg px-md py-sm text-body-md font-inter text-on-surface"
                      />
                    ))}
                  </div>
                )}
                <label className="flex items-center gap-sm cursor-pointer">
                  <input type="checkbox" checked={newQuestion.isPrediction}
                    onChange={e => setNewQuestion({ ...newQuestion, isPrediction: e.target.checked })}
                    className="w-4 h-4" />
                  <span className="text-body-md font-inter text-on-surface">Prediction question</span>
                </label>
                <button type="submit"
                  className="bg-primary text-on-primary font-inter font-semibold py-md rounded-lg hover:opacity-90 transition-opacity">
                  Add Question
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Questions Table */}
        {loading ? (
          <div className="text-center py-2xl">
            <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '32px' }}>progress_activity</span>
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            {questions.map(q => (
              <div key={q._id}
                className={`premium-card rounded-xl p-md flex items-start justify-between gap-md ${!q.isActive ? 'opacity-50' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-sm mb-xs">
                    <span className="text-label-caps font-inter text-on-surface-variant uppercase tracking-widest">{q.category}</span>
                    <span className="text-label-caps font-inter text-on-surface-variant uppercase">·</span>
                    <span className="text-label-caps font-inter text-on-surface-variant uppercase">{q.type.replace('_', ' ')}</span>
                    {q.isPrediction && (
                      <span className="text-label-caps font-inter text-tertiary-fixed-dim uppercase">· Prediction</span>
                    )}
                  </div>
                  <p className="text-body-md font-inter text-on-surface">{q.text}</p>
                  <div className="flex flex-wrap gap-xs mt-sm">
                    {q.options.map((opt, i) => (
                      <span key={i}
                        className="px-sm py-xs rounded text-label-md font-inter text-on-surface-variant border border-white/10">
                        {opt.text}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleActive(q._id, q.isActive)}
                  className={`flex-shrink-0 p-sm rounded-lg border transition-colors ${
                    q.isActive
                      ? 'border-tertiary-fixed-dim/30 text-tertiary-fixed-dim hover:bg-red-900/20'
                      : 'border-white/10 text-on-surface-variant hover:border-tertiary-fixed-dim/30'
                  }`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {q.isActive ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
