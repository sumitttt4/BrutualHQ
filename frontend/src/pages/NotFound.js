import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <div className="text-gray-400 mb-4">
            <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <HomeIcon className="h-5 w-5" />
              <span>Go Home</span>
            </Link>
            
            <Link
              to="/generator"
              className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span>Try the Generator</span>
            </Link>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="text-sm text-gray-500">
          <p className="mb-2">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/explore" className="text-indigo-600 hover:text-indigo-700 underline">
              Explore
            </Link>
            <span>•</span>
            <Link to="/chat" className="text-indigo-600 hover:text-indigo-700 underline">
              Chat
            </Link>
            <span>•</span>
            <Link to="/motivation" className="text-indigo-600 hover:text-indigo-700 underline">
              Motivation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
