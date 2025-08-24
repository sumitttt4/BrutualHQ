const express = require('express');
const { body, validationResult } = require('express-validator');
const { voiceLimiter } = require('../middleware/rateLimit');
const { optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Voice generation endpoint
router.post('/generate', optionalAuth, voiceLimiter, [
  body('input')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Input must be between 1 and 300 characters'),
  body('tone')
    .isIn(['sarcasm', 'dark-humor', 'brutal-honesty', 'pessimistic', 'existential'])
    .withMessage('Invalid tone selected'),
  body('voice')
    .isIn(['morgan-freeman', 'gordon-ramsay', 'david-attenborough', 'samuel-jackson', 'british-butler', 'drill-sergeant', 'therapist', 'random'])
    .withMessage('Invalid voice selected')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { input, tone, voice } = req.body;
    const userId = req.user?.id;

    // Tone-specific system prompts
    const tonePrompts = {
      'sarcasm': 'You are a master of sarcasm. Create witty, cutting observations that point out the unrealistic nature of dreams and plans. Use clever wordplay and irony.',
      'dark-humor': 'You are a dark comedian. Use cynical wit with a twisted sense of humor. Make observations about failure and disappointment with dark comedic timing.',
      'brutal-honesty': 'You are brutally honest. Give harsh, unfiltered truths about reality. No sugar-coating, just direct facts about why things probably won\'t work out.',
      'pessimistic': 'You are deeply pessimistic. Always assume the worst outcome. Point out all the ways things can and will go wrong. Expect disappointment.',
      'existential': 'You are an existential philosopher. Question the meaning and purpose of their endeavors. Make them wonder why anything matters in the grand scheme of things.'
    };

    // Generate AI message first
    const fetch = (await import('node-fetch')).default;
    
    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || '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'}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `${tonePrompts[tone] || tonePrompts['sarcasm']} 

Create a demotivational message that's 2-3 sentences long, perfect for text-to-speech. Make it conversational and natural to speak aloud. Avoid complex punctuation that doesn't translate well to speech.

Rules:
- 2-3 sentences maximum
- Natural speaking rhythm
- Clear and impactful delivery
- Avoid quotation marks or complex formatting
- Make it sound good when spoken aloud`
          },
          {
            role: 'user',
            content: `Create a demotivational message about: "${input.trim()}"`
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      })
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.text();
      console.error('OpenRouter AI Error:', errorData);
      return res.status(500).json({ 
        error: 'Failed to generate demotivational message',
        details: aiResponse.status === 401 ? 'AI API key invalid' : 'AI service temporarily unavailable'
      });
    }

    const aiData = await aiResponse.json();
    
    if (!aiData.choices || !aiData.choices[0] || !aiData.choices[0].message) {
      return res.status(500).json({ 
        error: 'Invalid response from AI service' 
      });
    }

    const message = aiData.choices[0].message.content.trim();

    // Voice ID mapping for browser TTS
    const voiceNames = {
      'morgan-freeman': 'Microsoft David - English (United States)',
      'gordon-ramsay': 'Microsoft George - English (United Kingdom)', 
      'david-attenborough': 'Microsoft Hazel - English (Great Britain)',
      'samuel-jackson': 'Microsoft David - English (United States)',
      'british-butler': 'Microsoft George - English (United Kingdom)',
      'drill-sergeant': 'Microsoft David - English (United States)',
      'therapist': 'Microsoft Zira - English (United States)',
      'random': 'Microsoft David - English (United States)'
    };

    // Track usage for authenticated users
    if (userId) {
      console.log(`User ${userId} generated voice: ${voice}, tone: ${tone}`);
    }

    // Return the message and voice info for frontend TTS
    res.json({ 
      message: message,
      voice: voice,
      voiceName: voiceNames[voice] || voiceNames['morgan-freeman'],
      tone: tone,
      useBrowserTTS: true, // Signal frontend to use browser TTS
      usage: {
        remainingGenerations: req.user?.subscription?.plan === 'free' ? 10 : 200 // Mock data
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Voice generation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Something went wrong generating your voice demotivation'
    });
  }
});

// Get available voices
router.get('/voices', (req, res) => {
  const voices = [
    {
      id: 'morgan-freeman',
      name: 'Morgan Freeman',
      description: 'Wise, calming, and authoritative',
      accent: 'American',
      gender: 'Male'
    },
    {
      id: 'gordon-ramsay',
      name: 'Gordon Ramsay',
      description: 'Harsh, direct, and brutally honest',
      accent: 'British',
      gender: 'Male'
    },
    {
      id: 'david-attenborough',
      name: 'David Attenborough',
      description: 'Sophisticated, documentary-style narration',
      accent: 'British',
      gender: 'Male'
    },
    {
      id: 'samuel-jackson',
      name: 'Samuel L. Jackson',
      description: 'Intense, commanding presence',
      accent: 'American',
      gender: 'Male'
    },
    {
      id: 'british-butler',
      name: 'British Butler',
      description: 'Polite yet condescending',
      accent: 'British',
      gender: 'Male'
    },
    {
      id: 'drill-sergeant',
      name: 'Drill Sergeant',
      description: 'Loud, intimidating, and harsh',
      accent: 'American',
      gender: 'Male'
    },
    {
      id: 'therapist',
      name: 'Therapist',
      description: 'Calm, understanding, yet brutally honest',
      accent: 'American',
      gender: 'Female'
    },
    {
      id: 'random',
      name: 'Random',
      description: 'Surprise me with any voice',
      accent: 'Varies',
      gender: 'Varies'
    }
  ];

  res.json({ voices });
});

// Get voice generation history
router.get('/history', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to view your voice history'
      });
    }

    // In production, fetch from database
    const history = [
      {
        id: '1',
        input: 'I want to be a movie star',
        message: 'Ah, another dreamer who thinks Hollywood is waiting for their "unique" talent. The odds of making it as a movie star are about the same as winning the lottery, but with more rejection and broken dreams.',
        voice: 'gordon-ramsay',
        tone: 'sarcasm',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    res.json({
      history,
      totalCount: history.length
    });

  } catch (error) {
    console.error('Voice history fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch voice history',
      details: 'Something went wrong retrieving your voice history'
    });
  }
});

module.exports = router;
