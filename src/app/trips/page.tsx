"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getAllTrips } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMapTransition } from "@/components/trips/map/MapTransitionContext";
import { COUNTRIES_DATA, CountryData } from "@/components/trips/map/MapData";

const OSMMap = dynamic(() => import("@/components/trips/map/OSMMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />,
});

export default function TripsPage() {
  const trips = getAllTrips();
  const router = useRouter();
  const { startTransition, transitionKey } = useMapTransition();

  const handleCountryClick = (country: CountryData) => {
    router.push(`/trips/${country.slug}`);
  };

  const handleExploreClick = (slug: string) => {
    const country = COUNTRIES_DATA.find(c => c.slug === slug);
    if (country) {
      startTransition(country);
    }
    router.push(`/trips/${slug}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <OSMMap 
          key={transitionKey}
          mode="world"
          onCountryClick={handleCountryClick}
        />
      </div>

      <div className="relative z-10 min-h-screen">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="outline" className="px-4 py-2 border-primary/50 text-primary text-xs font-bold uppercase tracking-widest bg-background/80 backdrop-blur-sm">
                  Explore by Region
                </Badge>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold tracking-tight text-foreground drop-shadow-lg"
              >
                Choose Your Jastiper Locations
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted-foreground max-w-2xl bg-background/60 backdrop-blur-sm p-3 rounded-lg"
              >
                Click on a marker to explore cities, or choose from the cards below.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button asChild variant="outline" className="rounded-full bg-background/80 backdrop-blur-sm">
                <Link href="/">Back to Home</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          >
            {trips.map((trip, index) => {
              const cities = (trip as any).cities || [];
              const cityCount = cities.length;
              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                >
                  <Link
                    href={`/trips/${(trip as any).slug || trip.id}`}
                    className="group block"
                    onClick={() => handleExploreClick((trip as any).slug || trip.id)}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 dark:bg-black/60 backdrop-blur-xl">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={(trip as any).imageUrl || `https://source.unsplash.com/600x400/?${trip.destination}`}
                          alt={trip.destination}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <Badge className="absolute top-3 left-3 bg-white/90 text-foreground text-xs">
                          {cityCount} Cities
                        </Badge>
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 text-primary" />
                          <span>{trip.country}</span>
                        </div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                          {trip.destination}
                        </h3>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">{trip.status === "open" ? "Open" : trip.status}</Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
