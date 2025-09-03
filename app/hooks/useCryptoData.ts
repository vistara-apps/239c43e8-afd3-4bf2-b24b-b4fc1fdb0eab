'use client';

import { useQuery } from '@tanstack/react-query';
import { Coin, PriceData } from '../types';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Fetch market data for multiple coins
export const useCryptoMarketData = (coins: string[] = []) => {
  return useQuery<Coin[]>({
    queryKey: ['crypto-market', coins],
    queryFn: async () => {
      const coinIds = coins.length > 0 ? coins.join(',') : 'bitcoin,ethereum,cardano,polkadot,chainlink';
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data');
      }
      
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

// Fetch simple price data for specific coins
export const useSimplePrice = (coinIds: string[]) => {
  return useQuery({
    queryKey: ['simple-price', coinIds],
    queryFn: async () => {
      if (coinIds.length === 0) return {};
      
      const response = await fetch(
        `${COINGECKO_API_BASE}/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch price data');
      }
      
      return response.json();
    },
    refetchInterval: 30000,
    enabled: coinIds.length > 0,
  });
};

// Fetch historical price data for charts
export const useHistoricalData = (coinId: string, days: number = 7) => {
  return useQuery<PriceData>({
    queryKey: ['historical-data', coinId, days],
    queryFn: async () => {
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }
      
      return response.json();
    },
    staleTime: 300000, // 5 minutes
    enabled: !!coinId,
  });
};

// Search for coins
export const useSearchCoins = (query: string) => {
  return useQuery({
    queryKey: ['search-coins', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      const response = await fetch(
        `${COINGECKO_API_BASE}/search?query=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search coins');
      }
      
      const data = await response.json();
      return data.coins || [];
    },
    enabled: query.length > 0,
    staleTime: 600000, // 10 minutes
  });
};
