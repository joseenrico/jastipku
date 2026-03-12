"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatIDR } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Calendar,
  Edit2,
  Save,
  X,
  ArrowRight,
  Clock,
  CheckCircle2,
  History,
  Settings,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import { getUserById, getOrdersByUserId, getOrdersByJastiperId, getJastiperById, getTripById } from "@/lib/data";
import { OrderStatus } from "@/components/OrderStatus";
import { useAuth, Transaction } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

// Demo user for testing
const demoUser = getUserById("user1") || {
  id: "user1",
  name: "Demo User",
  email: "demo@jastipku.com",
  avatar: "https://i.pravatar.cc/150?u=demo",
  phone: "+62 812-3456-7890",
  address: "Jl. Sudirman No. 123, Jakarta Selatan",
};

const userOrders = getOrdersByUserId(demoUser.id);

export default function ProfilePage() {
  const { user, isLoading, updateBalance } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isToppingUp, setIsToppingUp] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    avatar: user?.avatar || "",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-2xl font-bold">Please login to view profile</h2>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  // Determine if user is a jastiper or buyer and get appropriate orders
  const userOrders = user.role === "jastiper" 
    ? getOrdersByJastiperId(user.id) 
    : getOrdersByUserId(user.id);
  
  const activeOrders = userOrders.filter((o) => o.status !== "delivered");
  const historyOrders = userOrders.filter((o) => o.status === "delivered");

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleTopUp = async () => {
    setIsToppingUp(true);
    // Simulate payment gateway
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateBalance(1000000, "topup");
    toast.success("Top-up successful!", {
      description: "Rp 1.000.000 has been added to your JastipPay balance."
    });
    setIsToppingUp(false);
  };

