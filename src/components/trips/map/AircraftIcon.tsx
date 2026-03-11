"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface AircraftIconProps {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  progress: number;
}

export default function AircraftIcon({ start, end, progress }: AircraftIconProps) {
  const position = useMemo(() => {
    const t = Math.min(1, Math.max(0, progress));
    return {
      lat: start.lat + (end.lat - start.lat) * t,
      lng: start.lng + (end.lng - start.lng) * t,
    };
  }, [start, end, progress]);

  const angle = useMemo(() => {
    return Math.atan2(end.lng - start.lng, end.lat - start.lat) * (180 / Math.PI);
  }, [start, end]);

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: progress < 1 ? 1 : 0 }}
      exit={{ opacity: 0 }}
      style={{
        transform: `translate(${position.lat}%, ${position.lng}%) rotate(${angle}deg)`,
      }}
    >
      <motion.path
        d="M 0 -1.5 L 1 0 L 0 1 L -1 0 Z"
        fill="#f59e0b"
        filter="url(#glow)"
        animate={{
          x: [0, 0.5, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.path
        d="M -1 0 L -2 -0.5 L -2 0.5 Z"
        fill="#f59e0b"
        animate={{
          x: [0, -0.3, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.g>
  );
}
