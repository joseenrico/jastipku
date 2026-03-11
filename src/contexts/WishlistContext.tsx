"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Trip } from "@/types";

interface WishlistContextType {
  wishlist: Trip[];
  addToWishlist: (trip: Trip) => void;
  removeFromWishlist: (tripId: string) => void;
  toggleWishlist: (trip: Trip) => void;
  isInWishlist: (tripId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Trip[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse wishlist from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const addToWishlist = (trip: Trip) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === trip.id)) {
        return prev;
      }
      return [...prev, trip];
    });
  };

  const removeFromWishlist = (tripId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== tripId));
  };

  const toggleWishlist = (trip: Trip) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === trip.id);
      if (exists) {
        return prev.filter((item) => item.id !== trip.id);
      }
      return [...prev, trip];
    });
  };

  const isInWishlist = (tripId: string) => {
    return wishlist.some((item) => item.id === tripId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
