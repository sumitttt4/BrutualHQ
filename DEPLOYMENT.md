# 🚀 Deployment Guide

This guide will help you deploy your Demotivation Station to the cloud.

## Quick Deploy Options

### Option 1: Deploy to Vercel (Recommended for Frontend)

**Frontend:**
1. Install Vercel CLI: `npm i -g vercel`
2. From the `frontend` directory: `vercel`
3. Follow the prompts
4. Update the API URL in your frontend to point to your backend

**Backend (using Vercel Functions):**
1. Move `backend/server.js` content to `api/demotivate.js` in your frontend
2. Deploy everything together to Vercel

### Option 2: Deploy to Render

**Backend:**
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Set root directory to `backend`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variable: `OPENROUTER_API_KEY`

**Frontend:**
1. Create a new Static Site
2. Connect your repository
3. Set root directory to `frontend`
4. Build command: `npm run build`
5. Publish directory: `build`

### Option 3: Deploy to Railway

**Backend:**
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select the backend folder
4. Add environment variables
5. Deploy

## Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
OPENROUTER_API_KEY=your_api_key_here
FRONTEND_URL=https://your-frontend-domain.com
```

## Custom Domain Setup

1. Buy a domain from any registrar
2. Point it to your deployed app
3. Enable HTTPS (usually automatic)

## Monitoring & Analytics

Consider adding:
- Google Analytics
- Error tracking (Sentry)
- Uptime monitoring
- Performance monitoring

## Cost Estimates

- **Vercel**: Free tier available
- **Render**: $7/month for backend
- **Railway**: $5/month for backend
- **Domain**: ~$10-15/year

## Scaling Considerations

- Add rate limiting for production
- Implement caching for API responses
- Use a CDN for static assets
- Monitor API usage and costs

---

Your Demotivation Station is ready to depress people worldwide! 🖤
