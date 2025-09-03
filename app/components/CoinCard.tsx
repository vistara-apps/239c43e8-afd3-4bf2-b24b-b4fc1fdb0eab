'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Star, StarOff, Bell } from 'lucide-react';
import { Coin } from '../types';

interface CoinCardProps {
  coin: Coin;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (coinId: string) => void;
  onSetAlert?: (coin: Coin) => void;
  variant?: 'default' | 'price-change-up' | 'price-change-down';
}

export default function CoinCard({
  coin,
  isInWatchlist = false,
  onToggleWatchlist,
  onSetAlert,
  variant = 'default'
}: CoinCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return price.toFixed(6);
    } else if (price < 1) {
      return price.toFixed(4);
    } else if (price < 100) {
      return price.toFixed(2);
    } else {
      return price.toLocaleString();
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  const priceChange = coin.price_change_percentage_24h;
  const isPositive = priceChange >= 0;
  
  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-lg p-4 shadow-card border border-gray-100 dark:border-gray-700 
      hover:shadow-lg transition-all duration-200 cursor-pointer group
      ${variant === 'price-change-up' ? 'ring-2 ring-green-500/20' : ''}
      ${variant === 'price-change-down' ? 'ring-2 ring-red-500/20' : ''}
    `}>
      <div className="flex items-start justify-between">
        {/* Left Section - Coin Info */}
        <div className="flex items-start space-x-3">
          {/* Coin Image */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {!imageError && coin.image ? (
              <img
                src={coin.image}
                alt={coin.name}
                className="w-8 h-8"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {coin.symbol.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Coin Details */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {coin.name}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                {coin.symbol}
              </span>
            </div>
            
            <div className="mt-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${formatPrice(coin.current_price)}
                </span>
                <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Market Cap: {formatMarketCap(coin.market_cap)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist?.(coin.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              isInWatchlist 
                ? 'text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20' 
                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10'
            }`}
            aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {isInWatchlist ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetAlert?.(coin);
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
            aria-label="Set price alert"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price Chart Placeholder */}
      <div className="mt-3 h-16 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center justify-center">
        <div className="w-full h-8 flex items-end space-x-1">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}
              style={{ height: `${20 + Math.random() * 12}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
