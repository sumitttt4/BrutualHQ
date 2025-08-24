import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UsageLimit = ({ onUpgrade }) => {
  const { user, isPremium, hasUsageRemaining } = useAuth();

  if (isPremium || hasUsageRemaining) {
    return null;
  }

  const remainingUsage = user?.usage?.remaining || 0;
  const dailyLimit = user?.usage?.dailyLimit || 10;

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="text-orange-500 text-2xl mr-3">⚠️</div>
          <div>
            <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
              Daily Limit Reached
            </h3>
            <p className="text-orange-700 dark:text-orange-300 text-sm mt-1">
              You've used {dailyLimit - remainingUsage} of {dailyLimit} free demotivations today.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onUpgrade}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          ⭐ Upgrade to Pro for Unlimited
        </button>
        
        <div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Resets in {getTimeUntilReset()}
        </div>
      </div>
    </div>
  );
};

const getTimeUntilReset = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

export default UsageLimit;
