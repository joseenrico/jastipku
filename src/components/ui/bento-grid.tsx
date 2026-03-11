import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  delay?: number;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({ children, className, colSpan = 1, rowSpan = 1, delay = 0 }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300",
        colSpan === 2 && "md:col-span-2",
        colSpan === 3 && "md:col-span-3",
        colSpan === 4 && "md:col-span-4",
        rowSpan === 2 && "md:row-span-2",
        rowSpan === 3 && "md:row-span-3",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative h-full p-6 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}

interface BentoCardHeaderProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function BentoCardHeader({ icon, title, description, className }: BentoCardHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {icon && <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white">
        {icon}
      </div>}
      <h3 className="font-bold text-lg">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

interface BentoCardImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: React.ReactNode;
}

export function BentoCardImage({ src, alt, className, overlay }: BentoCardImageProps) {
  return (
    <div className={cn("relative w-full h-full rounded-2xl overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          {overlay}
        </div>
      )}
    </div>
  );
}
