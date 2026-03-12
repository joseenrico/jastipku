"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getAllJastipers, getTripBySlug, getReviewsByJastiperId } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Star, Plane, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getCountryBySlug, getCityBySlug } from "@/components/trips/map/MapData";
import { useMapTransition } from "@/components/trips/map/MapTransitionContext";

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

export default function JastipersPage() {
  const params = useParams();
  const router = useRouter();
  const { resetToWorld, startTransition } = useMapTransition();
  const countrySlug = params.country as string;
  const citySlug = params.city as string;
  const trip = getTripBySlug(countrySlug);
  const allJastipers = getAllJastipers();
  const countryData = getCountryBySlug(countrySlug);
  
  // Decode city name from slug
  const cityName = citySlug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Get city data to find jastiper count
  const cityData = trip && (trip as any).cities
    ? (trip as any).cities.find((city: any) => slugify(city.name) === citySlug)
    : null;

  // Get jastipers - for demo, show all jastipers (in real app, filter by city)
  const jastipersInCity = allJastipers;

  // Limit to the jastiper_count from city data
  const displayedJastipers = jastipersInCity.slice(0, cityData?.jastiper_count || jastipersInCity.length);

  const handleBack = () => {
    router.push(`/trips/${countrySlug}`);
  };

  const handleJastiperSelect = (jastiper: any) => {
    // Navigate to city detail page with selected jastiper
    router.push(`/trips/${countrySlug}/${citySlug}?jastiper=${jastiper.id}`);
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
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <OSMMap
          mode="city"
          countrySlug={countrySlug}
          citySlug={citySlug}
        />
      </div>

      {/* Content Overlay */}
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
                <Link href={`/trips/${countrySlug}`} className="flex items-center gap-2 text-sm">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Cities
                </Link>
              </Button>
              <Badge variant="outline" className="px-4 py-2 border-primary/50 text-primary text-xs font-bold uppercase tracking-widest bg-background/80 backdrop-blur-sm">
                Choose Your Jastiper
              </Badge>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold tracking-tight text-foreground drop-shadow-lg"
              >
                {cityName}, {trip.destination}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted-foreground max-w-2xl bg-background/60 backdrop-blur-sm p-3 rounded-lg"
              >
                Select a verified jastiper to handle your shopping request. Click on a card to view their profile and submit your order.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {displayedJastipers.length} Jastipers Available
              </Badge>
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
            {displayedJastipers.map((jastiper: any, index: number) => {
              const reviews = getReviewsByJastiperId(jastiper.id);
              const avgRating = reviews.length > 0
                ? reviews.reduce((sum: any, r: any) => sum + r.rating, 0) / reviews.length
                : jastiper.rating || 0;

              return (
                <motion.div
                  key={jastiper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                >
                  <Link
                    href={`/trips/${countrySlug}/${citySlug}?jastiper=${jastiper.id}`}
                    className="group block"
                    onClick={() => handleJastiperSelect(jastiper)}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 dark:bg-black/60 backdrop-blur-xl">
                      {/* Jastiper Photo Header */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={jastiper.avatar || `https://i.pravatar.cc/400?u=${jastiper.id}`}
                          alt={jastiper.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge className="bg-white/90 text-foreground text-xs">
                            {jastiper.verified && (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            )}
                            Verified
                          </Badge>
                        </div>

                        {/* Rating */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-500/90 backdrop-blur-sm">
                          <Star className="h-3.5 w-3.5 fill-white text-white" />
                          <span className="text-xs font-bold text-white">{avgRating.toFixed(1)}</span>
                        </div>

                        {/* Jastiper Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-end gap-4">
                            <Avatar className="h-16 w-16 ring-4 ring-white/30">
                              <AvatarImage src={jastiper.avatar} alt={jastiper.name} />
                              <AvatarFallback className="text-lg font-bold">
                                {jastiper.name.split(" ").map((n: string) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                {jastiper.name}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-white/80">
                                <Plane className="h-3 w-3" />
                                <span>{jastiper.totalTrips} trips • {jastiper.totalOrders} orders</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <CardContent className="p-4 space-y-2">
                        {/* Bio */}
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {jastiper.bio || "Experienced jastiper ready to help with your shopping needs!"}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 text-primary" />
                            <span>{cityName}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Empty State */}
          {displayedJastipers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-background/60 backdrop-blur-sm rounded-2xl"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <Plane className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No Jastipers Available</h2>
              <p className="text-muted-foreground mb-6">
                There are currently no jastipers available in {cityName}. Check back later!
              </p>
              <Button asChild>
                <Link href={`/trips/${countrySlug}`}>Back to Cities</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
