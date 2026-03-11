"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Star, MapPin, Clock, ArrowRight, Heart } from "lucide-react";
import type { Trip } from "@/types";
import { useWishlist } from "@/contexts/WishlistContext";
import { useState } from "react";
import { toast } from "sonner";

interface TripCardProps {
  trip: Trip;
  jastiperName: string;
  jastiperRating: number;
}

export function TripCard({ trip, jastiperName, jastiperRating }: TripCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(trip);
    const added = !isInWishlist(trip.id);
    toast.success(added ? "Added to wishlist!" : "Removed from wishlist", {
      description: trip.destination,
    });
  };

  return (
    <Card
      className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={(trip as any).imageUrl || `https://source.unsplash.com/400x300/?${trip.destination}`}
          alt={trip.destination}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        <Badge className={`absolute top-3 left-3 transition-all duration-300 ${trip.status === "open"
            ? "bg-emerald-500/90 backdrop-blur-sm"
            : "bg-muted/90 backdrop-blur-sm"
          }`}>
          {trip.status === "open" ? "✓ Open" : trip.status}
        </Badge>

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="secondary"
          className={`absolute top-3 right-3 h-9 w-9 rounded-full backdrop-blur-sm transition-all duration-300 ${isInWishlist(trip.id)
              ? "bg-primary/90 text-white"
              : "bg-white/90 hover:bg-primary hover:text-white"
            } ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-4 w-4 ${isInWishlist(trip.id) ? 'fill-white' : ''}`} />
        </Button>

        {/* Category Badge */}
        <div className={`absolute bottom-3 left-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Badge variant="secondary" className="backdrop-blur-sm">
            {(trip as any).category || "Shopping"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">{trip.country}</span>
            </div>
            <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{trip.destination}</h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2 space-y-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {(trip as any).description || `Join our exciting jastip trip to ${trip.destination}! Shop for authentic products and enjoy a hassle-free experience.`}
        </p>

        <div className="flex items-center gap-2 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{jastiperRating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground truncate">{jastiperName}</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full group/btn bg-primary hover:bg-primary/90">
          <Link href={`/trips/${(trip as any).slug || trip.id}`} className="flex items-center justify-center gap-2">
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
