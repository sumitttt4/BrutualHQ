import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      id: 'ai-generator',
      title: 'AI-Powered Generator',
      description: 'Transform your hopes and dreams into crushing reality checks with our advanced AI.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      features: [
        'Personalized demotivation based on your input',
        'Multiple tone options (sarcastic, dark humor, friendly roast)',
        'Context-aware responses',
        'Instant reality checks'
      ],
      cta: { text: 'Try Generator', link: '/generator' },
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'celebrity-voices',
      title: 'Celebrity Voice Studio',
      description: 'Hear your reality checks delivered by AI-powered celebrity voices for maximum impact.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      features: [
        'Gordon Ramsay - Kitchen nightmare commentary',
        'Simon Cowell - Talent show brutality',
        'Drill Sergeant - Military-style motivation killer',
        'Disappointed Parent - Ultimate guilt trip',
        'Nihilistic Philosopher - Existential dread',
        'Sarcastic Teenager - Eye-rolling expertise',
        'Corporate Boss - Dream crusher extraordinaire',
        'Reality TV Host - Eliminates hope efficiently'
      ],
      cta: { text: 'Try Voice Studio', link: '/voice' },
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'smart-chat',
      title: 'Intelligent Chat Assistant',
      description: 'Converse with our AI that seamlessly switches between helpful and brutally honest.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.172-.273L7 21l1.273-3.828C7.482 16.467 7 15.264 7 14c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
        </svg>
      ),
      features: [
        'Dynamic conversation flow',
        'Context-aware responses',
        'Mood detection and adaptation',
        'Chat history and memory',
        'Multiple conversation styles',
        'Real-time demotivation on demand'
      ],
      cta: { text: 'Start Chatting', link: '/chat' },
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'quick-roast',
      title: 'Quick Roast Generator',
      description: 'Get instant, savage reality checks in 2-4 brutal lines. Perfect for when you need a quick dose of humility.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 716.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      features: [
        'Lightning-fast roasts in seconds',
        'Concise, punchy delivery',
        'Targeted personal attacks (the good kind)',
        'Sample prompts for inspiration',
        'Character count optimization',
        'Share-worthy one-liners'
      ],
      cta: { text: 'Get Roasted', link: '/#roast-section' },
      gradient: 'from-red-500 to-orange-600'
    },
    {
      id: 'multi-input',
      title: 'Multi-Modal Input',
      description: 'Express yourself through typing, voice, or chat - we\'ll crush your dreams regardless of format.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      features: [
        'Voice-to-text input with speech recognition',
        'Traditional text typing',
        'Interactive chat interface',
        'Seamless mode switching',
        'Cross-platform compatibility',
        'Accessibility optimized'
      ],
      cta: { text: 'Try All Modes', link: '/voice' },
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'social-sharing',
      title: 'Social Sharing & Export',
      description: 'Share your favorite demotivational moments with friends, family, and enemies.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      ),
      features: [
        'One-click social media sharing',
        'Copy to clipboard functionality',
        'Export as image or text',
        'Custom branding options',
        'Privacy-friendly sharing',
        'Viral-ready formats'
      ],
      cta: { text: 'Share Now', link: '/generator' },
      gradient: 'from-cyan-500 to-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Landing Hero */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">Features That <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Crush Dreams</span></h1>
            <p className="text-lg text-slate-600 mb-6">From celebrity voiceovers to instant roast generators, Demotivation Station delivers surgical reality checks for creators, teams, and pranksters.</p>
            <div className="flex gap-4">
              <Link to="/generator" className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold">Try Generator</Link>
              <Link to="/voice" className="px-6 py-3 border rounded-lg">Try Voices</Link>
            </div>
          </div>

          <div>
            <div className="w-full h-72 bg-white rounded-xl shadow-lg flex items-center justify-center border border-slate-100">
              <span className="text-slate-400">[Hero Illustration Placeholder]</span>
            </div>
          </div>
        </div>
      </section>

      {/* reuse existing features grid and sections (unchanged below) */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={feature.id} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`}></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-3 mb-8">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={feature.cta.link} className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl`}>{feature.cta.text}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / How it works / CTA left unchanged - reuse below (omitted for brevity) */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">By The Numbers</h2>
          <p className="text-xl text-slate-600 text-center mb-16 max-w-3xl mx-auto">Our platform delivers measurable results in dream crushing and reality checking.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-red-600 mb-2">98%</div>
              <div className="text-slate-600">Dreams Crushed</div>
              <div className="text-sm text-slate-500 mt-1">With surgical precision</div>
            </div>
            <div className="text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-orange-600 mb-2">2.4s</div>
              <div className="text-slate-600">Avg Response Time</div>
              <div className="text-sm text-slate-500 mt-1">Lightning fast reality</div>
            </div>
            <div className="text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-purple-600 mb-2">8</div>
              <div className="text-slate-600">Celebrity Voices</div>
              <div className="text-sm text-slate-500 mt-1">AI-powered personalities</div>
            </div>
            <div className="text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-blue-600 mb-2">∞</div>
              <div className="text-slate-600">Ways to Disappoint</div>
              <div className="text-sm text-slate-500 mt-1">Limitless possibilities</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">How It Works</h2>
          <p className="text-xl text-slate-600 text-center mb-16 max-w-2xl mx-auto">Getting demotivated has never been easier. Follow these simple steps to crush your dreams.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">1</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Share Your Dreams</h3>
              <p className="text-slate-600">Tell us about your hopes, goals, or anything you're optimistic about. The more specific, the better the crushing.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">2</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Choose Your Style</h3>
              <p className="text-slate-600">Pick from celebrity voices, chat modes, or quick roasts. Each offers a unique flavor of reality checking.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">3</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Get Crushed</h3>
              <p className="text-slate-600">Receive your personalized reality check and share it with others who need a dose of humble pie.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Face Reality?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Stop living in delusion. Start your journey to brutal honesty and lowered expectations today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/generator" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:scale-105 transition-transform duration-200 shadow-xl">Start Getting Demotivated</Link>
            <Link to="/voice" className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-slate-900 transition-colors duration-200">Try Celebrity Voices</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;