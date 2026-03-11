"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CartItem, OrderPricing } from "@/types";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  pricing: OrderPricing;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SERVICE_FEE_PERCENT = 15;
const TAX_PERCENT = 10;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("jastipku-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart:", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("jastipku-cart", JSON.stringify(items));
  }, [items]);

  const calculatePricing = useCallback((): OrderPricing => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceFee = subtotal * (SERVICE_FEE_PERCENT / 100);
    const taxEstimate = subtotal * (TAX_PERCENT / 100);
    const shippingEstimate = items.reduce((sum, item) => sum + ((item.weight || 0.5) * 50000 * item.quantity), 0);
    const total = subtotal + serviceFee + taxEstimate + shippingEstimate;

    return {
      subtotal,
      serviceFee,
      taxEstimate,
      shippingEstimate,
      total,
      currency: "IDR",
    };
  }, [items]);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
    toast.success("Added to cart", {
      description: `${item.name} has been added to your jastip cart.`,
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    toast.info("Item removed from cart");
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.info("Cart cleared");
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const pricing = calculatePricing();

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        pricing,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
