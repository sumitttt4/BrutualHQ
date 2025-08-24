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
    animation: taglineCycle 24s infinite;
    transition: opacity 300ms ease, transform 300ms ease;
    line-height: 1.4;
    padding-right: 2rem;
  }
  .tagline:nth-child(1)  { animation-delay: 0s; }
  .tagline:nth-child(2)  { animation-delay: 3s; }
  .tagline:nth-child(3)  { animation-delay: 6s; }
  .tagline:nth-child(4)  { animation-delay: 9s; }
  .tagline:nth-child(5)  { animation-delay: 12s; }
  .tagline:nth-child(6)  { animation-delay: 15s; }
  .tagline:nth-child(7)  { animation-delay: 18s; }
  .tagline:nth-child(8)  { animation-delay: 21s; }

  @keyframes taglineCycle {
    0% { opacity: 0; transform: translateY(8px); }
    4.17% { opacity: 1; transform: translateY(0); }
    12.5% { opacity: 1; transform: translateY(0); }
    16.67% { opacity: 0; transform: translateY(-8px); }
    100% { opacity: 0; transform: translateY(-8px); }
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

// Inject styles once
if (typeof document !== 'undefined' && !document.querySelector('#dm-tagline-styles')) {
  const s = document.createElement('style');
  s.id = 'dm-tagline-styles';
  s.innerText = taglineStyles;
  document.head.appendChild(s);
}

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
        <p className="text-sm text-gray-400 mb-3 text-center">Try these examples:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => setInput(p)}
              className="px-3 py-1 text-xs bg-slate-900/80 backdrop-blur-sm border border-slate-600 rounded-full hover:bg-slate-800 transition-colors text-gray-200"
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-6 shadow-lg mb-6 border border-slate-700">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tell us about yourself — habits, dreams, or anything we can roast you for (be specific for better burns)."
          className="w-full p-4 bg-transparent border border-slate-700 rounded-lg resize-none focus:ring-0 text-white placeholder-gray-400 focus-ring"
          rows="3"
          maxLength="200"
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-400">{input.length}/200</span>
          <button
            onClick={generateRoast}
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-md"
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
        <div className="bg-gradient-to-r from-red-900/10 to-orange-900/10 border-l-4 border-red-500 rounded-lg p-6 shadow-lg backdrop-blur-sm border border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-red-300 mb-2">Reality Check Delivered</h4>
              <p className="text-gray-200 leading-relaxed whitespace-pre-line">{roast}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ------------------ Main Home Component (Polished Hero + Cards + Sections) ------------------
