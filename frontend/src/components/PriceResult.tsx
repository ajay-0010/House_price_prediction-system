import { TrendingUp, Sparkles } from "lucide-react";

interface PriceResultProps {
  price: number | null;
  isVisible: boolean;
}

const PriceResult = ({ price, isVisible }: PriceResultProps) => {
  if (!isVisible || price === null) return null;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div className="result-display pulse-gold animate-fade-in">
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Estimated Value
          </span>
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>
        
        <div className="relative">
          <h2 className="text-5xl md:text-6xl font-bold gold-text mb-4 float-animation">
            {formattedPrice}
          </h2>
        </div>

        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm">
            Based on California housing market data
          </span>
        </div>

        <div className="mt-6 pt-6 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            This prediction is generated using a Random Forest model trained on historical housing data.
            Actual prices may vary based on market conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceResult;
