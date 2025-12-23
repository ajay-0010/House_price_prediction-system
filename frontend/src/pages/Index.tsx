import { useState } from "react";
import { Home, TrendingUp, BarChart3, MapPin } from "lucide-react";
import PredictionForm from "@/components/PredictionForm";
import PriceResult from "@/components/PriceResult";
import FeatureCard from "@/components/FeatureCard";
import { toast } from "sonner";

interface FormData {
  longitude: string;
  latitude: string;
  houseAge: string;
  totalRooms: string;
  totalBedrooms: string;
  population: string;
  households: string;
  medianIncome: string;
  oceanProximity: string;
}

const Index = () => {
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [computedFeatures, setComputedFeatures] = useState({
    roomsPerHousehold: 0,
    bedroomsPerRoom: 0,
    populationPerHousehold: 0,
  });

  const handlePredict = async (data: FormData) => {
    setIsLoading(true);
    setShowResult(false);

    // Convert inputs
    const households = Number(data.households) || 1;
    const totalRooms = Number(data.totalRooms) || 0;
    const totalBedrooms = Number(data.totalBedrooms) || 0;
    const population = Number(data.population) || 0;

    // Derived features (MATCH BACKEND)
    const roomsPerHousehold = totalRooms / households;
    const bedroomsPerRoom =
      totalRooms > 0 ? totalBedrooms / totalRooms : 0;
    const populationPerHousehold = population / households;

    setComputedFeatures({
      roomsPerHousehold,
      bedroomsPerRoom,
      populationPerHousehold,
    });

    try {
      // ✅ IMPORTANT FIXES:
      // 1. Use relative URL "/predict"
      // 2. Send ONLY keys expected by Flask backend
      const response = await fetch("/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          median_income: Number(data.medianIncome),
          housing_median_age: Number(data.houseAge),
          rooms_per_household: roomsPerHousehold,
          bedrooms_per_room: bedroomsPerRoom,
          population: population,
          population_per_household: populationPerHousehold,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.predicted_price) {
        throw new Error(result.error || "Prediction failed");
      }

      setPredictedPrice(Math.round(result.predicted_price));
      setShowResult(true);

      toast.success("Prediction complete!", {
        description: "Your house price estimate is ready.",
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Prediction failed", {
        description:
          "Could not connect to calculation engine. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-pattern">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Home className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                PropValue AI
              </h1>
              <p className="text-xs text-muted-foreground">
                California Housing Predictor
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Predict Your </span>
              <span className="gold-text">Home's Value</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by machine learning to estimate housing prices based on
              real-world data.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Property Details
                  </h3>
                </div>
                <PredictionForm
                  onPredict={handlePredict}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {showResult && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Computed Features
                  </h4>
                  <FeatureCard
                    icon={Home}
                    title="Rooms / Household"
                    value={computedFeatures.roomsPerHousehold.toFixed(2)}
                  />
                  <FeatureCard
                    icon={TrendingUp}
                    title="Bedrooms / Room"
                    value={computedFeatures.bedroomsPerRoom.toFixed(3)}
                  />
                  <FeatureCard
                    icon={MapPin}
                    title="Population / Household"
                    value={computedFeatures.populationPerHousehold.toFixed(2)}
                  />
                </div>
              )}

              <PriceResult price={predictedPrice} isVisible={showResult} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Built with React & Tailwind • Model: Random Forest Regressor
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
