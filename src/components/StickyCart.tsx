"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { GlassButton } from "@/components/ui/glass";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Calculator } from "lucide-react";
import { formatIDR } from "@/lib/utils";

export function StickyCart() {
  const { items, totalItems, pricing, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      {/* Floating Cart Button (when closed) */}
      <AnimatePresence>
        {!isCartOpen && (
          <motion.div
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 100 }}
            className="fixed bottom-24 right-6 z-40"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-3 px-5 py-4 rounded-full bg-gradient-to-r from-primary to-orange-500 text-white shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105"
            >
              <ShoppingBag className="h-6 w-6" />
              <div className="text-left">
                <p className="text-xs opacity-80">{totalItems} items</p>
                <p className="font-bold text-sm">{formatIDR(pricing.total)}</p>
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                  <div>
                    <h2 className="font-bold text-lg">Your Jastip Cart</h2>
                    <p className="text-xs text-muted-foreground">{totalItems} items</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 p-3 rounded-2xl bg-muted/50 border border-border"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatIDR(item.price)} × {item.quantity}
                      </p>
                      <p className="font-bold text-primary mt-1">
                        {formatIDR(item.price * item.quantity)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-background rounded transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-background rounded transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors ml-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="border-t p-4 space-y-3 bg-card">
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    {showBreakdown ? "Hide" : "Show"} price breakdown
                  </span>
                  <ArrowRight className={cn("h-4 w-4 transition-transform", showBreakdown && "rotate-90")} />
                </button>

                <AnimatePresence>
                  {showBreakdown && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 overflow-hidden text-sm"
                    >
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatIDR(pricing.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Fee (15%)</span>
                        <span>{formatIDR(pricing.serviceFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax Estimate (10%)</span>
                        <span>{formatIDR(pricing.taxEstimate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping Estimate</span>
                        <span>{formatIDR(pricing.shippingEstimate)}</span>
                      </div>
                      <div className="border-t pt-2" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                    {formatIDR(pricing.total)}
                  </span>
                </div>

                <GlassButton variant="primary" className="w-full" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </GlassButton>

                <p className="text-xs text-center text-muted-foreground">
                  Free consultation available • Secure payment protected
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
