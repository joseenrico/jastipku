"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloatingActionMenu } from "@/components/FloatingActionMenu";
import { RealisticEarth } from "@/components/RealisticEarth";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Plane,
  ShieldCheck,
  CheckCircle2,
  Globe,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Sparkles,
  Zap,
  HandCoins,
  Camera,
  Truck,
} from "lucide-react";
import { getAllTrips, getAllJastipers } from "@/lib/data";
import { useRef } from "react";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const stats = [
    { icon: Globe, value: "50+", label: "Countries" },
    { icon: Users, value: "10k+", label: "Verified Users" },
    { icon: TrendingUp, value: "Rp 2B+", label: "Transactions" },
    { icon: HandCoins, value: "100%", label: "Escrow Safe" },
  ];

  return (
    <div ref={containerRef} className="flex flex-col bg-background">
      {/* Floating Action Menu */}
      <FloatingActionMenu />

      {/* 🚀 Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 4K Background Video */}
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/images/background-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/0" />
        </motion.div>

        {/* Hero Content */}
        <div className="container relative z-10 text-center px-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white border-primary"
          >
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-widest">Experience The Global Shopping Revolution</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-white tracking-tighter"
          >
            <span className="block italic font-light opacity-80 text-4xl md:text-6xl mb-2">Titip Apapun,</span>
            <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent animate-gradient-x">
              Dari Mana Saja.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-xl md:text-2xl text-white/70 leading-relaxed font-medium"
          >
            JastipKu menghubungkan Anda dengan traveler tepercaya di seluruh dunia. Dapatkan barang impian Anda dengan sistem escrow yang 100% aman.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Button asChild size="lg" className="h-16 px-10 text-xl font-bold bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(255,122,0,0.3)] transition-all hover:scale-105 rounded-2xl group">
              <Link href="/trips">
                Mulai Belanja <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-10 text-xl font-bold border-2 border-white/50 text-black hover:bg-white hover:text-orange-500 transition-all rounded-2xl backdrop-blur-sm">
              <Link href="/register">Jadi Jastiper</Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Scroll to explore</span>
        </motion.div>
      </section>

      {/* 🌍 The Global Shopping Hub (Rotating Globe Effect Mock) */}
      <section className="py-32 relative overflow-hidden bg-background">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Badge variant="outline" className="px-4 py-2 border-primary text-primary text-sm font-bold uppercase tracking-widest">
                The Global Network
              </Badge>
              <h2 className="text-5xl md:text-7xl font-bold leading-[1.1]">
                Belanja di <span className="text-primary">California</span> <br /> 
                Serasa di <span className="text-orange-500">Sudirman.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Kami mensimulasikan koneksi belanja real-time dari seluruh pusat perbelanjaan ternama di dunia langsung ke genggaman Anda. Tidak ada lagi hambatan jarak.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Real-time Photo Proof</span>
                  </div>
                  <p className="text-muted-foreground">Lihat barangnya sebelum dibayar.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Secure Escrow</span>
                  </div>
                  <p className="text-muted-foreground">Uang aman sampai barang tiba.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              {/* Professional Realistic 3D Earth Globe - Interactive */}
              <div className="relative aspect-square w-full max-w-[600px] mx-auto flex items-center justify-center">
                {/* Main Globe Container - Larger and Clean */}
                <div className="relative w-full h-full max-w-[500px] max-h-[500px]">
                  {/* RealisticEarth 3D Component with Mouse Interaction */}
                  <RealisticEarth
                    showStars={false}
                    autoRotate={true}
                    rotationSpeed={0.2}
                    interactive={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🛡️ Trust Pillar Grid */}
      <section className="py-32 bg-muted/30">
        <div className="container">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold">Kenapa Memilih JastipKu?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Standar keamanan industri untuk pengalaman titip-beli terbaik.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                icon: ShieldCheck, 
                title: "100% Safe Escrow", 
                desc: "Dana Anda tertahan di sistem kami dan hanya dilepaskan ke Jastiper setelah Anda mengonfirmasi barang telah tiba di Indonesia.",
                color: "bg-blue-500"
              },
              { 
                icon: Users, 
                title: "Traveler Terverifikasi", 
                desc: "Setiap Jastiper melewati proses verifikasi identitas (E-KTP) dan screening histori perjalanan yang ketat.",
                color: "bg-emerald-500"
              },
              { 
                icon: Camera, 
                title: "Visual Verification", 
                desc: "Jastiper wajib mengirimkan foto bukti pembelian di toko secara real-time sebelum transaksi final dilakukan.",
                color: "bg-orange-500"
              },
              { 
                icon: HandCoins, 
                title: "Tax Transparency", 
                desc: "Bantuan kalkulasi pajak masuk ($500 limit) agar Anda tidak perlu khawatir dengan kendala di Bea Cukai.",
                color: "bg-purple-500"
              },
              { 
                icon: Zap, 
                title: "Instant Chat", 
                desc: "Komunikasi langsung dengan Jastiper untuk negosiasi harga dan detail barang secara real-time.",
                color: "bg-amber-500"
              },
              { 
                icon: Truck, 
                title: "Domestic Dispatch", 
                desc: "Integrasi pengiriman lokal (JNE/Gojek/Grab) segera setelah Jastiper mendarat kembali di Jakarta.",
                color: "bg-cyan-500"
              }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-card rounded-3xl border border-muted hover:border-primary/50 transition-all shadow-sm hover:shadow-2xl space-y-4 group"
              >
                <div className={`p-4 ${pillar.color} rounded-2xl w-fit shadow-lg group-hover:scale-110 transition-transform`}>
                  <pillar.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">{pillar.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📊 Real-time Stats */}
      <section className="py-24 border-y">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-5xl md:text-6xl font-extrabold text-primary mb-2 group-hover:scale-110 transition-transform duration-500">{stat.value}</div>
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⭐ 5-Star Reviews Carousel */}
      <section className="py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="px-4 py-2 border-primary text-primary text-sm font-bold uppercase tracking-widest">
              What Our Users Say
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold">Loved by Thousands</h2>
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-2xl font-bold ml-4">5.0/5.0</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                name: "Sarah Amelia",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
                rating: 5,
                comment: "Gila sih, JastipKu nyelamatin banget! Mau beli sepatu dari LA, traveler-nya responsif dan barang sampe dengan aman.",
                location: "Jakarta"
              },
              {
                name: "Michael Chen",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                rating: 5,
                comment: "Sistem escrow-nya bikin tenang. Barang baru dibayar lunas setelah sampai Indonesia. Recommended!",
                location: "Surabaya"
              },
              {
                name: "Jessica Tan",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
                rating: 5,
                comment: "Foto real-time dari toko bikin yakin banget. Jastipernya juga ramah dan mau diajak nego. Top!",
                location: "Bandung"
              },
              {
                name: "David Pratama",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
                rating: 5,
                comment: "Pertama kali coba langsung ketagihan! Prosesnya cepet, aman, dan biayanya transparan banget.",
                location: "Medan"
              },
              {
                name: "Rachel Wijaya",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
                rating: 5,
                comment: "Udah 5x pake JastipKu, semua lancar jaya! Traveler-nya verified dan profesional. Mantap!",
                location: "Bali"
              }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-6 bg-card rounded-2xl border border-muted shadow-lg hover:shadow-2xl transition-all space-y-4"
              >
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-sm">{review.name}</div>
                    <div className="text-xs text-muted-foreground">{review.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏁 CTA Section */}
      <section className="py-40 relative overflow-hidden bg-primary">
         <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1530789253488-b413832bd17b?q=80&w=2070&auto=format&fit=crop" 
            alt="Travelers" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container relative z-10 text-center text-white space-y-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter"
          >
            SIAP UNTUK BELANJA <br /> DUNIA?
          </motion.h2>
          <p className="text-2xl text-white/80 max-w-3xl mx-auto font-medium leading-relaxed">
            Bergabunglah dengan 10.000+ pengguna yang telah bertransaksi dengan aman melalui JastipKu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Button asChild size="lg" className="h-20 px-12 text-2xl font-black bg-white text-primary hover:bg-white/90 rounded-3xl shadow-2xl transition-all hover:scale-105">
              <Link href="/register">Buat Akun Gratis</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-20 px-12 text-2xl font-black border-2 border-white text-black hover:bg-white hover:text-orange-500 rounded-3xl transition-all">
              <Link href="/trips">Lihat Jastiper</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
