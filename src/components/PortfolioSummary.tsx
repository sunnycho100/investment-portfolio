import { ArrowUpRight, ArrowDownRight, DollarSign, PieChart, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PortfolioSummaryProps {
  totalValue: number;
  totalInvested: number;
  totalGain: number;
  gainPercentage: number;
  assetCount: number;
}

const PortfolioSummary = ({
  totalValue,
  totalInvested,
  totalGain,
  gainPercentage,
  assetCount,
}: PortfolioSummaryProps) => {
  const isPositive = totalGain >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Portfolio Value */}
      <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Total Portfolio Value</span>
            <DollarSign className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-3xl font-bold">
            ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isPositive ? "+" : ""}
              {gainPercentage.toFixed(2)}% all time
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Total Invested */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Invested</span>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-foreground">
            ${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground mt-2">Initial capital</p>
        </CardContent>
      </Card>

      {/* Total Gain/Loss */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Gain/Loss</span>
            {isPositive ? (
              <ArrowUpRight className="w-5 h-5 text-success" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-destructive" />
            )}
          </div>
          <p
            className={`text-3xl font-bold ${
              isPositive ? "text-success" : "text-destructive"
            }`}
          >
            {isPositive ? "+" : ""}$
            {Math.abs(totalGain).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {isPositive ? "Profit" : "Loss"} to date
          </p>
        </CardContent>
      </Card>

      {/* Asset Count */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Assets Tracked</span>
            <PieChart className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-foreground">{assetCount}</p>
          <p className="text-sm text-muted-foreground mt-2">Across platforms</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioSummary;
