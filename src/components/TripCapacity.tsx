"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Package, AlertCircle, CheckCircle } from "lucide-react";

interface TripCapacityProps {
  totalCapacity: number; // in kg
  usedCapacity: number;
  className?: string;
  showDetails?: boolean;
}

export function TripCapacity({ totalCapacity, usedCapacity, className, showDetails = true }: TripCapacityProps) {
  const remainingCapacity = totalCapacity - usedCapacity;
  const percentageUsed = (usedCapacity / totalCapacity) * 100;
  const isLow = remainingCapacity < totalCapacity * 0.3;
  const isFull = remainingCapacity <= 0;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className={cn("h-4 w-4", isLow && !isFull ? "text-orange-500" : "text-muted-foreground")} />
          <span className="text-sm font-medium">Remaining Capacity</span>
        </div>
        <span className={cn("text-sm font-bold", isLow && !isFull ? "text-orange-500" : isFull ? "text-destructive" : "text-foreground")}>
          {remainingCapacity.toFixed(1)} / {totalCapacity} kg
        </span>
      </div>

      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentageUsed}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            isFull
              ? "bg-gradient-to-r from-red-500 to-destructive"
              : isLow
              ? "bg-gradient-to-r from-orange-500 to-red-500"
              : "bg-gradient-to-r from-primary to-green-500"
          )}
        />
      </div>

      {showDetails && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {percentageUsed.toFixed(0)}% used
          </span>
          {isFull ? (
            <span className="flex items-center gap-1 text-destructive font-medium">
              <AlertCircle className="h-3 w-3" />
              Trip Full
            </span>
          ) : isLow ? (
            <span className="flex items-center gap-1 text-orange-500 font-medium">
              <AlertCircle className="h-3 w-3" />
              Only {remainingCapacity.toFixed(1)} kg left!
            </span>
          ) : (
            <span className="flex items-center gap-1 text-green-500 font-medium">
              <CheckCircle className="h-3 w-3" />
              Plenty of space
            </span>
          )}
        </div>
      )}
    </div>
  );
}

interface CapacityBadgeProps {
  remainingCapacity: number;
  totalCapacity: number;
  className?: string;
}

export function CapacityBadge({ remainingCapacity, totalCapacity, className }: CapacityBadgeProps) {
  const percentageLeft = (remainingCapacity / totalCapacity) * 100;
  const isLow = percentageLeft < 30;
  const isFull = remainingCapacity <= 0;

  if (isFull) {
    return (
      <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive", className)}>
        <AlertCircle className="h-3 w-3" />
        Full
      </span>
    );
  }

  if (isLow) {
    return (
      <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 animate-pulse", className)}>
        <AlertCircle className="h-3 w-3" />
        Only {remainingCapacity.toFixed(1)} kg left
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500", className)}>
      <CheckCircle className="h-3 w-3" />
      {remainingCapacity.toFixed(1)} kg available
    </span>
  );
}
