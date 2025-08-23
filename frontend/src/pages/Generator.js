import React, { useState, useEffect } from 'react';
import { ClipboardIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/LoadingSpinner';
import TypingEffect from '../components/TypingEffect';

const Generator = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tone, setTone] = useState('sarcasm');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied] = useState(false);

  // Dramatic motivation sequence states
  const [isMotivationMode, setIsMotivationMode] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [showChoice, setShowChoice] = useState(false);
  const [motivationResult, setMotivationResult] = useState('');
  const [showTyping, setShowTyping] = useState(false);

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
    
    try {
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
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      const apiResponse = await fetch('/api/demotivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: randomMessage,
          tone: tone
        })
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to fetch demotivation');
      }

      const data = await apiResponse.json();
      setResponse(data.message || data.response || "Your dreams are adorably optimistic.");
      setHasGenerated(true);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to crush your dreams. Even our AI is having an off day.');
    } finally {
      setLoading(false);
    }
  };

  // Dramatic Motivation Sequence Functions
  const startMotivationSequence = () => {
    setIsMotivationMode(true);
    setShowProgress(true);
    setProgress(0);
    setShowChoice(false);
    setMotivationResult('');
    setShowTyping(false);
    setError('');
    
    const progressTexts = [
      "Charging your positivity…",
      "Filtering out all the excuses…",
      "Cracking open a fortune cookie…",
      "Checking if you're really ready for this…",
      "Summoning the motivation spirits…",
      "Double-checking your commitment level…"
    ];
    
    let currentProgress = 0;
    let textIndex = 0;
    
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5; // Random progress between 5-20%
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setProgressText("Almost there...");
        clearInterval(progressInterval);
        
        // Show the choice after a dramatic pause
        setTimeout(() => {
          setShowChoice(true);
        }, 1000);
      } else {
        setProgress(currentProgress);
        setProgressText(progressTexts[textIndex % progressTexts.length]);
        textIndex++;
      }
    }, 800);
  };

  const handleMotivationChoice = (wantsMotivation) => {
    if (wantsMotivation) {
      // Generate actual motivation
      const motivationalMessages = [
        "You are capable of amazing things! Every challenge is an opportunity to grow, and every setback is a setup for a comeback. Keep pushing forward!",
        "Your potential is limitless! The only thing standing between you and your dreams is the story you tell yourself. Rewrite that story today!",
        "Success isn't about being perfect—it's about being persistent. Every small step forward is progress worth celebrating!",
        "You have overcome 100% of your worst days so far. That's an incredible track record! Trust in your strength and resilience.",
        "The best time to plant a tree was 20 years ago. The second best time is now. Start today, start small, but start!",
        "Your current situation is not your final destination. Keep working, keep believing, and keep moving forward!"
      ];
      
      const randomMotivation = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setMotivationResult(randomMotivation);
      setShowTyping(true);
      setShowChoice(false);
    } else {
      // Redirect to demotivation with cheeky message
      setShowChoice(false);
      setProgressText("Knew it. You can't handle the truth.");
      setTimeout(() => {
        setIsMotivationMode(false);
        setShowProgress(false);
        demotivateUser();
      }, 1500);
    }
  };

  const resetMotivationSequence = () => {
    setIsMotivationMode(false);
    setShowProgress(false);
    setProgress(0);
    setProgressText('');
    setShowChoice(false);
    setMotivationResult('');
    setShowTyping(false);
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
    <div className="min-h-screen w-full relative">
      {/* Aurora Dream Vivid Bloom */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 20%, rgba(175, 109, 255, 0.85), transparent 68%),
            radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
            radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.98), transparent 68%),
            radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.3), transparent 68%),
            linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
          `,
        }}
      />
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

        {/* Generate Buttons */}
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={demotivateUser}
              disabled={loading || showProgress}
              className={`px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform ${
                loading || showProgress
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
            
            <div className="text-gray-400 font-medium">or</div>
            
            <button
              onClick={startMotivationSequence}
              disabled={loading || showProgress}
              className={`px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform ${
                loading || showProgress
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white hover:shadow-xl hover:scale-105'
              }`}
            >
              ✨ Generate Motivation
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Dramatic Motivation Sequence */}
        {isMotivationMode && (
          <div className="mb-8 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-8 shadow-2xl border-2 border-purple-200">
              
              {/* Progress Bar Section */}
              {showProgress && !showChoice && !motivationResult && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {progressText === "Knew it. You can't handle the truth." ? 
                      "Redirecting to Reality..." : 
                      "Generating Your Motivation..."
                    }
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ease-out rounded-full ${
                        progressText === "Knew it. You can't handle the truth." ?
                          'bg-gradient-to-r from-red-500 to-gray-600' :
                          'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  
                  <p className={`text-lg font-medium ${
                    progressText === "Knew it. You can't handle the truth." ?
                      'text-red-600 text-xl font-bold' :
                      'text-gray-600'
                  }`}>
                    {progressText}
                  </p>
                  
                  <div className={`mt-4 text-2xl font-bold ${
                    progressText === "Knew it. You can't handle the truth." ?
                      'text-red-600' :
                      'text-purple-600'
                  }`}>
                    {Math.round(progress)}%
                  </div>
                </div>
              )}

              {/* Suspense Choice Section */}
              {showChoice && (
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-8 leading-tight">
                    Do you seriously want motivation?
                  </h2>
                  
                  <p className="text-lg text-gray-600 mb-8">
                    Last chance to back out before we hit you with the positivity...
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => handleMotivationChoice(true)}
                      className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      ✅ Yes, hit me with it
                    </button>
                    
                    <button
                      onClick={() => handleMotivationChoice(false)}
                      className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      ❌ Nah, give me demotivation instead
                    </button>
                  </div>
                </div>
              )}

              {/* Motivation Result with Typing Effect */}
              {motivationResult && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-green-600 mb-6">
                    Here's Your Motivation! 🌟
                  </h3>
                  
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-400 p-6 rounded-lg mb-6">
                    {showTyping ? (
                      <TypingEffect 
                        text={motivationResult}
                        speed={50}
                        className="text-lg text-gray-800 leading-relaxed"
                      />
                    ) : (
                      <p className="text-lg text-gray-800 leading-relaxed">
                        {motivationResult}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => copyToClipboard(motivationResult)}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
                    >
                      📋 Copy Motivation
                    </button>
                    
                    <button
                      onClick={resetMotivationSequence}
                      className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
                    >
                      🔄 Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
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
