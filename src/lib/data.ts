import DUMMY_DATA from "@/data/DUMMY_DATA.json";
import type {
  User,
  Jastiper,
  Trip,
  Order,
  Review,
  Product,
} from "@/types";

const data = DUMMY_DATA as any;

export function getAllUsers(): User[] {
  return data.users;
}

export function getUserById(id: string): User | undefined {
  return data.users.find((user: User) => user.id === id);
}

export function getAllJastipers(): Jastiper[] {
  return data.jastipers;
}

export function getJastiperById(id: string): Jastiper | undefined {
  return data.jastipers.find((jastiper: Jastiper) => jastiper.id === id);
}

export function getAllTrips(): Trip[] {
  return data.trips.map((trip: any) => ({
    ...trip,
    startDate: new Date(trip.departureDate),
    endDate: new Date(trip.returnDate),
    jastiperId: trip.jastiperId,
    jastiperName: getJastiperById(trip.jastiperId)?.name || "Unknown",
  }));
}

export function getTripById(id: string): Trip | undefined {
  const trip = data.trips.find((trip: any) => trip.id === id);
  if (!trip) return undefined;
  return {
    ...trip,
    startDate: new Date(trip.departureDate),
    endDate: new Date(trip.returnDate),
    jastiperId: trip.jastiperId,
    jastiperName: getJastiperById(trip.jastiperId)?.name || "Unknown",
  };
}

export function getTripBySlug(slug: string): Trip | undefined {
  const trip = data.trips.find((trip: any) => trip.slug === slug);
  if (!trip) return undefined;
  return {
    ...trip,
    startDate: new Date(trip.departureDate),
    endDate: new Date(trip.returnDate),
    jastiperId: trip.jastiperId,
    jastiperName: getJastiperById(trip.jastiperId)?.name || "Unknown",
  };
}

export function getTripsByJastiperId(jastiperId: string): Trip[] {
  return data.trips
    .filter((trip: any) => trip.jastiperId === jastiperId)
    .map((trip: any) => ({
      ...trip,
      startDate: new Date(trip.departureDate),
      endDate: new Date(trip.returnDate),
      jastiperId: trip.jastiperId,
      jastiperName: getJastiperById(trip.jastiperId)?.name || "Unknown",
    }));
}

export function getAllOrders(): Order[] {
  return data.orders;
}

export function getOrderById(id: string): Order | undefined {
  return data.orders.find((order: Order) => order.id === id);
}

export function getOrdersByUserId(userId: string): Order[] {
  return data.orders.filter((order: Order) => order.userId === userId);
}

export function getOrdersByJastiperId(jastiperId: string): Order[] {
  return data.orders.filter((order: Order) => order.jastiperId === jastiperId);
}

export function getAllReviews(): Review[] {
  return data.reviews;
}

export function getReviewsByJastiperId(jastiperId: string): Review[] {
  return data.reviews.filter((review: Review) => review.jastiperId === jastiperId);
}

export function getReviewsByOrderId(orderId: string): Review[] {
  return data.reviews.filter((review: Review) => review.orderId === orderId);
}

export function getAllProducts(): Product[] {
  return data.products;
}

export function getProductById(id: string): Product | undefined {
  return data.products.find((product: Product) => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return data.products.filter((product: Product) => (product as any).category === category);
}

export function getProductsByCountry(country: string): Product[] {
  return data.products.filter((product: Product) => (product as any).country === country);
}

export function createTrip(tripData: {
  id: string;
  jastiperId: string;
  destination: string;
  country: string;
  slug: string;
  departureDate: string;
  returnDate: string;
  status: "upcoming" | "open" | "closing-soon" | "closed" | "completed";
  category: string;
  description: string;
  maxWeight: string;
  fee: string;
  cities: any[];
}): Trip {
  // Save to localStorage for persistence
  const existingTrips = JSON.parse(localStorage.getItem("trips") || "[]");
  existingTrips.push(tripData);
  localStorage.setItem("trips", JSON.stringify(existingTrips));

  return {
    ...tripData,
    startDate: new Date(tripData.departureDate),
    endDate: new Date(tripData.returnDate),
    orderDeadline: new Date(tripData.departureDate),
    jastiperName: getJastiperById(tripData.jastiperId)?.name || "Unknown",
    capacity: parseInt(tripData.maxWeight) || 0,
    usedCapacity: 0,
    remainingCapacity: parseInt(tripData.maxWeight) || 0,
    items: [],
  };
}
