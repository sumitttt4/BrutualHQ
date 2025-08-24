const express = require('express');
const { body, validationResult } = require('express-validator');
const { requireRole } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimit');
const router = express.Router();

// Apply admin role requirement to all routes
router.use(requireRole('admin'));
router.use(adminLimiter);

// Get admin dashboard overview
router.get('/dashboard', async (req, res) => {
  try {
    // Mock admin dashboard data
    const dashboardData = {
      overview: {
        totalUsers: 1542,
        activeUsers: 856,
        newUsersToday: 23,
        revenue: {
          total: 15678.90,
          thisMonth: 4567.89,
          growth: '+12.3%'
        },
        systemStatus: {
          api: 'healthy',
          database: 'healthy',
          ai_service: 'healthy',
          uptime: '99.9%'
        }
      },
      recentActivity: [
        {
          type: 'user_registered',
          user: 'john.doe@example.com',
          timestamp: new Date(Date.now() - 300000).toISOString()
        },
        {
          type: 'subscription_upgraded',
          user: 'jane.smith@example.com',
          plan: 'pro',
          timestamp: new Date(Date.now() - 600000).toISOString()
        },
        {
          type: 'high_usage_alert',
          user: 'power.user@example.com',
          details: 'Exceeded rate limit',
          timestamp: new Date(Date.now() - 900000).toISOString()
        }
      ],
      alerts: [
        {
          id: 'alert_1',
          type: 'warning',
          message: 'API usage approaching monthly limit',
          timestamp: new Date(Date.now() - 1200000).toISOString()
        }
      ]
    };

    res.json({ dashboardData });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      details: 'Something went wrong retrieving admin dashboard data'
    });
  }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, role, subscription } = req.query;
    const offset = (page - 1) * limit;

    // Mock user data (in production, fetch from database with filters)
    const users = [
      {
        id: 'user_1',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        subscription: { plan: 'pro', status: 'active' },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'user_2',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'user',
        subscription: { plan: 'free', status: 'active' },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      }
    ];

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(users.length / limit),
        totalUsers: users.length,
        hasNext: page * limit < users.length,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Admin users fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      details: 'Something went wrong retrieving user data'
    });
  }
});

// Get specific user details
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Mock user details (in production, fetch from database)
    const userDetails = {
      id: userId,
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      subscription: {
        plan: 'pro',
        status: 'active',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      usage: {
        demotivations: { used: 234, limit: 1000 },
        voices: { used: 45, limit: 200 },
        chats: { used: 567, limit: 2000 }
      },
      activity: [
        {
          type: 'login',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          ip: '192.168.1.1'
        },
        {
          type: 'demotivation_generated',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          details: { tone: 'sarcasm' }
        }
      ],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isActive: true
    };

    res.json({ user: userDetails });

  } catch (error) {
    console.error('Admin user details error:', error);
    res.status(500).json({
      error: 'Failed to fetch user details',
      details: 'Something went wrong retrieving user details'
    });
  }
});

