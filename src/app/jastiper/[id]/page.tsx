"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star,
  Package,
  Plane,
  Phone,
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  ArrowLeft,
  TrendingUp,
  Users,
  Award,
  Heart,
  MessageSquare,
  Shield,
} from "lucide-react";
import {
  getJastiperById,
  getTripsByJastiperId,
  getReviewsByJastiperId,
  getOrdersByJastiperId,
  getUserById,
} from "@/lib/data";
import { TripCard } from "@/components/TripCard";

export default function JastiperProfilePage() {
  const params = useParams();
  const jastiperId = params.id as string;
  const jastiper = getJastiperById(jastiperId);

  if (!jastiper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Jastiper not found</h1>
          <Button asChild>
            <Link href="/trips">Back to Trips</Link>
          </Button>
        </div>
      </div>
    );
  }

  const trips = getTripsByJastiperId(jastiperId);
  const reviews = getReviewsByJastiperId(jastiperId);
  const orders = getOrdersByJastiperId(jastiperId);
  const activeTrips = trips.filter((t) => t.status === "open");

  const stats = [
    { icon: Star, value: jastiper.rating.toFixed(1), label: "Average Rating", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { icon: Package, value: orders.length, label: "Orders Completed", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Plane, value: trips.length, label: "Total Trips", color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: Users, value: reviews.length, label: "Reviews", color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Banner */}
      <div className="relative h-64 bg-gradient-to-br from-primary via-orange-500 to-primary bg-300% animate-gradient overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm" asChild>
            <Link href="/trips">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="container py-8 -mt-32 relative z-10">
        {/* Profile Card */}
        <Card className="border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Avatar Section */}
              <div className="relative md:w-80 h-48 md:h-auto bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center p-8">
                <Avatar className="w-40 h-40 ring-4 ring-white shadow-2xl relative z-10">
                  <AvatarImage src={jastiper.avatar} alt={jastiper.name} />
                  <AvatarFallback className="text-3xl bg-primary text-white">
                    {jastiper.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Info Section */}
              <div className="flex-1 p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{jastiper.name}</h1>
                      {jastiper.verified && (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 gap-1 px-3 py-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4" />
                      {jastiper.email}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {jastiper.phone}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">{jastiper.bio}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className={`p-4 rounded-xl ${stat.bg} border`}>
                        <div className={`flex items-center gap-2 mb-2 ${stat.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap gap-2 mt-6">
                  <Badge variant="outline" className="gap-1 px-3 py-1">
                    <Calendar className="h-3 w-3" />
                    Joined {new Date(jastiper.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </Badge>
                  <Badge variant="outline" className="gap-1 px-3 py-1">
                    <Shield className="h-3 w-3" />
                    Identity Verified
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Badges */}
        <Card className="p-4 mt-6 border-0 shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Achievements
            </h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: TrendingUp, label: "Top Rated", color: "text-yellow-500", condition: jastiper.rating >= 4.8 },
                { icon: Package, label: "100+ Orders", color: "text-blue-500", condition: orders.length >= 50 },
                { icon: Plane, label: "Frequent Traveler", color: "text-purple-500", condition: trips.length >= 10 },
                { icon: Heart, label: "Customer Favorite", color: "text-red-500", condition: reviews.length >= 20 },
                { icon: MessageSquare, label: "Responsive", color: "text-green-500", condition: true },
                { icon: Shield, label: "Trusted", color: "text-indigo-500", condition: jastiper.verified },
              ].map(
                (badge) =>
                  badge.condition && (
                    <div
                      key={badge.label}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border hover:shadow-md transition-shadow"
                    >
                      <badge.icon className={`h-4 w-4 ${badge.color}`} />
                      <span className="text-sm font-medium">{badge.label}</span>
                    </div>
                  )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Trips */}
        <Card className="p-4 mt-6 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Plane className="h-5 w-5 text-primary" />
                  Active Trips
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTrips.length} trip{activeTrips.length !== 1 ? "s" : ""} available for orders
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/trips">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeTrips.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    jastiperName={jastiper.name}
                    jastiperRating={jastiper.rating}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <Plane className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No active trips at the moment</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="mt-6 border-0 shadow-lg">
          <CardHeader>
            {/* <div className="flex items-center justify-between"> */}
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Reviews
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""} from satisfied customers
                </p>
              </div>
            {/* </div> */}
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {reviews.map((review) => {
                    const user = getUserById(review.userId);
                    return (
                      <Card key={review.id} className="border-0 shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                              <AvatarFallback>
                                {user?.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-semibold">{user?.name || "Anonymous"}</p>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <Separator className="my-3" />
                              <p className="text-muted-foreground leading-relaxed">&quot;{review.comment}&quot;</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
