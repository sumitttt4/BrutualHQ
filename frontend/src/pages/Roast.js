import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// A standalone roast generator page (based on the RoastGenerator in Home.js)
const Roast = () => {
  const [input, setInput] = useState('');
  const [roast, setRoast] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Roast mode dropdown state
  const roastModes = [
    { id: 'roast2', label: ' Roast 2.0' },
    { id: 'badchick', label: ' Bad Chick' },
    { id: 'unhinged', label: ' Unhinged' },
    { id: 'smartass', label: ' Smartass' },
    { id: 'clown', label: ' Clown Mode' }
  ];
  const [selectedMode, setSelectedMode] = useState(roastModes[0].id);
  const [modeOpen, setModeOpen] = useState(false);

  const generateRoast = async () => {
    if (!input.trim()) {
      setError('Please tell us something about yourself first!');
      return;
    }
    setIsLoading(true);
    setError('');
    setRoast('');
    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
  // include selected roast mode so backend can adjust tone
  body: JSON.stringify({ input: input.trim(), mode: selectedMode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate roast');
      setRoast(data.roast || 'No roast returned.');
    } catch (err) {
      console.error('Roast generation error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-2">Get Roasted</h1>
          <p className="text-lg" style={{ color: 'var(--muted-text)' }}>Tell us a few facts and we&apos;ll return a short, savage roast.</p>
        </div>

  <div className="rounded-xl p-6 shadow-lg mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          {/* Roast mode selector */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="text-sm" style={{ color: 'var(--muted-text)' }}>Choose roast mode</div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setModeOpen(!modeOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition"
                style={{ background: 'var(--surface)', color: 'var(--text)', borderColor: modeOpen ? 'var(--primary)' : 'transparent' }}
                aria-haspopup="listbox"
                aria-expanded={modeOpen}
              >
                <span className="whitespace-nowrap">
                  {roastModes.find(m => m.id === selectedMode)?.label}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--muted-text)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {modeOpen && (
                <ul
                  role="listbox"
                  tabIndex={-1}
                  className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg overflow-hidden z-40"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', outline: 'none' }}
                >
                  {roastModes.map((m) => {
                    const isSelected = m.id === selectedMode;
                    return (
                      <li
                        key={m.id}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => { setSelectedMode(m.id); setModeOpen(false); }}
                        className="px-3 py-2 cursor-pointer text-sm"
                        style={{
                          color: isSelected ? 'var(--text)' : 'var(--muted-text)',
                          background: isSelected ? 'var(--bg)' : 'transparent',
                          borderLeft: isSelected ? '3px solid var(--primary)' : '3px solid transparent'
                        }}
                      >
                        {m.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell us about yourself — habits, dreams, or anything we can roast you for (be specific for better burns)."
            className="w-full p-4 bg-transparent rounded-lg resize-none focus:ring-0"
            style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
            rows="4"
            maxLength="300"
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm" style={{ color: 'var(--muted-text)' }}>{input.length}/300</span>
            <div className="flex items-center gap-3">
              <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--muted-text)', textDecoration: 'none' }} className="hover:underline">Back</Link>
              <button
                onClick={generateRoast}
                disabled={isLoading || !input.trim()}
                style={{
                  padding: '8px 18px',
                  background: isLoading ? 'var(--muted-button, #6b7280)' : 'linear-gradient(90deg, var(--accent, #fb923c) 0%, var(--primary, #ef4444) 100%)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '10px',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'transform 120ms ease'
                }}
                className="transition-all duration-200"
              >
                {isLoading ? 'Roasting...' : 'Roast Me!'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-center">{error}</p>
          </div>
        )}

        {roast && (
          <div className="bg-gradient-to-r from-orange-50 to-rose-50 border-l-4 border-rose-400 rounded-lg p-6 shadow-lg mb-6">
            <h4 className="font-semibold text-rose-600 mb-2">Your Roast</h4>
            <p className="text-slate-800 whitespace-pre-line">{roast}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roast;
