import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plane, 
  Heart, 
  Globe, 
  Users, 
  Award, 
  Target, 
  Zap, 
  Shield,
  ArrowRight,
  MapPin,
  Mail,
  Linkedin,
  Twitter,
  Package
} from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Alexandra Chen",
      role: "CEO & Founder",
      avatar: "https://i.pravatar.cc/150?u=alex",
      bio: "Former travel blogger turned entrepreneur. Passionate about connecting cultures.",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Michael Torres",
      role: "CTO",
      avatar: "https://i.pravatar.cc/150?u=michael",
      bio: "Tech enthusiast with 10+ years building scalable platforms.",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Sarah Kim",
      role: "Head of Operations",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      bio: "Ensuring every jastip experience is smooth and reliable.",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "David Wijaya",
      role: "Community Manager",
      avatar: "https://i.pravatar.cc/150?u=david",
      bio: "Building trust and connections within our jastip community.",
      social: { linkedin: "#", twitter: "#" }
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Trust First",
      description: "Every jastiper is verified and reviewed by our community.",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: Globe,
      title: "Global Connection",
      description: "Bridging cultures through the simple act of sharing.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "Quick updates and timely delivery guaranteed.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Your payments are protected until delivery is confirmed.",
      gradient: "from-green-500 to-emerald-500"
    },
  ];

  const stats = [
    { value: "55+", label: "Countries", icon: Globe },
    { value: "98k+", label: "Active Jastipers", icon: Users },
    { value: "110k+", label: "Orders Completed", icon: Package },
    { value: "99%", label: "Satisfaction Rate", icon: Award },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="px-4 py-2 text-sm mb-2">
              <Plane className="h-3 w-3 mr-1" />
              About JastipKu
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Connecting Travelers with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                {" "}Shopping Dreams
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We&apos;re on a mission to make international shopping accessible, 
              affordable, and trustworthy for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y bg-gradient-to-r from-primary/5 via-orange-500/5 to-primary/5">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-2xl">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                Our Story
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Born from a Simple Idea
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  JastipKu started in 2024 when our founder struggled to find authentic 
                  Korean skincare products in Indonesia. A friend traveling to Seoul 
                  offered to bring some back — and that&apos;s when the lightbulb moment happened.
                </p>
                <p>
                  What if we could connect people traveling abroad with those who want 
                  authentic international products? A platform where travelers could 
                  earn extra income doing what they already love, and shoppers could 
                  access products they couldn&apos;t find locally.
                </p>
                <p>
                  Today, JastipKu has grown into Indonesia&apos;s leading jastip platform, 
                  connecting hundreds of travelers with thousands of happy customers 
                  across the country.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <Button asChild className="bg-primary hover:bg-primary/90 gap-2">
                  <Link href="/trips">
                    Browse Trips
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/register">Become a Jastiper</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-3xl blur-3xl" />
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-orange-500 p-1">
                <div className="w-full h-full rounded-3xl bg-background flex items-center justify-center p-8">
                  <div className="relative w-full h-full">
                    <Image 
                      src="/JasTipku-Logo.png" 
                      alt="JastipKu Logo" 
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-muted/30 via-muted/10 to-background">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="px-4 py-2 text-sm mb-2">
              <Target className="h-3 w-3 mr-1" />
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">What Drives Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                  <CardContent className="pt-6 text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${value.gradient} p-[2px]`}>
                      <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                        <Icon className="h-8 w-8 text-foreground" />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="px-4 py-2 text-sm mb-2">
              <Users className="h-3 w-3 mr-1" />
              Our Team
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">Meet the People Behind JastipKu</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A passionate team dedicated to making your jastip experience amazing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden text-center">
                <CardContent className="pt-6 space-y-4">
                  <Avatar className="w-24 h-24 mx-auto ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-orange-500 text-white text-xl">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                  <div className="flex justify-center gap-2 pt-2">
                    <a href={member.social.linkedin} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a href={member.social.twitter} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-500 to-primary bg-300% animate-gradient" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Whether you&apos;re a traveler looking to earn extra income or a shopper 
              seeking authentic international products, JastipKu is here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold">
                <Link href="/register">Sign Up Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold bg-transparent border-2 border-white/50 text-white hover:bg-white/10">
                <Link href="/trips">Browse Trips</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
