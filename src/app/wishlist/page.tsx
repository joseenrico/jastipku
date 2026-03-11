"use client";

import Link from "next/link";
import { useWishlist } from "@/contexts/WishlistContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MapPin, Calendar, Plane, ArrowRight, ShoppingBag } from "lucide-react";
import { getJastiperById } from "@/lib/data";
import { toast } from "sonner";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, removeFromWishlist } = useWishlist();

  const handleRemove = (tripId: string) => {
    removeFromWishlist(tripId);
    toast.success("Removed from wishlist");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-medium">My Saved Trips</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">My Wishlist</h1>
          <p className="text-lg text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? "trip" : "trips"} saved for later
          </p>
        </div>

        {/* Wishlist Grid */}
        {wishlist.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((trip, index) => {
              const jastiper = getJastiperById(trip.jastiperId);
              const isInWishlist = true;

              return (
                <Card
                  key={trip.id}
                  className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={(trip as any).imageUrl || `https://source.unsplash.com/400x300/?${trip.destination}`}
                      alt={trip.destination}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 rounded-full shadow-lg hover:scale-110 transition-transform"
                        onClick={() => handleRemove(trip.id)}
                      >
                        <Heart className="h-4 w-4 fill-primary text-primary" />
                      </Button>
                    </div>
                    <Badge className="absolute bottom-3 left-3 bg-primary/90 backdrop-blur-sm">
                      {trip.status === "open" ? "Open" : trip.status}
                    </Badge>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div>
                      <div className="flex items-start gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <div>
                          <h3 className="font-semibold text-lg">{trip.destination}</h3>
                          <p className="text-sm text-muted-foreground">Trip to {trip.country}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(trip.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(trip.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {jastiper?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{jastiper?.name}</p>
                        <p className="text-xs text-muted-foreground">Jastiper</p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button asChild className="w-full gap-2">
                      <Link href={`/trips/${(trip as any).slug || trip.id}`}>
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-16 space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">Your wishlist is empty</h3>
              <p className="text-muted-foreground">
                Start exploring trips and save the ones you&apos;re interested in!
              </p>
            </div>
            <Button asChild size="lg" className="gap-2">
              <Link href="/trips">
                <ShoppingBag className="h-5 w-5" />
                Browse Trips
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
