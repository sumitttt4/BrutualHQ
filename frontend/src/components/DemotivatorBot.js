import React, { useState } from 'react';
import ToneSelector from './ToneSelector';
import ResponseCard from './ResponseCard';
import ShareButtons from './ShareButtons';
import LoadingSpinner from './LoadingSpinner';

const DemotivatorBot = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tone, setTone] = useState('sarcasm');
  const [hasGenerated, setHasGenerated] = useState(false);

  const demotivateUser = async () => {
    setLoading(true);
    setError('');
    
    try {
      const messages = [
        "I'm feeling motivated today!",
        "I think I can achieve anything!",
        "I'm ready to conquer the world!",
        "I believe in myself!",
        "I'm going to be successful!",
        "Today is going to be amazing!",
        "I'm unstoppable!",
        "I can do anything I set my mind to!",
        "I'm feeling confident!",
        "I'm going to make it happen!"
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      const response = await fetch('/api/demotivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: randomMessage,
          tone: tone
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get demotivational response');
      }

      setResponse(data.message);
      setHasGenerated(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Even I can\'t demotivate you right now.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateAgain = () => {
    demotivateUser();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          BrutualHQ
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Feeling too positive? Let our AI bring you back down to earth with some quality demotivation.
        </p>
      </div>

      {/* Tone Selector */}
      <div className="animate-slide-up">
        <ToneSelector tone={tone} onToneChange={setTone} />
      </div>

      {/* Main Action Button */}
      <div className="text-center animate-bounce-in">
        <button
          onClick={demotivateUser}
          disabled={loading}
          className={`
            px-8 py-4 text-lg font-semibold rounded-full shadow-lg
            transition-all duration-300 transform hover:scale-105
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
              : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-xl'
            }
          `}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner />
              <span>Preparing Demotivation...</span>
            </div>
          ) : (
            "Come Here, I'll Demotivate You"
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="animate-slide-up">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Card */}
      {response && (
        <div className="animate-bounce-in">
          <ResponseCard response={response} tone={tone} />
        </div>
      )}

      {/* Generate Again Button */}
      {hasGenerated && !loading && (
        <div className="text-center animate-slide-up">
          <button
            onClick={generateAgain}
            className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-purple-800 font-medium rounded-lg border border-purple-300 hover:border-purple-400 transition-all duration-300 backdrop-blur-sm"
          >
            Generate Again
          </button>
        </div>
      )}

      {/* Share Buttons */}
      {response && (
        <div className="animate-fade-in">
          <ShareButtons response={response} />
        </div>
      )}
    </div>
  );
};

export default DemotivatorBot;
