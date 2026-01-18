import { useState, useEffect, useCallback } from 'react';
import { fetchAssetPrice, isCrypto } from '@/services/stockApi';
import type { Asset } from '@/components/AssetCard';

interface PriceData {
  [symbol: string]: number;
}

interface UsePricesReturn {
  prices: PriceData;
  loading: boolean;
  error: string | null;
  refreshPrices: () => void;
  lastUpdated: Date | null;
}

/**
 * Custom hook to fetch and manage stock/crypto prices
 * Includes automatic refresh and manual refresh capability
 */
export const useStockPrices = (assets: Asset[], autoRefresh: boolean = false): UsePricesReturn => {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    if (assets.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const pricePromises = assets.map(async (asset) => {
        try {
          const price = await fetchAssetPrice(asset.symbol);
          return { symbol: asset.symbol, price };
        } catch (err) {
          console.error(`Failed to fetch price for ${asset.symbol}:`, err);
          // Return current price as fallback
          return { symbol: asset.symbol, price: asset.currentPrice };
        }
      });

      // Fetch all prices in parallel (be mindful of API rate limits)
      const results = await Promise.all(pricePromises);

      const newPrices: PriceData = {};
      results.forEach(({ symbol, price }) => {
        newPrices[symbol] = price;
      });

      setPrices(newPrices);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prices';
      setError(errorMessage);
      console.error('Error fetching prices:', err);
    } finally {
      setLoading(false);
    }
  }, [assets]);

  const refreshPrices = useCallback(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Initial fetch
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Auto-refresh every 5 minutes if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchPrices();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh, fetchPrices]);

  return {
    prices,
    loading,
    error,
    refreshPrices,
    lastUpdated,
  };
};
