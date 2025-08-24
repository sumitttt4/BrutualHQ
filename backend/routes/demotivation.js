const express = require('express');
const { body, validationResult } = require('express-validator');
const { demotivationLimiter } = require('../middleware/rateLimit');
const { optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Helper function to get system prompt
const getSystemPrompt = (tone) => {
  const prompts = {
    sarcasm: "You are a master of sarcasm and wit. Your job is to deliver clever, sarcastic demotivational responses that are funny but not mean-spirited. Use dry humor, irony, and witty observations. Keep responses concise and punchy.",
    darkhumor: "You are a darkly humorous demotivational AI. Create responses that use dark comedy and cynical observations about life, work, and human nature. Be witty and pessimistic but not genuinely harmful. Keep it edgy but entertaining.",
    roast: "You are a friendly roast master. Deliver playful, humorous 'roasts' that are clearly jokes and come from a place of fun rather than malice. Use clever wordplay and light-hearted teasing. Keep it entertaining and obviously comedic.",
    motivation: "You are a genuinely caring and motivational AI coach. Provide uplifting, encouraging, and practical advice. Focus on building confidence, resilience, and hope. Use warm, supportive language and offer actionable insights. Be authentic and inspiring.",
    brutalhonesty: "You are brutally honest but constructive. Provide direct, unfiltered feedback that points out harsh realities while offering practical insights. Be straightforward without being cruel.",
    pessimistic: "You are deeply pessimistic but intellectually thoughtful. Focus on potential problems, worst-case scenarios, and the likelihood of failure while maintaining a philosophical perspective."
  };
  
  return prompts[tone] || prompts.sarcasm;
};

// Main demotivation endpoint
router.post('/', optionalAuth, demotivationLimiter, [
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters'),
  body('tone')
    .optional()
    .isIn(['sarcasm', 'darkhumor', 'roast', 'motivation', 'brutalhonesty', 'pessimistic'])
    .withMessage('Invalid tone selected')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { message, tone = 'sarcasm', context } = req.body;
    const userId = req.user?.id;

    // Check usage limits for authenticated users
    if (userId) {
      // In production, you would check the database for usage limits
      // For now, we'll use the rate limiter
    }

    const systemPrompt = getSystemPrompt(tone);
    
    // Import fetch dynamically
    const fetch = (await import('node-fetch')).default;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.warn('OPENROUTER_API_KEY is not set in environment');
    }

    const makeRequest = async () => {
      return fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey || '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'}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `${context ? `Context: ${context}\n\n` : ''}${message}` }
          ],
          max_tokens: 200,
          temperature: 0.9
        })
      });
    };

    // Retry transient errors (429 / 5xx) once with backoff
    let response;
    let attempt = 0;
    const maxAttempts = 2;
    while (attempt < maxAttempts) {
      attempt += 1;
      try {
        response = await makeRequest();
      } catch (err) {
        console.error(`Network error calling OpenRouter (attempt ${attempt}):`, err.message || err);
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, 500 * attempt));
          continue;
        }
        // fallthrough to error handler below
      }

      if (response && response.ok) break;

      // If non-ok and retryable, wait and retry
      if (response && (response.status >= 500 || response.status === 429) && attempt < maxAttempts) {
        console.warn(`OpenRouter returned ${response.status} (attempt ${attempt}), retrying...`);
        await new Promise((r) => setTimeout(r, 500 * attempt));
        continue;
      }

      // otherwise break and handle
      break;
    }

    if (!response) {
      console.error('No response from OpenRouter after attempts');
      return res.status(502).json({ error: 'No response from AI provider' });
    }

    if (!response.ok) {
      const text = await response.text().catch(() => 'Unable to read error body');
      let details = text;
      try {
        const parsed = JSON.parse(text);
        details = parsed?.message || parsed?.error || JSON.stringify(parsed);
      } catch (e) {
        // keep text as-is
      }
      console.error('OpenRouter API Error:', { status: response.status, body: details });
      // propagate the provider status so frontend can surface clearer messages
      const clientStatus = response.status >= 400 && response.status < 600 ? response.status : 502;
      return res.status(clientStatus).json({ 
        error: 'Failed to get response from AI service',
        status: response.status,
        details: response.status === 401 ? 'API key invalid or unauthorized' : details
      });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ 
        error: 'Invalid response from AI service' 
      });
    }

    const demotivationText = data.choices[0].message.content.trim();

    // Track usage for authenticated users
    if (userId) {
      // In production, increment usage counter in database
      console.log(`User ${userId} generated demotivation: ${tone}`);
    }

    res.json({ 
      message: demotivationText,
      tone: tone,
      usage: {
        remainingGenerations: req.user?.subscription?.plan === 'free' ? 10 : 1000 // Mock data
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Demotivation generation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Something went wrong processing your request'
    });
  }
});

