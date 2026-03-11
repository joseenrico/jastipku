"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CountryData } from './MapData';

interface CountryMarkerProps {
  country: CountryData;
  onClick?: () => void;
}

export default function CountryMarker({ country, onClick }: CountryMarkerProps) {
  const { coordinates, name, destination } = country;

  return (
    <g
      className="cursor-pointer"
      onClick={onClick}
      style={{ transformOrigin: `${coordinates.lat}% ${coordinates.lng}%` }}
    >
      <motion.circle
        cx={coordinates.lat}
        cy={coordinates.lng}
        r="3"
        fill="#f59e0b"
        filter="url(#glow)"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.5 }}
        transition={{ duration: 0.2 }}
      />

      <motion.circle
        cx={coordinates.lat}
        cy={coordinates.lng}
        r="3"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="0.3"
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{
          scale: [1, 2, 2.5],
          opacity: [0.8, 0.4, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />

      <motion.circle
        cx={coordinates.lat}
        cy={coordinates.lng}
        r="1.5"
        fill="#fff"
        initial={{ opacity: 0.9 }}
        whileHover={{ opacity: 1 }}
      />

      <motion.text
        x={coordinates.lat}
        y={coordinates.lng + 5}
        textAnchor="middle"
        className="text-[2px] fill-foreground font-semibold pointer-events-none"
        initial={{ opacity: 0.7 }}
        whileHover={{ opacity: 1 }}
      >
        {destination}
      </motion.text>

      <title>{name}</title>
    </g>
  );
}
