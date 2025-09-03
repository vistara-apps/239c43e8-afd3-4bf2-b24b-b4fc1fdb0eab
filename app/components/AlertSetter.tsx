'use client';

import { useState } from 'react';
import { X, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { Coin, UserAlert } from '../types';

interface AlertSetterProps {
  coin?: Coin;
  alerts: UserAlert[];
  onSetAlert: (alert: Omit<UserAlert, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  variant?: 'input-price' | 'trigger-type';
}

export default function AlertSetter({
  coin,
  alerts,
  onSetAlert,
  onClose,
  variant = 'input-price'
}: AlertSetterProps) {
  const [targetPrice, setTargetPrice] = useState('');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!coin) return null;

  const existingAlerts = alerts.filter(alert => 
    alert.coinSymbol === coin.symbol && alert.status === 'active'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetPrice || isNaN(Number(targetPrice))) {
      return;
    }

    setIsSubmitting(true);
    
    const newAlert: Omit<UserAlert, 'id' | 'createdAt'> = {
      userId: 'user-1', // In real app, get from auth
      coinSymbol: coin.symbol,
      targetPrice: Number(targetPrice),
      alertType,
      status: 'active'
    };

    try {
      await onSetAlert(newAlert);
      setTargetPrice('');
      onClose();
    } catch (error) {
      console.error('Failed to set alert:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPrice = coin.current_price;
  const isValidPrice = targetPrice && !isNaN(Number(targetPrice));
  const targetPriceNum = Number(targetPrice);
  const percentageDiff = isValidPrice 
    ? ((targetPriceNum - currentPrice) / currentPrice * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                {coin.image ? (
                  <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {coin.symbol.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Set Price Alert
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {coin.name} ({coin.symbol.toUpperCase()})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Current Price */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Current Price</div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              ${currentPrice.toLocaleString()}
            </div>
          </div>

          {/* Alert Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Alert Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alert When Price Goes
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAlertType('above')}
                  className={`p-3 rounded-lg border transition-colors ${
                    alertType === 'above'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Above</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAlertType('below')}
                  className={`p-3 rounded-lg border transition-colors ${
                    alertType === 'below'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-red-300'
                  }`}
                >
                  <TrendingDown className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Below</span>
                </button>
              </div>
            </div>

            {/* Target Price Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Price (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.000001"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              {isValidPrice && (
                <div className={`mt-2 text-sm ${percentageDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {percentageDiff >= 0 ? '+' : ''}{percentageDiff.toFixed(2)}% from current price
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValidPrice || isSubmitting}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium
                       hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                       transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Setting Alert...' : 'Set Alert'}</span>
            </button>
          </form>

          {/* Existing Alerts */}
          {existingAlerts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Active Alerts for {coin.symbol.toUpperCase()}
              </h4>
              <div className="space-y-2">
                {existingAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      {alert.alertType === 'above' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {alert.alertType} ${alert.targetPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs text-green-500">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
