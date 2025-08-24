const express = require('express');
const { body, validationResult } = require('express-validator');
const { paymentLimiter } = require('../middleware/rateLimit');
const router = express.Router();

// Mock Stripe integration (replace with actual Stripe in production)
const mockStripe = {
  plans: {
    free: { id: 'free', name: 'Free', price: 0, features: ['50 demotivations/month', '10 voice generations/month', '100 chat messages/month'] },
    pro: { id: 'pro', name: 'Pro', price: 9.99, features: ['1000 demotivations/month', '200 voice generations/month', '2000 chat messages/month', 'Priority support'] },
    enterprise: { id: 'enterprise', name: 'Enterprise', price: 29.99, features: ['Unlimited everything', 'Custom voices', 'API access', 'Priority support', 'Custom integrations'] }
  },
  customers: new Map(),
  subscriptions: new Map()
};

// Get billing information
router.get('/info', (req, res) => {
  try {
    const userId = req.user.id;
    
    // In production, fetch from Stripe and database
    const billingInfo = {
      subscription: {
        plan: 'free',
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false
      },
      paymentMethod: null,
      invoices: [],
      usage: {
        demotivations: { used: 5, limit: 50 },
        voices: { used: 2, limit: 10 },
        chats: { used: 25, limit: 100 }
      }
    };

    res.json({ billingInfo });

  } catch (error) {
    console.error('Billing info fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch billing information',
      details: 'Something went wrong retrieving your billing information'
    });
  }
});

// Get available plans
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        '50 demotivations per month',
        '10 voice generations per month',
        '100 chat messages per month',
        'Basic support'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 9.99,
      interval: 'month',
      features: [
        '1,000 demotivations per month',
        '200 voice generations per month',
        '2,000 chat messages per month',
        'Priority support',
        'Advanced voice options',
        'Export capabilities'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 29.99,
      interval: 'month',
      features: [
        'Unlimited demotivations',
        'Unlimited voice generations',
        'Unlimited chat messages',
        'Custom voice training',
        'API access',
        'Priority support',
        'Custom integrations',
        'Team management'
      ],
      popular: false
    }
  ];

  res.json({ plans });
});

// Create checkout session
router.post('/checkout', paymentLimiter, [
  body('planId').isIn(['pro', 'enterprise']).withMessage('Invalid plan selected'),
  body('couponCode').optional().isString().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { planId, couponCode } = req.body;
    const userId = req.user.id;

    // Mock Stripe checkout session creation
    const plan = mockStripe.plans[planId];
    if (!plan) {
      return res.status(400).json({
        error: 'Invalid plan',
        message: 'The selected plan does not exist'
      });
    }

    let discount = 0;
    let finalPrice = plan.price;

    // Apply coupon if provided
    if (couponCode) {
      const validCoupons = {
        'SAVE20': { discount: 0.2, type: 'percentage' },
        'FIRSTMONTH': { discount: plan.price, type: 'amount' },
        'STUDENT50': { discount: 0.5, type: 'percentage' }
      };

      const coupon = validCoupons[couponCode.toUpperCase()];
      if (coupon) {
        if (coupon.type === 'percentage') {
          discount = plan.price * coupon.discount;
        } else {
          discount = coupon.discount;
        }
        finalPrice = Math.max(0, plan.price - discount);
      }
    }

    // Mock checkout session
    const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const checkoutSession = {
      id: sessionId,
      url: `https://checkout.stripe.com/pay/${sessionId}`, // Mock URL
      planId,
      userId,
      originalPrice: plan.price,
      discount,
      finalPrice,
      couponCode,
      status: 'open',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    res.json({
      message: 'Checkout session created',
      sessionId,
      checkoutUrl: checkoutSession.url,
      planDetails: {
        name: plan.name,
        originalPrice: plan.price,
        discount,
        finalPrice,
        couponApplied: !!couponCode
      }
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      details: 'Something went wrong creating your checkout session'
    });
  }
});

// Validate coupon
router.post('/validate-coupon', [
  body('couponCode').isString().trim().isLength({ min: 1 }).withMessage('Coupon code is required'),
  body('planId').isIn(['pro', 'enterprise']).withMessage('Invalid plan selected')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { couponCode, planId } = req.body;
    const plan = mockStripe.plans[planId];

    const validCoupons = {
      'SAVE20': { 
        discount: 0.2, 
        type: 'percentage',
        description: '20% off your subscription',
        maxUses: 1000,
        usedCount: 45
      },
      'FIRSTMONTH': { 
        discount: plan.price, 
        type: 'amount',
        description: 'First month free',
        maxUses: 100,
        usedCount: 23
      },
      'STUDENT50': { 
        discount: 0.5, 
        type: 'percentage',
        description: '50% off for students',
        maxUses: 500,
        usedCount: 156
      }
    };

    const coupon = validCoupons[couponCode.toUpperCase()];
    
    if (!coupon) {
      return res.status(400).json({
        error: 'Invalid coupon',
        message: 'The coupon code is not valid or has expired'
      });
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = plan.price * coupon.discount;
    } else {
      discountAmount = coupon.discount;
    }

    const finalPrice = Math.max(0, plan.price - discountAmount);

    res.json({
      valid: true,
      coupon: {
        code: couponCode.toUpperCase(),
        description: coupon.description,
        discountAmount,
        finalPrice,
        type: coupon.type
      }
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    res.status(500).json({
      error: 'Failed to validate coupon',
      details: 'Something went wrong validating your coupon'
    });
  }
});

// Cancel subscription
router.post('/cancel', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // In production, cancel Stripe subscription
    // For now, just return success
    
    res.json({
      message: 'Subscription cancelled successfully',
      details: 'Your subscription will remain active until the end of the current billing period'
    });

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({
      error: 'Failed to cancel subscription',
      details: 'Something went wrong cancelling your subscription'
    });
  }
});

// Update payment method
router.post('/payment-method', [
  body('paymentMethodId').isString().withMessage('Payment method ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { paymentMethodId } = req.body;
    const userId = req.user.id;

    // In production, update payment method in Stripe
    res.json({
      message: 'Payment method updated successfully'
    });

  } catch (error) {
    console.error('Payment method update error:', error);
    res.status(500).json({
      error: 'Failed to update payment method',
      details: 'Something went wrong updating your payment method'
    });
  }
});

// Get billing history
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // In production, fetch from Stripe
    const invoices = [
      {
        id: 'inv_1',
        amount: 9.99,
        status: 'paid',
        description: 'Pro Plan - Monthly',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        downloadUrl: 'https://invoice.stripe.com/mock'
      }
    ];

    res.json({
      invoices,
      totalCount: invoices.length
    });

  } catch (error) {
    console.error('Billing history fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch billing history',
      details: 'Something went wrong retrieving your billing history'
    });
  }
});

// Webhook endpoint for Stripe events (in production)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // In production, verify Stripe webhook signature
    const event = req.body;

    // Handle different Stripe events
    switch (event.type) {
      case 'customer.subscription.created':
        // Handle new subscription
        break;
      case 'customer.subscription.updated':
        // Handle subscription update
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        break;
      case 'invoice.payment_succeeded':
        // Handle successful payment
        break;
      case 'invoice.payment_failed':
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      error: 'Webhook processing failed'
    });
  }
});

module.exports = router;
