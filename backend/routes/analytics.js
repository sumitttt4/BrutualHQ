const express = require('express');
const { body, validationResult } = require('express-validator');
const { optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Track events (can be called with or without authentication)
router.post('/track', optionalAuth, [
  body('event').isString().trim().isLength({ min: 1 }).withMessage('Event name is required'),
  body('properties').optional().isObject().withMessage('Properties must be an object')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { event, properties = {} } = req.body;
    const userId = req.user?.id;
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.connection.remoteAddress;

    // Create analytics event
    const analyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      event,
      properties,
      userId,
      timestamp: new Date().toISOString(),
      metadata: {
        userAgent,
        ip: ip.replace(/^.*:/, ''), // Remove IPv6 prefix if present
        referrer: req.headers.referer,
        sessionId: properties.sessionId
      }
    };

    // In production, send to analytics service (Google Analytics, Mixpanel, etc.)
    console.log('Analytics Event:', JSON.stringify(analyticsEvent, null, 2));

    res.json({
      success: true,
      eventId: analyticsEvent.id
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({
      error: 'Failed to track event',
      details: 'Something went wrong tracking your event'
    });
  }
});

// Get analytics data (admin only)
router.get('/data', async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin access required'
      });
    }

    const { period = '7d', metric = 'all' } = req.query;

    // Mock analytics data (in production, fetch from analytics service)
    const analyticsData = {
      overview: {
        totalUsers: 1542,
        activeUsers: 856,
        newUsers: 123,
        revenue: 4567.89,
        conversionRate: 3.2
      },
      usage: {
        demotivations: {
          total: 15420,
          daily: [120, 145, 134, 156, 189, 167, 201],
          popular_tones: [
            { tone: 'sarcasm', count: 6842 },
            { tone: 'brutalhonesty', count: 4521 },
            { tone: 'darkhumor', count: 2876 },
            { tone: 'roast', count: 1181 }
          ]
        },
        voices: {
          total: 3421,
          daily: [45, 52, 48, 61, 67, 58, 71],
          popular_voices: [
            { voice: 'gordon-ramsay', count: 1245 },
            { voice: 'morgan-freeman', count: 987 },
            { voice: 'samuel-jackson', count: 654 },
            { voice: 'british-butler', count: 535 }
          ]
        },
        chats: {
          total: 8945,
          daily: [89, 112, 98, 134, 156, 142, 167],
          average_length: 4.2
        }
      },
      subscriptions: {
        free: 1234,
        pro: 267,
        enterprise: 41,
        churn_rate: 2.3,
        monthly_revenue: 3456.78
      },
      geography: [
        { country: 'United States', users: 642 },
        { country: 'United Kingdom', users: 287 },
        { country: 'Canada', users: 156 },
        { country: 'Australia', users: 134 },
        { country: 'Germany', users: 98 }
      ],
      devices: {
        desktop: 867,
        mobile: 542,
        tablet: 133
      },
      referrers: [
        { source: 'Direct', visits: 456 },
        { source: 'Google', visits: 342 },
        { source: 'Twitter', visits: 189 },
        { source: 'Reddit', visits: 134 },
        { source: 'Facebook', visits: 87 }
      ]
    };

    res.json({
      period,
      data: analyticsData,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics data fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics data',
      details: 'Something went wrong retrieving analytics data'
    });
  }
});

// Track page views
router.post('/pageview', optionalAuth, [
  body('page').isString().trim().isLength({ min: 1 }).withMessage('Page is required'),
  body('title').optional().isString().trim()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { page, title } = req.body;
    const userId = req.user?.id;

    const pageviewEvent = {
      id: `pageview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'pageview',
      page,
      title,
      userId,
      timestamp: new Date().toISOString(),
      metadata: {
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer
      }
    };

    // In production, send to analytics service
    console.log('Pageview:', JSON.stringify(pageviewEvent, null, 2));

    res.json({
      success: true,
      eventId: pageviewEvent.id
    });

  } catch (error) {
    console.error('Pageview tracking error:', error);
    res.status(500).json({
      error: 'Failed to track pageview',
      details: 'Something went wrong tracking the pageview'
    });
  }
});

// Track user actions
router.post('/action', optionalAuth, [
  body('action').isString().trim().isLength({ min: 1 }).withMessage('Action is required'),
  body('category').optional().isString().trim(),
  body('label').optional().isString().trim(),
  body('value').optional().isNumeric()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { action, category, label, value } = req.body;
    const userId = req.user?.id;

    const actionEvent = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'action',
      action,
      category,
      label,
      value,
      userId,
      timestamp: new Date().toISOString()
    };

    // In production, send to analytics service
    console.log('Action:', JSON.stringify(actionEvent, null, 2));

    res.json({
      success: true,
      eventId: actionEvent.id
    });

  } catch (error) {
    console.error('Action tracking error:', error);
    res.status(500).json({
      error: 'Failed to track action',
      details: 'Something went wrong tracking the action'
    });
  }
});

// Get user analytics (for authenticated users)
router.get('/user', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to view your analytics'
      });
    }

    const userId = req.user.id;

    // Mock user analytics (in production, fetch from database)
    const userAnalytics = {
      overview: {
        joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalSessions: 42,
        avgSessionDuration: '8m 34s',
        favoriteFeature: 'demotivation'
      },
      usage: {
        demotivations: {
          total: 156,
          thisMonth: 23,
          favoriteTone: 'sarcasm'
        },
        voices: {
          total: 34,
          thisMonth: 8,
          favoriteVoice: 'gordon-ramsay'
        },
        chats: {
          total: 89,
          thisMonth: 15,
          avgLength: 3.8
        }
      },
      streaks: {
        current: 7,
        longest: 12,
        total: 28
      },
      achievements: [
        {
          id: 'first_demotivation',
          name: 'First Steps',
          description: 'Generated your first demotivation',
          unlockedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'voice_explorer',
          name: 'Voice Explorer',
          description: 'Tried 5 different voices',
          unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };

    res.json({
      userAnalytics,
      userId
    });

  } catch (error) {
    console.error('User analytics fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch user analytics',
      details: 'Something went wrong retrieving your analytics'
    });
  }
});

module.exports = router;
