import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, MapPin, Users, DollarSign, Waves, Loader2 } from "lucide-react";

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

interface PredictionFormProps {
  onPredict: (data: FormData) => void;
  isLoading: boolean;
}

const PredictionForm = ({ onPredict, isLoading }: PredictionFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    longitude: "-122.23",
    latitude: "37.88",
    houseAge: "41",
    totalRooms: "880",
    totalBedrooms: "129",
    population: "322",
    households: "126",
    medianIncome: "8.3252",
    oceanProximity: "NEAR BAY",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Location Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <MapPin className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">Location</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => handleChange("longitude", e.target.value)}
              placeholder="-122.23"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => handleChange("latitude", e.target.value)}
              placeholder="37.88"
            />
          </div>
        </div>
      </div>

      {/* Property Details Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Home className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">Property Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="houseAge">House Age (years)</Label>
            <Input
              id="houseAge"
              type="number"
              value={formData.houseAge}
              onChange={(e) => handleChange("houseAge", e.target.value)}
              placeholder="41"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalRooms">Total Rooms</Label>
            <Input
              id="totalRooms"
              type="number"
              value={formData.totalRooms}
              onChange={(e) => handleChange("totalRooms", e.target.value)}
              placeholder="880"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalBedrooms">Total Bedrooms</Label>
            <Input
              id="totalBedrooms"
              type="number"
              value={formData.totalBedrooms}
              onChange={(e) => handleChange("totalBedrooms", e.target.value)}
              placeholder="129"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oceanProximity">Ocean Proximity</Label>
            <Select
              value={formData.oceanProximity}
              onValueChange={(value) => handleChange("oceanProximity", value)}
            >
              <SelectTrigger>
                <Waves className="h-4 w-4 mr-2 text-primary" />
                <SelectValue placeholder="Select proximity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEAR BAY">Near Bay</SelectItem>
                <SelectItem value="<1H OCEAN">&lt;1H Ocean</SelectItem>
                <SelectItem value="INLAND">Inland</SelectItem>
                <SelectItem value="NEAR OCEAN">Near Ocean</SelectItem>
                <SelectItem value="ISLAND">Island</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Demographics Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Users className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">Demographics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="population">Population</Label>
            <Input
              id="population"
              type="number"
              value={formData.population}
              onChange={(e) => handleChange("population", e.target.value)}
              placeholder="322"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="households">Households</Label>
            <Input
              id="households"
              type="number"
              value={formData.households}
              onChange={(e) => handleChange("households", e.target.value)}
              placeholder="126"
            />
          </div>
        </div>
      </div>

      {/* Income Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <DollarSign className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">Income</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="medianIncome">Median Income (in $10,000s)</Label>
          <Input
            id="medianIncome"
            type="number"
            step="any"
            value={formData.medianIncome}
            onChange={(e) => handleChange("medianIncome", e.target.value)}
            placeholder="8.3252"
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="gold"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Calculating...
          </>
        ) : (
          <>
            <Home className="mr-2 h-5 w-5" />
            Predict House Price
          </>
        )}
      </Button>
    </form>
  );
};

export default PredictionForm;
