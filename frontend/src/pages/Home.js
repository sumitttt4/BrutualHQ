import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

// ----- Small CSS for taglines & tiny helpers (kept inside component file) -----
const taglineStyles = `
  /* Rotating taglines: fade + slight upward movement */
  .rotating-taglines { 
    position: relative; 
    height: 90px; 
    overflow: hidden; 
    margin-bottom: 1rem;
  }
  .tagline {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    opacity: 0;
    transform: translateY(8px);
    /* duration and delay will be set inline so the sequence scales with count */
    animation-name: taglineCycle;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
    transition: opacity 300ms ease, transform 300ms ease;
    line-height: 1.4;
    padding-right: 2rem;
  }


  /* small helper to allow different blob animation delays */
  .animate-blob { animation: blob 8s infinite; }
  .delay-2000 { animation-delay: 2s; }
  .delay-4000 { animation-delay: 4s; }

  @keyframes blob {
    0% { transform: translateY(0) scale(1); }
    33% { transform: translateY(-8px) scale(1.06); }
    66% { transform: translateY(6px) scale(0.98); }
    100% { transform: translateY(0) scale(1); }
  }

  /* subtle shared focus visual for inputs when JS-injected style exists */
  .focus-ring:focus { outline: none; box-shadow: 0 0 0 4px rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.9); }
`;

// Rotating taglines content (used inside Home's hero); includes roast-specific lines
const rotatingTaglinesContent = [
  'Unfiltered Roasts. Zero Mercy.',
  'Where Confidence Comes to Die.',
  'Brutal Truth, Served Hot.',
  'Your Daily Dose of Savage.',
  'Egos Burn Here.',
  'Hope is Cancelled. Roasts are Not.',
  'AI Roasts Sharper Than Your Ex.',
  'Enter Brave. Leave Roasted.',
  'Fueling Chaos, One Roast at a Time.',
  'BrutualHQ: Not for the Weak.',
  'Less Sugar. More Burn.',
  'Sarcasm Meets Brutality.',
  'Your Comfort Zone Ends Here.',
  'Roast Culture, Upgraded.',
  'Because Therapy is Too Soft.',
  'Roasts So Smart, They Burn Twice.',
  'Sharper Than Your WiFi Connection.',
  'AI With Zero Chill.',
  'The Roast You Didn’t Know You Needed.',
  'Funnier. Meaner. Smarter.',
  'Where Brutality Meets Intelligence.',
  'AI That Hits Below the Belt—Respectfully.',
  'Sharper Than Your Sunday Hangover.',
  'Comedy, Upgraded to 10x Savage Mode.',
  'AI Roasts. Human Tears.'
];

// (style injection moved into Home component useEffect to avoid running during SSR/hydration)

// per-item duration (seconds) for each tagline visible window
const perItemDuration = 3.5;

