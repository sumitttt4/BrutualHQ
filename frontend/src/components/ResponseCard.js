import React from 'react';

const ResponseCard = ({ response, tone }) => {
  const getToneEmoji = (tone) => {
    const emojiMap = {
      sarcasm: '😏',
      darkhumor: '🖤',
      roast: '🔥'
    };
    return emojiMap[tone] || '😏';
  };

  const getToneColor = (tone) => {
    const colorMap = {
      sarcasm: 'border-blue-300 bg-blue-50',
      darkhumor: 'border-gray-400 bg-gray-50',
      roast: 'border-red-300 bg-red-50'
    };
    return colorMap[tone] || 'border-blue-300 bg-blue-50';
  };

  return (
    <div className={`
      p-6 rounded-xl shadow-lg backdrop-blur-sm bg-white bg-opacity-80 
      border-2 ${getToneColor(tone)} animate-bounce-in
    `}>
      <div className="flex items-start space-x-3">
        <div className="text-2xl flex-shrink-0">
          {getToneEmoji(tone)}
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-2 font-medium capitalize">
            {tone === 'darkhumor' ? 'Dark Humor' : tone} Mode
          </div>
          <blockquote className="text-gray-800 text-lg leading-relaxed italic">
            "{response}"
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default ResponseCard;
