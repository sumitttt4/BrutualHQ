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
  const [error, setError] = useState('');
  const [tone, setTone] = useState('sarcasm');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

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
    }
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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI Demotivation Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready for some reality? Our AI has plenty of wisdom to share about your ambitious plans.
          </p>
        </div>

        {/* Tone Selector */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-700 mb-4 text-center">
            Choose Your Reality Check:
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
                className={`px-6 py-4 rounded-xl text-center transition-all duration-200 ${
                  tone === toneOption.value
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="font-medium">{toneOption.label}</div>
                <div className="text-sm opacity-75">{toneOption.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-12">
          <button
            onClick={demotivateUser}
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

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}



        {/* Response Card */}
        {response && (
          <div className="mb-8 animate-fade-in">
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 shadow-xl">
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2 capitalize">
                  {tone === 'darkhumor' ? 'Dark Humor' : tone} Mode
                </div>
                <blockquote className="text-xl text-gray-800 leading-relaxed">
                  "<TypingEffect text={response} speed={30} />"
                </blockquote>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={demotivateUser}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Generate Again
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <ClipboardIcon className="h-4 w-4" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                
                <button
                  onClick={saveFavorite}
                  disabled={isFavorite}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isFavorite 
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
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
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">
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
                      className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors text-sm"
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
