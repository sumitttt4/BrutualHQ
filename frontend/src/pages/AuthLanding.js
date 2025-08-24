import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/auth/AuthModal';

const AuthLanding = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleSuccess = (data) => {
    // After successful login/register, navigate to dashboard
    setShowAuthModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold mb-8">Get started</h1>

        <div className="flex gap-6 justify-center mb-6">
          <button
            onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
            className="px-10 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Log in
          </button>

          <button
            onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
            className="px-10 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Sign up for free
          </button>
        </div>

        <div>
          <button
            onClick={() => navigate('/generator')}
            className="text-sm text-white/80 underline"
          >
            Try it first
          </button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default AuthLanding;
