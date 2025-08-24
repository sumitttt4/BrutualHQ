import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Backwards-compatible alias: some components import `useNotification` (singular)
export const useNotification = useNotifications;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }

    return id;
  }, [removeNotification]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const success = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    });
  }, [addNotification]);

  const error = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: 8000,
      ...options
    });
  }, [addNotification]);

  const warning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      ...options
    });
  }, [addNotification]);

  const info = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const NotificationItem = ({ notification, onRemove }) => {
  const getStyles = () => {
    const base = "p-4 rounded-lg shadow-lg backdrop-blur-md border transition-all duration-300 transform";
    
    switch (notification.type) {
      case 'success':
        return `${base} bg-green-50/90 dark:bg-green-900/90 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200`;
      case 'error':
        return `${base} bg-red-50/90 dark:bg-red-900/90 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200`;
      case 'warning':
        return `${base} bg-yellow-50/90 dark:bg-yellow-900/90 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200`;
      case 'info':
      default:
        return `${base} bg-blue-50/90 dark:bg-blue-900/90 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200`;
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`${getStyles()} animate-slide-in-right`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-lg">{getIcon()}</span>
          <div className="flex-1">
            {notification.title && (
              <h4 className="font-semibold text-sm mb-1">
                {notification.title}
              </h4>
            )}
            <p className="text-sm">{notification.message}</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
