'use client';

import { useState } from 'react';
import { Search, Menu, Bell, TrendingUp } from 'lucide-react';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Identity } from '@coinbase/onchainkit/identity';

interface AppBarProps {
  onSearchToggle: () => void;
  onMenuToggle: () => void;
}

export default function AppBar({ onSearchToggle, onMenuToggle }: AppBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="crypto-gradient p-4 shadow-lg">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg glassmorphism hover:bg-white/20 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white">Crypto Pulse</h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onSearchToggle}
              className="p-2 rounded-lg glassmorphism hover:bg-white/20 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-white" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg glassmorphism hover:bg-white/20 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Price Alerts</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      No active alerts yet
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:block">
              <ConnectWallet className="!bg-white/20 !border-white/30 hover:!bg-white/30" />
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-2">
          <p className="text-white/80 text-sm">
            Live cryptocurrency tracking for your portfolio
          </p>
        </div>
      </div>
    </header>
  );
}
