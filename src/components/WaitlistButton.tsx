"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bell, BellOff, CheckCircle, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface WaitlistButtonProps {
  productId: string;
  productName: string;
  className?: string;
  variant?: "button" | "badge" | "icon";
}

export function WaitlistButton({ productId, productName, className, variant = "button" }: WaitlistButtonProps) {
  const [isWaiting, setIsWaiting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setIsWaiting(!isWaiting);
    setIsLoading(false);
    
    if (!isWaiting) {
      toast.success("Added to waitlist!", {
        description: `We'll notify you when ${productName} is back in stock.`,
        icon: <Bell className="h-4 w-4" />,
      });
    } else {
      toast.info("Removed from waitlist", {
        description: `You won't receive notifications for ${productName} anymore.`,
        icon: <BellOff className="h-4 w-4" />,
      });
    }
  };

  if (variant === "badge") {
    return (
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
          isWaiting
            ? "bg-primary/10 text-primary border border-primary/30"
            : "bg-muted text-muted-foreground border border-border",
          className
        )}
      >
        {isWaiting ? (
          <>
            <Bell className="h-3 w-3" />
            <span>Notify Me</span>
          </>
        ) : (
          <>
            <BellOff className="h-3 w-3" />
            <span>Notified</span>
          </>
        )}
      </motion.button>
    );
  }

  if (variant === "icon") {
    return (
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all",
          isWaiting
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-primary/10",
          className
        )}
      >
        {isWaiting ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleToggle}
      disabled={isLoading}
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      className={cn(
        "relative overflow-hidden px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2",
        isWaiting
          ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
          : "bg-gradient-to-r from-primary to-orange-500 text-white hover:shadow-lg hover:shadow-primary/30",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
          />
        ) : isWaiting ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Bell className="h-5 w-5" />
            <span>Notify When Available</span>
          </motion.div>
        ) : (
          <motion.div
            key="notified"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Notify Me Enabled</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  productImage?: string;
}

export function WaitlistModal({ open, onOpenChange, productName, productImage }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    onOpenChange(false);
    
    toast.success("You're on the list!", {
      description: `We'll email you at ${email} when ${productName} is available.`,
      icon: <CheckCircle className="h-4 w-4" />,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4 z-50"
          >
            <div className="rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                {productImage ? (
                  <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                ) : (
                  <Bell className="h-12 w-12 text-white/50" />
                )}
                <button
                  onClick={() => onOpenChange(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">Get Notified</h3>
                  <p className="text-sm text-muted-foreground">
                    Be the first to know when <span className="font-semibold text-foreground">{productName}</span> is back in stock!
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      We'll only email you about this product's availability. No spam, unsubscribe anytime.
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading || !email}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      "Join Waitlist"
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
