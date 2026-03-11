"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ConnectionPath as ConnectionPathType } from './MapData';

interface ConnectionPathProps {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  curve?: { lat: number; lng: number };
  progress?: number;
}

export default function ConnectionPath({ from, to, curve, progress = 1 }: ConnectionPathProps) {
  const pathD = curve
    ? `M ${from.lat} ${from.lng} Q ${curve.lat} ${curve.lng} ${to.lat} ${to.lng}`
    : `M ${from.lat} ${from.lng} L ${to.lat} ${to.lng}`;

  return (
    <g>
      <motion.path
        d={pathD}
        fill="none"
        stroke="#94a3b8"
        strokeWidth="0.3"
        strokeDasharray="1 1"
        opacity="0.3"
      />

      <motion.path
        d={pathD}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="0.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        style={{
          filter: 'url(#glow)',
        }}
      />
    </g>
  );
}
