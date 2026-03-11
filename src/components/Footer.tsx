"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { toast } from "sonner";

export function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement;
    if (input.value) {
      toast.success("Subscribed!", {
        description: "You'll receive the latest updates.",
      });
      input.value = "";
    }
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
  ];

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <Image 
                src="/JasTipku-Logo.png" 
                alt="JastipKu Logo" 
                width={150} 
                height={40} 
                className="group-hover:opacity-90 transition-opacity"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Platform jasa titip premium. Jastiper bepergian ke luar negeri,
              membeli barang titipan user, lalu mengirimkannya ke alamat user.
            </p>
            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                { href: "/trips", label: "Browse Trips" },
                { href: "/about", label: "About Us" },
                { href: "/faq", label: "FAQ" },
                { href: "/wishlist", label: "Wishlist" },
                { href: "/profile", label: "Profile" },
                { href: "/login", label: "Login" },
                { href: "/register", label: "Sign Up" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Categories</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                { href: "/trips?category=K-Beauty", label: "K-Beauty" },
                { href: "/trips?category=Anime", label: "Anime & Manga" },
                { href: "/trips?category=Fashion", label: "Fashion" },
                { href: "/trips?category=Electronics", label: "Electronics" },
                { href: "/trips?category=Food", label: "Food & Snacks" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4 text-lg">Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Subscribe for latest trips and exclusive deals.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="jastipku@email.com"
                  className="h-10"
                  required
                />
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
                  <Mail className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Contact</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  support@jastipku.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  +62 800-JASTIPKU
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  Jakarta, Indonesia
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} JastipKu. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
