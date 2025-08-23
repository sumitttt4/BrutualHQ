import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

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

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Demotivator API is running!' });
});

app.post('/api/demotivate', async (req, res) => {
  try {
    const { message, tone = 'sarcasm' } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message is required and cannot be empty' 
      });
    }

    const systemPrompt = getSystemPrompt(tone);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.9
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

    res.json({ 
      message: data.choices[0].message.content.trim(),
      tone: tone
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Something went wrong processing your request'
    });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message is required and cannot be empty' 
      });
    }

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
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
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

    res.json({ 
      message: data.choices[0].message.content.trim(),
      mode: isDeMotivationRequest ? 'demotivation' : 'helpful'
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Something went wrong processing your chat message'
    });
  }
});

// Roast endpoint - for short, punchy roasts (2-4 lines)
app.post('/api/roast', async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || input.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Input is required and cannot be empty' 
      });
    }

    if (input.trim().length > 200) {
      return res.status(400).json({ 
        error: 'Input too long. Please keep it under 200 characters.' 
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
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
      roast: data.choices[0].message.content.trim()
    });

  } catch (error) {
    console.error('Roast API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Something went wrong generating your roast'
    });
  }
});

// Voice Demotivation endpoint - AI + Text-to-Speech
app.post('/api/voice-demotivate', async (req, res) => {
  try {
    const { input, tone, voice } = req.body;

    if (!input || input.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Input is required and cannot be empty' 
      });
    }

    if (!tone) {
      return res.status(400).json({ 
        error: 'Tone selection is required' 
      });
    }

    if (!voice) {
      return res.status(400).json({ 
        error: 'Voice selection is required' 
      });
    }

    if (input.trim().length > 300) {
      return res.status(400).json({ 
        error: 'Input too long. Please keep it under 300 characters.' 
      });
    }

    // Tone-specific system prompts
    const tonePrompts = {
      'sarcasm': 'You are a master of sarcasm. Create witty, cutting observations that point out the unrealistic nature of dreams and plans. Use clever wordplay and irony.',
      'dark-humor': 'You are a dark comedian. Use cynical wit with a twisted sense of humor. Make observations about failure and disappointment with dark comedic timing.',
      'brutal-honesty': 'You are brutally honest. Give harsh, unfiltered truths about reality. No sugar-coating, just direct facts about why things probably won\'t work out.',
      'pessimistic': 'You are deeply pessimistic. Always assume the worst outcome. Point out all the ways things can and will go wrong. Expect disappointment.',
      'existential': 'You are an existential philosopher. Question the meaning and purpose of their endeavors. Make them wonder why anything matters in the grand scheme of things.'
    };

    // Generate AI message first
    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
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

    // For now, we'll use browser-based TTS instead of 11Labs
    // The frontend will handle the actual voice synthesis
    // This allows us to have working voice without external API costs
    
    // Voice ID mapping (these will be used by frontend for voice selection)
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

    // Return the message and voice info for frontend TTS
    res.json({ 
      message: message,
      voice: voice,
      voiceName: voiceNames[voice] || voiceNames['morgan-freeman'],
      tone: tone,
      useBrowserTTS: true // Signal frontend to use browser TTS
    });

  } catch (error) {
    console.error('Voice Demotivation API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: 'Something went wrong generating your voice demotivation'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    details: 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Demotivator API server running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;
