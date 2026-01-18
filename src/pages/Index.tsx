import Header from "@/components/Header";
import PortfolioSummary from "@/components/PortfolioSummary";
import AssetCard, { Asset } from "@/components/AssetCard";
import { Plus, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStockPrices } from "@/hooks/useStockPrices";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMemo } from "react";

// Mock data - will be replaced with API data
const mockAssets: Asset[] = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    currentPrice: 178.72,
    investedAmount: 5000,
    shares: 30,
    status: "active",
    platform: "Robinhood",
    change24h: 1.24,
  },
  {
    id: "2",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    currentPrice: 378.91,
    investedAmount: 7500,
    shares: 22,
    status: "active",
    platform: "Fidelity",
    change24h: 0.87,
  },
  {
    id: "3",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    currentPrice: 141.80,
    investedAmount: 4200,
    shares: 35,
    status: "active",
    platform: "Charles Schwab",
    change24h: -0.45,
  },
  {
    id: "4",
    symbol: "TSLA",
    name: "Tesla, Inc.",
    currentPrice: 248.50,
    investedAmount: 6000,
    shares: 20,
    status: "active",
    platform: "Webull",
    change24h: 2.31,
  },
  {
    id: "5",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    currentPrice: 495.22,
    investedAmount: 8000,
    shares: 18,
    status: "active",
    platform: "TD Ameritrade",
    change24h: 3.15,
  },
  {
    id: "6",
    symbol: "BTC",
    name: "Bitcoin",
    currentPrice: 43250.00,
    investedAmount: 10000,
    shares: 0.28,
    status: "active",
    platform: "Coinbase",
    change24h: -1.23,
  },
];

const Index = () => {
  // Fetch real-time prices
  const { prices, loading, error, refreshPrices, lastUpdated } = useStockPrices(mockAssets);
  
  // Update assets with real-time prices
  const updatedAssets: Asset[] = useMemo(() => {
    return mockAssets.map(asset => ({
      ...asset,
      currentPrice: prices[asset.symbol] || asset.currentPrice,
    }));
  }, [prices]);

  // Calculate portfolio totals using updated prices
  const totalValue = updatedAssets.reduce(
    (sum, asset) => sum + asset.currentPrice * asset.shares,
    0
  );
  const totalInvested = updatedAssets.reduce(
    (sum, asset) => sum + asset.investedAmount,
    0
  );
  const totalGain = totalValue - totalInvested;
  const gainPercentage = (totalGain / totalInvested) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* API Status Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error} - Using cached prices as fallback.
            </AlertDescription>
          </Alert>
        )}

        <PortfolioSummary
          totalValue={totalValue}
          totalInvested={totalInvested}
          totalGain={totalGain}
          gainPercentage={gainPercentage}
          assetCount={updatedAssets.length}
        />

        {/* Asset List Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Assets</h2>
            <p className="text-muted-foreground">
              {lastUpdated 
                ? `Last updated: ${lastUpdated.toLocaleTimeString()}` 
                : 'Manage and track all your investments'}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                className="pl-10 bg-background border-border"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={refreshPrices}
              disabled={loading}
              className="shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && updatedAssets.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Loading real-time prices...</p>
            </div>
          ) : (
            updatedAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
