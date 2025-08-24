const rateLimit = require('express-rate-limit');

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiting for AI generation endpoints
const demotivationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: (req) => {
    // Different limits based on user subscription
    if (req.user) {
      switch (req.user.subscription?.plan) {
        case 'enterprise':
          return 100;
        case 'pro':
          return 60;
        case 'free':
        default:
          return 10;
      }
    }
    return 5; // Anonymous users
  },
  message: {
    error: 'Rate limit exceeded for demotivation generation',
    suggestion: 'Upgrade your plan for higher limits'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? `user_${req.user.id}` : req.ip;
  }
});

// Voice generation rate limiting (more expensive)
const voiceLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: (req) => {
    if (req.user) {
      switch (req.user.subscription?.plan) {
        case 'enterprise':
          return 50;
        case 'pro':
          return 20;
        case 'free':
        default:
          return 3;
      }
    }
    return 1; // Anonymous users
  },
  message: {
    error: 'Rate limit exceeded for voice generation',
    suggestion: 'Voice generation is limited. Upgrade for more generations.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? `user_${req.user.id}` : req.ip;
  }
});

// Chat rate limiting
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: (req) => {
    if (req.user) {
      switch (req.user.subscription?.plan) {
        case 'enterprise':
          return 200;
        case 'pro':
          return 100;
        case 'free':
        default:
          return 30;
      }
    }
    return 10; // Anonymous users
  },
  message: {
    error: 'Rate limit exceeded for chat',
    suggestion: 'Too many chat messages. Please slow down or upgrade your plan.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? `user_${req.user.id}` : req.ip;
  }
});

// Authentication rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth attempts per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful requests
});

// Payment rate limiting
const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Limit payment attempts
  message: {
    error: 'Too many payment attempts, please try again later.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Admin endpoint rate limiting
const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit admin endpoints
  message: {
    error: 'Rate limit exceeded for admin operations',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  apiLimiter,
  demotivationLimiter,
  voiceLimiter,
  chatLimiter,
  authLimiter,
  paymentLimiter,
  adminLimiter
};
