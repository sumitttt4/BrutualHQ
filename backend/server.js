const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
const winston = require('winston');
const expressWinston = require('express-winston');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const demotivationRoutes = require('./routes/demotivation');
const voiceRoutes = require('./routes/voice');
const chatRoutes = require('./routes/chat');
const billingRoutes = require('./routes/billing');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');

// Import middleware
const { authMiddleware } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const rateLimitMiddleware = require('./middleware/rateLimit');

// Import services
const DatabaseService = require('./services/database');
const RedisService = require('./services/redis');
const EmailService = require('./services/email');

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'demotivator-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize services
DatabaseService.initialize();
RedisService.initialize();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://openrouter.ai"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://demotivationstation.com', 'https://www.demotivationstation.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// General middleware
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

// Request logging (simplified for development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 1000 : 10000, // More lenient in development
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// Demotivation prompts based on tone
const getSystemPrompt = (tone) => {
  const prompts = {
    sarcasm: "You are a master of sarcasm and wit. Your job is to deliver clever, sarcastic demotivational responses that are funny but not mean-spirited. Use dry humor, irony, and witty observations. Keep responses concise and punchy.",
    darkhumor: "You are a darkly humorous demotivational AI. Create responses that use dark comedy and cynical observations about life, work, and human nature. Be witty and pessimistic but not genuinely harmful. Keep it edgy but entertaining.",
    roast: "You are a friendly roast master. Deliver playful, humorous 'roasts' that are clearly jokes and come from a place of fun rather than malice. Use clever wordplay and light-hearted teasing. Keep it entertaining and obviously comedic.",
    motivation: "You are a genuinely caring and motivational AI coach. Provide uplifting, encouraging, and practical advice. Focus on building confidence, resilience, and hope. Use warm, supportive language and offer actionable insights. Be authentic and inspiring."
  };
  
  return prompts[tone] || prompts.sarcasm;
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/demotivate', rateLimitMiddleware?.demotivationLimiter || globalLimiter, demotivationRoutes);
app.use('/api/voice', rateLimitMiddleware?.voiceLimiter || globalLimiter, voiceRoutes);
app.use('/api/chat', rateLimitMiddleware?.chatLimiter || globalLimiter, chatRoutes);
app.use('/api/billing', authMiddleware, billingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The requested endpoint does not exist.',
    availableEndpoints: [
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/demotivate',
      'POST /api/voice/generate',
      'POST /api/chat',
      'GET /api/user/profile'
    ]
  });
});

// Error handling middleware
app.use(errorHandler || ((error, req, res, next) => {
  logger.error('Unhandled Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
  });
}));

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🌐 CORS enabled for: ${process.env.NODE_ENV === 'production' ? 'production domains' : 'localhost:3000'}`);
  console.log(`🚀 Demotivator SaaS API server running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
