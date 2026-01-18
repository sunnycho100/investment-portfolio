# Stock Price API Integration

## Overview
This project uses **Alpha Vantage API** for real-time stock and cryptocurrency price data.

### Why Alpha Vantage?
- ✅ Free tier: 25 requests/day, 5 requests/minute
- ✅ Comprehensive coverage: Stocks, Forex, Crypto
- ✅ Real-time and historical data
- ✅ No credit card required
- ✅ Reliable and well-documented

## Setup

### 1. Get Your API Key
1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Enter your email to get a free API key instantly
3. Copy your API key

### 2. Configure Environment
1. Create a `.env` file in the project root (or rename `.env.example`)
2. Add your API key:
   ```env
   VITE_ALPHA_VANTAGE_API_KEY=your_actual_api_key_here
   ```

### 3. Run the Application
```bash
npm install
npm run dev
```

## Features

### Real-Time Price Updates
- Automatic price fetching on page load
- Manual refresh button with loading indicator
- Displays last updated timestamp
- Error handling with fallback to cached prices

### Supported Assets
- **Stocks**: AAPL, MSFT, GOOGL, TSLA, NVDA, and more
- **Crypto**: BTC, ETH, and other major cryptocurrencies

### API Service (`src/services/stockApi.ts`)
- `fetchStockPrice(symbol)` - Get real-time stock quote
- `fetchCryptoPrice(symbol)` - Get cryptocurrency price
- `fetchAssetPrice(symbol)` - Auto-detect and fetch stock or crypto
- Rate limiting built-in to respect API limits

### Custom Hook (`src/hooks/useStockPrices.ts`)
- `useStockPrices(assets, autoRefresh?)` - React hook for price management
- Returns: prices, loading state, error state, refresh function, last updated time
- Optional auto-refresh every 5 minutes

## Usage Example

```tsx
import { useStockPrices } from '@/hooks/useStockPrices';

const { prices, loading, error, refreshPrices, lastUpdated } = useStockPrices(assets);

// Access price for a specific symbol
const applePrice = prices['AAPL'];

// Manual refresh
<button onClick={refreshPrices}>Refresh Prices</button>
```

## API Rate Limits (Free Tier)
- **25 requests per day**
- **5 requests per minute**

💡 The app handles rate limiting automatically with delays between requests.

## Alternative APIs
If you need more requests, consider:
- **Finnhub** (60 calls/minute free)
- **IEX Cloud** (50,000 messages/month free)
- **Yahoo Finance API** (via RapidAPI)

## Troubleshooting

### "API rate limit reached"
Wait 1 minute and try again. Consider upgrading to a paid plan for higher limits.

### "No data available for symbol"
Check that the stock symbol is correct. Some symbols may not be available.

### Prices not updating
1. Check your `.env` file has the correct API key
2. Verify your API key is valid at [Alpha Vantage](https://www.alphavantage.co/)
3. Check browser console for errors
