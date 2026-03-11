"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getOrdersByJastiperId,
  getTripsByJastiperId,
  getUserById
} from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Plane,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  ShieldAlert,
  Search,
  ChevronRight,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { OrderStatus } from "@/components/OrderStatus";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NewTripDialog } from "@/components/NewTripDialog";

export default function JastiperDashboard() {
  const { user } = useAuth();
  const [isTripDialogOpen, setIsTripDialogOpen] = useState(false);

  // Guard for jastiper only
  if (!user || user.role !== "jastiper") {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground mt-2">This dashboard is for registered Jastipers only.</p>
        <Button asChild className="mt-6 rounded-xl">
          <Link href="/login">Login as Jastiper</Link>
        </Button>
      </div>
    );
  }

  const trips = getTripsByJastiperId(user.id);
  const orders = getOrdersByJastiperId(user.id);
  
  const totalEarnings = orders
    .filter(o => o.status === "delivered")
    .reduce((acc, curr) => acc + (curr.fee || 0), 0);
    
  const pendingEarnings = orders
    .filter(o => o.status !== "delivered")
    .reduce((acc, curr) => acc + (curr.fee || 0), 0);

  const [manifestValueUsd, setManifestValueUsd] = useState(420);
  const [exchangeRate, setExchangeRate] = useState(15500);
  const [thresholdUsd, setThresholdUsd] = useState(500);
  const [dutyRate, setDutyRate] = useState(7.5);
  const [vatRate, setVatRate] = useState(11);
  const [incomeTaxRate, setIncomeTaxRate] = useState(0);

  const dutiableUsd = Math.max(0, manifestValueUsd - thresholdUsd);
  const dutyUsd = dutiableUsd * (dutyRate / 100);
  const vatUsd = (dutiableUsd + dutyUsd) * (vatRate / 100);
  const incomeTaxUsd = (dutiableUsd + dutyUsd) * (incomeTaxRate / 100);
  const totalTaxUsd = dutyUsd + vatUsd + incomeTaxUsd;
  const totalTaxIdr = totalTaxUsd * exchangeRate;
  const remainingUsd = thresholdUsd - manifestValueUsd;
  const thresholdProgress = thresholdUsd > 0 ? Math.min(100, (manifestValueUsd / thresholdUsd) * 100) : 0;

  const handleUpdateStatus = (orderId: string, nextStatus: string) => {
    toast.success(`Order #${orderId} updated to ${nextStatus}`, {
      description: "Buyer has been notified of the logistics update."
    });
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="container max-w-7xl py-10 px-4 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-background p-8 rounded-[2.5rem] shadow-xl border border-primary/5">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-primary/10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl font-bold">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Jastiper Console</p>
              <h1 className="text-4xl font-black tracking-tighter">Halo, {user.name}!</h1>
              <p className="text-muted-foreground font-medium">Manage your international logistics and earnings.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setIsTripDialogOpen(true)}
              className="rounded-2xl h-14 px-8 font-bold bg-primary hover:bg-primary/90 text-white shadow-xl gap-2"
            >
              <Plus className="h-5 w-5" />
              Start New Trip
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Earnings", value: `Rp ${totalEarnings.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Pending Escrow", value: `Rp ${pendingEarnings.toLocaleString()}`, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Active Trips", value: trips.length.toString(), icon: Plane, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Success Rate", value: "98.5%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-lg rounded-[2rem] overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px] font-black uppercase">+12%</Badge>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</p>
                <h3 className="text-2xl font-black tracking-tighter mt-1">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Orders Terminal */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    <Package className="h-6 w-6 text-primary" />
                    Logistics Terminal
                  </h2>
                  <Badge className="bg-primary text-white font-bold rounded-full">
                    {orders.filter(o => o.status !== "delivered").length} Active Orders
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/10">
                    <TableRow className="border-b">
                      <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest">Order / Buyer</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                      <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const buyer = getUserById(order.userId);
                      return (
                        <TableRow key={order.id} className="group hover:bg-muted/5 border-b last:border-0 transition-colors">
                          <TableCell className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border border-primary/20">
                                <AvatarImage src={buyer?.avatar} />
                                <AvatarFallback>{buyer?.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-sm tracking-tight">{buyer?.name}</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">#{order.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <OrderStatus status={order.status} />
                          </TableCell>
                          <TableCell className="px-8 text-right">
                            {order.status === "confirmed" && (
                              <Button 
                                onClick={() => handleUpdateStatus(order.id, "purchasing")}
                                size="sm" 
                                className="rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20"
                              >
                                Mark Purchasing
                              </Button>
                            )}
                            {order.status === "purchasing" && (
                              <Button 
                                onClick={() => handleUpdateStatus(order.id, "purchased")}
                                size="sm" 
                                className="rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
                              >
                                Upload Proof
                              </Button>
                            )}
                            {order.status === "purchased" && (
                              <Button 
                                onClick={() => handleUpdateStatus(order.id, "in-transit")}
                                size="sm" 
                                className="rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                              >
                                Dispatch International
                              </Button>
                            )}
                            {order.status === "in-transit" && (
                              <Button 
                                variant="outline"
                                className="rounded-xl font-bold border-muted-foreground/20"
                                asChild
                              >
                                <Link href={`/orders/${order.id}`}>View Tracking</Link>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Tools */}
          <div className="space-y-8">
            {/* Customs Tool */}
            <Card className="border-0 shadow-lg rounded-[2.5rem] bg-slate-950 text-white overflow-hidden p-8 space-y-6">
              <div className="space-y-2">
                <Badge className="bg-amber-500 text-slate-950 font-black uppercase text-[9px] tracking-[0.2em] rounded-full">
                  Duty & Tax Tool
                </Badge>
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6 text-amber-500" />
                  Customs Clearance
                </h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">
                  Automatic calculation of PMK 199/2019 thresholds ($500 per passenger).
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Manifest (USD)</p>
                    <Input
                      type="number"
                      value={manifestValueUsd}
                      onChange={(e) => setManifestValueUsd(Number(e.target.value) || 0)}
                      className="h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Exchange Rate</p>
                    <Input
                      type="number"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(Number(e.target.value) || 0)}
                      className="h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Duty %</p>
                    <Input
                      type="number"
                      value={dutyRate}
                      onChange={(e) => setDutyRate(Number(e.target.value) || 0)}
                      className="h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">VAT %</p>
                    <Input
                      type="number"
                      value={vatRate}
                      onChange={(e) => setVatRate(Number(e.target.value) || 0)}
                      className="h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Income %</p>
                    <Input
                      type="number"
                      value={incomeTaxRate}
                      onChange={(e) => setIncomeTaxRate(Number(e.target.value) || 0)}
                      className="h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Threshold (USD)</span>
                    <Input
                      type="number"
                      value={thresholdUsd}
                      onChange={(e) => setThresholdUsd(Number(e.target.value) || 0)}
                      className="h-9 w-28 bg-white/5 border-white/10 text-white text-right"
                    />
                  </div>
                  <Progress value={thresholdProgress} className="h-2 bg-white/10" />
                  <div className="flex justify-between mt-2">
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${remainingUsd >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                      {remainingUsd >= 0 ? "Safe Zone" : "Exceeded"}
                    </span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                      {remainingUsd >= 0 ? `$${remainingUsd.toFixed(2)} remaining` : `$${Math.abs(remainingUsd).toFixed(2)} over`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <p className="text-xs font-black text-slate-500 uppercase">Estimated Tax</p>
                    <p className="text-lg font-black text-amber-500">Rp {Math.round(totalTaxIdr).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 mt-1">≈ ${totalTaxUsd.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <p className="text-xs font-black text-slate-500 uppercase">Status</p>
                    <p className={`text-[10px] font-black uppercase flex items-center justify-center gap-1 ${remainingUsd >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      {remainingUsd >= 0 ? "Green Lane" : "Taxable"}
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full h-14 rounded-2xl font-bold bg-white text-slate-950 hover:bg-white/90 gap-2">
                <Search className="h-5 w-5" />
                Regulated Item Checklist
              </Button>
            </Card>

            {/* Local Dispatch Card */}
            <Card className="border-0 shadow-lg rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                Local Dispatch
              </h3>
              <div className="bg-muted/30 p-4 rounded-2xl border border-dashed border-primary/20 flex flex-col items-center justify-center text-center gap-2 py-8">
                <p className="text-xs text-muted-foreground font-medium">No packages arrived in Indonesia yet.</p>
                <p className="text-[10px] text-muted-foreground/60 uppercase font-black uppercase tracking-widest">Awaiting flight confirmation</p>
              </div>
              <Button disabled variant="outline" className="w-full h-14 rounded-2xl font-bold opacity-50">
                Bulk Generating AWBs
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <NewTripDialog
        open={isTripDialogOpen}
        onOpenChange={setIsTripDialogOpen}
        jastiperId={user.id}
        onSuccess={() => {
          // Optionally refresh data or update UI
        }}
      />
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
