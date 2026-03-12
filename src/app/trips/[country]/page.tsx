"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getTripBySlug } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useMapTransition } from "@/components/trips/map/MapTransitionContext";
import { getCountryBySlug, CountryData, CityData } from "@/components/trips/map/MapData";

const OSMMap = dynamic(() => import("@/components/trips/map/OSMMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />,
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function TripCitiesPage() {
  const params = useParams();
  const router = useRouter();
  const countrySlug = params.country as string;
  const trip = getTripBySlug(countrySlug);
  const cities = (trip as any)?.cities || [];
  const countryData = getCountryBySlug(countrySlug);
  const { startTransition, resetToWorld, transitionKey } = useMapTransition();

  const handleCityClick = (city: CityData) => {
    if (countryData) {
      router.push(`/trips/${countrySlug}/${city.slug}`);
    }
  };

  const handleBack = () => {
    // Trigger zoom out transition before navigating
    resetToWorld();
    setTimeout(() => {
      router.push("/trips");
    }, 300); // Delay to allow transition to complete
  };

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Trip not found</h1>
          <Button asChild>
            <Link href="/trips">Back to Trips</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <OSMMap 
          key={transitionKey}
          mode="country" 
          countrySlug={countrySlug}
          onCityClick={handleCityClick}
        />
      </div>

      <div className="relative z-10 min-h-screen">
        <div className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8"
          >
            <div className="space-y-3">
              <Button 
                asChild 
                variant="ghost" 
                className="h-auto px-0 text-muted-foreground hover:text-foreground bg-background/60 backdrop-blur-sm"
                onClick={handleBack}
              >
                <Link href="/trips" className="flex items-center gap-2 text-sm">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Regions
                </Link>
              </Button>
              <Badge variant="outline" className="px-4 py-2 border-primary/50 text-primary text-xs font-bold uppercase tracking-widest bg-background/80 backdrop-blur-sm">
                Choose a City
              </Badge>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold tracking-tight text-foreground drop-shadow-lg"
              >
                {trip.destination}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted-foreground max-w-2xl bg-background/60 backdrop-blur-sm p-3 rounded-lg"
              >
                Select a city to see full trip details and submit your request. Click on the map markers to navigate.
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">{cities.length} Cities</Badge>
              <Badge variant="outline" className="capitalize bg-background/80 backdrop-blur-sm">
                {trip.status === "open" ? "Open" : trip.status}
              </Badge>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {cities.map((city: any, index: number) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <Link
                  href={`/trips/${countrySlug}/${slugify(city.name)}/jastipers`}
                  className="group block"
                  onClick={() => handleCityClick({ name: city.name, slug: slugify(city.name), coordinates: { lat: 0, lng: 0 }, jastiper_count: city.jastiper_count, image: city.image })}
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 dark:bg-black/60 backdrop-blur-xl">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={city.image || (trip as any).imageUrl || `https://source.unsplash.com/600x400/?${city.name}`}
                        alt={city.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <Badge className="absolute top-3 left-3 bg-white/90 text-foreground text-xs">
                        {city.jastiper_count || 0} Jastipers
                      </Badge>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 text-primary" />
                        <span>{trip.destination}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                          {city.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
