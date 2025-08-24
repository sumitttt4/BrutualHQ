import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    const subscriptionData = localStorage.getItem('subscriptionData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      if (subscriptionData) {
        setSubscription(JSON.parse(subscriptionData));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      if (data.subscription) {
        localStorage.setItem('subscriptionData', JSON.stringify(data.subscription));
        setSubscription(data.subscription);
      }
      
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Redirect to Google OAuth
      window.location.href = '/api/auth/google';
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('subscriptionData');
    setUser(null);
    setSubscription(null);
  };

  const updateUserUsage = (usage) => {
    if (user) {
      const updatedUser = { ...user, usage };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    subscription,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUserUsage,
    isAuthenticated: !!user,
    isPremium: subscription?.status === 'active',
    hasUsageRemaining: user?.usage?.remaining > 0 || subscription?.status === 'active'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
