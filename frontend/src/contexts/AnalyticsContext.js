import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const [sessionId] = useState(() => Date.now().toString(36) + Math.random().toString(36).substr(2));

  // Initialize Google Analytics
  useEffect(() => {
    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const trackEvent = (eventName, properties = {}) => {
    try {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', eventName, {
          ...properties,
          session_id: sessionId,
          timestamp: new Date().toISOString()
        });
      }

      // Custom analytics endpoint
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          event: eventName,
          properties: {
            ...properties,
            sessionId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
          }
        })
      }).catch(err => console.warn('Analytics tracking failed:', err));
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  };

  const trackPageView = (page) => {
    trackEvent('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: page || window.location.pathname
    });
  };

  const trackUserAction = (action, details = {}) => {
    trackEvent('user_action', {
      action,
      ...details
    });
  };

  const trackGeneration = (type, tone, success = true) => {
    trackEvent('content_generation', {
      generation_type: type,
      tone,
      success,
      timestamp: new Date().toISOString()
    });
  };

  const trackSubscription = (action, plan = null) => {
    trackEvent('subscription_event', {
      action, // 'started', 'completed', 'cancelled'
      plan,
      timestamp: new Date().toISOString()
    });
  };

  const value = {
    trackEvent,
    trackPageView,
    trackUserAction,
    trackGeneration,
    trackSubscription,
    sessionId
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
