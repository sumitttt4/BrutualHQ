import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI assistant. You can ask me anything - whether you want motivation, demotivation, advice, or just have a casual conversation. What's on your mind?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation: messages.slice(-10) // Send last 10 messages for context
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.message,
        mode: data.mode || 'helpful',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: "Hello! I'm your AI assistant. I can help with various topics and conversations. \n\n💡 **Pro tip**: If you want me to be brutally honest and demotivating (like our demotivation generator), just say 'demotivate me' or ask for a 'reality check' and I'll switch to harsh truth mode!\n\nWhat would you like to chat about?",
        mode: 'helpful',
        timestamp: new Date()
      }
    ]);
    setError('');
  };

  const regenerateResponse = async () => {
    if (messages.length < 2) return;
    
    const lastUserMessage = [...messages].reverse().find(msg => msg.type === 'user');
    if (!lastUserMessage) return;

    // Remove the last AI message
    const messagesWithoutLastAI = messages.filter((msg, index) => {
      if (index === messages.length - 1 && msg.type === 'ai') {
        return false;
      }
      return true;
    });

    setMessages(messagesWithoutLastAI);
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: lastUserMessage.content,
          conversation: messagesWithoutLastAI.slice(-10)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      const aiMessage = {
        id: Date.now(),
        type: 'ai',
        content: data.message,
        mode: data.mode || 'helpful',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getBubbleStyle = (message) => {
    if (message.type === 'user') {
      return {
        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
        color: '#fff',
      };
    }

    if (message.mode === 'demotivation') {
      return {
        background: 'rgba(248,113,113,0.06)',
        border: '1px solid rgba(248,113,113,0.28)',
        color: 'var(--text)'
      };
    }

    // default AI message
    return {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      color: 'var(--text)'
    };
  };

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            AI Chat Assistant
          </h1>
          <p style={{ color: 'var(--muted-text)' }}>
            Have a conversation with our AI. Ask questions, get advice, or just chat!
          </p>
        </div>

        {/* Chat Container */}
  <div className="flex-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, boxShadow: 'var(--card-shadow)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Chat Header */}
          <div className="p-4" style={{ borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="font-medium" style={{ color: 'var(--text)' }}>AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={regenerateResponse}
                disabled={isLoading || messages.length < 2}
                className="p-2 rounded-full"
                style={{ color: 'var(--muted-text)', background: 'transparent' }}
                title="Regenerate last response"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </button>
              <button
                onClick={clearChat}
                className="p-2 rounded-full"
                style={{ color: 'var(--muted-text)', background: 'transparent' }}
                title="Clear chat"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
      className={`max-w-[80%] rounded-lg p-4`}
      style={getBubbleStyle(message)}
                >
                  {message.type === 'ai' && message.mode === 'demotivation' && (
                    <div className="flex items-center mb-2 text-red-600 text-sm font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Demotivation Mode
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                  <div className="text-xs mt-2" style={{ color: 'var(--muted-text)' }}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div style={{ background: 'var(--surface)', borderRadius: 8, padding: 12 }}>
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner />
                    <span style={{ color: 'var(--muted-text)' }}>AI is typing...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex justify-center">
                <div style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--text)', padding: '8px 12px', borderRadius: 8 }}>
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                  className="w-full p-3 rounded-lg resize-none focus:outline-none"
                  rows="2"
                  disabled={isLoading}
                  style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 rounded-lg transition-colors"
                style={(!inputMessage.trim() || isLoading) ? { background: 'var(--border)', color: 'var(--muted-text)', cursor: 'not-allowed' } : { background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: '#fff' }}
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            Try asking: "Give me some motivation", "Tell me a joke", "Help me with a problem", or just have a normal conversation!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
