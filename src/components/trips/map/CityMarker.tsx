"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CityData } from './MapData';

interface CityMarkerProps {
  city: CityData;
  isActive?: boolean;
  isPast?: boolean;
  onClick?: () => void;
}

export default function CityMarker({ city, isActive = false, isPast = false, onClick }: CityMarkerProps) {
  const { coordinates, name } = city;

  const getFillColor = () => {
    if (isActive) return '#10b981';
    if (isPast) return '#6366f1';
    return '#f43f5e';
  };

  return (
    <g
      className="cursor-pointer"
      onClick={onClick}
      style={{ transformOrigin: `${coordinates.lat}% ${coordinates.lng}%` }}
    >
      <motion.circle
        cx={coordinates.lat}
        cy={coordinates.lng}
        r="2.5"
        fill={getFillColor()}
        filter="url(#glow)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.8 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      />

      {isActive && (
        <motion.circle
          cx={coordinates.lat}
          cy={coordinates.lng}
          r="2.5"
          fill="none"
          stroke="#10b981"
          strokeWidth="0.4"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{
            scale: [1, 2, 2.5],
            opacity: [0.8, 0.4, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}

      <motion.circle
        cx={coordinates.lat}
        cy={coordinates.lng}
        r="1"
        fill="#fff"
      />

      <motion.text
        x={coordinates.lat}
        y={coordinates.lng + 4}
        textAnchor="middle"
        className="text-[1.8px] fill-foreground font-medium pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {name}
      </motion.text>

      <title>{name}</title>
    </g>
  );
}
