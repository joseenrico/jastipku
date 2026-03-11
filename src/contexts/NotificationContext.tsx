"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type NotificationType = "order" | "chat" | "trip" | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  href?: string;
  createdAt: string; // ISO string
  read: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, "id" | "createdAt" | "read"> & Partial<Pick<AppNotification, "id" | "createdAt" | "read">>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function storageKey(userId: string) {
  return `jastipku_notifications_${userId}`;
}

function seedNotifications(role: "buyer" | "jastiper"): AppNotification[] {
  const now = Date.now();
  const base = (offsetMinutes: number) => new Date(now - offsetMinutes * 60_000).toISOString();

  if (role === "jastiper") {
    return [
      {
        id: "seed-jastiper-1",
        type: "order",
        title: "New request received",
        description: "Buyer just submitted a request. Review items and confirm pricing.",
        href: "/orders/order3",
        createdAt: base(12),
        read: false,
      },
      {
        id: "seed-jastiper-2",
        type: "chat",
        title: "Buyer sent a message",
        description: "Open P2P chat to respond quickly.",
        href: "/orders/order3?tab=chat",
        createdAt: base(55),
        read: false,
      },
      {
        id: "seed-jastiper-3",
        type: "system",
        title: "Payout ready",
        description: "Escrow funds will be released after buyer confirms arrival.",
        href: "/jastiper/dashboard",
        createdAt: base(180),
        read: true,
      },
    ];
  }

  return [
    {
      id: "seed-buyer-1",
      type: "order",
      title: "Order status updated",
      description: "Your order is being prepared by the jastiper.",
      href: "/orders/order3",
      createdAt: base(18),
      read: false,
    },
    {
      id: "seed-buyer-2",
      type: "chat",
      title: "New message from jastiper",
      description: "Open P2P chat to see the latest update.",
      href: "/orders/order3?tab=chat",
      createdAt: base(70),
      read: false,
    },
    {
      id: "seed-buyer-3",
      type: "trip",
      title: "Trip closing soon",
      description: "Submit your request before the trip ends.",
      href: "/trips",
      createdAt: base(240),
      read: true,
    },
  ];
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Load on user change
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const key = storageKey(user.id);
    const raw = localStorage.getItem(key);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AppNotification[];
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
          return;
        }
      } catch {
        // fall through to seed
      }
    }

    const seeded = seedNotifications(user.role);
    setNotifications(seeded);
    localStorage.setItem(key, JSON.stringify(seeded));
  }, [user]);

  // Persist on changes
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(storageKey(user.id), JSON.stringify(notifications));
  }, [notifications, user]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const addNotification: NotificationContextType["addNotification"] = (notification) => {
    if (!user) return;
    const id = notification.id || `n-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const createdAt = notification.createdAt || new Date().toISOString();
    const read = notification.read ?? false;

    setNotifications((prev) => [
      { ...notification, id, createdAt, read } as AppNotification,
      ...prev,
    ]);
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markRead,
        markAllRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationProvider");
  return ctx;
};

