const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock user database (replace with actual database)
const users = new Map();

// Get user profile
router.get('/profile', (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find user (in production, query database)
    const user = Array.from(users.values()).find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Your account could not be found'
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscription: user.subscription,
        emailVerified: user.emailVerified,
        profile: user.profile,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      details: 'Something went wrong retrieving your profile'
    });
  }
});

// Update user profile
router.put('/profile', [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('preferences.theme').optional().isIn(['light', 'dark']).withMessage('Invalid theme'),
  body('preferences.notifications').optional().isBoolean().withMessage('Notifications must be boolean')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.user.id;
    const { firstName, lastName, preferences } = req.body;
    
    // Find user
    const user = Array.from(users.values()).find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Your account could not be found'
      });
    }

    // Update user data
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (preferences) {
      user.profile.preferences = {
        ...user.profile.preferences,
        ...preferences
      };
    }

    user.updatedAt = new Date();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      details: 'Something went wrong updating your profile'
    });
  }
});

// Change password
router.put('/password', [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = Array.from(users.values()).find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Your account could not be found'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    user.updatedAt = new Date();

    res.json({
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      error: 'Failed to change password',
      details: 'Something went wrong changing your password'
    });
  }
});

// Get user usage statistics
router.get('/usage', (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find user
    const user = Array.from(users.values()).find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Your account could not be found'
      });
    }

    // In production, calculate from database
    const usage = {
      demotivations: {
        used: user.subscription?.usage?.demotivations || 0,
        limit: user.subscription?.plan === 'free' ? 50 : 
               user.subscription?.plan === 'pro' ? 1000 : -1,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      voices: {
        used: user.subscription?.usage?.voices || 0,
        limit: user.subscription?.plan === 'free' ? 10 : 
               user.subscription?.plan === 'pro' ? 200 : -1,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      chats: {
        used: user.subscription?.usage?.chats || 0,
        limit: user.subscription?.plan === 'free' ? 100 : 
               user.subscription?.plan === 'pro' ? 2000 : -1,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    };

    res.json({ usage });

  } catch (error) {
    console.error('Usage fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch usage',
      details: 'Something went wrong retrieving your usage statistics'
    });
  }
});

// Get user favorites
router.get('/favorites', (req, res) => {
  try {
    const userId = req.user.id;
    
    // In production, fetch from database
    const favorites = [
      {
        id: 'fav_1',
        type: 'demotivation',
        content: 'Your dreams are just unrealistic expectations waiting to disappoint you.',
        tone: 'sarcasm',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'fav_2',
        type: 'roast',
        content: 'Another day, another person thinking they\'re special.',
        tone: 'darkhumor',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    res.json({ 
      favorites,
      totalCount: favorites.length
    });

  } catch (error) {
    console.error('Favorites fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch favorites',
      details: 'Something went wrong retrieving your favorites'
    });
  }
});

// Add to favorites
router.post('/favorites', [
  body('type').isIn(['demotivation', 'roast', 'voice']).withMessage('Invalid favorite type'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('tone').optional().isString()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.user.id;
    const { type, content, tone } = req.body;
    
    // In production, save to database
    const favorite = {
      id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      content,
      tone,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      message: 'Added to favorites',
      favorite
    });

  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      error: 'Failed to add favorite',
      details: 'Something went wrong adding to favorites'
    });
  }
});

// Delete account
router.delete('/account', [
  body('password').exists().withMessage('Password is required to delete account')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.user.id;
    const { password } = req.body;
    
    // Find user
    const user = Array.from(users.values()).find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Your account could not be found'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Password is incorrect'
      });
    }

    // Delete user (in production, mark as deleted and cleanup data)
    users.delete(user.email);

    res.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete account',
      details: 'Something went wrong deleting your account'
    });
  }
});

module.exports = router;
