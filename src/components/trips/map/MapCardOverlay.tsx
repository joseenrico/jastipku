"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users } from 'lucide-react';

interface MapCardOverlayProps {
  title: string;
  subtitle?: string;
  cityCount?: number;
  jastiperCount?: number;
  image?: string;
  onClick?: () => void;
  variant?: 'country' | 'city';
  position?: 'left' | 'right' | 'center';
}

export default function MapCardOverlay({
  title,
  subtitle,
  cityCount,
  jastiperCount,
  image,
  onClick,
  variant = 'country',
  position = 'left',
}: MapCardOverlayProps) {
  const positionClasses = {
    left: 'left-4 top-1/2 -translate-y-1/2',
    right: 'right-4 top-1/2 -translate-y-1/2',
    center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: position === 'left' ? -20 : position === 'right' ? 20 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: position === 'left' ? -20 : position === 'right' ? 20 : 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`absolute ${positionClasses[position]} z-10`}
      onClick={onClick}
    >
      <Card className="w-72 overflow-hidden bg-white/80 dark:bg-black/60 backdrop-blur-xl border-0 shadow-2xl cursor-pointer group">
        {image && (
          <div className="relative h-32 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
        <CardContent className="p-4 space-y-3">
          <div>
            <Badge variant="secondary" className="mb-2 text-xs">
              {variant === 'country' ? 'Country' : 'City'}
            </Badge>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {cityCount !== undefined && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{cityCount} Cities</span>
              </div>
            )}
            {jastiperCount !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{jastiperCount} Jastipers</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
