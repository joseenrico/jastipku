"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { ShieldCheck, ShoppingBag, ArrowRight, User, Briefcase } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(formData.email);

    if (success) {
      toast.success("Login successful!", {
        description: `Welcome back to JastipKu.`,
      });
      router.push("/profile");
    } else {
      toast.error("Login failed", {
        description: "Please check your email and try again.",
      });
    }

    setIsLoading(false);
  };

  const handleQuickLogin = async (email: string) => {
    setFormData({ email, password: "jastipku" });
    setIsLoading(true);
    const success = await login(email);
    if (success) {
      toast.success("Demo Login successful!", {
        description: `Logged in as ${email === "buyer@jastipku.com" ? "Buyer" : "Jastiper"}.`,
      });
      router.push("/profile");
    } else {
      toast.error("Demo login failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Visual Side (Left) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2070&auto=format&fit=crop"
            alt="Airport Traveler"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20" />
        </div>

        <div className="relative z-10 text-white space-y-8 max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-20 h-20 mb-8 rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
              <Image
                src="/JasTipku-Logo.png"
                alt="JastipKu Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tighter">
              Bring the world <br />to your doorstep.
            </h1>
            <p className="text-xl text-primary-foreground/90 mt-6 leading-relaxed font-medium">
              Join Indonesia&apos;s most trusted jastip network. Safe, simple, and global.
            </p>
          </motion.div>

          <div className="space-y-4 pt-10 border-t border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span>Secure JastipPay Escrow System</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span>Verified Travelers From 50+ Countries</span>
            </div>
          </div>
        </div>

        {/* Floating animated blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[80px]" />
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-transparent relative overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left space-y-2">
            <Link href="/" className="lg:hidden flex justify-center mb-6">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg border-2 border-primary/20 bg-background">
                  <Image
                    src="/JasTipku-Logo.png"
                    alt="JastipKu Logo"
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <span className="text-3xl font-black from-primary to-orange-500 bg-clip-text text-transparent">
                  JastipKu
                </span>
              </div>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Login to JastipKu</h2>
            <p className="text-muted-foreground">
              Please enter your details to access your dashboard.
            </p>
          </div>

          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-11"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password text-sm font-medium">Password</Label>
                    <Link href="#" className="text-sm text-primary hover:underline font-medium">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base bg-primary hover:bg-primary/90 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Authenticating...
                    </>
                  ) : "Sign In to My Account"}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground font-medium">
                    Or Quick Login (Demo)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="group hover:border-primary/50"
                  onClick={() => handleQuickLogin("buyer@jastipku.com")}
                  disabled={isLoading}
                >
                  <User className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  Buyer Account
                </Button>
                <Button
                  variant="outline"
                  className="group hover:border-orange-500/50"
                  onClick={() => handleQuickLogin("jastiper@jastipku.com")}
                  disabled={isLoading}
                >
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                  Jastiper Account
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-10">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-bold">
                  Create an account for free
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
