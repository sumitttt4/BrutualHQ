import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const APIDocumentation = () => {
  const [activeEndpoint, setActiveEndpoint] = useState('auth');

  const endpoints = {
    auth: {
      title: 'Authentication',
      description: 'User authentication and management endpoints',
      routes: [
        {
          method: 'POST',
          path: '/api/auth/register',
          description: 'Register a new user account',
          parameters: {
            email: 'string (required) - User email address',
            password: 'string (required) - User password (min 6 characters)',
            name: 'string (required) - User full name'
          },
          response: {
            token: 'string - JWT authentication token',
            user: 'object - User information',
            usage: 'object - Usage limits and current usage'
          }
        },
        {
          method: 'POST',
          path: '/api/auth/login',
          description: 'Authenticate existing user',
          parameters: {
            email: 'string (required) - User email address',
            password: 'string (required) - User password'
          },
          response: {
            token: 'string - JWT authentication token',
            user: 'object - User information',
            subscription: 'object - Subscription details (if any)'
          }
        },
        {
          method: 'POST',
          path: '/api/auth/forgot-password',
          description: 'Request password reset email',
          parameters: {
            email: 'string (required) - User email address'
          },
          response: {
            message: 'string - Success message'
          }
        }
      ]
    },
    demotivation: {
      title: 'Content Generation',
      description: 'AI-powered content generation endpoints',
      routes: [
        {
          method: 'POST',
          path: '/api/demotivate',
          description: 'Generate demotivational content',
          headers: {
            'Authorization': 'Bearer {token} (required)',
            'Content-Type': 'application/json'
          },
          parameters: {
            message: 'string (required) - Input message to demotivate',
            tone: 'string (optional) - Tone: sarcasm, darkhumor, roast (default: sarcasm)'
          },
          response: {
            message: 'string - Generated demotivational content',
            usage: 'object - Updated usage information',
            id: 'string - Generation ID for tracking'
          }
        },
        {
          method: 'POST',
          path: '/api/voice/generate',
          description: 'Generate voice demotivation',
          headers: {
            'Authorization': 'Bearer {token} (required)',
            'Content-Type': 'application/json'
          },
          parameters: {
            text: 'string (required) - Text to convert to speech',
            voice: 'string (optional) - Voice type: celebrity, robotic, etc.',
            tone: 'string (optional) - Emotional tone'
          },
          response: {
            audioUrl: 'string - URL to generated audio file',
            duration: 'number - Audio duration in seconds',
            usage: 'object - Updated usage information'
          }
        }
      ]
    },
    user: {
      title: 'User Management',
      description: 'User profile and settings endpoints',
      routes: [
        {
          method: 'GET',
          path: '/api/user/profile',
          description: 'Get user profile information',
          headers: {
            'Authorization': 'Bearer {token} (required)'
          },
          response: {
            user: 'object - User profile data',
            usage: 'object - Current usage statistics',
            subscription: 'object - Subscription details'
          }
        },
        {
          method: 'PUT',
          path: '/api/user/profile',
          description: 'Update user profile',
          headers: {
            'Authorization': 'Bearer {token} (required)',
            'Content-Type': 'application/json'
          },
          parameters: {
            name: 'string (optional) - User full name',
            email: 'string (optional) - User email address',
            bio: 'string (optional) - User bio'
          },
          response: {
            user: 'object - Updated user profile',
            message: 'string - Success message'
          }
        },
        {
          method: 'GET',
          path: '/api/user/stats',
          description: 'Get user usage statistics',
          headers: {
            'Authorization': 'Bearer {token} (required)'
          },
          response: {
            totalGenerations: 'number - Total content generations',
            todayGenerations: 'number - Generations today',
            totalFavorites: 'number - Total saved favorites',
            recentActivity: 'array - Recent user activity'
          }
        }
      ]
    },
    billing: {
      title: 'Billing & Subscriptions',
      description: 'Payment and subscription management endpoints',
      routes: [
        {
          method: 'POST',
          path: '/api/billing/create-checkout',
          description: 'Create Stripe checkout session',
          headers: {
            'Authorization': 'Bearer {token} (required)',
            'Content-Type': 'application/json'
          },
          parameters: {
            plan: 'string (required) - Subscription plan: pro, enterprise',
            billing: 'string (required) - Billing cycle: monthly, yearly',
            couponCode: 'string (optional) - Discount coupon code'
          },
          response: {
            checkoutUrl: 'string - Stripe checkout URL',
            sessionId: 'string - Checkout session ID'
          }
        },
        {
          method: 'POST',
          path: '/api/billing/validate-coupon',
          description: 'Validate discount coupon',
          headers: {
            'Authorization': 'Bearer {token} (required)',
            'Content-Type': 'application/json'
          },
          parameters: {
            code: 'string (required) - Coupon code to validate'
          },
          response: {
            valid: 'boolean - Whether coupon is valid',
            discount: 'object - Discount details',
            message: 'string - Validation message'
          }
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete API reference for integrating with Demotivation Station
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Endpoints
              </h3>
              <nav className="space-y-2">
                {Object.entries(endpoints).map(([key, endpoint]) => (
                  <button
                    key={key}
                    onClick={() => setActiveEndpoint(key)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeEndpoint === key
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {endpoint.title}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Quick Links
                </h4>
                <div className="space-y-2 text-sm">
                  <a href="#authentication" className="block text-indigo-600 dark:text-indigo-400 hover:underline">
                    Authentication Guide
                  </a>
                  <a href="#rate-limits" className="block text-indigo-600 dark:text-indigo-400 hover:underline">
                    Rate Limits
                  </a>
                  <a href="#errors" className="block text-indigo-600 dark:text-indigo-400 hover:underline">
                    Error Codes
                  </a>
                  <a href="#sdks" className="block text-indigo-600 dark:text-indigo-400 hover:underline">
                    SDKs & Libraries
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">
                  {endpoints[activeEndpoint].title}
                </h2>
                <p className="text-indigo-100 mt-2">
                  {endpoints[activeEndpoint].description}
                </p>
              </div>

              <div className="p-8">
                <div className="space-y-8">
                  {endpoints[activeEndpoint].routes.map((route, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          route.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                          route.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                          route.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}>
                          {route.method}
                        </span>
                        <code className="text-lg font-mono text-gray-900 dark:text-white">
                          {route.path}
                        </code>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {route.description}
                      </p>

                      {route.headers && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Headers</h4>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            {Object.entries(route.headers).map(([key, value]) => (
                              <div key={key} className="flex">
                                <code className="text-sm text-gray-900 dark:text-white mr-2">{key}:</code>
                                <code className="text-sm text-gray-600 dark:text-gray-300">{value}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {route.parameters && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Parameters</h4>
                          <div className="space-y-2">
                            {Object.entries(route.parameters).map(([key, value]) => (
                              <div key={key} className="flex flex-col sm:flex-row">
                                <code className="text-sm font-mono text-indigo-600 dark:text-indigo-400 sm:w-1/4 mb-1 sm:mb-0">
                                  {key}
                                </code>
                                <span className="text-sm text-gray-700 dark:text-gray-300 sm:w-3/4">
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Response</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <pre className="text-sm text-gray-900 dark:text-white overflow-x-auto">
                            {JSON.stringify(route.response, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Documentation Sections */}
            <div className="mt-8 space-y-8">
              <div id="authentication" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Authentication</h3>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p>All API requests require authentication using JWT tokens. Include the token in the Authorization header:</p>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                    <code>Authorization: Bearer YOUR_JWT_TOKEN</code>
                  </pre>
                  <p>Tokens are obtained through the login or register endpoints and are valid for 24 hours.</p>
                </div>
              </div>

              <div id="rate-limits" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rate Limits</h3>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ul>
                    <li><strong>Free Users:</strong> 10 requests per day</li>
                    <li><strong>Pro Users:</strong> Unlimited requests</li>
                    <li><strong>API Rate Limit:</strong> 100 requests per minute per IP</li>
                  </ul>
                  <p>Rate limit information is included in response headers:</p>
                  <ul>
                    <li><code>X-RateLimit-Limit</code> - Request limit per window</li>
                    <li><code>X-RateLimit-Remaining</code> - Requests remaining in window</li>
                    <li><code>X-RateLimit-Reset</code> - Time when limit resets</li>
                  </ul>
                </div>
              </div>

              <div id="errors" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error Codes</h3>
                <div className="space-y-4">
                  {[
                    { code: 400, message: 'Bad Request - Invalid parameters' },
                    { code: 401, message: 'Unauthorized - Invalid or missing token' },
                    { code: 403, message: 'Forbidden - Insufficient permissions' },
                    { code: 429, message: 'Too Many Requests - Rate limit exceeded' },
                    { code: 500, message: 'Internal Server Error - Server issue' }
                  ].map((error) => (
                    <div key={error.code} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-red-600 dark:text-red-400 font-mono font-semibold">
                        {error.code}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {error.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;