// Update user (ban, unban, change role, etc.)
router.put('/users/:userId', [
  body('action').isIn(['ban', 'unban', 'promote', 'demote', 'reset_usage']).withMessage('Invalid action'),
  body('reason').optional().isString().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { userId } = req.params;
    const { action, reason } = req.body;
    const adminId = req.user.id;

    // In production, update user in database and log admin action
    const actionResult = {
      userId,
      action,
      reason,
      performedBy: adminId,
      timestamp: new Date().toISOString()
    };

    // Mock action execution
    let message = '';
    switch (action) {
      case 'ban':
        message = 'User has been banned';
        break;
      case 'unban':
        message = 'User has been unbanned';
        break;
      case 'promote':
        message = 'User has been promoted to admin';
        break;
      case 'demote':
        message = 'User has been demoted to regular user';
        break;
      case 'reset_usage':
        message = 'User usage has been reset';
        break;
    }

    res.json({
      message,
      actionResult
    });

  } catch (error) {
    console.error('Admin user update error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      details: 'Something went wrong updating the user'
    });
  }
});

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    const { period = '24h' } = req.query;

    // Mock system stats
    const stats = {
      api: {
        totalRequests: 156789,
        requestsPerMinute: 45,
        averageResponseTime: '234ms',
        errorRate: '0.12%',
        uptime: '99.97%'
      },
      usage: {
        demotivations: {
          total: 45678,
          today: 1234,
          peak: 89,
          averagePerUser: 5.6
        },
        voices: {
          total: 12345,
          today: 345,
          peak: 23,
          averagePerUser: 1.8
        },
        chats: {
          total: 34567,
          today: 890,
          peak: 67,
          averagePerUser: 4.2
        }
      },
      infrastructure: {
        serverLoad: '23%',
        memoryUsage: '1.2GB / 4GB',
        diskUsage: '45GB / 100GB',
        networkBandwidth: '12.5 Mbps'
      },
      costs: {
        aiApiCosts: 234.56,
        infrastructureCosts: 89.12,
        totalMonthly: 1234.56
      }
    };

    res.json({ stats, period });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch system statistics',
      details: 'Something went wrong retrieving system statistics'
    });
  }
});

// System configuration
router.get('/config', async (req, res) => {
  try {
    // Mock system configuration
    const config = {
      rateLimits: {
        demotivation: { free: 10, pro: 60, enterprise: 100 },
        voice: { free: 3, pro: 20, enterprise: 50 },
        chat: { free: 30, pro: 100, enterprise: 200 }
      },
      pricing: {
        pro: { price: 9.99, currency: 'USD' },
        enterprise: { price: 29.99, currency: 'USD' }
      },
      features: {
        voiceGeneration: true,
        chatMode: true,
        analyticsTracking: true,
        customVoices: false
      },
      maintenance: {
        scheduled: false,
        message: null,
        startTime: null,
        endTime: null
      }
    };

    res.json({ config });

  } catch (error) {
    console.error('Admin config error:', error);
    res.status(500).json({
      error: 'Failed to fetch configuration',
      details: 'Something went wrong retrieving system configuration'
    });
  }
});

// Update system configuration
router.put('/config', [
  body('rateLimits').optional().isObject(),
  body('pricing').optional().isObject(),
  body('features').optional().isObject(),
  body('maintenance').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { rateLimits, pricing, features, maintenance } = req.body;
    const adminId = req.user.id;

    // In production, update configuration in database
    const configUpdate = {
      rateLimits,
      pricing,
      features,
      maintenance,
      updatedBy: adminId,
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: 'Configuration updated successfully',
      configUpdate
    });

  } catch (error) {
    console.error('Admin config update error:', error);
    res.status(500).json({
      error: 'Failed to update configuration',
      details: 'Something went wrong updating system configuration'
    });
  }
});

// Get audit logs
router.get('/audit', async (req, res) => {
  try {
    const { page = 1, limit = 50, action, userId, dateFrom, dateTo } = req.query;

    // Mock audit logs
    const auditLogs = [
      {
        id: 'audit_1',
        action: 'user_banned',
        performedBy: req.user.id,
        targetUser: 'user_123',
        reason: 'Violation of terms of service',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        metadata: { ip: '192.168.1.1' }
      },
      {
        id: 'audit_2',
        action: 'config_updated',
        performedBy: req.user.id,
        changes: { 'rateLimits.free': '10 -> 15' },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        metadata: { ip: '192.168.1.1' }
      }
    ];

    res.json({
      auditLogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(auditLogs.length / limit),
        totalLogs: auditLogs.length
      }
    });

  } catch (error) {
    console.error('Admin audit logs error:', error);
    res.status(500).json({
      error: 'Failed to fetch audit logs',
      details: 'Something went wrong retrieving audit logs'
    });
  }
});

module.exports = router;
