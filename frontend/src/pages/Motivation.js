import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

// Typing effect component
const TypingEffect = ({ text, speed = 50, className = "" }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return <span className={className}>{displayedText}</span>;
};

const Motivation = () => {
  // Enhanced motivation sequence states
  const [mode, setMode] = useState('selection'); // 'selection', 'dramatic', 'result'
  const [motivationType, setMotivationType] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [showChoice, setShowChoice] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [motivationResult, setMotivationResult] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  const motivationTypes = [
    {
      id: 'pure',
      title: 'Pure Motivation',
      description: 'Genuine, uplifting messages designed to inspire and energize you towards your goals.',
      icon: '✨',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'balanced',
      title: 'Balanced Perspective',
      description: 'Realistic motivation mixed with honest insights about challenges and opportunities.',
      icon: '⚖️',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'tough-love',
      title: 'Tough Love',
      description: 'Motivational kicks in the pants when you need someone to tell you the hard truths.',
      icon: '💪',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const startMotivationSequence = (type) => {
    setMotivationType(type);
    setMode('dramatic');
    setShowProgress(true);
    setProgress(0);
    setShowChoice(false);
    setShowWarning(false);
    setMotivationResult('');
    setShowTyping(false);
    
    const progressTexts = [
      "Scanning your motivation levels...",
      "Analyzing your potential...",
      "Consulting the inspiration database...",
      "Checking if you're really ready for this...",
      "Summoning positive energy...",
      "Calibrating motivational intensity...",
      "Loading encouragement protocols...",
      "Preparing your personal pep talk...",
      "Almost ready to inspire you..."
    ];
    
    let currentProgress = 0;
    let textIndex = 0;
    
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 12 + 8; // Random progress between 8-20%
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setProgressText("Motivation sequence complete!");
        clearInterval(progressInterval);
        
        // Show warning for dramatic effect
        setTimeout(() => {
          setShowWarning(true);
        }, 800);
        
        // Show the choice after dramatic pause
        setTimeout(() => {
          setShowChoice(true);
          setShowWarning(false);
        }, 3000);
      } else {
        setProgress(currentProgress);
        if (textIndex < progressTexts.length - 1 && Math.random() > 0.7) {
          textIndex++;
        }
        setProgressText(progressTexts[textIndex]);
      }
    }, 600);
  };

  const handleMotivationChoice = (wantsMotivation) => {
    if (wantsMotivation) {
      // Generate motivation based on type
      const motivationalMessages = {
        pure: [
          "You are capable of incredible things! Every challenge you face is an opportunity to grow stronger and wiser. Your potential is unlimited, and today is the perfect day to start unleashing it!",
          "Success isn't about being perfect—it's about being persistent. Every small step you take forward is progress worth celebrating. Trust in your journey and keep moving forward!",
          "You have overcome 100% of your worst days so far. That's an incredible track record! Your resilience is your superpower, and you're stronger than you realize.",
          "The best time to plant a tree was 20 years ago. The second best time is now. Whatever you're dreaming of, start today—even the smallest action can lead to extraordinary results!",
          "Your current situation is not your final destination. Every expert was once a beginner, every professional was once an amateur. Keep learning, keep growing, keep believing in yourself!"
        ],
        balanced: [
          "Success requires both optimism and realism. You have great potential, but it will take consistent effort and patience. The good news? You're already taking the first step by seeking motivation.",
          "Life will throw challenges at you, and that's perfectly normal. What matters is how you respond. You have the tools to succeed—you just need to use them consistently and wisely.",
          "Motivation gets you started, but habit keeps you going. Build small, sustainable routines that align with your goals. Progress might be slow, but it's still progress.",
          "You're capable of more than you think, but you're also human with limitations. Work with your strengths, acknowledge your weaknesses, and focus on steady improvement over perfection.",
          "The path to success isn't linear—expect setbacks, celebrate small wins, and remember that everyone successful has faced exactly what you're facing right now."
        ],
        'tough-love': [
          "Stop waiting for the perfect moment—it doesn't exist. You have everything you need to start right now. The only thing holding you back is the story you tell yourself.",
          "Your comfort zone is a beautiful place, but nothing ever grows there. You know what you need to do—stop making excuses and start making progress.",
          "Discipline is choosing between what you want now and what you want most. Every time you choose the hard thing, you're building the person you want to become.",
          "Nobody is coming to save you. This is your life, your goals, your responsibility. You can either be the hero of your story or remain the victim—choose wisely.",
          "You've spent enough time planning, thinking, and preparing. The gap between where you are and where you want to be can only be closed by action. Start today."
        ]
      };
      
      const messages = motivationalMessages[motivationType];
      const randomMotivation = messages[Math.floor(Math.random() * messages.length)];
      setMotivationResult(randomMotivation);
      setShowTyping(true);
      setShowChoice(false);
      setMode('result');
    } else {
      // Redirect to demotivation with cheeky message
      setShowChoice(false);
      setProgressText("Knew it. Back to reality we go...");
      setTimeout(() => {
        window.location.href = '/generator';
      }, 1500);
    }
  };

  const resetMotivationSequence = () => {
    setMode('selection');
    setMotivationType('');
    setShowProgress(false);
    setProgress(0);
    setProgressText('');
    setShowChoice(false);
    setShowWarning(false);
    setMotivationResult('');
    setShowTyping(false);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(motivationResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareToSocial = (platform) => {
    const text = encodeURIComponent(`"${motivationResult}" - Motivation from Demotivation Station`);
    const url = encodeURIComponent(window.location.href);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--text)' }}>
            AI Motivation Center
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--muted-text)' }}>
            Experience genuine AI-powered motivation. Sometimes you need encouragement to reach your potential.
          </p>
        </div>

        {/* Mode Selection */}
        {mode === 'selection' && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                Choose Your Motivation Style
              </h2>
              <p className="text-lg text-slate-600">
                Select the type of encouragement that resonates with you
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {motivationTypes.map((type) => (
                <div 
                  key={type.id}
                  className="group relative cursor-pointer"
                  onClick={() => startMotivationSequence(type.id)}
                >
                  {/* Background Gradient */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${type.color} rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500`}></div>
                  
                  {/* Card Content */}
                  <div className="relative rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="text-center">
                      <div className="text-5xl mb-6" style={{ color: 'var(--text)' }}>{type.icon}</div>
                      <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>{type.title}</h3>
                      <p className="leading-relaxed mb-6" style={{ color: 'var(--muted-text)' }}>{type.description}</p>
                      <button className={`w-full py-3 px-6 bg-gradient-to-r ${type.color} text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg`}>
                        Generate {type.title}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sample Insights */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-2xl p-8 shadow-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>Sample Motivational Insights</h3>
                <blockquote className="italic leading-relaxed" style={{ color: 'var(--muted-text)' }}>
                  "Success is not final, failure is not fatal: it is the courage to continue that counts."
                </blockquote>
                <div className="text-sm mt-2" style={{ color: 'var(--muted-text)' }}>- Inspirational Wisdom</div>
              </div>

              <div className="rounded-2xl p-8 shadow-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>How It Works</h3>
                <p className="leading-relaxed" style={{ color: 'var(--muted-text)' }}>
                  Our AI analyzes motivational patterns to provide genuine encouragement tailored to your chosen style and current mindset.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dramatic Motivation Sequence */}
        {mode === 'dramatic' && (
          <div className="animate-fade-in">
            <div className="rounded-2xl p-8 md:p-12 shadow-2xl max-w-3xl mx-auto" style={{ background: 'var(--surface)', border: '2px solid var(--border)' }}>
              
              {/* Progress Bar Section */}
              {showProgress && !showChoice && !showWarning && (
                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8">
                    Generating Your Motivation...
                  </h3>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="w-full rounded-full h-6 mb-6 overflow-hidden shadow-inner" style={{ background: 'var(--border)' }}>
                    <div 
                      className="h-full transition-all duration-500 ease-out rounded-full relative"
                      style={{ width: `${progress}%`, background: 'linear-gradient(90deg,var(--primary),var(--accent))' }}
                    >
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.0) 100%)', animation: 'pulse 3s infinite' }}></div>
                    </div>
                  </div>
                  
                  <p className="text-lg font-medium mb-4" style={{ color: 'var(--muted-text)' }}>
                    {progressText}
                  </p>
                  
                  <div className="text-3xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
                    {Math.round(progress)}%
                  </div>

                  {/* Floating particles animation */}
                  <div className="relative">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute animate-bounce"
                          style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                          }}
                        >
                          ✨
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Warning Section */}
              {showWarning && (
                <div className="text-center animate-pulse">
                  <div className="text-6xl mb-6">⚠️</div>
                  <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--accent)' }}>
                    WARNING
                  </h3>
                  <p className="text-xl leading-relaxed" style={{ color: 'var(--muted-text)' }}>
                    You are about to receive genuine motivation.<br/>
                    This may cause sudden bursts of productivity and optimism.
                  </p>
                </div>
              )}

              {/* Enhanced Choice Section */}
              {showChoice && (
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-8 leading-tight" style={{ color: 'var(--text)' }}>
                    Are you absolutely sure you want motivation?
                  </h2>
                  
                  <div className="p-6 rounded-lg mb-8" style={{ background: 'rgba(255, 210, 102, 0.08)', borderLeft: '4px solid #F6C84C' }}>
                    <p className="text-lg leading-relaxed" style={{ color: 'var(--muted-text)' }}>
                      Last chance to back out before we hit you with the positivity...<br/>
                      <span className="font-semibold" style={{ color: 'var(--text)' }}>This cannot be undone.</span>
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                      onClick={() => handleMotivationChoice(true)}
                      className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl group-hover:animate-bounce">✅</span>
                        <span>Yes, I'm ready for motivation!</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleMotivationChoice(false)}
                      className="group px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl group-hover:animate-bounce">❌</span>
                        <span>Actually, give me demotivation</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Result Section */}
        {mode === 'result' && motivationResult && (
          <div className="animate-fade-in">
            <div className="rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto" style={{ background: 'var(--surface)', border: '2px solid var(--border)' }}>
              <div className="text-center">
                <div className="text-6xl mb-6">🌟</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: 'var(--primary)' }}>
                  Your Motivation Has Arrived!
                </h3>
                
                <div className="p-8 rounded-xl mb-8" style={{ background: 'linear-gradient(90deg, rgba(236,253,245,0.6), rgba(239,246,255,0.6))', borderLeft: '4px solid rgba(34,197,94,0.2)' }}>
                  {showTyping ? (
                    <TypingEffect 
                      text={motivationResult}
                      speed={30}
                      className="text-lg md:text-xl leading-relaxed"
                      // ensure typing text uses token colors
                    />
                  ) : (
                    <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--text)' }}>
                      {motivationResult}
                    </p>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center mb-8">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <span>{copied ? '✅' : '📋'}</span>
                    <span>{copied ? 'Copied!' : 'Copy Motivation'}</span>
                  </button>
                  
                  <button
                    onClick={resetMotivationSequence}
                    className="flex items-center space-x-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <span>🔄</span>
                    <span>Get More Motivation</span>
                  </button>
                  
                  <Link
                    to="/generator"
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <span>😈</span>
                    <span>Back to Demotivation</span>
                  </Link>
                </div>

                {/* Share Buttons */}
                <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                  <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--muted-text)' }}>
                    Share the Positivity:
                  </h4>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {[
                      { name: 'Twitter', platform: 'twitter', color: 'bg-blue-400 hover:bg-blue-500' },
                      { name: 'LinkedIn', platform: 'linkedin', color: 'bg-blue-600 hover:bg-blue-700' },
                      { name: 'Reddit', platform: 'reddit', color: 'bg-orange-500 hover:bg-orange-600' },
                      { name: 'Facebook', platform: 'facebook', color: 'bg-blue-800 hover:bg-blue-900' }
                    ].map((social) => (
                      <button
                        key={social.platform}
                        onClick={() => shareToSocial(social.platform)}
                        className={`px-4 py-2 ${social.color} text-white rounded-lg transition-colors text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105`}
                      >
                        {social.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back to Home */}
        {mode === 'selection' && (
          <div className="text-center mt-12">
            <p className="mb-4" style={{ color: 'var(--muted-text)' }}>
              Changed your mind about motivation?
            </p>
            <Link
              to="/generator"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg"
            >
              <span>😈</span>
              <span>Back to Demotivation</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Motivation;