const stats = [
    { icon: Package, value: userOrders.length, label: "Total Orders", color: "text-blue-500" },
    { icon: Wallet, value: formatIDR(user.jastipPayBalance), label: "JastipPay", color: "text-orange-500" },
    { icon: CheckCircle2, value: historyOrders.length, label: "Completed", color: "text-green-500" },
    { icon: TrendingUp, value: user.role === "buyer" ? "Buyer" : "Jastiper", label: "Account Type", color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8 space-y-6">
        {/* Profile Header */}
        <Card className="border shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Avatar Section */}
              <div className="relative md:w-64 h-48 md:h-auto bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <Avatar className="w-32 h-32 ring-4 ring-white/50 shadow-2xl relative z-10">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="text-2xl bg-primary text-white">
                    {userData.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Info Section */}
              <div className="flex-1 p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{userData.name}</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {userData.email}
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "default"}
                    className="gap-2"
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="p-4 rounded-lg bg-card border shadow-sm">
                        <div className={`flex items-center gap-2 mb-2 ${stat.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        {isEditing && (
          <Card className="border shadow-lg rounded-2xl">
            <CardHeader>
              <div className="flex items-center mt-6 justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Edit Profile
                  </h2>
                  <p className="text-sm text-muted-foreground">Update your personal information</p>
                </div>
                <Button onClick={handleSave} className="gap-2 rounded-xl">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 mb-10 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-primary" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4 text-primary" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={userData.address}
                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders Tabs */}
        <Card className="border shadow-lg rounded-2xl">
          <Tabs defaultValue="active" className="w-full">
            <div className="border-b">
              <div className="flex items-center justify-between px-6 pt-6">
                <TabsList className="grid w-full md:w-auto grid-cols-3 h-12 rounded-xl">
                  <TabsTrigger value="active" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl">
                    <Clock className="h-4 w-4" />
                    <span className="hidden sm:inline">Active</span>
                    <Badge variant="secondary" className="ml-1 h-5 text-xs rounded-full">
                      {activeOrders.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="wallet" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl">
                    <Wallet className="h-4 w-4" />
                    <span className="hidden sm:inline">JastipPay</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl">
                    <History className="h-4 w-4" />
                    <span className="hidden sm:inline">History</span>
                    <Badge variant="secondary" className="ml-1 h-5 text-xs rounded-full">
                      {historyOrders.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="wallet" className="p-6 space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Balance Card */}
                <Card className="lg:col-span-1 bg-gradient-to-br from-primary to-orange-500 text-white border-0 shadow-xl">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-white/20 rounded-lg backdrop-blur-md">
                        <Wallet className="h-6 w-6" />
                      </div>
                      <Badge className="bg-white/20 text-white border-0">Primary Wallet</Badge>
                    </div>
                    <div>
                      <p className="text-white/80 text-xs font-medium uppercase tracking-widest">Available Balance</p>
                      <h3 className="text-3xl font-bold mt-1">{formatIDR(user.jastipPayBalance)}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-white text-primary hover:bg-white/90 font-semibold h-10 rounded-lg"
                        onClick={handleTopUp}
                        disabled={isToppingUp}
                      >
                        {isToppingUp ? <Spinner className="h-4 w-4" /> : <ArrowUpRight className="mr-2 h-4 w-4" />}
                        Top Up
                      </Button>
                      <Button variant="outline" className="flex-1 border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold h-10 rounded-lg">
                        Withdraw
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction History */}
                <Card className="lg:col-span-2 border shadow-sm pt-4">
                  <CardHeader className="pb-0">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <History className="h-5 w-5 text-primary" />
                      Transaction Ledger
                    </h3>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-3">
                        {user.transactions.length > 0 ? (
                          user.transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 group hover:bg-muted/80 transition-all border border-transparent hover:border-primary/20">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-md ${tx.type === "topup" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
                                  {tx.type === "topup" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                </div>
                                <div>
                                  <p className="font-semibold capitalize text-sm">{tx.type}</p>
                                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold text-sm ${tx.type === "topup" ? "text-green-600" : "text-blue-600"}`}>
                                  {tx.type === "topup" ? "+" : "-"} {formatIDR(tx.amount)}
                                </p>
                                <Badge variant="outline" className="h-4 text-[10px] uppercase font-semibold">
                                  {tx.status}
                                </Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-16 text-muted-foreground">
                            <p className="text-sm">No transactions yet.</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Security Alert */}
              <Alert className="border-primary/20 bg-primary/5 rounded-lg">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <AlertTitle className="font-semibold text-primary">JastipPay Escrow Protection</AlertTitle>
                <AlertDescription className="text-muted-foreground text-sm">
                  Your funds are protected by our escrow system. Payments are only released to Jastipers after you confirm the safe arrival of your items.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="active" className="p-6">
              {activeOrders.length > 0 ? (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {activeOrders.map((order) => {
                      const jastiper = order.jastiperId ? getJastiperById(order.jastiperId) : undefined;
                      const trip = order.tripId ? getTripById(order.tripId) : undefined;
                      const buyer = order.userId ? getUserById(order.userId) : undefined;

                      return (
                        <Card key={order.id} className="pt-4 border shadow-sm hover:shadow-md transition-shadow">
                          <CardHeader className="pb-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {trip?.destination?.charAt(0) || "T"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold">{trip?.destination || "Unknown"}</h3>
                                  <p className="text-sm text-muted-foreground">Trip to {trip?.country || "Unknown"}</p>
                                </div>
                              </div>
                              <OrderStatus status={order.status} />
                            </div>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <div className="flex items-center gap-6 text-sm">
                              {user.role === "jastiper" ? (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <User className="h-4 w-4" />
                                  <span>From: {buyer?.name || "Unknown Buyer"}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <User className="h-4 w-4" />
                                  <span>With: {jastiper?.name || "Unknown Jastiper"}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Package className="h-4 w-4" />
                                <span>{order.items.length} item(s)</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                                <p className="text-lg font-bold text-primary">IDR {(order.grandTotal || 0).toLocaleString()}</p>
                              </div>
                              <Button asChild variant="outline" className="gap-2 h-10">
                                <Link href={`/orders/${order.id}`}>
                                  {user.role === "jastiper" ? "Manage Order" : "Track Order"}
                                  <ArrowRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    {user.role === "jastiper" ? (
                      <>
                        <h3 className="text-lg font-semibold mb-2">No active orders assigned</h3>
                        <p className="text-muted-foreground mb-4 text-sm">Once buyers book your trips, orders will appear here</p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold mb-2">No active orders</h3>
                        <p className="text-muted-foreground mb-4 text-sm">Start browsing trips and place your first order!</p>
                        <Button asChild className="gap-2">
                          <Link href="/trips">
                            Browse Trips
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="p-6">
              {historyOrders.length > 0 ? (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {historyOrders.map((order) => {
                      const jastiper = order.jastiperId ? getJastiperById(order.jastiperId) : undefined;
                      const trip = order.tripId ? getTripById(order.tripId) : undefined;
                      const buyer = order.userId ? getUserById(order.userId) : undefined;

                      return (
                        <Card key={order.id} className="pt-4 border shadow-sm hover:shadow-md transition-shadow">
                          <CardHeader className="pb-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                    {trip?.destination?.charAt(0) || "T"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-base">{trip?.destination || "Unknown"}</h3>
                                  <p className="text-xs text-muted-foreground">Trip to {trip?.country || "Unknown"}</p>
                                </div>
                              </div>
                              <OrderStatus status={order.status} />
                            </div>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <div className="flex items-center gap-4 text-xs">
                              {user.role === "jastiper" ? (
                                <>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <User className="h-3 w-3" />
                                    <span>From: {buyer?.name || "Unknown Buyer"}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>Completed: {order.deliveredAt || "N/A"}</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <User className="h-3 w-3" />
                                    <span>With: {jastiper?.name || "Unknown Jastiper"}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>Delivered: {order.deliveredAt || "N/A"}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground">Total Amount</p>
                                <p className="text-base font-bold text-primary">IDR {(order.grandTotal || 0).toLocaleString()}</p>
                              </div>
                              <Button asChild variant="outline" className="gap-2 h-9 text-sm">
                                <Link href={`/orders/${order.id}`}>
                                  View Details
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <History className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    {user.role === "jastiper" ? (
                      <h3 className="text-lg font-semibold">No completed orders yet</h3>
                    ) : (
                      <h3 className="text-lg font-semibold">No order history yet</h3>
                    )}
                    <p className="text-muted-foreground text-sm">
                      {user.role === "jastiper"
                        ? "Your completed orders will appear here once delivered"
                        : "Your completed orders will appear here"}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
