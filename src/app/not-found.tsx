"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane, Home, ArrowLeft, MapPin, Search, MessageSquare, Compass, ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false);
  
  // Parallax constraints
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  const translatePlaneX = useTransform(dx, [-500, 500], [-50, 50]);
  const translatePlaneY = useTransform(dy, [-500, 500], [-50, 50]);
  
  const translateBgX = useTransform(dx, [-500, 500], [20, -20]);
  const translateBgY = useTransform(dy, [-500, 500], [20, -20]);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = clientX - window.innerWidth / 2;
      const y = clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-[90vh] flex items-center justify-center overflow-hidden relative bg-background">
      {/* 🌌 Immersive Parallax Background */}
      <motion.div 
        style={{ x: translateBgX, y: translateBgY }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      </motion.div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          {/* ✈️ Parallax Icon Stage */}
          <div className="relative h-48 flex items-center justify-center">
            <motion.div 
              style={{ x: translatePlaneX, y: translatePlaneY }}
              className="relative z-20"
            >
              <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl skew-x-[-10deg] rotate-[-5deg]">
                <Plane className="h-24 w-24 text-primary animate-pulse" />
              </div>
              {/* Speed Lines */}
              <div className="absolute -left-20 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent to-primary/30 rounded-full animate-pulse" />
                <div className="w-20 h-1 bg-gradient-to-r from-transparent to-primary/20 rounded-full animate-pulse delay-75" />
                <div className="w-16 h-1 bg-gradient-to-r from-transparent to-primary/40 rounded-full animate-pulse delay-150" />
              </div>
            </motion.div>
            
            {/* Ghosty Shadow */}
            <motion.div 
              style={{ x: useTransform(dx, [-500, 500], [-30, 30]), y: useTransform(dy, [-500, 500], [100, 120]) }}
              className="absolute w-32 h-6 bg-black/10 blur-xl rounded-full"
            />
          </div>

          {/* 📝 Copy with Premium Typography */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-[0.3em]"
            >
              Arrival Impossible
            </motion.div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none">
              TRIP <span className="text-primary italic">CANCELLED</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
              Mohon maaf, destinasi yang Anda tuju tidak terdaftar di rute JastipKu. <br className="hidden md:block"/> 
              Mungkin Jastiper-nya ganti pesawat?
            </p>
          </div>

          {/* 🌍 Action Grid */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Button asChild size="lg" className="h-16 px-8 text-lg font-bold bg-primary hover:bg-primary/90 rounded-2xl shadow-xl transition-all hover:scale-105 group">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Home Base
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-8 text-lg font-bold border-2 rounded-2xl hover:bg-muted transition-all">
              <Link href="/trips">
                <Compass className="mr-2 h-5 w-5" />
                Explore Trips
              </Link>
            </Button>
            <Button variant="secondary" size="lg" className="h-16 px-8 text-lg font-bold rounded-2xl hover:bg-muted transition-all" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
          </div>

          {/* 🐱 Cat AI Floating Helper */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-20"
          >
            <div className="inline-flex items-center gap-4 p-4 bg-muted/50 backdrop-blur-sm border rounded-2xl hover:bg-muted transition-all group cursor-pointer">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <MessageSquare className="text-white h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black uppercase tracking-widest text-primary">Tanya Cat AI</p>
                <p className="text-xs text-muted-foreground">"Bantu saya cari rute belanja yang benar!"</p>
              </div>
              <ArrowRight className="h-4 w-4 ml-4 opacity-50" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
