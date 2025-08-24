# Demotivation Station Backend API

A comprehensive production-ready SaaS backend for the Demotivation Station platform, featuring AI-powered demotivational content generation, voice synthesis, chat functionality, user authentication, billing, and analytics.

## 🚀 Features

### Core Functionality
- **AI-Powered Content Generation**: Multiple demotivation tones (sarcasm, dark humor, brutal honesty, etc.)
- **Voice Generation**: Text-to-speech with multiple voice options and tones
- **Chat System**: Interactive AI chat with both helpful and demotivational modes
- **Content History**: Track and favorite generated content

### Authentication & Security
- **JWT-based Authentication**: Secure token-based auth with refresh tokens
- **Social Login**: Google OAuth integration
- **Password Security**: Bcrypt hashing with configurable rounds
- **Rate Limiting**: Comprehensive rate limiting per feature and user tier
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Robust request validation and sanitization

### Subscription & Billing
- **Multi-tier Plans**: Free, Pro, and Enterprise subscription tiers
- **Stripe Integration**: Secure payment processing with webhooks
- **Usage Tracking**: Monitor and limit feature usage per plan
- **Coupon System**: Discount codes and promotional pricing
- **Billing History**: Complete invoice and payment tracking

### User Management
- **Profile Management**: Complete user profile and preferences
- **Usage Analytics**: Personal usage statistics and achievements
- **Admin Panel**: Comprehensive admin dashboard and user management
- **Audit Logging**: Track all admin actions and system changes

### Infrastructure
- **Database Integration**: PostgreSQL support with connection pooling
- **Redis Caching**: Performance optimization and session management
- **Email Service**: Transactional emails for onboarding and notifications
- **Logging**: Structured logging with Winston and file rotation
- **Health Monitoring**: System health checks and uptime monitoring

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm 8+
- PostgreSQL 12+ (recommended)
- Redis 6+ (optional but recommended)

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration values
   ```

3. **Database Setup** (if using PostgreSQL)
   ```bash
   # Create database and run migrations
   npm run migrate
   
   # Seed initial data (optional)
   npm run seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Start Production Server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

#### Required
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret key for JWT tokens
- `OPENROUTER_API_KEY`: API key for AI service

#### Database (Optional - falls back to mock)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

#### Redis (Optional - falls back to mock)
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`

#### Email (Optional)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`

#### Stripe (Required for billing)
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

#### OAuth (Optional)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

See `.env.example` for complete configuration options.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/forgot-password` - Password reset request
- `GET /api/auth/verify` - Token verification

### Content Generation
- `POST /api/demotivate` - Generate demotivational content
- `POST /api/demotivate/roast` - Generate roast content
- `GET /api/demotivate/tones` - Get available tones
- `GET /api/demotivate/history` - Get generation history

### Voice Generation
- `POST /api/voice/generate` - Generate voice content
- `GET /api/voice/voices` - Get available voices
- `GET /api/voice/history` - Get voice history

### Chat System
- `POST /api/chat` - Send chat message
- `POST /api/chat/session` - Create chat session
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/session/:id` - Delete chat session

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password
- `GET /api/user/usage` - Get usage statistics
- `GET /api/user/favorites` - Get favorites
- `POST /api/user/favorites` - Add to favorites
- `DELETE /api/user/account` - Delete account

### Billing & Subscriptions
- `GET /api/billing/info` - Get billing information
- `GET /api/billing/plans` - Get available plans
- `POST /api/billing/checkout` - Create checkout session
- `POST /api/billing/validate-coupon` - Validate coupon code
- `POST /api/billing/cancel` - Cancel subscription
- `GET /api/billing/history` - Get billing history

### Analytics
- `POST /api/analytics/track` - Track events
- `POST /api/analytics/pageview` - Track page views
- `POST /api/analytics/action` - Track user actions
- `GET /api/analytics/user` - Get user analytics
- `GET /api/analytics/data` - Get system analytics (admin)

### Admin Panel
- `GET /api/admin/dashboard` - Admin dashboard overview
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user (ban/unban/etc.)
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/config` - System configuration
- `PUT /api/admin/config` - Update configuration
- `GET /api/admin/audit` - Audit logs

### System
- `GET /health` - Health check endpoint

## 🔒 Security Features

### Rate Limiting
- Global rate limiting (1000 requests/15min in production)
- Feature-specific limits based on subscription tier
- User-based rate limiting for authenticated endpoints
- IP-based rate limiting for anonymous users

### Data Protection
- Password hashing with bcrypt (12 rounds)
- JWT tokens with configurable expiration
- Input validation and sanitization
- SQL injection prevention
- XSS protection with helmet middleware

### CORS Configuration
- Environment-specific origin allowlists
- Credential support for authenticated requests
- Configurable allowed headers and methods

## 📊 Monitoring & Analytics

### Health Monitoring
- `/health` endpoint for uptime monitoring
- Database connection health checks
- Redis connection status
- Service dependency monitoring

### Logging
- Structured JSON logging with Winston
- Separate error and combined log files
- Configurable log levels
- Request/response logging in development

### Analytics
- User action tracking
- Feature usage analytics
- Performance metrics
- Error rate monitoring

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Production Checklist
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up Redis for caching
4. Configure email service (SendGrid/SES)
5. Set up Stripe webhooks
6. Configure monitoring (Sentry/DataDog)
7. Set up SSL certificates
8. Configure reverse proxy (nginx)

### Docker Deployment
```bash
# Build image
docker build -t demotivator-backend .

# Run container
docker run -p 5000:5000 --env-file .env demotivator-backend
```

### Environment-specific configurations
- **Development**: Mock services, verbose logging, CORS allowing localhost
- **Staging**: Reduced rate limits, test payment processing
- **Production**: Strict security, real payment processing, monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Documentation: [docs.demotivationstation.com](https://docs.demotivationstation.com)
- Email: support@demotivationstation.com
- GitHub Issues: [github.com/demotivation-station/backend](https://github.com/demotivation-station/backend)

---

Made with ❤️ (and a healthy dose of sarcasm) by the Demotivation Station Team
