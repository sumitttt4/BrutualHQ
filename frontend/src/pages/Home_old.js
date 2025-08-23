import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowPathIcon, 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon,
  PaperAirplaneIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  // State for all interactive features
  const [activeCard, setActiveCard] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [selectedTone, setSelectedTone] = useState('sarcasm');
  const [selectedVoice, setSelectedVoice] = useState('morgan-freeman');
  const [chatInput, setChatInput] = useState('');
  const [roastInput, setRoastInput] = useState('');
  
  // Loading states
  const [textLoading, setTextLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [roastLoading, setRoastLoading] = useState(false);
  
  // Results
  const [textResult, setTextResult] = useState('');
  const [voiceResult, setVoiceResult] = useState('');
  const [chatResult, setChatResult] = useState('');
  const [roastResult, setRoastResult] = useState('');
  
  const [isPlaying, setIsPlaying] = useState(false);

  // Sample quotes for hero
  const [currentQuote, setCurrentQuote] = useState(0);
  const heroQuotes = [
    "Your potential is limitless... at being disappointing.",
    "Dream big, fail bigger - that's the spirit!",
    "Success is just failure that hasn't happened yet.",
    "Your optimism is adorable, but reality disagrees."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % heroQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const tones = [
    { id: 'sarcasm', name: 'Sarcasm', emoji: '😏' },
    { id: 'dark-humor', name: 'Dark Humor', emoji: '🖤' },
    { id: 'brutal-honesty', name: 'Brutal Truth', emoji: '💀' },
    { id: 'friendly', name: 'Friendly Roast', emoji: '😊' }
  ];

  const voices = [
    { id: 'morgan-freeman', name: 'Morgan Freeman', accent: 'Deep & Wise' },
    { id: 'gordon-ramsay', name: 'Gordon Ramsay', accent: 'British Fury' },
    { id: 'david-attenborough', name: 'David Attenborough', accent: 'Nature Doc' },
    { id: 'british-butler', name: 'British Butler', accent: 'Sophisticated' }
  ];

  // Generate Text Demotivation
  const generateText = async () => {
    if (!textInput.trim()) return;
    setTextLoading(true);
    try {
      const response = await fetch('/api/demotivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: textInput.trim(), tone: selectedTone })
      });
      const data = await response.json();
      setTextResult(data.message || 'Generation failed');
    } catch (error) {
      setTextResult('Oops! Even our AI is demotivated right now.');
    } finally {
      setTextLoading(false);
    }
  };

  // Generate Voice Demotivation
  const generateVoice = async () => {
    if (!textInput.trim()) return;
    setVoiceLoading(true);
    try {
      const response = await fetch('/api/voice-demotivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: textInput.trim(), tone: selectedTone, voice: selectedVoice })
      });
      const data = await response.json();
      setVoiceResult(data.message || 'Voice generation failed');
    } catch (error) {
      setVoiceResult('Even our celebrity voices gave up on you.');
    } finally {
      setVoiceLoading(false);
    }
  };

  // Play Voice
  const playVoice = () => {
    if (!voiceResult) return;
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(voiceResult);
    const voices = window.speechSynthesis.getVoices();
    
    // Basic voice mapping
    const voiceMapping = {
      'morgan-freeman': voices.find(v => v.name.includes('Daniel')) || voices[0],
      'gordon-ramsay': voices.find(v => v.lang.includes('en-GB')) || voices[0],
      'david-attenborough': voices.find(v => v.lang.includes('en-GB')) || voices[1],
      'british-butler': voices.find(v => v.lang.includes('en-GB')) || voices[2]
    };

    utterance.voice = voiceMapping[selectedVoice] || voices[0];
    utterance.rate = selectedVoice === 'gordon-ramsay' ? 1.2 : 0.9;
    utterance.pitch = selectedVoice === 'morgan-freeman' ? 0.7 : 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  // Send Chat Message
  const sendChat = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput.trim() })
      });
      const data = await response.json();
      setChatResult(data.response || 'Chat failed');
    } catch (error) {
      setChatResult('Even our AI doesn\'t want to talk to you right now.');
    } finally {
      setChatLoading(false);
    }
  };

  // Generate Roast
  const generateRoast = async () => {
    if (!roastInput.trim()) return;
    setRoastLoading(true);
    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: roastInput.trim() })
      });
      const data = await response.json();
      setRoastResult(data.roast || 'Roast failed');
    } catch (error) {
      setRoastResult('You\'re so disappointing, even our roast generator crashed.');
    } finally {
      setRoastLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-teal-400/15 to-cyan-400/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Hero Content */}
          <div className="mb-20">
            <h1 className="text-7xl md:text-9xl font-black text-gray-900 mb-8 leading-none">
              <span className="block">Demotivation</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Station
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 mb-8 font-light max-w-4xl mx-auto">
              Reality checks delivered with style
            </p>
            
            {/* Rotating Hero Quote */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-3xl mx-auto border border-white/30">
              <p className="text-xl md:text-2xl text-gray-800 italic font-medium leading-relaxed">
                "{heroQuotes[currentQuote]}"
              </p>
              <div className="flex justify-center mt-6 space-x-2">
                {heroQuotes.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      index === currentQuote ? 'bg-indigo-600 scale-125' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-8 h-80 flex flex-col justify-between transform group-hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl group-hover:shadow-2xl">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Quick Roasts</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Get instant 2-4 line reality checks. Perfect for when you need a quick dose of harsh truth without the commitment.
                  </p>
                </div>
                <button
                  onClick={() => document.getElementById('roast-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 transform group-hover:translate-y-0 translate-y-2"
                >
                  Roast Me Now
                </button>
              </div>
            </div>
          </div>

          {/* Rotating Sample Quotes */}
          <div className="mt-20">
            <h3 className="text-lg font-medium text-gray-700 mb-6">Today's Reality Check</h3>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg max-w-2xl mx-auto border border-white/20">
              <p className="text-gray-800 text-xl italic transition-all duration-500 leading-relaxed">
                "{sampleQuotes[currentQuoteIndex]}"
              </p>
              <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                  {sampleQuotes.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentQuoteIndex ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDownIcon className="h-6 w-6 text-gray-400" />
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator-section" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Choose Your Reality Check
          </h2>
          
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
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Generator
          </Link>
        </div>
      </section>

      {/* Roast Me Section */}
      <section id="roast-section" className="py-20 px-4 bg-red-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Roasted in 3 Lines
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us about yourself and get a short, punchy reality check. Quick burns, maximum damage.
            </p>
          </div>

          <RoastGenerator />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">
            More Ways to Lower Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Expectations
            </span>
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Explore our complete suite of reality-checking tools and features
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