const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
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
                  <span className="inline-flex items-center gap-3 bg-white/95 border border-slate-200 rounded-lg px-3 py-1 shadow-sm text-sm font-medium text-slate-700">
                    <span className="inline-flex items-center justify-center bg-[#ff6a00] text-white rounded-sm w-6 h-6 font-bold">Y</span>
                    <span>Not Backed by Y Combinator</span>
                  </span>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-slate-900 mb-5">
                Get Demotivated
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                  With Me
                </span>
              </h1>

              {/* Rotating Taglines */}
              <div className="mb-8">
                <div className="rotating-taglines">
                  <p className="tagline text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                    "Feeling too positive? Let our AI bring you back to reality."
                  </p>
                  <p className="tagline text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                    "Too much positivity is dangerous. Balance it out with a little negativity."
                  </p>
                  <p className="tagline text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                    "Your daily reminder that dreams are overrated and reality bites."
                  </p>
                  <p className="tagline text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                    "Lower your expectations and you'll never be disappointed."
                  </p>
                  <p className="tagline text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                    "Motivation is temporary. Demotivation is forever."
                  </p>
                  <p className="tagline text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                    "We don't sugarcoat. We add salt — with style."
                  </p>
                  <p className="tagline text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                    "Reality check: Your comfort zone is a prison."
                  </p>
                  <p className="tagline text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                    "Dream crushing, professionally (since 2024)."
                  </p>
                </div>
              </div>

              <p className="text-base md:text-lg text-slate-600 mb-8 max-w-2xl">
                Professional dream crushing since 2024. AI-powered reality checks delivered in celebrity voices.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link
                  to="/generator"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-2xl hover:scale-[1.02] transition-transform duration-250"
                >
                  <span className="relative z-10">Get Demotivated</span>
                  <span className="absolute -inset-0.5 rounded-2xl blur opacity-20" />
                </Link>

                <Link
                  to="/voice"
                  className="inline-flex items-center px-6 py-3 text-base font-medium text-slate-700 bg-white border border-slate-200 rounded-2xl shadow hover:shadow-lg transition"
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
              {/* Generator */}
              <Link to="/generator" className="group relative block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-400"></div>
                <div className="relative bg-white/95 backdrop-blur rounded-2xl p-6 h-64 flex flex-col justify-between border border-slate-100 shadow-lg hover:shadow-2xl transform group-hover:-translate-y-1 transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Generator</h3>
                    <p className="text-sm text-slate-600">AI-powered reality checks tailored to your situation</p>
                  </div>
                  <div className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-center text-sm shadow-sm">
                    Try Now
                  </div>
                </div>
              </Link>

              {/* Chat */}
              <Link to="/chat" className="group relative block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-400"></div>
                <div className="relative bg-white/95 backdrop-blur rounded-2xl p-6 h-64 flex flex-col justify-between border border-slate-100 shadow-lg hover:shadow-2xl transform group-hover:-translate-y-1 transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.172-.273L7 21l1.273-3.828C7.482 16.467 7 15.264 7 14c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Chat</h3>
                    <p className="text-sm text-slate-600">Converse with AI that switches between helpful and brutal</p>
                  </div>
                  <div className="w-full py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium text-center text-sm shadow-sm">
                    Start Chat
                  </div>
                </div>
              </Link>

              {/* Voice Studio */}
              <Link to="/voice" className="group relative block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-400"></div>
                <div className="relative bg-white/95 backdrop-blur rounded-2xl p-6 h-64 flex flex-col justify-between border border-slate-100 shadow-lg hover:shadow-2xl transform group-hover:-translate-y-1 transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Voice Studio</h3>
                    <p className="text-sm text-slate-600">Celebrity voices deliver your personalized reality checks</p>
                  </div>
                  <div className="w-full py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-lg font-medium text-center text-sm shadow-sm">
                    Try Voices
                  </div>
                </div>
              </Link>

              {/* Roast */}
              <div className="group relative" onClick={() => document.getElementById('roast-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-rose-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-400"></div>
                <div className="relative bg-white/95 backdrop-blur rounded-2xl p-6 h-64 flex flex-col justify-between border border-slate-100 shadow-lg hover:shadow-2xl transform group-hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center mb-4 shadow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Roast</h3>
                    <p className="text-sm text-slate-600">Quick brutal reality checks in 2-4 savage lines</p>
                  </div>
                  <div className="w-full py-2 bg-gradient-to-r from-orange-400 to-rose-500 text-white rounded-lg font-medium text-center text-sm shadow-sm">
                    Roast Me
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fun stats - smaller and polished */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow border border-slate-100 text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">98%</div>
              <div className="text-sm text-slate-600">Dreams crushed with precision</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow border border-slate-100 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">2.4s</div>
              <div className="text-sm text-slate-600">Average time to reality check</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow border border-slate-100 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">∞</div>
              <div className="text-sm text-slate-600">Ways to lower expectations</div>
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <ArrowDownIcon className="h-6 w-6 text-slate-400" />
        </div>
      </section>

      {/* Generator Section */}
  <section id="generator-section" className="py-20 px-6 bg-white">
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
  <section id="roast-section" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Get Roasted in 3 Lines</h2>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto mb-4">Tell us about yourself and get a short, punchy reality check.</p>
            <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Warning: No feelings will be spared
            </div>
          </div>

          <RoastGenerator />
        </div>
      </section>

      {/* Features / Chat Preview (kept neat) */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Chat with Our AI Assistant</h2>
            <p className="text-xl text-slate-600">Have a conversation with our AI. Ask for demotivation, advice, or just chat!</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl max-w-2xl mx-auto mb-8">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="font-medium text-slate-800">AI Assistant</span>
              </div>
              <div className="text-sm text-slate-500">Try it now!</div>
            </div>

            <div className="p-4 space-y-4 h-64 overflow-y-auto">
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 rounded-lg p-3 max-w-[80%]">
                  <div className="whitespace-pre-wrap">Hello! I can help with motivation, demotivation, advice, or just chat. What's on your mind?</div>
                  <div className="text-xs text-slate-500 mt-1">AI Assistant</div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-lg p-3 max-w-[80%]">
                  <div className="whitespace-pre-wrap">I'm feeling too motivated today. Can you demotivate me?</div>
                  <div className="text-xs text-indigo-200 mt-1">You</div>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 rounded-lg p-3 max-w-[80%]">
                  <div className="whitespace-pre-wrap">Ah, feeling overly optimistic? Let me help with that. Your motivation is probably just caffeine-induced delusion anyway.</div>
                  <div className="text-xs text-slate-500 mt-1">AI Assistant</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100">
              <Link to="/chat" className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                Start Chatting Now
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
