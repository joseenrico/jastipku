"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Clock, AlertCircle } from "lucide-react";
import { getTimeRemaining } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date | string;
  label?: string;
  variant?: "default" | "compact" | "large";
  className?: string;
  onComplete?: () => void;
}

export function CountdownTimer({
  targetDate,
  label = "Time Remaining",
  variant = "default",
  className,
  onComplete,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate));
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);
      setTimeLeft(remaining);

      if (remaining.days === 0 && remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
        setIsExpired(true);
        onComplete?.();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (isExpired) {
    return (
      <div className={cn("flex items-center gap-2 text-destructive", className)}>
        <AlertCircle className="h-5 w-5" />
        <span className="font-medium">Expired</span>
      </div>
    );
  }

  const isUrgent = timeLeft.days <= 2;

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1.5 text-sm", className, isUrgent && "text-orange-500")}>
        <Clock className="h-4 w-4" />
        <span className="font-medium">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
        </span>
      </div>
    );
  }

  if (variant === "large") {
    return (
      <div className={cn("space-y-2", className)}>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {label}
        </p>
        <div className="grid grid-cols-4 gap-3">
          <TimeBox value={timeLeft.days} label="Days" isUrgent={isUrgent} />
          <TimeBox value={timeLeft.hours} label="Hours" isUrgent={isUrgent} />
          <TimeBox value={timeLeft.minutes} label="Minutes" isUrgent={isUrgent} />
          <TimeBox value={timeLeft.seconds} label="Seconds" isUrgent={isUrgent} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className, isUrgent && "text-orange-500")}>
      <Clock className={cn("h-5 w-5", isUrgent && "animate-pulse")} />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </p>
      </div>
    </div>
  );
}

function TimeBox({ value, label, isUrgent }: { value: number; label: string; isUrgent: boolean }) {
  return (
    <motion.div
      key={value}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-xl",
        isUrgent
          ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30"
          : "bg-muted border border-border"
      )}
    >
      <motion.span
        key={value}
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        className={cn(
          "text-2xl font-bold",
          isUrgent ? "text-orange-500" : "text-foreground"
        )}
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </motion.div>
  );
}
