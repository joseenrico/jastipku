"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Package, Truck, Home, FileText } from "lucide-react";

export type OrderStatus = "pending" | "confirmed" | "purchasing" | "in-transit" | "shipping" | "delivered";

interface StatusStep {
  status: OrderStatus;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const statusSteps: StatusStep[] = [
  {
    status: "pending",
    label: "Order Received",
    icon: <FileText className="h-4 w-4" />,
    description: "Your order has been received",
  },
  {
    status: "confirmed",
    label: "Confirmed",
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: "Order confirmed by jastiper",
  },
  {
    status: "purchasing",
    label: "Purchasing",
    icon: <Package className="h-4 w-4" />,
    description: "Jastiper is purchasing your items",
  },
  {
    status: "in-transit",
    label: "In Transit",
    icon: <Truck className="h-4 w-4" />,
    description: "Items are on the way to Indonesia",
  },
  {
    status: "shipping",
    label: "Ready to Ship",
    icon: <Home className="h-4 w-4" />,
    description: "Ready for domestic shipping",
  },
  {
    status: "delivered",
    label: "Delivered",
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: "Order delivered successfully",
  },
];

interface LiveStatusTrackerProps {
  currentStatus: OrderStatus;
  orderId: string;
  estimatedDelivery?: string;
  className?: string;
}

export function LiveStatusTracker({ currentStatus, orderId, estimatedDelivery, className }: LiveStatusTrackerProps) {
  const currentIndex = statusSteps.findIndex((step) => step.status === currentStatus);

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg">Track Your Order</h3>
          <p className="text-sm text-muted-foreground">Order ID: {orderId}</p>
        </div>
        {estimatedDelivery && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Estimated Delivery</p>
            <p className="font-semibold text-primary">{estimatedDelivery}</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-muted rounded-full" />
        </div>
        <motion.div
          className="absolute inset-0 flex items-center"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="w-full h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full" />
        </motion.div>
      </div>

      {/* Status Steps */}
      <div className="grid grid-cols-6 gap-2">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={step.status}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted
                    ? "bg-gradient-to-br from-primary to-orange-500 border-primary text-white"
                    : "bg-card border-border text-muted-foreground",
                  isCurrent && "ring-4 ring-primary/30 scale-110"
                )}
                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isCompleted ? step.icon : <Circle className="h-4 w-4" />}
              </motion.div>
              <p className={cn(
                "text-xs font-medium mt-2 hidden lg:block",
                isCompleted ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Current Status Description */}
      <motion.div
        key={currentStatus}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            {statusSteps[currentIndex].icon}
          </div>
          <div>
            <p className="font-medium text-sm">Current Status</p>
            <p className="text-sm text-muted-foreground">{statusSteps[currentIndex].description}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface StatusTimelineItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

interface StatusTimelineProps {
  timeline: StatusTimelineItem[];
  className?: string;
}

export function StatusTimeline({ timeline, className }: StatusTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {timeline.map((item, index) => {
        const step = statusSteps.find((s) => s.status === item.status);
        if (!step) return null;

        return (
          <motion.div
            key={item.status}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                index === 0 ? "bg-gradient-to-br from-primary to-orange-500 text-white" : "bg-muted text-muted-foreground"
              )}>
                {step.icon}
              </div>
              {index < timeline.length - 1 && (
                <div className="w-0.5 h-full bg-muted mt-2" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="font-medium text-sm">{step.label}</p>
              <p className="text-xs text-muted-foreground">{item.timestamp}</p>
              {item.note && <p className="text-sm text-muted-foreground mt-1">{item.note}</p>}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
