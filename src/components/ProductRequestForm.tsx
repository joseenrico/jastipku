"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlassButton, GlassInput } from "@/components/ui/glass";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileText, Link as LinkIcon, Store, DollarSign, Package, FileUp, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ProductRequestFormProps {
  className?: string;
  tripId?: string;
  onSuccess?: () => void;
}

export function ProductRequestForm({ className, tripId, onSuccess }: ProductRequestFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    productUrl: "",
    store: "",
    estimatedPrice: "",
    currency: "USD",
    quantity: "1",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    toast.success("Product request submitted!", {
      description: "We'll review your request and get back to you soon.",
    });

    setFormData({
      productName: "",
      productUrl: "",
      store: "",
      estimatedPrice: "",
      currency: "USD",
      quantity: "1",
      notes: "",
    });

    onSuccess?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className={cn("border-0 shadow-xl overflow-hidden bg-card/80 backdrop-blur-xl", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Request a Product</h3>
              <p className="text-sm text-muted-foreground">Can't find what you're looking for?</p>
            </div>
          </div>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <GlassInput
            label="Product Name"
            placeholder="e.g., Sony WH-1000XM5 Headphones"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            required
            icon={<Package className="h-4 w-4" />}
          />

          <GlassInput
            label="Product URL"
            placeholder="Paste link from Amazon, Rakuten, etc."
            value={formData.productUrl}
            onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
            required
            icon={<LinkIcon className="h-4 w-4" />}
          />

          <div className="grid grid-cols-2 gap-4">
            <GlassInput
              label="Store Name"
              placeholder="e.g., Amazon JP"
              value={formData.store}
              onChange={(e) => setFormData({ ...formData, store: e.target.value })}
              required
              icon={<Store className="h-4 w-4" />}
            />

            <div className="flex gap-2">
              <div className="flex-1">
                <GlassInput
                  label="Estimated Price"
                  type="number"
                  placeholder="0.00"
                  value={formData.estimatedPrice}
                  onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                  required
                  icon={<DollarSign className="h-4 w-4" />}
                />
              </div>
              <div className="w-24">
                <label className="text-sm font-medium text-foreground mb-2 block">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="JPY">JPY</option>
                  <option value="KRW">KRW</option>
                  <option value="SGD">SGD</option>
                  <option value="CNY">CNY</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <GlassInput
              label="Quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              icon={<Package className="h-4 w-4" />}
            />

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Attach Reference Image</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <FileUp className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Color, size, variant, or any specific requirements..."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <GlassButton
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            {isLoading ? "Submitting Request..." : "Submit Product Request"}
          </GlassButton>

          <p className="text-xs text-center text-muted-foreground">
            Our team will review your request within 24 hours and provide a final quote.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

interface ProductRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId?: string;
}

export function ProductRequestModal({ open, onOpenChange, tripId }: ProductRequestModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl p-4 z-50"
          >
            <div className="relative">
              <button
                onClick={() => onOpenChange(false)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors z-10"
              >
                <X className="h-4 w-4" />
              </button>
              <ProductRequestForm tripId={tripId} onSuccess={() => onOpenChange(false)} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
