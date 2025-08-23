import React, { useState } from 'react';
import { SparklesIcon, ArrowPathIcon, HeartIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/LoadingSpinner';
import TypingEffect from '../components/TypingEffect';

const MotivationTwist = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPositive, setShowPositive] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied] = useState(false);

  const generateMotivation = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      const positiveMessages = [
        "I believe I can achieve my dreams!",
        "I'm capable of great things!",
        "Nothing can stop me from succeeding!",
        "I have unlimited potential!",
        "I'm ready to overcome any obstacle!",
        "I will make my goals a reality!",
        "I'm destined for success!",
        "I can conquer any challenge!",
        "I'm unstoppable in my pursuit of greatness!",
        "I will turn my dreams into reality!"
      ];
      
      const randomMessage = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
      
      const apiResponse = await fetch('/api/demotivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: randomMessage,
          tone: 'motivation' // This will trigger the AI to provide both perspectives
        }),
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(data.error || 'Failed to get motivational response');
      }

      setResponse(data.message);
    } catch (err) {
      setError(err.message || 'Something went wrong. Even motivation needs a break sometimes.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setShowPositive(!showPositive);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const saveFavorite = () => {
    if (response && !favorites.some(fav => fav.text === response)) {
      const newFavorite = {
        id: Date.now(),
        text: response,
        type: 'motivation',
        timestamp: new Date().toISOString()
      };
      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
      localStorage.setItem('demotivator-favorites', JSON.stringify(updatedFavorites));
    }
  };

  const isFavorite = response && favorites.some(fav => fav.text === response);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI Motivation Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience genuine AI-powered motivation. Sometimes you need encouragement to reach your potential.
          </p>
        </div>

        {/* Feature Toggle */}
        <div className="mb-8 text-center">
          <div className="inline-flex bg-white/80 backdrop-blur-md rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowPositive(true)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                showPositive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <SparklesIcon className="h-5 w-5" />
                <span>Motivational Mode</span>
              </div>
            </button>
            <button
              onClick={() => setShowPositive(false)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                !showPositive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ArrowPathIcon className="h-5 w-5" />
                <span>Balanced Perspective</span>
              </div>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md max-w-2xl mx-auto">
            {showPositive ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Pure Motivation
                </h3>
                <p className="text-gray-600">
                  Genuine, uplifting messages designed to inspire and energize you towards your goals.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Realistic Perspective
                </h3>
                <p className="text-gray-600">
                  Honest insights that balance optimism with practical reality checks.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-12">
          <button
            onClick={generateMotivation}
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
                <span>Generating Inspiration...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <SparklesIcon className="h-5 w-5" />
                <span>Generate Motivation</span>
              </div>
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
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    {showPositive ? 'Motivational Message' : 'Balanced Perspective'}
                  </div>
                  <button
                    onClick={toggleView}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Switch to {showPositive ? 'Balanced View' : 'Motivational View'}
                  </button>
                </div>
                <blockquote className="text-xl text-gray-800 leading-relaxed">
                  "<TypingEffect text={response} speed={30} />"
                </blockquote>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={generateMotivation}
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
            </div>
          </div>
        )}

        {/* Sample Motivational Quotes */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sample Motivational Insights
            </h3>
            <div className="space-y-3 text-gray-600">
              <p className="italic">"Success is not final, failure is not fatal: it is the courage to continue that counts."</p>
              <p className="italic">"The only way to do great work is to love what you do."</p>
              <p className="italic">"Your potential is endless. Go do what you were created to do."</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              How It Works
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>Our AI analyzes motivational patterns to provide genuine encouragement.</p>
              <p>Switch between pure motivation and balanced perspectives based on your needs.</p>
              <p>Save your favorites and build a personal collection of inspiration.</p>
            </div>
          </div>
        </div>

        {/* Favorites Counter */}
        {favorites.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p className="text-sm">
              You've saved {favorites.length} motivational message{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MotivationTwist;
