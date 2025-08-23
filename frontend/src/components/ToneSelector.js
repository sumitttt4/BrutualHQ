import React from 'react';

const ToneSelector = ({ tone, onToneChange }) => {
  const tones = [
    { 
      value: 'sarcasm', 
      label: '😏 Sarcasm', 
      description: 'Witty and sarcastic remarks' 
    },
    { 
      value: 'darkhumor', 
      label: '🖤 Dark Humor', 
      description: 'Cynical and darkly funny' 
    },
    { 
      value: 'roast', 
      label: '🔥 Friendly Roast', 
      description: 'Playful and teasing' 
    }
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 text-center">
        Choose Your Poison:
      </label>
      <div className="flex flex-wrap justify-center gap-3">
        {tones.map((toneOption) => (
          <button
            key={toneOption.value}
            onClick={() => onToneChange(toneOption.value)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${tone === toneOption.value
                ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                : 'bg-white bg-opacity-20 text-purple-800 hover:bg-opacity-30 border border-purple-300 hover:border-purple-400'
              }
              backdrop-blur-sm
            `}
            title={toneOption.description}
          >
            {toneOption.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToneSelector;
