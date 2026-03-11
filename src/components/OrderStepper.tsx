"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { GlassButton } from "@/components/ui/glass";
import {
  CheckCircle2,
  Circle,
  Package,
  Truck,
  Home,
  FileText,
  Plane,
  Warehouse,
  Image as ImageIcon,
  Download,
} from "lucide-react";
import type { OrderStatus, OrderTimeline } from "@/types";
import { formatDateTime } from "@/lib/utils";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string; description: string }> = {
  pending: {
    label: "Pending",
    icon: <FileText className="h-4 w-4" />,
    color: "bg-gray-500",
    description: "Order received, awaiting confirmation",
  },
  confirmed: {
    label: "Confirmed",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-blue-500",
    description: "Order confirmed by jastiper",
  },
  purchasing: {
    label: "Purchasing",
    icon: <Package className="h-4 w-4" />,
    color: "bg-purple-500",
    description: "Jastiper is purchasing your items",
  },
  purchased: {
    label: "Purchased",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-green-500",
    description: "Items purchased successfully",
  },
  "in-transit": {
    label: "In Transit",
    icon: <Plane className="h-4 w-4" />,
    color: "bg-sky-500",
    description: "Items on the way to Indonesia",
  },
  customs: {
    label: "Customs",
    icon: <Warehouse className="h-4 w-4" />,
    color: "bg-orange-500",
    description: "Clearing customs",
  },
  shipping: {
    label: "Shipping",
    icon: <Truck className="h-4 w-4" />,
    color: "bg-indigo-500",
    description: "Out for domestic delivery",
  },
  "out-for-delivery": {
    label: "Out for Delivery",
    icon: <Truck className="h-4 w-4" />,
    color: "bg-violet-500",
    description: "On the way to you",
  },
  delivered: {
    label: "Delivered",
    icon: <Home className="h-4 w-4" />,
    color: "bg-emerald-500",
    description: "Order delivered successfully",
  },
};

interface OrderStepperProps {
  timeline: OrderTimeline[];
  currentStatus: OrderStatus;
  className?: string;
}

export function OrderStepper({ timeline, currentStatus, className }: OrderStepperProps) {
  const currentIndex = Object.keys(statusConfig).indexOf(currentStatus);
  const statuses = Object.keys(statusConfig) as OrderStatus[];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Horizontal Progress Bar (Mobile) */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Order Progress</span>
          <span className="text-sm text-muted-foreground">
            {Math.round(((currentIndex + 1) / statuses.length) * 100)}%
          </span>
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / statuses.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
          />
        </div>
      </div>

      {/* Vertical Stepper (Desktop) */}
      <div className="hidden lg:block space-y-0">
        {statuses.map((status, index) => {
          const config = statusConfig[status];
          const timelineItem = timeline.find((t) => t.status === status);
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isCompleted
                      ? cn(config.color, "text-white border-transparent")
                      : "bg-card border-border text-muted-foreground",
                    isCurrent && "ring-4 ring-primary/30 scale-110"
                  )}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isCompleted ? config.icon : <Circle className="h-4 w-4" />}
                </motion.div>
                {index < statuses.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 h-12 mt-2",
                      isCompleted ? "bg-gradient-to-b from-primary to-orange-500" : "bg-muted"
                    )}
                  />
                )}
              </div>
              <div className="flex-1 pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={cn("font-semibold", isCompleted ? "text-foreground" : "text-muted-foreground")}>
                      {config.label}
                    </h4>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </div>
                  {timelineItem && (
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatDateTime(timelineItem.timestamp)}</p>
                      {timelineItem.note && (
                        <p className="text-xs text-muted-foreground mt-1">{timelineItem.note}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Proof of Purchase Display */}
                {timelineItem?.proofImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-center gap-3"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group cursor-pointer">
                      <img
                        src={timelineItem.proofImage}
                        alt="Proof of purchase"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <GlassButton variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                      Download
                    </GlassButton>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Timeline Cards */}
      <div className="lg:hidden space-y-3">
        {timeline.map((item, index) => {
          const config = statusConfig[item.status];
          return (
            <motion.div
              key={item.status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-md overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", config.color, "text-white")}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{config.label}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDateTime(item.timestamp)}
                      </p>
                      {item.note && (
                        <p className="text-sm text-muted-foreground mt-2">{item.note}</p>
                      )}
                      {item.proofImage && (
                        <div className="mt-3">
                          <img
                            src={item.proofImage}
                            alt="Proof"
                            className="w-24 h-24 rounded-lg object-cover border border-border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
