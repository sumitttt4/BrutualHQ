const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { authLimiter } = require('../middleware/rateLimit');
const router = express.Router();

// Mock user database (replace with actual database)
const users = new Map();

// Helper function to generate JWT token
const generateToken = (userId, email, role = 'user') => {
  return jwt.sign(
    { 
      id: userId, 
      email, 
      role,
      subscription: { plan: 'free', status: 'active' }
    },
    process.env.JWT_SECRET || 'fallback_secret_key_for_development',
    { expiresIn: '7d' }
  );
};

// Register endpoint
router.post('/register', authLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
      subscription: {
        plan: 'free',
        status: 'active',
        usage: {
          demotivations: 0,
          voices: 0,
          chats: 0
        }
      },
      createdAt: new Date(),
      emailVerified: false,
      profile: {
        avatar: null,
        preferences: {
          theme: 'dark',
          notifications: true
        }
      }
    };

    users.set(email, user);

    // Generate token
    const token = generateToken(userId, email);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        role: 'user',
        subscription: user.subscription,
        emailVerified: false
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Something went wrong during registration'
    });
  }
});

// Login endpoint
router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscription: user.subscription,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Something went wrong during login'
    });
  }
});

// Google OAuth login (simplified mock)
router.post('/google', async (req, res) => {
  try {
    const { token: googleToken, email, firstName, lastName, avatar } = req.body;

    if (!googleToken || !email) {
      return res.status(400).json({
        error: 'Invalid Google token',
        message: 'Google authentication failed'
      });
    }

    // Check if user exists
    let user = users.get(email);
    
    if (!user) {
      // Create new user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      user = {
        id: userId,
        email,
        firstName: firstName || 'User',
        lastName: lastName || '',
        role: 'user',
        subscription: {
          plan: 'free',
          status: 'active',
          usage: {
            demotivations: 0,
            voices: 0,
            chats: 0
          }
        },
        createdAt: new Date(),
        emailVerified: true, // Google accounts are pre-verified
        profile: {
          avatar: avatar || null,
          preferences: {
            theme: 'dark',
            notifications: true
          }
        },
        authProvider: 'google'
      };
      
      users.set(email, user);
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    res.json({
      message: 'Google login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscription: user.subscription,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin
      },
      token
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      error: 'Google login failed',
      message: 'Something went wrong during Google authentication'
    });
  }
});

// Password reset request
router.post('/forgot-password', authLimiter, [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email } = req.body;

    // For demo purposes, always return success (don't reveal if email exists)
    res.json({
      message: 'If an account with this email exists, a password reset link has been sent.',
      email
    });

    // In production, you would:
    // 1. Check if user exists
    // 2. Generate reset token
    // 3. Send email with reset link
    // 4. Store reset token in database with expiration

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      error: 'Password reset failed',
      message: 'Something went wrong processing your request'
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authorization header is required'
      });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');
    
    // Find user to get latest data
    const user = Array.from(users.values()).find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'Invalid token'
      });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscription: user.subscription,
        emailVerified: user.emailVerified
      }
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please log in again'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Please log in again'
      });
    }

    console.error('Token verification error:', error);
    res.status(500).json({
      error: 'Verification failed',
      message: 'Something went wrong verifying your token'
    });
  }
});

module.exports = router;
