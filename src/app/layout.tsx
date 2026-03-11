import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { StickyCart } from "@/components/StickyCart";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JastipKu - Indonesia's #1 Jastip Platform",
    template: "%s | JastipKu"
  },
  description:
    "JastipKu connects you with trusted jastipers traveling abroad. Shop international products easily - from K-Beauty to Anime, Fashion to Electronics. Safe, secure, and reliable.",
  keywords: ["jastip", "jasa titip", "international shopping", "K-Beauty", "Anime", "travel shopping", "Indonesia"],
  authors: [{ name: "JastipKu" }],
  openGraph: {
    title: "JastipKu - Indonesia's #1 Jastip Platform",
    description: "Shop international products with trusted jastipers",
    type: "website",
    locale: "en_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "JastipKu - Indonesia's #1 Jastip Platform",
    description: "Shop international products with trusted jastipers",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NotificationProvider>
              <CartProvider>
                <WishlistProvider>
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <StickyCart />
                  <Toaster />
                </WishlistProvider>
              </CartProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
