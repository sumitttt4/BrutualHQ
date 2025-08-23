# Feature Development Template

Use this template when implementing new features in the Demotivator application.

```javascript
/*
=============================
Feature: [Feature Name Here]
=============================
Instructions for GitHub Copilot:

1. Brief Description:
   - Explain what the feature does in 1–2 sentences.
   Example: "Generates demotivational messages using AI and plays them in the voice of a selected actor or sports person."

2. Frontend Requirements:
   - React + Tailwind CSS
   - Components: Input, Tone Selector, Voice Selector, Response Card
   - User actions: Type prompt, select tone, select voice, click "Generate"
   - Play audio returned from backend
   - Save favorite messages locally
   - Smooth animations and responsive layout
   - Multi-language support (optional)
   - No emojis

3. Backend Requirements:
   - Node.js + Express
   - Endpoint: /api/[feature]
   - Receives user input, tone, selected voice
   - Calls OpenRouter API for AI message
   - Calls 11 Labs TTS API for voice generation
   - Returns JSON with AI message and audio URL/base64
   - Error handling and clean JSON responses

4. Extra Notes:
   - Modular, clean code with separate frontend and backend components
   - Fully responsive for desktop and mobile
   - Optional: Loading indicator while AI and audio are generating
   - Optional: "Random voice" option
   - Optional: Social sharing buttons for messages/audio

5. Example Flow:
   - User selects tone and voice, types prompt
   - User clicks "Generate"
   - Backend generates AI message and audio
   - Frontend displays message and plays audio

6. GitHub Copilot Usage:
   - Insert this comment at the top of a new file
   - Below, start defining your main component or backend route
   - Copilot will use this comment to generate full, production-ready code

*/
```

## Usage Instructions:

1. **Copy the template comment** to the top of any new file you're creating
2. **Replace `[Feature Name Here]`** with your actual feature name
3. **Customize the requirements** based on your specific feature needs
4. **Start coding below the comment** - GitHub Copilot will use this context to generate appropriate code

## Current Project Architecture:

### Frontend Structure:
```
frontend/src/
├── components/
│   ├── Header.js
│   ├── Footer.js
│   ├── ToneSelector.js
│   └── ResponseCard.js
├── pages/
│   ├── Home.js
│   ├── Generator.js
│   ├── Gallery.js
│   ├── MotivationTwist.js
│   ├── Chat.js
│   └── NotFound.js
└── App.js
```

### Backend Structure:
```
backend/
├── server.js (main API endpoints)
├── package.json
└── .env.example
```

### Existing API Endpoints:
- `POST /api/demotivate` - Generate demotivational messages
- `POST /api/chat` - ChatGPT-style conversation with demotivation mode
- `GET /health` - Health check

### Design Guidelines:
- **No emojis** anywhere in the application
- **Professional gradients**: `bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100`
- **Glass morphism effects**: `backdrop-blur-sm bg-white/80`
- **Tailwind CSS** for all styling
- **Heroicons** for SVG icons
- **Responsive design** for mobile and desktop

This template will help you maintain consistency with the existing codebase while adding new features efficiently!