// Roast endpoint - for short, punchy roasts
router.post('/roast', optionalAuth, demotivationLimiter, [
  body('input')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Input must be between 1 and 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { input } = req.body;
    const fetch = (await import('node-fetch')).default;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
            content: `You are a witty roast master. Create SHORT, punchy roasts that are 2-4 lines maximum. Be clever, sarcastic, and brutally honest but not mean-spirited. Focus on pointing out contradictions, unrealistic expectations, or funny observations about the person's statement.

Rules:
- Maximum 2-4 lines
- Be witty and clever, not just mean
- Use humor and irony
- Point out realistic flaws or contradictions
- Keep it snappy and memorable
- Don't be personally insulting, focus on the behavior/statement`
          },
          {
            role: 'user',
            content: `Roast this: "${input.trim()}"`
          }
        ],
        max_tokens: 150,
        temperature: 0.9
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API Error:', errorData);
      return res.status(500).json({ 
        error: 'Failed to generate roast',
        details: response.status === 401 ? 'API key invalid' : 'Service temporarily unavailable'
      });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ 
        error: 'Invalid response from AI service' 
      });
    }

    res.json({ 
      roast: data.choices[0].message.content.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Roast API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Something went wrong generating your roast'
    });
  }
});

// Get demotivation history for authenticated users
router.get('/history', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to view your history'
      });
    }

    // In production, fetch from database
    // For now, return mock data
    const history = [
      {
        id: '1',
        message: 'I want to start a business',
        response: 'Ah yes, another "entrepreneur" who thinks they\'re the next Steve Jobs. Most businesses fail within the first year, but I\'m sure yours will be different because you have "passion" and a half-baked idea.',
        tone: 'sarcasm',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        message: 'I\'m going to learn programming',
        response: 'Welcome to the club of people who think coding is easy because they watched a 10-minute YouTube tutorial. Reality check: you\'ll spend more time debugging than actually coding.',
        tone: 'brutalhonesty',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    res.json({
      history,
      totalCount: history.length
    });

  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch history',
      details: 'Something went wrong retrieving your demotivation history'
    });
  }
});

// Get available tones
router.get('/tones', (req, res) => {
  const tones = [
    {
      id: 'sarcasm',
      name: 'Sarcasm',
      description: 'Witty, ironic responses with clever observations',
      icon: '😏'
    },
    {
      id: 'darkhumor',
      name: 'Dark Humor',
      description: 'Cynical comedy with a twisted perspective',
      icon: '🖤'
    },
    {
      id: 'roast',
      name: 'Roast',
      description: 'Playful, humorous teasing and wordplay',
      icon: '🔥'
    },
    {
      id: 'brutalhonesty',
      name: 'Brutal Honesty',
      description: 'Direct, unfiltered truth without sugar-coating',
      icon: '💀'
    },
    {
      id: 'pessimistic',
      name: 'Pessimistic',
      description: 'Expect the worst, focus on potential failures',
      icon: '☁️'
    },
    {
      id: 'motivation',
      name: 'Motivation',
      description: 'Uplifting, encouraging, and genuinely helpful',
      icon: '✨'
    }
  ];

  res.json({ tones });
});

module.exports = router;
