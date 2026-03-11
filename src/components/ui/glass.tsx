import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
}

export function GlassCard({ children, className, hover = true, animate = true }: GlassCardProps) {
  const card = (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg",
        hover && "hover:shadow-2xl hover:border-primary/30 transition-all duration-300",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        {children}
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={hover ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
      >
        {card}
      </motion.div>
    );
  }

  return card;
}

interface GlassButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  isLoading?: boolean;
  success?: boolean;
}

export function GlassButton({
  variant = "primary",
  size = "md",
  children,
  isLoading,
  success,
  className,
  ...props
}: GlassButtonProps) {
  const baseStyles = "relative overflow-hidden rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-orange-500 text-white hover:shadow-lg hover:shadow-primary/30 hover:scale-105",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105",
    outline: "border-2 border-primary/50 text-primary hover:bg-primary/10 hover:scale-105",
    ghost: "text-foreground hover:bg-muted/50 hover:scale-105",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileTap={{ scale: 0.95 }}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
        />
      ) : success ? (
        <motion.svg
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </motion.svg>
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
}

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export function GlassInput({ label, icon, error, className, ...props }: GlassInputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="relative">
        <input
          className={cn(
            "w-full px-4 py-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent",
            "placeholder:text-muted-foreground/70",
            "transition-all duration-300",
            icon && "pl-12",
            error && "border-destructive focus:ring-destructive/50",
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
