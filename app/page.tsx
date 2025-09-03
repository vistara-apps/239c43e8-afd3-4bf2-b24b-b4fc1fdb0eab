'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import AppBar from './components/AppBar';
import CoinCard from './components/CoinCard';
import WatchlistManager from './components/WatchlistManager';
import AlertSetter from './components/AlertSetter';
import SearchModal from './components/SearchModal';
import { useCryptoMarketData } from './hooks/useCryptoData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Coin, UserAlert } from './types';

export default function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedCoinForAlert, setSelectedCoinForAlert] = useState<Coin | undefined>();
  
  // Local storage for watchlist and alerts
  const [watchlist, setWatchlist, watchlistLoading] = useLocalStorage<string[]>('crypto-watchlist', [
    'bitcoin', 'ethereum', 'cardano', 'polkadot', 'chainlink'
  ]);
  
  const [alerts, setAlerts, alertsLoading] = useLocalStorage<UserAlert[]>('crypto-alerts', []);

  // Fetch crypto data for watchlisted coins
  const { data: coins = [], isLoading, error, refetch } = useCryptoMarketData(watchlist);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  const handleToggleWatchlist = (coinId: string) => {
    setWatchlist(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  const handleSetAlert = async (alert: Omit<UserAlert, 'id' | 'createdAt'>) => {
    const newAlert: UserAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setAlerts(prev => [...prev, newAlert]);
  };

  const handleAddCoinToWatchlist = (coinId: string) => {
    if (!watchlist.includes(coinId)) {
      setWatchlist(prev => [...prev, coinId]);
    }
  };

  const handleRemoveCoinFromWatchlist = (coinId: string) => {
    setWatchlist(prev => prev.filter(id => id !== coinId));
  };

  const handleSelectCoinFromSearch = (coinId: string) => {
    handleAddCoinToWatchlist(coinId);
  };

  if (watchlistLoading || alertsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* App Bar */}
      <AppBar 
        onSearchToggle={() => setShowSearch(true)}
        onMenuToggle={() => setShowSidebar(true)}
      />

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0
        `}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            <WatchlistManager
              watchlist={watchlist}
              onAddCoin={handleAddCoinToWatchlist}
              onRemoveCoin={handleRemoveCoinFromWatchlist}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="max-w-full mx-auto px-4 py-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-card border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Coins</div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {watchlist.length}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-card border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Active Alerts</div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {alerts.filter(alert => alert.status === 'active').length}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-card border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Last Update</div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {isLoading ? 'Loading...' : 'Live'}
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <div className="text-red-800 dark:text-red-200">
                  Failed to load cryptocurrency data. Please try again later.
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-card border border-gray-100 dark:border-gray-700 animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Coins Grid */}
            {!isLoading && coins.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {coins.map((coin) => (
                  <CoinCard
                    key={coin.id}
                    coin={coin}
                    isInWatchlist={watchlist.includes(coin.id)}
                    onToggleWatchlist={handleToggleWatchlist}
                    onSetAlert={setSelectedCoinForAlert}
                    variant={
                      coin.price_change_percentage_24h > 0 
                        ? 'price-change-up' 
                        : coin.price_change_percentage_24h < 0 
                        ? 'price-change-down' 
                        : 'default'
                    }
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && coins.length === 0 && watchlist.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <Menu className="w-16 h-16 mx-auto opacity-50" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Start Building Your Watchlist
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Add cryptocurrencies to track their prices and set alerts
                </p>
                <button
                  onClick={() => setShowSearch(true)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Search Cryptocurrencies
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectCoin={handleSelectCoinFromSearch}
      />

      {/* Alert Setter Modal */}
      {selectedCoinForAlert && (
        <AlertSetter
          coin={selectedCoinForAlert}
          alerts={alerts}
          onSetAlert={handleSetAlert}
          onClose={() => setSelectedCoinForAlert(undefined)}
        />
      )}
    </div>
  );
}
