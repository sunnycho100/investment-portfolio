import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  investedAmount: number;
  shares: number;
  status: "active" | "pending" | "inactive";
  platform: string;
  change24h: number;
}

interface AssetCardProps {
  asset: Asset;
}

const AssetCard = ({ asset }: AssetCardProps) => {
  const currentValue = asset.currentPrice * asset.shares;
  const gain = currentValue - asset.investedAmount;
  const gainPercentage = (gain / asset.investedAmount) * 100;
  const isPositive = gain >= 0;

  const statusColors = {
    active: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    inactive: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center font-bold text-foreground">
              {asset.symbol.slice(0, 2)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{asset.symbol}</h3>
              <p className="text-sm text-muted-foreground">{asset.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={statusColors[asset.status]}>
              {asset.status}
            </Badge>
            <button className="p-1 rounded-lg hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Price</p>
            <p className="text-lg font-semibold text-foreground">
              ${asset.currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <div
              className={`flex items-center gap-1 text-xs ${
                asset.change24h >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {asset.change24h >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>
                {asset.change24h >= 0 ? "+" : ""}
                {asset.change24h.toFixed(2)}% 24h
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Value</p>
            <p className="text-lg font-semibold text-foreground">
              ${currentValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">{asset.shares} shares</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Amount Invested</p>
              <p className="font-medium text-foreground">
                ${asset.investedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Total Return</p>
              <p
                className={`font-semibold ${
                  isPositive ? "text-success" : "text-destructive"
                }`}
              >
                {isPositive ? "+" : ""}$
                {Math.abs(gain).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                <span className="text-xs font-normal ml-1">
                  ({isPositive ? "+" : ""}
                  {gainPercentage.toFixed(2)}%)
                </span>
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Platform: {asset.platform}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetCard;
