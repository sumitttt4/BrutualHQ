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
    // return an inline style object that uses tokens so the accents show in dark mode
    switch (tone) {
      case 'sarcasm':
        return { borderColor: '#bfdbfe', background: 'rgba(59,130,246,0.06)' };
      case 'darkhumor':
        return { borderColor: 'rgba(156,163,175,0.5)', background: 'rgba(156,163,175,0.04)' };
      case 'roast':
        return { borderColor: 'rgba(248,113,113,0.6)', background: 'rgba(248,113,113,0.04)' };
      default:
        return { borderColor: '#bfdbfe', background: 'rgba(59,130,246,0.06)' };
    }
  };

  return (
  <div className="p-6 rounded-xl shadow-lg backdrop-blur-sm card animate-bounce-in" style={{ borderWidth: 2, ...getToneColor(tone) }}>
      <div className="flex items-start space-x-3">
        <div className="text-2xl flex-shrink-0">
          {getToneEmoji(tone)}
        </div>
        <div className="flex-1">
          <div className="text-sm mb-2 font-medium capitalize" style={{ color: 'var(--muted-text)' }}>
            {tone === 'darkhumor' ? 'Dark Humor' : tone} Mode
          </div>
          <blockquote className="text-lg leading-relaxed italic" style={{ color: 'var(--text)' }}>
            "{response}"
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default ResponseCard;
