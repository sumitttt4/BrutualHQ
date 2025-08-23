import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

// CSS for rotating taglines
const taglineStyles = `
  .rotating-taglines {
    position: relative;
    height: 80px;
  }
  
  .tagline {
    transition: opacity 1s ease-in-out;
    animation: rotateTaglines 24s infinite;
  }
  
  .tagline:nth-child(1) { animation-delay: 0s; }
  .tagline:nth-child(2) { animation-delay: 3s; }
  .tagline:nth-child(3) { animation-delay: 6s; }
  .tagline:nth-child(4) { animation-delay: 9s; }
  .tagline:nth-child(5) { animation-delay: 12s; }
  .tagline:nth-child(6) { animation-delay: 15s; }
  .tagline:nth-child(7) { animation-delay: 18s; }
  .tagline:nth-child(8) { animation-delay: 21s; }
  
  @keyframes rotateTaglines {
    0%, 12.5% { opacity: 1; }
    12.51%, 100% { opacity: 0; }
  }
`;

// Inject styles
if (!document.querySelector('#tagline-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = 'tagline-styles';
  styleSheet.innerText = taglineStyles;
  document.head.appendChild(styleSheet);
}

// Roast Generator Component
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate roast');
      }

      setRoast(data.roast);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error('Roast generation error:', err);
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
          {samplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setInput(prompt)}
              className="px-3 py-1 text-xs bg-[#1E293B]/80 backdrop-blur-sm border border-gray-600 rounded-full hover:bg-[#334155] transition-colors text-gray-300"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-6 shadow-lg mb-6 border border-gray-600">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tell us about yourself, your dreams, your habits... anything we can roast you for! (Be specific for better burns)"
          className="w-full p-4 bg-[#0F172A] border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400"
          rows="3"
          maxLength="200"
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-400">{input.length}/200</span>
          <button
            onClick={generateRoast}
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
          >
            {isLoading ? 'Roasting...' : 'Roast Me!'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6 backdrop-blur-sm">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Roast Display */}
      {roast && (
        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-l-4 border-red-500 rounded-lg p-6 shadow-lg backdrop-blur-sm border border-red-500/30">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-red-300 mb-2">Reality Check Delivered:</h4>
              <p className="text-gray-200 leading-relaxed whitespace-pre-line">{roast}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Home = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/25 rounded-full filter blur-xl animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/25 rounded-full filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500/25 rounded-full filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Hero Text & CTAs */}
            <div className="text-left">
              <div className="animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                  Get Demotivated
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                    With Me
                  </span>
                </h1>
                
                {/* Rotating Taglines */}
                <div className="mb-8 h-32">
                  <div className="rotating-taglines">
                    <p className="tagline text-xl md:text-2xl text-gray-700 leading-relaxed font-medium opacity-0 absolute">
                      "Feeling too positive? Let our AI bring you back down to reality with a sharp dose of perspective."
                    </p>
                    <p className="tagline text-xl md:text-2xl text-gray-700 leading-relaxed font-medium opacity-0 absolute">
                      "Because not everything needs a silver lining — get demotivated today."
                    </p>
                    <p className="tagline text-xl md:text-2xl text-gray-700 leading-relaxed font-medium opacity-0 absolute">
                      "Your daily reminder that dreams are overrated and reality bites."
                    </p>
                    <p className="tagline text-xl md:text-2xl text-gray-700 leading-relaxed font-medium opacity-0 absolute">
                      "Too much positivity is dangerous. Balance it out with a little negativity."
                    </p>
                    <p className="tagline text-xl md:text-2xl text-gray-700 leading-relaxed font-medium opacity-0 absolute">
                      "We don't sugarcoat. We salt your wounds — with style."
                    </p>
                    <p className="tagline text-xl md:text-2xl text-gray-700 leading-relaxed font-medium opacity-0 absolute">
                      "Motivation is temporary. Demotivation is forever."
                    </p>
                    <p className="tagline text-xl md:text-2xl text-gray-700 leading-relaxed font-medium opacity-0 absolute">
                      "Lower your expectations and you'll never be disappointed."
                    </p>
                    <p className="tagline text-xl md:text-2xl text-gray-700 leading-relaxed font-medium opacity-0 absolute">
                      "Reality check: Your comfort zone is actually a prison."
                    </p>
                  </div>
                </div>
                
                <p className="text-lg text-gray-600 mb-8 max-w-2xl leading-relaxed">
                  Professional dream crushing since 2024. AI-powered reality checks delivered in celebrity voices.
                </p>
                
                {/* Primary CTA Button */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/generator"
                    className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-xl shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative flex items-center space-x-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 716.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                      <span>Get Demotivated</span>
                    </div>
                  </Link>
                  
                  <Link
                    to="/voice"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl shadow-lg hover:shadow-xl hover:border-gray-400 transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <span>Try Celebrity Voices</span>
                    </div>
                  </Link>
                </div>
                
                {/* Secondary Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/chat"
                    className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.172-.273L7 21l1.273-3.828C7.482 16.467 7 15.264 7 14c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                      </svg>
                      <span>Start Chatting</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side - Interactive Feature Cards */}
            <div className="grid grid-cols-2 gap-6">
              {/* Text Generator Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-6 h-64 flex flex-col justify-between transform group-hover:scale-105 transition-all duration-300 cursor-pointer border border-blue-200/50 group-hover:border-blue-500/50 shadow-xl group-hover:shadow-2xl">
                  <div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Generator</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      AI-powered reality checks tailored to your situation
                    </p>
                  </div>
                  <Link
                    to="/generator"
                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm shadow-lg hover:shadow-xl text-center block"
                  >
                    Try Now
                  </Link>
                </div>
              </div>

              {/* Chat Card */}
              <Link to="/chat" className="group relative block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-6 h-64 flex flex-col justify-between transform group-hover:scale-105 transition-all duration-300 cursor-pointer border border-purple-200/50 group-hover:border-purple-500/50 shadow-xl group-hover:shadow-2xl">
                  <div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.172-.273L7 21l1.273-3.828C7.482 16.467 7 15.264 7 14c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Chat</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Converse with AI that switches between helpful and brutal
                    </p>
                  </div>
                  <div className="w-full py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium text-center text-sm shadow-lg">
                    Start Chat
                  </div>
                </div>
              </Link>

              {/* Voice Studio Card */}
              <Link to="/voice" className="group relative block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-6 h-64 flex flex-col justify-between transform group-hover:scale-105 transition-all duration-300 cursor-pointer border border-emerald-200/50 group-hover:border-emerald-500/50 shadow-xl group-hover:shadow-2xl">
                  <div>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Voice Studio</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Celebrity voices deliver your personalized reality checks
                    </p>
                  </div>
                  <div className="w-full py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium text-center text-sm shadow-lg">
                    Try Voices
                  </div>
                </div>
              </Link>

              {/* Roast Card */}
              <div className="group relative" onClick={() => document.getElementById('roast-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-6 h-64 flex flex-col justify-between transform group-hover:scale-105 transition-all duration-300 cursor-pointer border border-orange-200/50 group-hover:border-orange-500/50 shadow-xl group-hover:shadow-2xl">
                  <div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Roast</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Quick brutal reality checks in 2-4 savage lines
                    </p>
                  </div>
                  <div className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium text-center text-sm shadow-lg">
                    Roast Me
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fun Statistics */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl font-bold text-red-600 mb-2">98%</div>
              <div className="text-gray-600">Dreams crushed with precision</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">2.4s</div>
              <div className="text-gray-600">Average time to reality check</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
              <div className="text-gray-600">Ways to lower expectations</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDownIcon className="h-6 w-6 text-gray-600" />
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator-section" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Reality Check
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Pick your preferred style of brutal honesty. We have options for every level of delusion.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sarcasm</h3>
              <p className="text-gray-600">Witty observations about your ambitious plans</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Dark Humor</h3>
              <p className="text-gray-600">Cynical wisdom for the overly optimistic</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Friendly Roast</h3>
              <p className="text-gray-600">Playful reality checks with a smile</p>
            </div>
          </div>
          
          <Link
            to="/generator"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Start Generator
          </Link>
        </div>
      </section>

      {/* Roast Me Section */}
      <section id="roast-section" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Roasted in 3 Lines
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-4">
              Tell us about yourself and get a short, punchy reality check. Quick burns, maximum damage.
            </p>
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

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">
            More Ways to Crush Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              Delusions
            </span>
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Because one reality check is never enough — explore our complete arsenal of dream-crushing tools
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.172-.273L7 21l1.273-3.828C7.482 16.467 7 15.264 7 14c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Conversations</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">Have dynamic conversations with AI that switches between helpful and demotivational modes</p>
              <Link 
                to="/chat" 
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors group-hover:translate-x-1 transform duration-200"
              >
                Start Chatting
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Celebrity Voices</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">Experience demotivation through the voices of Morgan Freeman, Gordon Ramsay, and more</p>
              <Link 
                to="/voice" 
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors group-hover:translate-x-1 transform duration-200"
              >
                Try Voice Mode
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Curated Gallery</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">Browse our collection of the finest reality checks and demotivational wisdom</p>
              <Link 
                to="/explore" 
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors group-hover:translate-x-1 transform duration-200"
              >
                Explore Gallery
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Accidental Motivation</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">Sometimes we accidentally provide encouragement. It happens to the best of us</p>
              <Link 
                to="/motivation" 
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors group-hover:translate-x-1 transform duration-200"
              >
                Get Motivated
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Preview Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Chat with Our AI Assistant
            </h2>
            <p className="text-xl text-gray-600">
              Have a conversation with our AI. Ask for demotivation, advice, or just chat!
            </p>
          </div>

          {/* Mini Chat Preview */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl max-w-2xl mx-auto mb-8">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-800">AI Assistant</span>
              </div>
              <div className="text-sm text-gray-500">Try it now!</div>
            </div>

            <div className="p-4 space-y-4 h-64 overflow-y-auto">
              {/* Sample conversation */}
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
                  <div className="whitespace-pre-wrap">Hello! I can help with motivation, demotivation, advice, or just chat. What's on your mind?</div>
                  <div className="text-xs text-gray-500 mt-1">AI Assistant</div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-lg p-3 max-w-[80%]">
                  <div className="whitespace-pre-wrap">I'm feeling too motivated today. Can you demotivate me?</div>
                  <div className="text-xs text-indigo-200 mt-1">You</div>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
                  <div className="whitespace-pre-wrap">Ah, feeling overly optimistic? Let me help with that. Your motivation is probably just caffeine-induced delusion anyway. Tomorrow you'll remember why you started this conversation.</div>
                  <div className="text-xs text-gray-500 mt-1">AI Assistant</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <Link
                to="/chat"
                className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Start Chatting Now
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">Ask for Demotivation</h4>
              <p className="text-gray-600 text-sm">Perfect for when you're feeling too optimistic</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">Get Advice</h4>
              <p className="text-gray-600 text-sm">Honest insights about life and goals</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">Casual Chat</h4>
              <p className="text-gray-600 text-sm">Just have a normal conversation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
