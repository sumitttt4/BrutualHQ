import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const OnboardingTour = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (isOpen) {
      setShowTour(true);
      trackEvent('onboarding_started');
    }
  }, [isOpen, trackEvent]);

  const steps = [
    {
      title: 'Welcome to BrutualHQ! 🎭',
      content: "The AI-powered playground for brutal honesty and witty reality checks. Let's show you around!",
      target: null,
      position: 'center'
    },
    {
      title: 'AI Demotivation Generator 🤖',
      content: 'Our flagship feature! Generate personalized demotivational content with different tones: sarcasm, dark humor, or friendly roasts.',
      target: '[data-tour="generator"]',
      position: 'bottom'
    },
    {
      title: 'Chat with AI 💬',
      content: 'Have a conversation with our demotivational AI. Ask questions, get advice, or just chat about life.',
      target: '[data-tour="chat"]',
      position: 'bottom'
    },
    {
      title: 'Need Motivation? ✨',
      content: 'Sometimes you actually need a boost! Our motivation section provides genuine encouragement when you need it.',
      target: '[data-tour="motivation"]',
      position: 'bottom'
    },
    {
      title: 'Free to Use 🎁',
      content: 'All users can generate demotivations for free. Upgrade only if you want unlimited access or premium voices.',
      target: '[data-tour="auth"]',
      position: 'bottom'
    },
    {
      title: "You're All Set! 🎉",
      content: 'Ready to get demotivated? Start with the generator, explore features, or chat with our AI. Welcome aboard!',
      target: null,
      position: 'center'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      trackEvent('onboarding_step_completed', { step: currentStep + 1 });
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setShowTour(false);
    onClose();
    localStorage.setItem('onboarding_completed', 'true');
    trackEvent('onboarding_completed', { total_steps: steps.length });
  };

  const handleSkip = () => {
    setShowTour(false);
    onClose();
    localStorage.setItem('onboarding_skipped', 'true');
    trackEvent('onboarding_skipped', { step: currentStep + 1 });
  };

  if (!showTour) return null;

  const currentStepData = steps[currentStep];
  const targetElement = currentStepData.target ? document.querySelector(currentStepData.target) : null;
  
  let tooltipPosition = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  
  if (targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    switch (currentStepData.position) {
      case 'bottom':
        tooltipPosition = {
          top: rect.bottom + scrollY + 10,
          left: rect.left + scrollX + (rect.width / 2),
          transform: 'translateX(-50%)'
        };
        break;
      case 'top':
        tooltipPosition = {
          top: rect.top + scrollY - 10,
          left: rect.left + scrollX + (rect.width / 2),
          transform: 'translate(-50%, -100%)'
        };
        break;
      case 'left':
        tooltipPosition = {
          top: rect.top + scrollY + (rect.height / 2),
          left: rect.left + scrollX - 10,
          transform: 'translate(-100%, -50%)'
        };
        break;
      case 'right':
        tooltipPosition = {
          top: rect.top + scrollY + (rect.height / 2),
          left: rect.right + scrollX + 10,
          transform: 'translateY(-50%)'
        };
        break;
      default:
        break;
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleSkip} />
      
      {/* Spotlight effect */}
      {targetElement && (
        <div
          className="fixed z-45 pointer-events-none"
          style={{
            top: targetElement.getBoundingClientRect().top + window.scrollY - 8,
            left: targetElement.getBoundingClientRect().left + window.scrollX - 8,
            width: targetElement.offsetWidth + 16,
            height: targetElement.offsetHeight + 16,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '8px'
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 p-6 max-w-sm animate-fade-in"
        style={tooltipPosition}
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep 
                    ? 'bg-indigo-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Skip tour
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {currentStepData.content}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentStep === 0
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentStep + 1} of {steps.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            {currentStep !== steps.length - 1 && <ChevronRightIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </>
  );
};

// Hook to manage onboarding state
export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    const hasSkippedOnboarding = localStorage.getItem('onboarding_skipped');
    
    // Show onboarding for new users or when explicitly requested
    if (!hasCompletedOnboarding && !hasSkippedOnboarding) {
      // Delay to ensure page is loaded
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  return {
    showOnboarding,
    startOnboarding,
    closeOnboarding
  };
};

export default OnboardingTour;
