const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const verifyToken = promisify(jwt.verify);

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided or invalid token format'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = await verifyToken(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');
    
    // Add user info to request
    req.user = decoded;
    
    next();
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

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Authentication failed'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      if (token) {
        const decoded = await verifyToken(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');
        req.user = decoded;
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't return errors, just continue without user
    next();
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  optionalAuth,
  requireRole
};
