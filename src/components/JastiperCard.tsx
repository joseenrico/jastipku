"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Plane, Package, CheckCircle, ArrowRight, MapPin, Heart } from "lucide-react";
import type { Jastiper } from "@/types";
import { useState } from "react";

interface JastiperCardProps {
  jastiper: Jastiper;
}

export function JastiperCard({ jastiper }: JastiperCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group overflow-visible border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col rounded-t-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="text-center pb-2 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative">
          <Avatar className="w-24 h-24 mx-auto ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
            <AvatarImage src={jastiper.avatar} alt={jastiper.name} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-orange-500 text-white">
              {jastiper.name.split(" ").map((n: string) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          
          {/* Verified Badge */}
          {jastiper.verified && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
              <Badge className="bg-emerald-500/90 backdrop-blur-sm text-xs gap-1 pl-1.5">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{jastiper.name}</h3>
          <div className="flex items-center justify-center gap-1 text-sm">
            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded-full">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{jastiper.rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">({jastiper.totalOrders} orders)</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-grow space-y-4">
        <p className="text-sm text-muted-foreground text-center leading-relaxed line-clamp-2">
          {jastiper.bio}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/5 group-hover:from-primary/20 group-hover:to-orange-500/10 transition-all duration-300">
            <div className="flex items-center justify-center gap-1.5 font-bold text-lg text-primary">
              <Plane className="h-4 w-4" />
              {jastiper.totalTrips}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Total Trips</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/5 group-hover:from-primary/20 group-hover:to-orange-500/10 transition-all duration-300">
            <div className="flex items-center justify-center gap-1.5 font-bold text-lg text-primary">
              <Package className="h-4 w-4" />
              {jastiper.totalOrders}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Orders Done</div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground pt-2">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span>Indonesia</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button asChild variant="outline" className="w-full group/btn hover:bg-primary hover:text-primary-foreground transition-all duration-300">
          <Link href={`/jastiper/${jastiper.id}`} className="flex items-center justify-center gap-2">
            View Profile
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
