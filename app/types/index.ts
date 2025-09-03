export interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
  last_updated: string;
}

export interface UserWatchlist {
  userId: string;
  coinSymbol: string;
  addedAt: Date;
}

export interface UserAlert {
  id: string;
  userId: string;
  coinSymbol: string;
  targetPrice: number;
  alertType: 'above' | 'below';
  status: 'active' | 'triggered';
  createdAt: Date;
}

export interface PriceData {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}
