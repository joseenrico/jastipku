"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { GlassButton } from "@/components/ui/glass";
import { X, Heart, Share2, Plane, Store, MapPin, AlertCircle } from "lucide-react";
import type { Product, Trip } from "@/types";
import { formatIDR } from "@/lib/utils";
import { toast } from "sonner";
import { WaitlistButton } from "@/components/WaitlistButton";

interface ProductQuickViewProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip?: Trip;
}

export function ProductQuickView({ product, open, onOpenChange, trip }: ProductQuickViewProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    setTimeout(() => {
      addToCart({
        ...product,
        quantity,
        tripId: trip?.id,
      });
      setIsAdding(false);
      onOpenChange(false);
    }, 500);
  };

  const convertedPrice = product.currency === "USD" 
    ? product.price * 15500 
    : product.currency === "EUR"
    ? product.price * 16800
    : product.currency === "JPY"
    ? product.price * 105
    : product.price;

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl p-4 z-50"
          >
            <div className="relative rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative h-64 md:h-full bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {product.store && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          <Store className="h-3 w-3" />
                          {product.store}
                        </span>
                      )}
                      {trip && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                          <Plane className="h-3 w-3" />
                          {trip.destination} Trip
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold">{product.name}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                        {formatIDR(convertedPrice)}
                      </span>
                      {product.currency !== "IDR" && (
                        <span className="text-sm text-muted-foreground">
                          ({product.price} {product.currency})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Trip Info */}
                  {trip && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20 space-y-3">
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">
                          Next Trip: {trip.destination}, {trip.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {trip.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {trip.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      {(trip.remainingCapacity || 0) <= 0 ? (
                        <div className="flex items-center gap-2 text-destructive text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>Trip is full - Join waitlist</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-500 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>{(trip.remainingCapacity || 0).toFixed(1)} kg remaining</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                      >
                        <span className="text-lg font-bold">−</span>
                      </button>
                      <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <GlassButton
                      variant="primary"
                      className="flex-1"
                      size="lg"
                      onClick={handleAddToCart}
                      isLoading={isAdding}
                    >
                      Add to Cart
                    </GlassButton>
                    {(trip?.remainingCapacity || 0) <= 0 && (
                      <WaitlistButton
                        productId={product.id}
                        productName={product.name}
                        variant="button"
                      />
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                    <p>• Estimated delivery: 7-14 days after purchase</p>
                    <p>• Price includes jastip fee and tax estimate</p>
                    <p>• Free consultation available</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
