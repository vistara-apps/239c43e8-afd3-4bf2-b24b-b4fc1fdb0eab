'use client';

import { useState } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { useSearchCoins } from '../hooks/useCryptoData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoin: (coinId: string) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectCoin }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: searchResults = [], isLoading: isSearching } = useSearchCoins(searchQuery);

  if (!isOpen) return null;

  const handleSelectCoin = (coinId: string) => {
    onSelectCoin(coinId);
    setSearchQuery('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-96">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {!searchQuery && !isSearching && (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Search Cryptocurrencies
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Type to search for coins to add to your watchlist
              </p>
            </div>
          )}

          {searchQuery && !isSearching && searchResults.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <Search className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No results found for "{searchQuery}"
              </p>
            </div>
          )}

          {searchResults.map((coin: any) => (
            <button
              key={coin.id}
              onClick={() => handleSelectCoin(coin.id)}
              className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {coin.symbol?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {coin.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                    {coin.symbol}
                  </div>
                </div>
                <div className="text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
