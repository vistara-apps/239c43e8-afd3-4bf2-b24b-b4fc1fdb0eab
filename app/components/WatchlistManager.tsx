'use client';

import { useState } from 'react';
import { Plus, X, Search } from 'lucide-react';
import { useSearchCoins } from '../hooks/useCryptoData';

interface WatchlistManagerProps {
  watchlist: string[];
  onAddCoin: (coinId: string) => void;
  onRemoveCoin: (coinId: string) => void;
  variant?: 'add-coin' | 'remove-coin';
}

export default function WatchlistManager({
  watchlist,
  onAddCoin,
  onRemoveCoin,
  variant = 'add-coin'
}: WatchlistManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: searchResults = [], isLoading: isSearching } = useSearchCoins(searchQuery);

  const handleAddCoin = (coinId: string) => {
    onAddCoin(coinId);
    setShowAddModal(false);
    setSearchQuery('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border border-gray-100 dark:border-gray-700">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            My Watchlist ({watchlist.length})
          </h2>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Coin</span>
          </button>
        </div>
      </div>

      {watchlist.length === 0 && (
        <div className="p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <Plus className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No coins in watchlist
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Start tracking your favorite cryptocurrencies
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Your First Coin
          </button>
        </div>
      )}

      {/* Add Coin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-96">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Coin to Watchlist
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSearchQuery('');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Search Results */}
              <div className="max-h-48 overflow-y-auto space-y-2">
                {isSearching && (
                  <div className="text-center py-4">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                )}

                {searchResults.map((coin: any) => (
                  <button
                    key={coin.id}
                    onClick={() => handleAddCoin(coin.id)}
                    disabled={watchlist.includes(coin.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      watchlist.includes(coin.id)
                        ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {coin.symbol?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {coin.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                          {coin.symbol}
                        </div>
                      </div>
                      {watchlist.includes(coin.id) && (
                        <span className="ml-auto text-xs text-green-500">Added</span>
                      )}
                    </div>
                  </button>
                ))}

                {searchQuery && !isSearching && searchResults.length === 0 && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
