import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { 
  UserIcon, 
  CreditCardIcon, 
  ChartBarIcon, 
  BellIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const { user, subscription, logout } = useAuth();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, notificationsRes] = await Promise.all([
        fetch('/api/user/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        }),
        fetch('/api/user/notifications', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your account and track your demotivation journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        trackEvent('dashboard_tab_changed', { tab: tab.id });
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <OverviewTab stats={stats} subscription={subscription} />
            )}
            {activeTab === 'profile' && (
              <ProfileTab user={user} onUpdate={fetchDashboardData} />
            )}
            {activeTab === 'billing' && (
              <BillingTab subscription={subscription} />
            )}
            {activeTab === 'notifications' && (
              <NotificationsTab notifications={notifications} onUpdate={fetchDashboardData} />
            )}
            {activeTab === 'settings' && (
              <SettingsTab />
            )}
            {activeTab === 'security' && (
              <SecurityTab />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats, subscription }) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Total Demotivations
        </h3>
        <p className="text-3xl font-bold text-indigo-600">
          {stats?.totalGenerations || 0}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          +{stats?.todayGenerations || 0} today
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Favorites Saved
        </h3>
        <p className="text-3xl font-bold text-green-600">
          {stats?.totalFavorites || 0}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          All time
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Plan Status
        </h3>
        <p className="text-2xl font-bold text-purple-600">
          {subscription?.plan?.toUpperCase() || 'FREE'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {subscription?.status === 'active' ? 'Active' : 'Inactive'}
        </p>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {stats?.recentActivity?.map((activity, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.action}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(activity.timestamp).toLocaleDateString()}
              </p>
            </div>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {activity.type}
            </span>
          </div>
        )) || (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No recent activity
          </p>
        )}
      </div>
    </div>
  </div>
);

// Profile Tab Component
const ProfileTab = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        onUpdate();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Profile Information
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Tell us about yourself..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

// Billing Tab Component
const BillingTab = ({ subscription }) => (
  <div className="space-y-6">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Current Subscription
      </h3>
      {subscription ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Plan:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {subscription.plan?.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Status:</span>
            <span className={`font-semibold ${
              subscription.status === 'active' ? 'text-green-600' : 'text-red-600'
            }`}>
              {subscription.status?.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Next billing:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {subscription.nextBilling ? new Date(subscription.nextBilling).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          You're currently on the free plan
        </p>
      )}
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Billing History
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        No billing history available
      </p>
    </div>
  </div>
);

// Notifications Tab Component
const NotificationsTab = ({ notifications, onUpdate }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Notifications
    </h3>
    <div className="space-y-3">
      {notifications.length > 0 ? notifications.map((notification, index) => (
        <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {new Date(notification.timestamp).toLocaleDateString()}
          </p>
        </div>
      )) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No notifications
        </p>
      )}
    </div>
  </div>
);

// Settings Tab Component
const SettingsTab = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    dataCollection: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Save to backend
    fetch('/api/user/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ [key]: value })
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Settings
      </h3>
      <div className="space-y-6">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {getSettingDescription(key)}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleSettingChange(key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

// Security Tab Component
const SecurityTab = () => (
  <div className="space-y-6">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Change Password
      </h3>
      <form className="space-y-4">
        <input
          type="password"
          placeholder="Current password"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder="New password"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Update Password
        </button>
      </form>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Two-Factor Authentication
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Add an extra layer of security to your account
      </p>
      <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
        Enable 2FA
      </button>
    </div>
  </div>
);

const getSettingDescription = (key) => {
  const descriptions = {
    emailNotifications: 'Receive email notifications for important updates',
    pushNotifications: 'Receive push notifications in your browser',
    marketingEmails: 'Receive promotional emails and product updates',
    dataCollection: 'Allow us to collect analytics data to improve the service'
  };
  return descriptions[key] || '';
};

export default Dashboard;
