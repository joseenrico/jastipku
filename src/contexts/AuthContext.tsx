"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import dummyData from "@/data/DUMMY_DATA.json";

export interface Transaction {
  id: string;
  type: "topup" | "payment" | "earning" | "withdrawal" | "refund";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  orderId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  address?: string;
  role: "buyer" | "jastiper";
  verified?: boolean;
  jastipPayBalance: number;
  transactions: Transaction[];
  bio?: string;
  joinedDate?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateBalance: (amount: number, type: Transaction["type"], orderId?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from LocalStorage or Dummy Data
  useEffect(() => {
    const storedUser = localStorage.getItem("jastipku_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Persist to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("jastipku_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("jastipku_user");
    }
  }, [user]);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check Buyer Account
    if (email === "buyer@jastipku.com") {
      const buyerData = dummyData.users.find(u => u.email === "demo@jastipku.com"); // Using existing demo as buyer
      if (buyerData) {
        setUser({
          ...buyerData,
          email: "buyer@jastipku.com",
          role: "buyer",
          jastipPayBalance: (buyerData as any).jastipPayBalance || 2500000,
          transactions: (buyerData as any).transactions || []
        } as User);
        setIsLoading(false);
        return true;
      }
    }

    // Check Jastiper Account
    if (email === "jastiper@jastipku.com") {
      const jastiperData = dummyData.jastipers.find(j => j.id === "jastiper1");
      if (jastiperData) {
        setUser({
          ...jastiperData,
          email: "jastiper@jastipku.com",
          role: "jastiper",
          jastipPayBalance: (jastiperData as any).jastipPayBalance || 8450000,
          transactions: (jastiperData as any).transactions || []
        } as User);
        setIsLoading(false);
        return true;
      }
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateBalance = (amount: number, type: Transaction["type"], orderId?: string) => {
    if (!user) return;

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type,
      amount: Math.abs(amount),
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      orderId
    };

    const newBalance = type === "topup" || type === "earning" || type === "refund" 
      ? user.jastipPayBalance + amount 
      : user.jastipPayBalance - amount;

    setUser({
      ...user,
      jastipPayBalance: newBalance,
      transactions: [newTransaction, ...user.transactions]
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
