"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plane, MapPin, Calendar, Package, Zap } from "lucide-react";

interface NewTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jastiperId: string;
  onSuccess?: () => void;
}

const COUNTRIES = [
  { value: "United States", slug: "united-states", cities: ["Los Angeles", "New York", "San Francisco", "Las Vegas"] },
  { value: "Japan", slug: "japan", cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama"] },
  { value: "South Korea", slug: "south-korea", cities: ["Seoul", "Busan", "Jeju", "Incheon"] },
  { value: "China", slug: "china", cities: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen"] },
  { value: "Thailand", slug: "thailand", cities: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya"] },
  { value: "Singapore", slug: "singapore", cities: ["Orchard", "Marina Bay", "Chinatown", "Sentosa"] },
  { value: "United Kingdom", slug: "united-kingdom", cities: ["London", "Manchester", "Birmingham", "Edinburgh"] },
  { value: "France", slug: "france", cities: ["Paris", "Lyon", "Marseille", "Nice"] },
  { value: "Germany", slug: "germany", cities: ["Berlin", "Munich", "Frankfurt", "Hamburg"] },
  { value: "Australia", slug: "australia", cities: ["Sydney", "Melbourne", "Brisbane", "Perth"] },
];

const CATEGORIES = [
  "Fashion & Luxury",
  "Electronics & Tech",
  "Beauty & Skincare",
  "Food & Snacks",
  "Hobbies & Collectibles",
  "Baby & Kids",
  "Sports & Outdoors",
  "Home & Living",
];

export function NewTripDialog({
  open,
  onOpenChange,
  jastiperId,
  onSuccess,
}: NewTripDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    country: "",
    departureDate: "",
    returnDate: "",
    category: "",
    maxWeight: "",
    fee: "",
    description: "",
  });

  const handleCountryChange = (country: string) => {
    setFormData((prev) => ({ ...prev, country, destination: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.destination || !formData.country || !formData.departureDate || !formData.returnDate) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      const tripData = {
        id: `trip-${Date.now()}`,
        jastiperId,
        destination: formData.destination,
        country: formData.country,
        slug: formData.country.toLowerCase().replace(/\s+/g, "-"),
        departureDate: formData.departureDate,
        returnDate: formData.returnDate,
        status: "upcoming" as const,
        category: formData.category || "General",
        description: formData.description || `Shopping trip to ${formData.destination}`,
        imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800",
        maxWeight: formData.maxWeight ? `${formData.maxWeight}kg` : "10kg",
        fee: formData.fee ? `${formData.fee}%` : "10%",
        cities: COUNTRIES.find((c) => c.value === formData.country)?.cities.map((city) => ({
          name: city,
          jastiper_count: 1,
          image: `/images/${formData.country.toLowerCase().replace(/\s+/g, "-")}/${city.toLowerCase().replace(/\s+/g, "-")}.jpg`,
        })) || [],
      };

      const existingTrips = JSON.parse(localStorage.getItem("trips") || "[]");
      existingTrips.push(tripData);
      localStorage.setItem("trips", JSON.stringify(existingTrips));

      toast.success("Trip created successfully!", {
        description: `Your trip to ${formData.destination} has been added.`,
      });

      setFormData({
        destination: "",
        country: "",
        departureDate: "",
        returnDate: "",
        category: "",
        maxWeight: "",
        fee: "",
        description: "",
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create trip", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCountry = COUNTRIES.find((c) => c.value === formData.country);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Plane className="h-6 w-6 text-primary" />
            Create New Trip
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
              <MapPin className="h-4 w-4 text-primary" />
              Destination
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="font-semibold">
                  Country <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.country}
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger id="country" className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="font-semibold">
                  City <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.destination}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, destination: value }))
                  }
                  disabled={!formData.country}
                >
                  <SelectTrigger id="destination" className="w-full">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCountry?.cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
              <Calendar className="h-4 w-4 text-primary" />
              Travel Dates
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureDate" className="font-semibold">
                  Departure Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      departureDate: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="returnDate" className="font-semibold">
                  Return Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      returnDate: e.target.value,
                    }))
                  }
                  min={
                    formData.departureDate || new Date().toISOString().split("T")[0]
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
              <Package className="h-4 w-4 text-primary" />
              Trip Details
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="font-semibold">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxWeight" className="font-semibold">
                  Max Weight (kg)
                </Label>
                <Input
                  id="maxWeight"
                  type="number"
                  placeholder="10"
                  value={formData.maxWeight}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxWeight: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee" className="font-semibold">
                  Service Fee (%)
                </Label>
                <Input
                  id="fee"
                  type="number"
                  placeholder="10"
                  value={formData.fee}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fee: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Tell buyers what items you can help them purchase..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Creating..."
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Create Trip
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
