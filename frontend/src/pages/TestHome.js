import React from 'react';
import { Link } from 'react-router-dom';

const TestHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Demotivation Station
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Sometimes a reality check is the most productive thing you can do.
            Our AI crafts perfectly blunt demotivations, voice renditions, and
            analytics to keep expectations grounded and goals realistic.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/generator"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md"
            >
              Try the Generator
            </Link>

            <Link
              to="/features"
              className="inline-flex items-center px-6 py-3 bg-white/80 hover:bg-white text-indigo-700 font-medium rounded-lg border border-transparent shadow-sm"
            >
              See Features
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Free tier available • Stripe billing • Voice synthesis • AI chat
          </p>
        </div>
      </header>

      {/* Features & Intro Section */}
      <section className="mt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6 shadow-sm border border-white/30">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Demotivations</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Generate perfectly-timed, razor-sharp demotivational messages tuned to tone and length.</p>
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6 shadow-sm border border-white/30">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Voice Synthesis</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Convert demotivations to natural-sounding voice clips for social posts or podcasts.</p>
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6 shadow-sm border border-white/30">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Usage & Billing</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Free & paid tiers, usage limits, Stripe billing, and analytics to manage your account.</p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800/30 dark:to-gray-700/30 rounded-xl p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">Built for creators, teams, and pranksters</h4>
              <p className="mt-3 text-gray-600 dark:text-gray-300">Whether you want a one-off scathing line or a daily subscription of blunt honesty, Demotivation Station adapts to your workflow.</p>
              <div className="mt-6">
                <Link to="/generator" className="px-5 py-2 bg-indigo-600 text-white rounded-lg mr-3">Get started</Link>
                <Link to="/pricing" className="px-5 py-2 border rounded-lg bg-white/80">Pricing</Link>
              </div>
            </div>

            <div className="flex-1">
              {/* Placeholder graphic - kept simple to avoid new assets */}
              <div className="w-full h-44 md:h-56 rounded-lg bg-white/70 dark:bg-gray-900/60 border border-white/30 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">[Hero illustration placeholder]</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestHome;
