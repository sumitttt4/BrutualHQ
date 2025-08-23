import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, HeartIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const Gallery = () => {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied] = useState('');

  // Sample curated demotivational quotes
  const sampleQuotes = [
    {
      id: 1,
      text: "Your dreams are valid. They're also probably unrealistic, but hey, at least they're valid.",
      category: 'dreams',
      tone: 'sarcasm',
      author: 'Reality Check AI'
    },
    {
      id: 2,
      text: "Success is 10% inspiration, 90% perspiration, and 100% realizing you're bad at math.",
      category: 'success',
      tone: 'darkhumor',
      author: 'Wisdom Bot'
    },
    {
      id: 3,
      text: "The only thing standing between you and your goals is the brutal reality of your current skill level.",
      category: 'goals',
      tone: 'roast',
      author: 'Truth Teller 3000'
    },
    {
      id: 4,
      text: "You miss 100% of the shots you don't take. You also miss most of the ones you do take.",
      category: 'motivation',
      tone: 'sarcasm',
      author: 'Statistical Reality'
    },
    {
      id: 5,
      text: "Believe in yourself. Someone has to, and it might as well be you since no one else is volunteering.",
      category: 'confidence',
      tone: 'darkhumor',
      author: 'Self-Help Skeptic'
    },
    {
      id: 6,
      text: "The early bird gets the worm. But the second mouse gets the cheese. Choose your cliché wisely.",
      category: 'wisdom',
      tone: 'sarcasm',
      author: 'Metaphor Master'
    },
    {
      id: 7,
      text: "Hard work pays off eventually. Procrastination pays off immediately. Economics 101.",
      category: 'work',
      tone: 'roast',
      author: 'Life Coach Alternate'
    },
    {
      id: 8,
      text: "You're unique. Just like everyone else who thinks they're unique.",
      category: 'individuality',
      tone: 'darkhumor',
      author: 'Originality Inspector'
    },
    {
      id: 9,
      text: "Follow your passion. Unless your passion doesn't pay rent. Then maybe follow something more practical.",
      category: 'passion',
      tone: 'sarcasm',
      author: 'Career Counselor Reality'
    },
    {
      id: 10,
      text: "Rome wasn't built in a day. But they were laying bricks every hour. You've been watching Netflix.",
      category: 'productivity',
      tone: 'roast',
      author: 'Historical Perspective Bot'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'dreams', label: 'Dreams' },
    { value: 'success', label: 'Success' },
    { value: 'goals', label: 'Goals' },
    { value: 'motivation', label: 'Motivation' },
    { value: 'confidence', label: 'Confidence' },
    { value: 'wisdom', label: 'Wisdom' },
    { value: 'work', label: 'Work' },
    { value: 'individuality', label: 'Individuality' },
    { value: 'passion', label: 'Passion' },
    { value: 'productivity', label: 'Productivity' }
  ];

  useEffect(() => {
    setQuotes(sampleQuotes);
    setFilteredQuotes(sampleQuotes);

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('demotivator-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []); // Remove sampleQuotes dependency since it's defined inline

  useEffect(() => {
    let filtered = quotes;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(quote => quote.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(quote =>
        quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuotes(filtered);
  }, [quotes, selectedCategory, searchTerm]);

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const toggleFavorite = (quote) => {
    const isCurrentlyFavorite = favorites.some(fav => fav.id === quote.id);
    let updatedFavorites;

    if (isCurrentlyFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== quote.id);
    } else {
      const newFavorite = {
        ...quote,
        timestamp: new Date().toISOString()
      };
      updatedFavorites = [...favorites, newFavorite];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('demotivator-favorites', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (quoteId) => {
    return favorites.some(fav => fav.id === quoteId);
  };

  const getToneColor = (tone) => {
    switch (tone) {
      case 'sarcasm': return 'text-blue-600 bg-blue-50';
      case 'darkhumor': return 'text-purple-600 bg-purple-50';
      case 'roast': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Aurora Dream Vivid Bloom */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 20%, rgba(175, 109, 255, 0.85), transparent 68%),
            radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
            radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.98), transparent 68%),
            radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.3), transparent 68%),
            linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
          `,
        }}
      />
      
      <div className="py-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explore Reality Checks
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our curated collection of AI-generated wisdom. Sometimes the truth hurts, but it's always enlightening.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search quotes, categories, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <FunnelIcon className="h-5 w-5" />
              <span className="font-medium">Filter by:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Showing {filteredQuotes.length} of {quotes.length} reality checks
          </p>
        </div>

        {/* Quotes Grid */}
        {filteredQuotes.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              {/* Quote Text */}
              <blockquote className="text-gray-800 text-lg leading-relaxed mb-4">
                "{quote.text}"
              </blockquote>

              {/* Meta Information */}
              <div className="space-y-3">
                {/* Author */}
                <p className="text-sm text-gray-500 italic">
                  — {quote.author}
                </p>

                {/* Tone Badge */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getToneColor(quote.tone)}`}>
                    {quote.tone === 'darkhumor' ? 'Dark Humor' : 
                     quote.tone.charAt(0).toUpperCase() + quote.tone.slice(1)}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(quote.text, quote.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      title="Copy quote"
                    >
                      <ClipboardIcon className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => toggleFavorite(quote)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title={isFavorite(quote.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {isFavorite(quote.id) ? (
                        <HeartSolidIcon className="h-4 w-4 text-red-500" />
                      ) : (
                        <HeartIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* No Results */}
        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No reality checks found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or category filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Favorites Summary */}
        {favorites.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              You have {favorites.length} favorite reality check{favorites.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