// ------------------ RoastGenerator (kept functional but polished UI) ------------------
const RoastGenerator = () => {
  const [input, setInput] = useState('');
  const [roast, setRoast] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
        body: JSON.stringify({ input: input.trim() }),
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateRoast();
    }
  };

  const samplePrompts = [
    "I think I'm going to be a millionaire by 30",
    "I never exercise but I eat healthy sometimes",
    "I'm starting my 15th business idea this month",
    "I read self-help books instead of actually doing things"
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Sample Prompts */}
      <div className="mb-6">
        <p className="text-sm mb-3 text-center" style={{ color: 'var(--muted-text)' }}>Try these examples:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => setInput(p)}
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                borderRadius: '999px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                cursor: 'pointer',
                transition: 'background 160ms ease'
              }}
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="rounded-xl p-6 shadow-lg mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tell us about yourself — habits, dreams, or anything we can roast you for (be specific for better burns)."
          className="w-full p-4 rounded-lg resize-none focus-ring"
          rows="3"
          maxLength="200"
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }}
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm" style={{ color: 'var(--muted-text)' }}>{input.length}/200</span>
          <button
            onClick={generateRoast}
            disabled={isLoading || !input.trim()}
            style={{
              padding: '10px 18px',
              background: isLoading ? 'var(--muted-text)' : 'linear-gradient(90deg, var(--accent) 0%, var(--primary) 100%)',
              color: 'white',
              fontWeight: 700,
              borderRadius: '10px',
              border: 'none',
              boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Roasting...' : 'Roast Me!'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-300 text-center">{error}</p>
        </div>
      )}

      {/* Roast Display */}
      {roast && (
        <div style={{ background: 'var(--surface)', borderLeft: '4px solid var(--primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '18px', boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--accent)' }}>
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Reality Check Delivered</h4>
              <p style={{ color: 'var(--text)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{roast}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ------------------ Main Home Component (Polished Hero + Cards + Sections) ------------------
const Home = () => {
  const [email, setEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);
  const [subError, setSubError] = useState('');

  useEffect(() => {
    // inject base tagline styles once
    if (typeof document !== 'undefined' && !document.querySelector('#dm-tagline-styles')) {
      const s = document.createElement('style');
      s.id = 'dm-tagline-styles';
      s.innerText = taglineStyles;
      document.head.appendChild(s);
    }

    // inject dynamic keyframes based on tagline count
    if (typeof document !== 'undefined' && !document.querySelector('#dm-tagline-dynamic')) {
      const n = rotatingTaglinesContent.length || 1;
      const slot = 100 / n;
      const fadePercent = Math.min(6, slot * 0.13);
      const appearAt = fadePercent;
      const disappearAt = slot - fadePercent;

      let frames = `@keyframes taglineCycle {\n`;
      frames += `  0% { opacity: 0; transform: translateY(8px); }\n`;
      frames += `  ${appearAt.toFixed(3)}% { opacity: 1; transform: translateY(0); }\n`;
      frames += `  ${disappearAt.toFixed(3)}% { opacity: 1; transform: translateY(0); }\n`;
      frames += `  ${slot.toFixed(3)}% { opacity: 0; transform: translateY(-8px); }\n`;
      frames += `  100% { opacity: 0; transform: translateY(-8px); }\n`;
      frames += `}\n`;

      const sd = document.createElement('style');
      sd.id = 'dm-tagline-dynamic';
      sd.innerText = frames + `.tagline { animation-name: taglineCycle; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }`;
      document.head.appendChild(sd);
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-10 -top-10 w-96 h-96 bg-blue-200/40 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute right-8 top-24 w-80 h-80 bg-emerald-200/28 rounded-full filter blur-3xl animate-blob delay-2000"></div>
          <div className="absolute left-16 -bottom-10 w-72 h-72 bg-purple-200/30 rounded-full filter blur-3xl animate-blob delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* ---------- LEFT: Hero copy (improved) ---------- */}
            <div className="pr-6 lg:pr-12">
              <div className="mb-4">
                <div className="inline-flex items-center gap-3">
                  <span className="inline-flex items-center gap-3 rounded-lg px-3 py-1 shadow-sm text-sm font-medium" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted-text)' }}>
                    <span className="inline-flex items-center justify-center bg-[#ff6a00] text-white rounded-sm w-6 h-6 font-bold">Y</span>
                    <span>Backed by Students Combinator</span>
                  </span>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-5" style={{ color: 'var(--text)' }}>
                Your comfort Zone
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                   Ends Here
                </span>
              </h1>

              {/* Rotating Taglines */}
              <div className="mb-8">
                <div className="rotating-taglines">
                  {rotatingTaglinesContent.map((line, idx) => {
                    // animation timing: use shared perItemDuration so total scales with count
                    const total = perItemDuration * rotatingTaglinesContent.length;
                    const delay = perItemDuration * idx;
                    const style = {
                      animationDuration: `${total}s`,
                      animationDelay: `${delay}s`,
                    };

                    return (
                      <p
                          key={idx}
                          className="tagline text-lg md:text-xl font-medium leading-relaxed"
                          style={{ ...style, color: 'var(--muted-text)' }}
                        >
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              <p className="text-base md:text-lg mb-8 max-w-2xl" style={{ color: 'var(--muted-text)' }}>
                Professional Ego crushing since 2024. AI-powered reality checks delivered in celebrity voices.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link
                  to="/generator"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-2xl hover:scale-[1.02] transition-transform duration-250"
                >
                  <span className="relative z-10">Try This</span>
                  <span className="absolute -inset-0.5 rounded-2xl blur opacity-20" />
                </Link>

                <Link
                  to="/voice"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-2xl shadow hover:shadow-lg transition"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted-text)' }}
                >
                  <svg className="w-5 h-5 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Try Celebrity Voices
                </Link>
              </div>

              {/* Secondary action */}
              <div className="mt-6">
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium text-purple-700 bg-purple-50 border border-purple-100 hover:bg-purple-100 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.172-.273L7 21l1.273-3.828C7.482 16.467 7 15.264 7 14c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                  </svg>
                  Start Chatting
                </Link>
              </div>
            </div>

            {/* ---------- RIGHT: Feature Cards (polished) ---------- */}
            <div className="grid grid-cols-2 gap-6">
              <Link to="/generator" className="group relative block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-400"></div>
                <div className="relative rounded-2xl p-6 h-64 flex flex-col justify-between shadow-lg hover:shadow-2xl transform group-hover:-translate-y-1 transition-all duration-300" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Generator</h3>
                    <p className="text-sm" style={{ color: 'var(--muted-text)' }}>AI-powered reality checks tailored to your situation</p>
                  </div>
                  <div className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-center text-sm shadow-sm">Try Now</div>
                </div>
              </Link>

              <Link to="/chat" className="group relative block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-400"></div>
                <div className="relative rounded-2xl p-6 h-64 flex flex-col justify-between shadow-lg hover:shadow-2xl transform group-hover:-translate-y-1 transition-all duration-300" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.172-.273L7 21l1.273-3.828C7.482 16.467 7 15.264 7 14c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Chat</h3>
                    <p className="text-sm" style={{ color: 'var(--muted-text)' }}>Converse with AI that switches between helpful and brutal</p>
                  </div>
                  <div className="w-full py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium text-center text-sm shadow-sm">Start Chat</div>
                </div>
              </Link>

              <Link to="/voice" className="group relative block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-400"></div>
                <div className="relative rounded-2xl p-6 h-64 flex flex-col justify-between shadow-lg hover:shadow-2xl transform group-hover:-translate-y-1 transition-all duration-300" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Voice Studio</h3>
                    <p className="text-sm" style={{ color: 'var(--muted-text)' }}>Celebrity voices deliver your personalized reality checks</p>
                  </div>
                  <div className="w-full py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-lg font-medium text-center text-sm shadow-sm">Try Voices</div>
                </div>
              </Link>

              <div className="group relative" onClick={() => document.getElementById('roast-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-rose-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-400"></div>
                <div className="relative rounded-2xl p-6 h-64 flex flex-col justify-between shadow-lg hover:shadow-2xl transform group-hover:-translate-y-1 transition-all duration-300 cursor-pointer" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center mb-4 shadow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Roast</h3>
                    <p className="text-sm" style={{ color: 'var(--muted-text)' }}>Quick brutal reality checks in 2-4 savage lines</p>
                  </div>
                  <div className="w-full py-2 bg-gradient-to-r from-orange-400 to-rose-500 text-white rounded-lg font-medium text-center text-sm shadow-sm">Roast Me</div>
                </div>
              </div>
            </div>
          </div>

          {/* Fun stats - smaller and polished */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl p-6 shadow text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>98%</div>
              <div className="text-sm" style={{ color: 'var(--muted-text)' }}>Dreams crushed with precision</div>
            </div>
            <div className="rounded-xl p-6 shadow text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>2.4s</div>
              <div className="text-sm" style={{ color: 'var(--muted-text)' }}>Average time to reality check</div>
            </div>
            <div className="rounded-xl p-6 shadow text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>∞</div>
              <div className="text-sm" style={{ color: 'var(--muted-text)' }}>Ways to lower expectations</div>
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <ArrowDownIcon className="h-6 w-6 text-slate-400" />
        </div>
      </section>

      {/* Generator Section */}
  <section id="generator-section" className="py-20 px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Choose Your Reality Check</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Pick your preferred style of brutal honesty. We have options for every level of delusion.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-3">Sarcasm</h3>
              <p className="text-slate-600">Witty observations about your ambitious plans</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-3">Dark Humor</h3>
              <p className="text-slate-600">Cynical wisdom for the overly optimistic</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-3">Friendly Roast</h3>
              <p className="text-slate-600">Playful reality checks with a smile</p>
            </div>
          </div>

          <Link to="/generator" className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow hover:shadow-2xl transition transform hover:scale-105">
            Start Generator
          </Link>
        </div>
      </section>

      {/* Roast Section */}
  <section id="roast-section" className="py-20 px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>Get Roasted in 3 Lines</h2>
            <p className="text-xl max-w-2xl mx-auto mb-4" style={{ color: 'var(--muted-text)' }}>Tell us about yourself and get a short, punchy reality check.</p>
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'var(--surface)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Warning: No feelings will be spared
            </div>
          </div>

          <RoastGenerator />
        </div>
      </section>

      {/* Demo / Pricing / Testimonials Section */}
      <section aria-labelledby="demo-heading" className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="demo-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">See BrutualHQ in Action</h2>
          <p className="text-lg text-slate-600 mb-8">Watch a short demo or preview screenshots of the Generator and Voice Studio.</p>

          {/* demo video (replace /demo/* with your real asset paths) */}
          <div className="mx-auto mb-8">
            <video
              controls
              width="840"
              className="rounded-lg shadow-lg mx-auto"
              poster="/demo/poster.jpg"
              aria-label="Product demo video"
            >
              <source src="/demo/demo.mp4" type="video/mp4" />
              Your browser does not support the video tag. You can download the demo at /demo/demo.mp4
            </video>
          </div>

          {/* Pricing */}
          <div id="pricing" className="mt-12">
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Pricing</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow border border-slate-100 text-center">
                <div className="text-xl font-bold mb-2">Free</div>
                <div className="text-3xl font-extrabold text-slate-900 mb-2">$0</div>
                <div className="text-sm text-slate-600 mb-4">Basic daily demotivations, community voice presets</div>
                <button aria-label="Select Free plan" className="mt-auto w-full px-4 py-2 bg-slate-100 text-slate-800 rounded-lg">Get Started</button>
              </div>
              <div className="bg-white rounded-xl p-6 shadow border border-slate-100 text-center">
                <div className="text-xl font-bold mb-2">Pro</div>
                <div className="text-3xl font-extrabold text-slate-900 mb-2">$9 / mo</div>
                <div className="text-sm text-slate-600 mb-4">Priority voices, higher-quality roasts, API access</div>
                <button aria-label="Select Pro plan" className="mt-auto w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg">Choose Pro</button>
              </div>
              <div className="bg-white rounded-xl p-6 shadow border border-slate-100 text-center">
                <div className="text-xl font-bold mb-2">Enterprise</div>
                <div className="text-3xl font-extrabold text-slate-900 mb-2">Contact</div>
                <div className="text-sm text-slate-600 mb-4">Custom SLAs, voice licensing</div>
                <a href="/contact" className="mt-auto inline-block w-full px-4 py-2 bg-slate-800 text-white rounded-lg" aria-label="Contact sales">Contact Sales</a>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div id="testimonials" className="mt-12">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">What people are saying</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <blockquote className="bg-white p-6 rounded-xl shadow">
                <p className="text-slate-800">“BrutualHQ roasted my delusions into submission — fast and hilarious.”</p>
                <footer className="mt-3 text-sm text-slate-500">— Alex R., beta user</footer>
              </blockquote>
              <blockquote className="bg-white p-6 rounded-xl shadow">
                <p className="text-slate-800">“The voices are uncanny — great product-market fit.”</p>
                <footer className="mt-3 text-sm text-slate-500">— Sam K., creator</footer>
              </blockquote>
              <blockquote className="bg-white p-6 rounded-xl shadow">
                <p className="text-slate-800">“We put this in our morning standups for morale (and humiliation).”</p>
                <footer className="mt-3 text-sm text-slate-500">— Morgan P., operations</footer>
              </blockquote>
            </div>
          </div>

          {/* FAQ Section */}
          <section id="faq" className="mt-12 text-left">
            <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>Frequently asked questions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  q: 'What is BrutualHQ?',
                  a: 'BrutualHQ is an AI-powered experience for blunt, humorous demotivation and roast content — useful for jokes, team rituals, and irreverent entertainment.'
                },
                {
                  q: 'Is the content safe for work?',
                  a: 'We provide options and filters; some modes are explicit or very direct. Use the milder modes for workplace-friendly output.'
                },
                {
                  q: 'Can I use the voices commercially?',
                  a: 'Voice usage may be subject to licensing and third-party provider terms. Check the pricing and licensing section or contact us for enterprise use.'
                },
                {
                  q: 'What if the AI fails to generate?',
                  a: 'We have retry logic and friendly fallback messages — if the service fails we surface a fallback roast and log events so we can improve reliability.'
                },
                {
                  q: 'How do I report abuse or a safety problem?',
                  a: 'Use the Contact link in the footer or the support widget to report problematic outputs. We review reports and update filters promptly.'
                },
                {
                  q: 'Do you store my prompts or messages?',
                  a: 'We store minimal usage metadata to improve quality; we do not sell personal data. See our Privacy page for details.'
                }
              ].map((item, idx) => (
                <details key={idx} className="p-4 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <summary className="font-medium mb-2" style={{ color: 'var(--text)', cursor: 'pointer' }}>{item.q}</summary>
                  <div className="mt-2" style={{ color: 'var(--muted-text)', lineHeight: 1.6 }}>{item.a}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Email capture */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSubLoading(true);
              setSubError('');
              try {
                await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
                setSubSuccess(true);
                setEmail('');
              } catch (err) {
                setSubError('Unable to subscribe right now.');
              } finally {
                setSubLoading(false);
              }
            }}
            className="mt-8 max-w-xl mx-auto"
          >
            <label htmlFor="email" className="sr-only">Email address</label>
            <div className="flex gap-2">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email — for updates and exclusive roasts"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none"
                aria-label="Email address"
              />
              <button aria-label="Subscribe" disabled={subLoading} className="px-4 py-3 bg-red-600 text-white rounded-lg">{subLoading ? 'Saving...' : 'Join'}</button>
            </div>
            {subSuccess && <p className="mt-3 text-sm text-green-600">Thanks — check your inbox.</p>}
            {subError && <p className="mt-3 text-sm text-red-600">{subError}</p>}
          </form>

          {/* Trust / footer-like small links */}
          <div className="mt-8 text-sm text-slate-500 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-3">
              <img src="/badges/secure.svg" alt="Secure badge" className="h-6" />
              <img src="/badges/trust.svg" alt="Trusted badge" className="h-6" />
            </div>
            <div>
              <a href="/privacy" className="underline">Privacy</a>
              <span className="mx-2">•</span>
              <a href="/contact" className="underline">Contact</a>
            </div>
          </div>

          {/* basic JSON-LD for SEO */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "BrutualHQ",
            "url": typeof window !== 'undefined' ? window.location.origin : ''
          }) }} />
        </div>
      </section>

    </div>
  );
};

export default Home;
