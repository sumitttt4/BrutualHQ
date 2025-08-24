import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../LoadingSpinner';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', onSuccess }) => {
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { login, register, loginWithGoogle } = useAuth();
  const { trackEvent } = useAnalytics();

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (mode !== 'forgot' && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode !== 'forgot' && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      if (mode === 'login') {
        const data = await login(formData.email, formData.password);
        trackEvent('user_login', { method: 'email' });
        if (onSuccess) {
          onSuccess(data);
        } else {
          onClose();
        }
      } else if (mode === 'register') {
        const data = await register(formData.email, formData.password, formData.name);
        trackEvent('user_register', { method: 'email' });
        if (onSuccess) {
          onSuccess(data);
        } else {
          onClose();
        }
      } else if (mode === 'forgot') {
        // Handle password reset
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        
        if (response.ok) {
          setMessage('Password reset email sent! Check your inbox.');
          trackEvent('password_reset_requested');
        } else {
          throw new Error('Failed to send reset email');
        }
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      trackEvent('user_login', { method: 'google' });
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-sm">
            {message}
          </div>
        )}

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner />
                <span>Processing...</span>
              </div>
            ) : (
              mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Email'
            )}
          </button>
        </form>

        {mode !== 'forgot' && (
          <>
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="mt-4 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </div>
            </button>
          </>
        )}

        <div className="mt-6 text-center text-sm">
          {mode === 'login' ? (
            <>
              <button
                onClick={() => setMode('forgot')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline mr-4"
              >
                Forgot password?
              </button>
              <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>
              <button
                onClick={() => setMode('register')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Sign up
              </button>
            </>
          ) : mode === 'register' ? (
            <>
              <span className="text-gray-500 dark:text-gray-400">Already have an account? </span>
              <button
                onClick={() => setMode('login')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <button
              onClick={() => setMode('login')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Back to sign in
            </button>
          )}
        </div>

        {mode === 'register' && (
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Privacy Policy
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
