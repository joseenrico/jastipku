"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Plane,
  Clock,
  Lock,
  Package,
  CheckCircle2,
  Star,
  Calendar,
  Users,
  Info,
  Shield,
  Zap,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getTripBySlug, getJastiperById, getTripsByJastiperId, getReviewsByJastiperId } from "@/lib/data";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useMapTransition } from "@/components/trips/map/MapTransitionContext";
import { getCountryBySlug } from "@/components/trips/map/MapData";

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

interface OrderItem {
  name: string;
  category: string;
  estimatedPrice: string;
  quantity: number;
  notes: string;
}

const galleryImages: Record<string, { src: string; alt: string }[]> = {
  trip1: [
    { src: "/images/south-korea/south-korea-1.jpg", alt: "Seoul street view" },
    { src: "/images/south-korea/south-korea-2.jpg", alt: "Korean skincare products" },
    { src: "/images/south-korea/south-korea-3.jpg", alt: "Myeongdong shopping" },
    { src: "/images/south-korea/south-korea-4.jpg", alt: "Korean fashion" },
  ],
  trip2: [
    { src: "/images/japan/japan-1.jpg", alt: "Tokyo street" },
    { src: "/images/japan/japan-2.jpg", alt: "Akihabara electronics" },
    { src: "/images/japan/japan-3.jpg", alt: "Tokyo tower" },
    { src: "/images/japan/japan-4.jpg", alt: "Japanese snacks" },
  ],
  trip3: [
    { src: "/images/usa/usa-1.jpg", alt: "San Francisco" },
    { src: "/images/usa/usa-2.jpg", alt: "New York City" },
    { src: "/images/usa/usa-3.jpg", alt: "NYC street" },
    { src: "/images/usa/usa-4.jpg", alt: "American fashion" },
  ],
  trip4: [
    { src: "/images/thailand/thailand-1.jpg", alt: "Bangkok street" },
    { src: "/images/thailand/thailand-2.jpg", alt: "Thai market" },
    { src: "/images/thailand/thailand-3.jpg", alt: "Thai cosmetics" },
    { src: "/images/thailand/thailand-4.jpg", alt: "Thai snacks" },
  ],
  trip5: [
    { src: "/images/singapore/singapore-1.jpg", alt: "Singapore skyline" },
    { src: "/images/singapore/singapore-2.jpg", alt: "Orchard Road" },
    { src: "/images/singapore/singapore-3.jpg", alt: "Singapore tech" },
    { src: "/images/singapore/singapore-4.jpg", alt: "Singapore electronics" },
  ],
  trip6: [
    { src: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800", alt: "London street view" },
    { src: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800", alt: "Manchester shopping" },
    { src: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800", alt: "Edinburgh castle" },
    { src: "https://images.unsplash.com/photo-1520939817895-060bdaf4de1e?w=800", alt: "British cosmetics" },
  ],
  trip7: [
    { src: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800", alt: "Sydney Opera House" },
    { src: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800", alt: "Melbourne street" },
    { src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800", alt: "Gold Coast beach" },
    { src: "https://images.unsplash.com/photo-1528659570420-ef5354e30e40?w=800", alt: "UGG boots Australia" },
  ],
  trip8: [
    { src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", alt: "Paris Eiffel Tower" },
    { src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800", alt: "Nice French Riviera" },
    { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800", alt: "Lyon shopping" },
    { src: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800", alt: "French perfume" },
  ],
  trip9: [
    { src: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800", alt: "Berlin street" },
    { src: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800", alt: "Munich architecture" },
    { src: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800", alt: "Frankfurt skyline" },
    { src: "https://images.unsplash.com/photo-1572508589189-898f3e17a6c6?w=800", alt: "German tech gadgets" },
  ],
  trip10: [
    { src: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800", alt: "Rome Colosseum" },
    { src: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800", alt: "Milan fashion" },
    { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800", alt: "Florence art" },
    { src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800", alt: "Italian leather goods" },
  ],
};

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { resetToWorld } = useMapTransition();
  const countrySlug = params.country as string;
  const citySlug = params.city as string;
  const trip = getTripBySlug(countrySlug);
  const jastiper = trip ? getJastiperById(trip.jastiperId) : null;
  const otherTrips = jastiper && trip ? getTripsByJastiperId(jastiper.id).filter((t) => t.id !== trip.id) : [];
  const reviews = jastiper ? getReviewsByJastiperId(jastiper.id) : [];
  const cityData = trip && (trip as any).cities
    ? (trip as any).cities.find((city: any) => slugify(city.name) === citySlug)
    : null;
  const destinationLabel = cityData?.name || trip?.destination || "";
  const locationLabel = cityData && trip ? `${cityData.name}, ${trip.destination}` : trip?.destination || "";
  const countryData = getCountryBySlug(countrySlug);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { name: "", category: "", estimatedPrice: "", quantity: 1, notes: "" },
  ]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(true);

  const baseGallery = trip
    ? (galleryImages[trip.id] || [{ src: (trip as any).imageUrl || "", alt: trip.destination }])
    : [{ src: "", alt: "" }];
  const cityGallery = cityData?.image
    ? [{ src: cityData.image, alt: locationLabel || destinationLabel }]
    : [];
  const gallery = trip ? [...cityGallery, ...baseGallery] : [{ src: "", alt: "" }];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    // Trigger zoom out transition before navigating
    resetToWorld();
    setTimeout(() => {
      router.push(`/trips`);
    }, 300); // Delay to allow transition to complete
  };

  const handleToggleWishlist = () => {
    if (trip) {
      toggleWishlist(trip);
      const isIn = isInWishlist(trip.id);
      toast.success(isIn ? "Removed from wishlist" : "Added to wishlist!");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  if (!trip || !jastiper || !cityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Destination not found</h1>
          <Button asChild>
            <Link href="/trips">Back to Trips</Link>
          </Button>
        </div>
      </div>
    );
  }

  const addItem = () => {
    setOrderItems([...orderItems, { name: "", category: "", estimatedPrice: "", quantity: 1, notes: "" }]);
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderItems(newItems);
  };

  const removeItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (parseFloat(item.estimatedPrice) || 0) * item.quantity, 0);
    const feePercent = parseInt((trip as any).fee || "15") / 100;
    const fee = subtotal * feePercent;
    return { subtotal, fee, total: subtotal + fee };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Login required", {
        description: "Please login to submit a request to the jastiper.",
      });
      router.push(`/login?next=/trips/${encodeURIComponent(countrySlug)}/${encodeURIComponent(citySlug)}`);
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Order submitted successfully!", {
      description: "Jastiper will review your request soon.",
    });

    setIsSubmitting(false);
    router.push("/profile");
  };

  const { subtotal, fee, total } = calculateTotal();
  const currentImage = gallery[currentImageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Animated Map Background */}
      <AnimatePresence>
        {isMapVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-0"
          >
            <OSMMap
              mode="city"
              countrySlug={countrySlug}
              citySlug={citySlug}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background z-10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Image Section */}
      <div className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />

        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="w-full h-full object-cover transition-all duration-500"
        />

        <div className="absolute inset-0 z-20 flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevImage}
            className="h-12 w-12 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextImage}
            className="h-12 w-12 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 p-6 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleWishlist}
              className={`rounded-full backdrop-blur-sm ${trip && isInWishlist(trip.id) ? "bg-red-500/80 text-white" : "bg-black/40 hover:bg-black/60 text-white"}`}
            >
              <Heart className={`h-5 w-5 ${trip && isInWishlist(trip.id) ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Image Counter & Badge */}
        <div className="absolute bottom-6 left-6 z-30 flex items-center gap-3">
          <Badge className="bg-primary/90 backdrop-blur-sm px-4 py-2 text-sm font-medium">
            {trip.status === "open" ? "✓ Open for Orders" : trip.status}
          </Badge>
          <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium">
            {currentImageIndex + 1} / {gallery.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-6 right-6 z-30">
          <ScrollArea className="w-[280px]">
            <div className="flex gap-2">
              {gallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                    index === currentImageIndex
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-black scale-105"
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 -mt-10 relative z-40">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Info Card */}
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold">{locationLabel || trip.destination}</h1>
                      <p className="text-muted-foreground">Trip to {trip.country}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Trip Details Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="group p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <Plane className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Departure</p>
                        <p className="font-semibold">{new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                      </div>
                    </div>
                  </div>
                  <div className="group p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/20">
                        <Clock className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Return</p>
                        <p className="font-semibold">{new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                      </div>
                    </div>
                  </div>
                  <div className="group p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <Package className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Max Weight</p>
                        <p className="font-semibold">{(trip as any).maxWeight || "10"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    About This Trip
                  </h3>
                  <p className={`text-muted-foreground leading-relaxed ${!isExpanded ? "line-clamp-3" : ""}`}>
                    {(trip as any).description || `Join our exciting jastip trip to ${locationLabel || trip.destination}! We'll be shopping for the best products and bringing them back to you.`}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 h-auto p-0 text-primary hover:text-white hover:bg-primary/80"
                  >
                    {isExpanded ? (
                      <>
                        Show less <ChevronUp className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Show more <ChevronDown className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Jastiper Card */}
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                    <AvatarImage src={jastiper.avatar} alt={jastiper.name} />
                    <AvatarFallback className="text-lg">{jastiper.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold">{jastiper.name}</h2>
                      {jastiper.verified && (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{jastiper.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({reviews.length} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Plane className="h-4 w-4" />
                        <span>{jastiper.totalTrips} trips</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{jastiper.totalOrders} orders</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{jastiper.bio}</p>
                    <Button asChild variant="outline" size="sm" className="mt-3">
                      <Link href={`/jastiper/${jastiper.id}`}>View Full Profile</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Why Book This Trip?
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Verified Jastiper</p>
                      <p className="text-xs text-muted-foreground">Identity verified</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Fast Updates</p>
                      <p className="text-xs text-muted-foreground">Real-time tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">On Time</p>
                      <p className="text-xs text-muted-foreground">Guaranteed delivery</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Order Form */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm sticky top-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Request Order
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Service fee: {(trip as any).fee || "15"}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="space-y-3 p-4 rounded-xl border bg-muted/30 relative group">
                    {orderItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                      >
                        <ArrowLeft className="h-4 w-4 rotate-45" />
                      </button>
                    )}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Item Name</Label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(index, "name", e.target.value)}
                        placeholder="e.g., COSRX Snail Essence"
                        className="h-10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Category</Label>
                      <Input
                        value={item.category}
                        onChange={(e) => updateItem(index, "category", e.target.value)}
                        placeholder="e.g., Skincare"
                        className="h-10"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Est. Price</Label>
                        <Input
                          type="number"
                          value={item.estimatedPrice}
                          onChange={(e) => updateItem(index, "estimatedPrice", e.target.value)}
                          placeholder="0"
                          className="h-10"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Qty</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                          className="h-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Notes (Optional)</Label>
                      <Textarea
                        value={item.notes}
                        onChange={(e) => updateItem(index, "notes", e.target.value)}
                        placeholder="Size, color, variant..."
                        rows={2}
                        className="resize-none"
                      />
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addItem} className="w-full border-dashed">
                  + Add Another Item
                </Button>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Shipping Address</Label>
                  <Textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your complete address"
                    rows={3}
                    className="resize-none"
                    required
                  />
                </div>

                <Separator />

                <div className="space-y-2 p-4 rounded-xl bg-muted/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">IDR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee ({(trip as any).fee || "15"}%)</span>
                    <span className="font-medium">IDR {fee.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Estimate</span>
                    <span className="text-primary">IDR {total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : user ? "Submit Request" : (
                    <span className="inline-flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Login to Submit
                    </span>
                  )}
                </Button>

                {!user && (
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    You can browse freely. Login is required only when you submit a request.
                  </p>
                )}

                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  This is an estimate. Final price may vary based on actual purchase and exchange rate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
