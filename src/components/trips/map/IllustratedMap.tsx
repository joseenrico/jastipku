"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useMapTransition } from './MapTransitionContext';
import { COUNTRIES_DATA, getCountryBySlug, getCityConnections, ORIGIN_POINT, CountryData, CityData } from './MapData';
import CountryMarker from './CountryMarker';
import CityMarker from './CityMarker';
import ConnectionPath from './ConnectionPath';
import AircraftIcon from './AircraftIcon';

interface IllustratedMapProps {
  mode?: 'world' | 'country' | 'city';
  countrySlug?: string;
  citySlug?: string;
  onCountryClick?: (country: CountryData) => void;
  onCityClick?: (city: CityData) => void;
  className?: string;
  showCards?: boolean;
}

export default function IllustratedMap({
  mode = 'world',
  countrySlug,
  citySlug,
  onCountryClick,
  onCityClick,
  className = '',
  showCards = false,
}: IllustratedMapProps) {
  const {
    currentCountry,
    currentCity,
    zoomLevel,
    viewCenter,
    showPath,
    isFlying,
    pathProgress,
    animationPhase,
    setAnimationPhase,
    updatePathProgress,
    transitionKey,
  } = useMapTransition();

  const controls = useAnimation();
  const currentCountryData = countrySlug ? getCountryBySlug(countrySlug) : null;
  const connections = currentCountryData ? getCityConnections(currentCountryData.cities) : [];

  useEffect(() => {
    const animateSequence = async () => {
      if (mode === 'country' && currentCountryData) {
        await controls.start({
          scale: currentCountryData.zoomLevel,
          x: -(currentCountryData.zoomCenter.lat - 50) * 2,
          y: -(currentCountryData.zoomCenter.lng - 50) * 2,
          transition: { duration: 0.8, ease: 'easeInOut' },
        });
        setAnimationPhase('path-drawing');

        let progress = 0;
        const duration = 1500;
        const startTime = Date.now();

        const animatePath = () => {
          const elapsed = Date.now() - startTime;
          progress = Math.min(1, elapsed / duration);
          updatePathProgress(progress);

          if (progress < 1) {
            requestAnimationFrame(animatePath);
          } else {
            setAnimationPhase('arrived');
          }
        };

        setTimeout(() => {
          requestAnimationFrame(animatePath);
        }, 300);
      } else if (mode === 'world') {
        await controls.start({
          scale: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.6, ease: 'easeInOut' },
        });
      }
    };

    animateSequence();
  }, [mode, countrySlug, transitionKey, controls, currentCountryData, setAnimationPhase, updatePathProgress]);

  const handleCountryClick = (country: CountryData) => {
    if (onCountryClick) {
      onCountryClick(country);
    }
  };

  const handleCityClick = (city: CityData) => {
    if (onCityClick) {
      onCityClick(city);
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="oceanGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="50%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="oceanGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="50%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <radialGradient id="markerGlow" cx="0" cy="0" r="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.g
          animate={controls}
          initial={{ scale: 1, x: 0, y: 0 }}
          key={transitionKey}
        >
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="url(#oceanGradientLight)"
            className="dark:fill-[url(#oceanGradientDark)]"
          />

          <g className="opacity-30 dark:opacity-20">
            <path
              d="M 10 30 Q 30 25 50 30 T 90 35"
              fill="none"
              stroke="#64748b"
              strokeWidth="0.3"
              strokeDasharray="1 1"
            />
            <path
              d="M 5 50 Q 25 45 45 50 T 85 55"
              fill="none"
              stroke="#64748b"
              strokeWidth="0.2"
              strokeDasharray="0.5 0.5"
            />
            <path
              d="M 15 70 Q 35 65 55 70 T 95 75"
              fill="none"
              stroke="#64748b"
              strokeWidth="0.2"
              strokeDasharray="0.5 0.5"
            />
          </g>

          {mode === 'world' && (
            <g className="world-markers">
              {COUNTRIES_DATA.map((country) => (
                <CountryMarker
                  key={country.id}
                  country={country}
                  onClick={() => handleCountryClick(country)}
                />
              ))}
            </g>
          )}

          {(mode === 'country' || mode === 'city') && currentCountryData && (
            <g className="country-markers">
              {currentCountryData.cities.map((city, index) => (
                <React.Fragment key={city.slug}>
                  {showPath && connections[index] && (
                    <ConnectionPath
                      from={connections[index].from}
                      to={connections[index].to}
                      progress={mode === 'city' ? 1 : pathProgress}
                    />
                  )}
                  <CityMarker
                    city={city}
                    isActive={mode === 'city' && city.slug === citySlug}
                    isPast={mode === 'city' && connections.findIndex(c => c.from === city.coordinates || c.to === city.coordinates) >= 0}
                    onClick={() => handleCityClick(city)}
                  />
                </React.Fragment>
              ))}
            </g>
          )}

          {isFlying && mode === 'country' && (
            <AircraftIcon
              start={ORIGIN_POINT}
              end={currentCountryData?.cities[0].coordinates || ORIGIN_POINT}
              progress={pathProgress}
            />
          )}
        </motion.g>
      </svg>

      <AnimatePresence>
        {showCards && mode === 'world' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 pointer-events-none flex items-end justify-center pb-8"
          >
            <div className="text-center text-foreground/60 text-sm">
              Click a marker to explore
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
