export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  store?: string;
  url?: string;
  weight?: number; // in kg
  category?: string;
}

export interface CartItem extends Product {
  quantity: number;
  notes?: string;
  tripId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  address?: string;
}

export interface Jastiper {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  rating: number;
  totalTrips: number;
  totalOrders: number;
  bio: string;
  verified: boolean;
  joinedDate: string;
}

export interface Trip {
  id: string;
  destination: string;
  country: string;
  startDate: Date;
  endDate: Date;
  orderDeadline: Date;
  status: "upcoming" | "open" | "closing-soon" | "closed" | "completed";
  jastiperId: string;
  jastiperName: string;
  capacity: number; // in kg
  usedCapacity: number;
  remainingCapacity: number;
  items: TripItem[];
}

export interface TripItem {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  product: Product;
  quantity: number;
  status: OrderStatus;
  createdAt: Date;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "purchasing"
  | "purchased"
  | "in-transit"
  | "customs"
  | "shipping"
  | "out-for-delivery"
  | "delivered";

export interface Order {
  id: string;
  userId: string;
  tripId?: string;
  jastiperId?: string; // For backward compatibility
  items: CartItem[];
  status: OrderStatus;
  pricing: OrderPricing;
  timeline: OrderTimeline[];
  createdAt: Date;
  updatedAt: Date;
  proofOfPurchase?: string;
  receiptImage?: string;
  // Legacy fields for backward compatibility
  totalEstimate?: number;
  fee?: number;
  grandTotal?: number;
  shippingAddress?: string;
  deliveredAt?: string | null;
}

export interface OrderPricing {
  subtotal: number; // Total product price in IDR
  serviceFee: number; // Percentage of subtotal
  taxEstimate: number; // Percentage of subtotal
  shippingEstimate: number;
  total: number;
  currency: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  proofImage?: string;
}

export interface ProductRequest {
  id: string;
  userId: string;
  productName: string;
  productUrl: string;
  store: string;
  estimatedPrice: number;
  currency: string;
  quantity: number;
  notes: string;
  tripId?: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  createdAt: Date;
}

export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  product: Product;
  notifyWhenAvailable: boolean;
  targetTripId?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  orderId: string;
  jastiperId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DummyData {
  users: User[];
  jastipers: Jastiper[];
  trips: Trip[];
  orders: Order[];
  reviews: Review[];
  products: Product[];
}
