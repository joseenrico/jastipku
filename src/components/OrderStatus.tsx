import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle2,
  ShoppingBag,
  Plane,
  Package,
  Truck,
  Home,
  AlertCircle,
  Clock,
  ShieldCheck,
  Search
} from "lucide-react";
import { motion } from "framer-motion";
import type { Order, OrderStatus as OrderStatusType } from "@/types";

export const statusConfig: Record<OrderStatusType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; description: string }> = {
  pending: {
    label: "Order Placed",
    icon: Clock,
    color: "bg-slate-500",
    description: "Waiting for Jastiper to accept your request."
  },
  confirmed: {
    label: "Accepted",
    icon: CheckCircle2,
    color: "bg-blue-500",
    description: "Jastiper has confirmed they can buy this item."
  },
  purchasing: {
    label: "Shopping",
    icon: ShoppingBag,
    color: "bg-purple-500",
    description: "Jastiper is at the store or has ordered the item."
  },
  purchased: {
    label: "Purchased",
    icon: ShieldCheck,
    color: "bg-emerald-500",
    description: "Item obtained! Proof of purchase uploaded."
  },
  "in-transit": {
    label: "International",
    icon: Plane,
    color: "bg-orange-500",
    description: "Item is flying from the origin country to Indonesia."
  },
  customs: {
    label: "Customs",
    icon: Search,
    color: "bg-yellow-600",
    description: "Arrived in Indonesia. Passing through customs inspection."
  },
  shipping: {
    label: "Domestic",
    icon: Truck,
    color: "bg-indigo-500",
    description: "Handed over to local courier for final delivery."
  },
  "out-for-delivery": {
    label: "Arriving",
    icon: Home,
    color: "bg-violet-500",
    description: "Courier is on the way to your shipping address."
  },
  delivered: {
    label: "Delivered",
    icon: Package,
    color: "bg-green-600",
    description: "Order complete. Funds released to Jastiper."
  },
};

interface OrderStatusProps {
  status: Order["status"];
}

export function OrderStatus({ status }: OrderStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} text-white hover:${config.color} gap-1.5 font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-widest`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export function OrderTimeline({ status }: { status: Order["status"] }) {
  const statusOrder: OrderStatusType[] = ["pending", "confirmed", "purchased", "in-transit", "delivered"];
  
  const currentIndex = statusOrder.indexOf(status === "purchasing" ? "confirmed" : status as any); // Simplification for UI

  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Progress Line Background */}
        <div className="absolute left-0 right-0 top-5 h-1 bg-muted rounded-full" />
        
        {/* Active Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(Math.max(0, currentIndex) / (statusOrder.length - 1)) * 100}%` }}
          className="absolute left-0 top-5 h-1 bg-primary transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(255,122,0,0.5)]"
        />

        {/* Steps */}
        <div className="relative flex items-center justify-between">
          {statusOrder.map((stepKey, index) => {
            const config = statusConfig[stepKey];
            const Icon = config.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={stepKey} className="flex flex-col items-center gap-3">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.2 : 1,
                    backgroundColor: isCompleted ? "var(--primary)" : "var(--muted)",
                  }}
                  className={`
                    relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center 
                    transition-colors duration-500 shadow-xl border-4
                    ${isCompleted ? "border-primary text-white bg-primary" : "border-background text-muted-foreground bg-muted"}
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {isCompleted && !isCurrent && index < currentIndex && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center"
                    >
                      <CheckCircle2 className="h-2 w-2 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                <div className="flex flex-col items-center">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? "text-primary" : "text-muted-foreground"}`}>
                    {config.label}
                  </span>
                  {isCurrent && (
                    <motion.span 
                      layoutId="active-indicator"
                      className="text-[9px] text-muted-foreground font-medium animate-pulse mt-1"
                    >
                      Active
                    </motion.span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
