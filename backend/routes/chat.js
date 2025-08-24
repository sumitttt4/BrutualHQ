const express = require('express');
const { body, validationResult } = require('express-validator');
const { chatLimiter } = require('../middleware/rateLimit');
const { optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Chat endpoint
router.post('/', optionalAuth, chatLimiter, [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('conversation')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Conversation history too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { message, conversation = [] } = req.body;
    const userId = req.user?.id;

    // Check if user is specifically asking for demotivation
    const demotivationKeywords = [
      'demotivate me', 'demotivate', 'bring me down', 'reality check', 
      'harsh truth', 'crush my dreams', 'be negative', 'discourage me',
      'tell me why i will fail', 'be pessimistic', 'brutal honesty',
      'destroy my confidence', 'roast me', 'be mean', 'be harsh'
    ];
    
    const isDeMotivationRequest = demotivationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    // Build conversation history for context
    const systemPrompt = isDeMotivationRequest ? 
      `You are a brutally honest, sarcastic, and demotivational AI assistant. Your job is to provide reality checks and crush unrealistic dreams with wit and cynicism.

Key guidelines:
- Be sarcastic and pessimistic
- Point out flaws and potential failures
- Use dark humor and wit
- Be brutally honest about challenges
- Highlight statistics about failure rates
- Be discouraging but not personally insulting
- Stay clever and articulate while being negative
- Focus on harsh realities and obstacles
- Don't give false hope or sugar-coat anything

Remember: You're providing demotivation because the user specifically asked for it. Be the voice of harsh reality.` :
      `You are a helpful, knowledgeable, and engaging AI assistant. You can help with various topics including motivation, advice, general questions, creative tasks, and casual conversation. 

Key guidelines:
- Be conversational and friendly
- Provide helpful and accurate information
- Be encouraging when appropriate
- Show personality while remaining professional
- Keep responses concise but thorough
- Ask follow-up questions when helpful
- If someone explicitly asks for demotivation, direct them to use phrases like "demotivate me" for that specific service`;

    const messages = [
      { 
        role: 'system', 
        content: systemPrompt
      }
    ];

    // Add conversation history (last 10 messages for context)
    const recentConversation = conversation.slice(-10);
    for (const msg of recentConversation) {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    }

    // Add current message
    messages.push({ role: 'user', content: message });
    
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || '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'}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 300,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API Error:', errorData);
      return res.status(500).json({ 
        error: 'Failed to get response from AI service',
        details: response.status === 401 ? 'API key invalid' : 'Service temporarily unavailable'
      });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ 
        error: 'Invalid response from AI service' 
      });
    }

    const responseMessage = data.choices[0].message.content.trim();

    // Track usage for authenticated users
    if (userId) {
      console.log(`User ${userId} sent chat message, mode: ${isDeMotivationRequest ? 'demotivation' : 'helpful'}`);
    }

    res.json({ 
      message: responseMessage,
      mode: isDeMotivationRequest ? 'demotivation' : 'helpful',
      usage: {
        remainingChats: req.user?.subscription?.plan === 'free' ? 100 : 2000 // Mock data
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Something went wrong processing your chat message'
    });
  }
});

// Get chat history for authenticated users
router.get('/history', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to view your chat history'
      });
    }

    // In production, fetch from database
    const chatSessions = [
      {
        id: 'session_1',
        title: 'Career Advice Discussion',
        messages: [
          {
            type: 'user',
            content: 'I want to switch careers to tech',
            timestamp: new Date(Date.now() - 86400000).toISOString()
          },
          {
            type: 'assistant',
            content: 'That\'s a great goal! Tech offers many opportunities. What specific area interests you most?',
            timestamp: new Date(Date.now() - 86400000 + 60000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 + 300000).toISOString()
      }
    ];

    res.json({
      chatSessions,
      totalCount: chatSessions.length
    });

  } catch (error) {
    console.error('Chat history fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch chat history',
      details: 'Something went wrong retrieving your chat history'
    });
  }
});

// Start a new chat session
router.post('/session', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to start a chat session'
      });
    }

    const { title } = req.body;
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // In production, save to database
    const session = {
      id: sessionId,
      userId: req.user.id,
      title: title || 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(201).json({
      message: 'Chat session created',
      session
    });

  } catch (error) {
    console.error('Chat session creation error:', error);
    res.status(500).json({
      error: 'Failed to create chat session',
      details: 'Something went wrong creating your chat session'
    });
  }
});

// Delete a chat session
router.delete('/session/:sessionId', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to delete chat sessions'
      });
    }

    const { sessionId } = req.params;
    
    // In production, delete from database after verifying ownership
    res.json({
      message: 'Chat session deleted successfully'
    });

  } catch (error) {
    console.error('Chat session deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete chat session',
      details: 'Something went wrong deleting your chat session'
    });
  }
});

module.exports = router;
