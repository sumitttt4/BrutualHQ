import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { CheckIcon, StarIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../LoadingSpinner';

const PricingModal = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billing, setBilling] = useState('monthly'); // 'monthly' or 'yearly'
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(null);

  const { user, subscription } = useAuth();
  const { trackEvent, trackSubscription } = useAnalytics();

  if (!isOpen) return null;

  const plans = {
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: [
        '10 demotivations per day',
        'Basic AI responses',
        'Limited voice options',
        'Standard support'
      ],
      limitations: [
        'No priority support',
        'Watermarked exports',
        'Limited customization'
      ]
    },
    pro: {
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99.99 },
      popular: true,
      features: [
        'Unlimited demotivations',
        'Advanced AI responses',
        'All voice options',
        'Priority support',
        'Export without watermark',
        'Custom tone training',
        'Analytics dashboard',
        'API access'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: { monthly: 29.99, yearly: 299.99 },
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
        'White-label options',
        'SLA guarantees',
        'Custom AI training'
      ]
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const response = await fetch('/api/billing/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ code: couponCode })
      });

      const data = await response.json();
      if (response.ok) {
        setDiscount(data.discount);
        trackEvent('coupon_applied', { code: couponCode, discount: data.discount });
      } else {
        alert('Invalid coupon code');
      }
    } catch (error) {
      console.error('Coupon validation failed:', error);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!user) {
      alert('Please sign in to subscribe');
      return;
    }

    setLoading(true);
    trackSubscription('started', plan);

    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          plan,
          billing,
          couponCode: discount ? couponCode : null
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (plan) => {
    const basePrice = plans[plan].price[billing];
    if (discount) {
      return basePrice * (1 - discount.percentage / 100);
    }
    return basePrice;
  };

  const savings = billing === 'yearly' ? 
    plans[selectedPlan].price.monthly * 12 - plans[selectedPlan].price.yearly : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Choose Your Plan
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Upgrade to unlock unlimited demotivations and premium features
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                billing === 'monthly'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-6 py-2 rounded-lg transition-colors relative ${
                billing === 'yearly'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {Object.entries(plans).map(([planKey, plan]) => (
            <div
              key={planKey}
              className={`relative border-2 rounded-2xl p-6 ${
                plan.popular
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <StarIcon className="h-4 w-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${calculatePrice(planKey).toFixed(2)}
                  <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">
                    /{billing === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                {billing === 'yearly' && planKey !== 'free' && (
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                    Save ${savings.toFixed(2)} per year
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
                {plan.limitations?.map((limitation, index) => (
                  <li key={index} className="flex items-start opacity-60">
                    <span className="text-red-500 mr-3 mt-0.5">✗</span>
                    <span className="text-gray-500 dark:text-gray-400 line-through">{limitation}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => planKey === 'free' ? onClose() : handleSubscribe(planKey)}
                disabled={loading || (subscription?.plan === planKey && subscription?.status === 'active')}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  planKey === 'free'
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                    : plan.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900'
                } ${
                  subscription?.plan === planKey && subscription?.status === 'active'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {loading && selectedPlan === planKey ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner />
                    <span>Processing...</span>
                  </div>
                ) : subscription?.plan === planKey && subscription?.status === 'active' ? (
                  'Current Plan'
                ) : planKey === 'free' ? (
                  'Current Plan'
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Coupon Code */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Have a coupon code?
          </h4>
          <div className="flex gap-3">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
            />
            <button
              onClick={applyCoupon}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
          {discount && (
            <p className="text-green-600 dark:text-green-400 text-sm mt-2">
              ✓ {discount.percentage}% discount applied!
            </p>
          )}
        </div>

        {/* Features Comparison */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-8">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Frequently Asked Questions
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel anytime?
              </h5>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h5>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                All new users get full access to our free plan with 10 daily demotivations. Upgrade anytime for unlimited access.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h5>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We accept all major credit cards, PayPal, and other payment methods through Stripe's secure payment processing.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                Need help choosing?
              </h5>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Contact our support team at support@demotivationstation.com and we'll help you find the perfect plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
