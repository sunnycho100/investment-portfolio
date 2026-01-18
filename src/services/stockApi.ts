/**
 * Stock Price API Service
 * Using Alpha Vantage API for real-time stock and crypto prices
 * Free tier: 25 requests/day, 5 requests/minute
 * Docs: https://www.alphavantage.co/documentation/
 */

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  timestamp: string;
}

export interface CryptoQuote {
  symbol: string;
  price: number;
  change24h: number;
  marketCap?: number;
  timestamp: string;
}

/**
 * Fetch real-time stock quote
 */
export const fetchStockPrice = async (symbol: string): Promise<StockQuote> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(`API Error: ${data['Error Message']}`);
    }
    
    if (data['Note']) {
      throw new Error('API rate limit reached. Please try again later.');
    }
    
    const quote = data['Global Quote'];
    
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error(`No data available for symbol: ${symbol}`);
    }
    
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      timestamp: quote['07. latest trading day'],
    };
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetch cryptocurrency price
 */
export const fetchCryptoPrice = async (symbol: string, currency: string = 'USD'): Promise<CryptoQuote> => {
  try {
    const cryptoSymbol = symbol.replace('BTC', 'BTC').replace('ETH', 'ETH');
    
    const response = await fetch(
      `${BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=${cryptoSymbol}&to_currency=${currency}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(`API Error: ${data['Error Message']}`);
    }
    
    if (data['Note']) {
      throw new Error('API rate limit reached. Please try again later.');
    }
    
    const exchangeRate = data['Realtime Currency Exchange Rate'];
    
    if (!exchangeRate) {
      throw new Error(`No data available for crypto: ${symbol}`);
    }
    
    return {
      symbol: exchangeRate['1. From_Currency Code'],
      price: parseFloat(exchangeRate['5. Exchange Rate']),
      change24h: 0, // Alpha Vantage doesn't provide 24h change for crypto in this endpoint
      timestamp: exchangeRate['6. Last Refreshed'],
    };
  } catch (error) {
    console.error(`Error fetching crypto price for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetch multiple stock prices with rate limiting
 */
export const fetchMultipleStockPrices = async (symbols: string[]): Promise<Map<string, StockQuote>> => {
  const results = new Map<string, StockQuote>();
  
  // Rate limiting: 5 requests per minute for free tier
  const DELAY_MS = 12000; // 12 seconds between requests
  
  for (const symbol of symbols) {
    try {
      const quote = await fetchStockPrice(symbol);
      results.set(symbol, quote);
      
      // Add delay between requests (except for the last one)
      if (symbol !== symbols[symbols.length - 1]) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    } catch (error) {
      console.error(`Failed to fetch price for ${symbol}:`, error);
      // Continue with other symbols even if one fails
    }
  }
  
  return results;
};

/**
 * Determine if symbol is a cryptocurrency
 */
export const isCrypto = (symbol: string): boolean => {
  const cryptoSymbols = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'ADA', 'DOGE', 'SOL', 'DOT', 'MATIC'];
  return cryptoSymbols.includes(symbol.toUpperCase());
};

/**
 * Fetch price for any asset (stock or crypto)
 */
export const fetchAssetPrice = async (symbol: string): Promise<number> => {
  try {
    if (isCrypto(symbol)) {
      const quote = await fetchCryptoPrice(symbol);
      return quote.price;
    } else {
      const quote = await fetchStockPrice(symbol);
      return quote.price;
    }
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    throw error;
  }
};
