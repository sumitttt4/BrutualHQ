import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import AuthModal from '../auth/AuthModal';
import PricingModal from '../billing/PricingModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const location = useLocation();

  const { user, isAuthenticated, logout, isPremium, subscription } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { trackEvent } = useAnalytics();

  const navigation = [
    { name: 'Home', href: '/', alt: 'Go to Home' },
    { name: 'RoastMe', href: '/roast', alt: 'Get Roasted' },
    { name: 'Chat', href: '/chat', alt: 'Open Chat' },
    { name: 'Voice', href: '/voice', alt: 'Open Voice Studio' },
    { name: 'Demotivation', href: '/generator', alt: 'Open Demotivation' },
    { name: 'Motivation', href: '/motivation', alt: 'Get Motivation' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleAuthAction = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    trackEvent('auth_modal_opened', { mode });
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    trackEvent('user_logout');
  };

  return (
    <>
  <header className="backdrop-blur-md sticky top-0 z-50" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link 
              to="/" 
              className="text-2xl font-bold transition-colors"
              style={{ color: 'var(--text)' }}
            >
              BrutualHQ
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-label={item.alt}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
                  style={isActive(item.href)
                    ? { background: 'rgba(99,102,241,0.08)', color: 'var(--accent)' }
                    : { color: 'var(--muted-text)' }
                  }
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors"
                aria-label="Toggle theme"
                style={{ color: 'var(--muted-text)' }}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>

              {/* User Menu or Auth Buttons */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg transition-colors"
                    style={{ color: 'var(--muted-text)' }}
                  >
                    <UserIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">{user?.name}</span>
                    {isPremium && (
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        PRO
                      </span>
                    )}
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-2 z-50" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm"
                        style={{ color: 'var(--text)' }}
                      >
                        <CogIcon className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      
                      {!isPremium && (
                        <button
                          onClick={() => {
                            setShowPricingModal(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm"
                          style={{ color: 'var(--accent)' }}
                        
                        >
                          <span>⭐</span>
                          <span>Upgrade to Pro</span>
                        </button>
                      )}
                      
                      <hr className="my-2" style={{ borderColor: 'var(--border)' }} />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm"
                        style={{ color: 'var(--text)' }}
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/auth"
                    className="px-4 py-2 text-sm font-medium transition-colors"
                    style={{ color: 'var(--muted-text)' }}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg"
                style={{ color: 'var(--muted-text)' }}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 animate-fade-in">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200`}
                    style={isActive(item.href)
                      ? { background: 'rgba(99,102,241,0.08)', color: 'var(--accent)' }
                      : { color: 'var(--muted-text)' }
                    }
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Theme Toggle */}
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: 'var(--muted-text)' }}
                >
                  {isDarkMode ? (
                    <>
                      <SunIcon className="h-5 w-5" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <MoonIcon className="h-5 w-5" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>

                {/* Mobile Auth/User Menu */}
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    
                    {!isPremium && (
                      <button
                        onClick={() => {
                          setShowPricingModal(true);
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
                      >
                        <span>⭐</span>
                        <span>Upgrade to Pro</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
                    >
                      <Link to="/auth">Sign In</Link>
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors w-full text-left"
                    >
                      <Link to="/auth">Sign Up</Link>
                    </button>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </>
  );
};

export default Header;
