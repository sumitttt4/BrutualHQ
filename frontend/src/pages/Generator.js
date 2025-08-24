import React, { useState, useEffect } from 'react';
import { ClipboardIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import TypingEffect from '../components/TypingEffect';
import UsageLimit from '../components/usage/UsageLimit';

const Generator = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState('');
  const [tone, setTone] = useState('sarcasm');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const { user, isAuthenticated, hasUsageRemaining, updateUserUsage } = useAuth();
  const { trackEvent, trackGeneration } = useAnalytics();



  useEffect(() => {
    const savedFavorites = localStorage.getItem('demotivator-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const saveFavorite = () => {
    if (response && !favorites.some(fav => fav.text === response)) {
      const newFavorite = {
        id: Date.now(),
        text: response,
        tone: tone,
        timestamp: new Date().toISOString()
      };
      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
      localStorage.setItem('demotivator-favorites', JSON.stringify(updatedFavorites));
    }
  };

  const demotivateUser = async () => {
    // start dramatic preflight sequence
    setPreparing(true);
    setProgress(0);
    setProgressText('Warming up pessimism engines...');
    // small simulated progress
    const texts = [
      'Warming up pessimism engines...',
      'Calibrating sarcasm levels...',
      'Consulting the reality database...',
      'Sharpening the burn...'
    ];
    let idx = 0;
    const progInterval = setInterval(() => {
      setProgress(p => Math.min(100, p + Math.random() * 18 + 6));
      if (Math.random() > 0.7 && idx < texts.length - 1) idx += 1;
      setProgressText(texts[idx]);
    }, 500);

    // delay slightly before calling API to allow dramatic effect
    await new Promise(r => setTimeout(r, 1200));
    setLoading(true);
    setError('');
    setResponse('');

    // small pool of random user prompts used to seed the AI call
    const messages = [
      "I'm feeling motivated today!",
      "I think I can achieve anything!",
      "I'm ready to conquer the world!",
      "I believe in myself!",
      "I'm going to be successful!",
      "Today is going to be amazing!",
      "I'm unstoppable!",
      "I can do anything I set my mind to!",
      "I'm feeling confident!",
      "I'm going to make it happen!"
    ];

    const cannedFallbacks = [
      "Reality check: your grand plan sounds lovely — in a fantasy novel. Back to the drawing board.",
      "Here's the truth: most of that will be forgotten by lunch. Try smaller, less delusional goals.",
      "If optimism were a product, you'd be overordering. Maybe ship one thing before the empire.",
      "Nice energy. Sadly, optimism doesn't replace work — but it does make for a good story.",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // helper to call API (returns parsed json or throws)
    const callApi = async () => {
      const res = await fetch('/api/demotivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: randomMessage, tone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get demotivational response');
      return data;
    };

    try {
      // attempt #1
      try {
        const data = await callApi();
        setResponse(data.message);
        setHasGenerated(true);
        // finalize dramatic sequence
        setProgress(100);
        setProgressText('Delivery ready');
        await new Promise(r => setTimeout(r, 400));
        setPreparing(false);
        trackGeneration('demotivation', tone, true);
        return;
      } catch (firstErr) {
        console.warn('First AI attempt failed, retrying once...', firstErr);
        // wait briefly then retry once
        await new Promise((r) => setTimeout(r, 1000));
        try {
          const data = await callApi();
          setResponse(data.message);
          setHasGenerated(true);
          trackGeneration('demotivation', tone, true);
          return;
        } catch (secondErr) {
          console.error('Second AI attempt also failed:', secondErr);
          // fall through to fallback
        }
      }

      // If we reach here, both attempts failed — present a friendly fallback
      const fallback = cannedFallbacks[Math.floor(Math.random() * cannedFallbacks.length)];
      setResponse(fallback);
      setHasGenerated(true);
      setError('Failed to get response from AI service — showing a fallback demotivation.');
  trackGeneration('demotivation', tone, false);
      trackEvent && trackEvent('demotivation_fallback');
    } catch (err) {
      console.error('Unexpected error during demotivation flow:', err);
      setError('Something went wrong. Even our demotivation is broken.');
    } finally {
      setLoading(false);
  setPreparing(false);
    }
  };

  const handleGenerateClick = () => {
    if (loading) return;
    // show irreversible warning first
    setShowWarning(true);
  };

  const proceedWithDemotivation = () => {
    // start a short dramatic countdown then trigger demotivateUser
    setShowWarning(false);
    setCountdown(3);
    const cd = setInterval(() => {
      setCountdown((c) => {
        if (!c || c <= 1) {
          clearInterval(cd);
          setCountdown(null);
          demotivateUser();
          return null;
        }
        return c - 1;
      });
    }, 1000);
  };



  const copyToClipboard = async (text = null) => {
    try {
      const textToCopy = text || response;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareToSocial = (platform) => {
    const text = encodeURIComponent(`"${response}" - Demotivation Station`);
    const url = encodeURIComponent(window.location.href);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const isFavorite = response && favorites.some(fav => fav.text === response);

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header / Hero (Demotivation) */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text)' }}>
            AI Demotivation Center
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--muted-text)' }}>
            Need your dreams bashed with precision? Pick a style and let our AI deliver the cold truth.
          </p>
        </div>

        {/* Feature Cards (dramatic) */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="relative group block">
            <div className="relative rounded-2xl p-6 h-64 flex flex-col justify-between shadow-lg transform group-hover:-translate-y-1 transition-all duration-300" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', color: 'white' }}>
                  🪓
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Sarcasm</h3>
                <p className="text-sm" style={{ color: 'var(--muted-text)' }}>Witty observations about your ambitious plans.</p>
              </div>
              <div>
                <button onClick={() => { setTone('sarcasm'); demotivateUser(); }} className="w-full py-3 rounded-lg font-medium" style={{ background: 'linear-gradient(90deg,var(--primary),var(--accent))', color: 'white' }}>Generate Sarcasm</button>
              </div>
            </div>
          </div>

          <div className="relative group block">
            <div className="relative rounded-2xl p-6 h-64 flex flex-col justify-between shadow-lg transform group-hover:-translate-y-1 transition-all duration-300" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(90deg,#10b981,#06b6d4)', color: 'white' }}>
                  ⚖️
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Balanced Perspective</h3>
                <p className="text-sm" style={{ color: 'var(--muted-text)' }}>Realistic checks mixed with painful clarity.</p>
              </div>
              <div>
                <button onClick={() => { setTone('darkhumor'); demotivateUser(); }} className="w-full py-3 rounded-lg font-medium" style={{ background: 'linear-gradient(90deg,var(--accent),var(--primary))', color: 'white' }}>Generate Balanced</button>
              </div>
            </div>
          </div>

          <div className="relative group block">
            <div className="relative rounded-2xl p-6 h-64 flex flex-col justify-between shadow-lg transform group-hover:-translate-y-1 transition-all duration-300" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(90deg,#f97316,#ef4444)', color: 'white' }}>
                  💀
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Tough Love</h3>
                <p className="text-sm" style={{ color: 'var(--muted-text)' }}>Direct, no-nonsense reality checks that sting.</p>
              </div>
              <div>
                <button onClick={() => { setTone('roast'); demotivateUser(); }} className="w-full py-3 rounded-lg font-medium" style={{ background: 'linear-gradient(90deg,var(--primary),var(--accent))', color: 'white' }}>Generate Tough Love</button>
              </div>
            </div>
          </div>
        </div>

        {/* Tone Selector (kept) */}
        <div className="mb-8">
          <label className="block text-lg font-medium mb-4 text-center" style={{ color: 'var(--muted-text)' }}>
            Or pick a style manually:
          </label>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { value: 'sarcasm', label: 'Sarcasm', desc: 'Witty observations' },
              { value: 'darkhumor', label: 'Dark Humor', desc: 'Cynical wisdom' },
              { value: 'roast', label: 'Friendly Roast', desc: 'Playful reality checks' }
            ].map((toneOption) => (
              <button
                key={toneOption.value}
                onClick={() => setTone(toneOption.value)}
                className={`px-6 py-4 rounded-xl text-center transition-all duration-200`}
                style={tone === toneOption.value ? { background: 'var(--primary)', color: 'white', boxShadow: '0 10px 20px rgba(0,0,0,0.08)', transform: 'scale(1.03)' } : { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
              >
                <div className="font-medium">{toneOption.label}</div>
                <div className="text-sm opacity-75" style={{ color: 'var(--muted-text)' }}>{toneOption.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-12">
          <button
            onClick={handleGenerateClick}
            disabled={loading}
            className={`px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform ${
              loading
                ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-xl hover:scale-105'
            }`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner />
                <span>Preparing Reality Check...</span>
              </div>
            ) : (
              "Come Here, I'll Demotivate You"
            )}
          </button>
        </div>

        {/* Irreversible Warning Modal */}
        {showWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
            <div className="relative max-w-xl w-full rounded-2xl p-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>Do you really want demotivation?</h2>
              <p className="mb-6" style={{ color: 'var(--muted-text)' }}>
                This action is dramatic and irreversible — the demotivation delivered cannot be unsaid. If you proceed, prepare for full candor.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowWarning(false)} className="px-4 py-2 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>Cancel</button>
                <button onClick={proceedWithDemotivation} className="px-4 py-2 rounded-lg font-semibold" style={{ background: 'linear-gradient(90deg,var(--primary),var(--accent))', color: 'white' }}>Yes — I understand</button>
              </div>
            </div>
          </div>
        )}

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-auto">
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)' }} />
            <div className="relative text-center p-10 rounded-3xl" style={{ background: 'transparent' }}>
              <div className="text-9xl font-extrabold" style={{ color: 'var(--accent)' }}>{countdown}</div>
              <div className="mt-4 text-xl" style={{ color: 'var(--muted-text)' }}>Brace yourself...</div>
            </div>
          </div>
        )}

        {/* Dramatic Preflight Sequence */}
        {preparing && (
          <div className="animate-fade-in mb-8">
            <div className="rounded-xl p-8 shadow-2xl max-w-3xl mx-auto" style={{ background: 'var(--surface)', border: '2px solid var(--border)' }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>Preparing Your Demotivation...</h3>
              <div className="w-full rounded-full h-6 mb-4 overflow-hidden shadow-inner" style={{ background: 'var(--border)' }}>
                <div className="h-full transition-all duration-500 ease-out rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,var(--primary),var(--accent))' }} />
              </div>
              <p style={{ color: 'var(--muted-text)', marginBottom: '8px' }}>{progressText}</p>
              <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{Math.round(progress)}%</div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 rounded-lg" style={{ background: 'rgba(254,226,226,0.6)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--text)' }}>
            <p>{error}</p>
          </div>
        )}



        {/* Response Card */}
        {response && (
          <div className="mb-8 animate-fade-in">
            <div className="rounded-xl p-8 shadow-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="mb-6">
                <div className="text-sm mb-2 capitalize" style={{ color: 'var(--muted-text)' }}>
                  {tone === 'darkhumor' ? 'Dark Humor' : tone} Mode
                </div>
                <blockquote className="text-xl leading-relaxed" style={{ color: 'var(--text)' }}>
                  "<TypingEffect text={response} speed={30} />"
                </blockquote>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={demotivateUser}
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  Generate Again
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  <ClipboardIcon className="h-4 w-4" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                
                <button
                  onClick={saveFavorite}
                  disabled={isFavorite}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors`}
                  style={isFavorite ? { background: 'rgba(220,252,231,0.8)', color: 'var(--text)', cursor: 'not-allowed' } : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-4 w-4" />
                  ) : (
                    <HeartIcon className="h-4 w-4" />
                  )}
                  <span>{isFavorite ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              {/* Share Buttons */}
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                <h4 className="text-sm font-medium mb-3 text-center" style={{ color: 'var(--muted-text)' }}>
                  Share the Reality Check:
                </h4>
                <div className="flex flex-wrap gap-3 justify-center">
                  {[
                    { name: 'Twitter', platform: 'twitter' },
                    { name: 'LinkedIn', platform: 'linkedin' },
                    { name: 'Reddit', platform: 'reddit' },
                    { name: 'Facebook', platform: 'facebook' }
                  ].map((social) => (
                    <button
                      key={social.platform}
                      onClick={() => shareToSocial(social.platform)}
                      className="px-4 py-2 rounded-lg transition-colors text-sm"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--primary)' }}
                    >
                      {social.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Favorites Counter */}
        {favorites.length > 0 && (
          <div className="text-center text-gray-600">
            <p className="text-sm">
              You've saved {favorites.length} favorite reality check{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
