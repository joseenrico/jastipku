"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getOrderById, getJastiperById, getTripById, getUserById } from "@/lib/data";
import { OrderTimeline, OrderStatus, statusConfig } from "@/components/OrderStatus";
import { 
  ArrowLeft, 
  MessageSquare, 
  Camera, 
  ShieldCheck, 
  MapPin, 
  Package, 
  Info,
  ChevronRight,
  ShoppingBag,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { P2PChat } from "@/components/P2PChat";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const countryThemes: Record<string, { gradient: string; accent: string; label: string }> = {
  "Korea": { gradient: "from-purple-500/10 via-background to-background", accent: "text-purple-600", label: "🇰🇷 K-Logistics" },
  "Japan": { gradient: "from-rose-500/10 via-background to-background", accent: "text-rose-600", label: "🇯🇵 Nippon Express" },
  "US": { gradient: "from-blue-600/10 via-background to-background", accent: "text-blue-700", label: "🇺🇸 Stateside Cargo" },
  "Thailand": { gradient: "from-emerald-500/10 via-background to-background", accent: "text-emerald-600", label: "🇹🇭 Siam Delivery" },
  "Singapore": { gradient: "from-red-500/10 via-background to-background", accent: "text-red-600", label: "🇸🇬 Lion City Post" },
  "Default": { gradient: "from-primary/5 via-background to-background", accent: "text-primary", label: "🌐 Global Logistics" }
};

export default function OrderTrackingPage() {
  const { user: currentUser } = useAuth();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "chat" ? "chat" : "manifest";
  const [activeTab, setActiveTab] = useState(initialTab);
  const params = useParams();
  const orderId = params.id as string;
  const order = getOrderById(orderId);

  const trip = order?.tripId ? getTripById(order.tripId) : undefined;
  const jastiper = order?.jastiperId ? getJastiperById(order.jastiperId) : undefined;
  const fallbackUser = order ? getUserById(order.userId) : undefined;
  const chatUser = currentUser || fallbackUser;
  const theme = countryThemes[trip?.country || "Default"] || countryThemes["Default"];

  if (!order) {
    return (
      <div className="container py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
          <Info className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter">Order Not Found</h1>
        <p className="text-muted-foreground">Maaf, kami tidak dapat menemukan pesanan ini.</p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/profile">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

// trip and jastiper already defined at top level
// trip and order already defined at top level
  
  const handleConfirmArrival = () => {
    toast.success("Arrival Confirmed!", {
      description: "JastipPay funds will be released to the Jastiper shortly."
    });
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="container max-w-6xl py-10 px-4">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Button asChild variant="ghost" className="rounded-xl hover:bg-background">
            <Link href="/profile" className="flex items-center gap-2 font-bold">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="flex gap-2 items-center">
            <Badge variant="outline" className={`rounded-full px-4 py-1.5 bg-background shadow-sm border-current ${theme.accent} font-black text-[10px] uppercase tracking-widest`}>
              {theme.label}
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1.5 bg-background shadow-sm border-primary/20 text-primary font-bold">
              #{order.id}
            </Badge>
            <OrderStatus status={order.status} />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Info Area */}
          <div className="lg:col-span-3 space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-background border rounded-xl h-12 p-1">
                  <TabsTrigger value="manifest" className="rounded-lg font-bold px-6">Logistics Manifest</TabsTrigger>
                  <TabsTrigger value="chat" className="rounded-lg font-bold px-6 gap-2">
                    <MessageSquare className="h-4 w-4" />
                    P2P Chat
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="manifest" className="space-y-8 mt-0 outline-none">
                {/* Status Card */}
                <Card className={`border-0 shadow-xl bg-gradient-to-br ${theme.gradient} overflow-hidden rounded-[2.5rem]`}>
                  <CardHeader className="pb-0 pt-10 px-10">
                    <div className="space-y-1">
                      <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme.accent}`}>Current Status</p>
                      <h1 className="text-4xl font-black tracking-tighter">
                        {statusConfig[order.status].label}
                      </h1>
                      <p className="text-muted-foreground font-medium">
                        {statusConfig[order.status].description}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10">
                    <OrderTimeline status={order.status} />
                  </CardContent>
                </Card>

                {/* Live Proof Gallery */}
                <Card className="border-0 shadow-lg rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="px-10 pt-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Camera className="h-6 w-6 text-primary" />
                        Live Verification Proof
                      </h2>
                      <Badge variant="secondary" className="rounded-full">Real-time Updates</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-10 pb-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=400", // Luxury bag
                        "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&q=80&w=400", // Clothing store
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400"  // Sneaker verification
                      ].map((url, i) => (
                        <motion.div 
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="aspect-square bg-muted rounded-3xl overflow-hidden relative group cursor-pointer"
                        >
                          <img 
                            src={url} 
                            alt={`Proof ${i + 1}`} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                          <div className="absolute bottom-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-lg text-[8px] text-white font-black uppercase tracking-widest leading-none">
                            Verified Photo • {trip?.destination}
                          </div>
                        </motion.div>
                      ))}
                      <div className="aspect-square border-2 border-dashed border-muted rounded-3xl flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <Clock className="h-6 w-6 opacity-30" />
                        <span className="text-[10px] uppercase font-black">Waiting for next shot</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Handover Action Center */}
                {order.status === "in-transit" && (
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <Alert className="bg-primary/5 border-primary/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6">
                      <div className="p-4 bg-primary rounded-2xl">
                        <ShieldCheck className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1 text-center md:text-left space-y-2">
                        <AlertTitle className="text-xl font-black tracking-tight">Ready for Arrival Verification?</AlertTitle>
                        <AlertDescription className="text-muted-foreground font-medium">
                          Jastiper has stated they are approaching Indonesia. Please only confirm arrival once you have officially received the items or verified the local shipping AWB.
                        </AlertDescription>
                      </div>
                      <Button onClick={handleConfirmArrival} size="lg" className="rounded-2xl h-16 px-10 font-bold bg-primary hover:bg-primary/90 text-white shadow-xl">
                        Confirm Safe Arrival
                      </Button>
                    </Alert>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="chat" className="mt-0 outline-none">
                {chatUser && jastiper && (
                  <P2PChat 
                    orderId={order.id}
                    currentUser={{ id: chatUser.id, name: chatUser.name, avatar: chatUser.avatar }}
                    otherUser={{ id: jastiper.id, name: jastiper.name, avatar: jastiper.avatar, role: "Jastiper" }}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Jastiper Card */}
            {jastiper && (
              <Card className="border-0 shadow-lg rounded-[2rem] p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage src={jastiper.avatar} alt={jastiper.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{jastiper.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{jastiper.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-500" />
                      Verified Jastiper
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/40 rounded-2xl text-center">
                    <p className="text-lg font-black">{jastiper.rating.toFixed(1)}</p>
                    <p className="text-[8px] uppercase font-black text-muted-foreground">Rating</p>
                  </div>
                  <div className="p-4 bg-muted/40 rounded-2xl text-center">
                    <p className="text-lg font-black">{jastiper.totalOrders}</p>
                    <p className="text-[8px] uppercase font-black text-muted-foreground">Trips</p>
                  </div>
                </div>
                <Button className="w-full h-14 rounded-2xl font-bold bg-muted hover:bg-muted/80 text-foreground gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Open P2P Chat
                </Button>
              </Card>
            )}

            {/* Order Items Summary */}
            <Card className="border-0 shadow-lg rounded-[2rem] p-6 space-y-6">
              <h3 className="font-black text-xl tracking-tight flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Manifest
              </h3>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div>
                      <p className="font-bold text-sm tracking-tight">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-black text-sm">Rp{((item as any).price || (item as any).estimatedPrice || 0).toLocaleString("id-ID").replace(/,/g, ".")}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t-2 border-dashed space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Escrow Fee</span>
                  <span className="font-bold">Rp{(order.fee || 0).toLocaleString("id-ID").replace(/,/g, ".")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-primary">Total Paid</span>
                  <span className="text-xl font-black tracking-tighter">Rp{(order.grandTotal || 0).toLocaleString("id-ID").replace(/,/g, ".")}</span>
                </div>
              </div>
            </Card>

            {/* Shipping Manifest */}
            <Card className="border-0 shadow-lg rounded-[2rem] p-6 space-y-4">
               <h3 className="font-black text-xl tracking-tight flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Recipient
              </h3>
              <div className="p-4 bg-muted/30 rounded-2xl">
                <p className="text-sm font-bold">{getUserById(order.userId)?.name}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  {order.shippingAddress}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
