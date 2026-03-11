"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { COUNTRIES_DATA, getCountryBySlug, getCityConnections, ORIGIN_POINT, WORLD_CENTER, WORLD_ZOOM, CountryData, CityData } from "./MapData";
import "leaflet/dist/leaflet.css";

const createCustomIcon = (color: string, isPulse: boolean = false) => {
  const html = isPulse
    ? `
      <div style="
        width: 30px;
        height: 30px;
        background: ${color};
        border-radius: 50%;
        position: relative;
        box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
        "></div>
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          border: 2px solid ${color};
          animation: pulse 2s ease-out infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      </style>
    `
    : `
      <div style="
        width: 24px;
        height: 24px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `;

  return L.divIcon({
    html,
    className: "custom-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const createPlaneIcon = () => {
  const html = `
    <div style="
      width: 40px;
      height: 40px;
      position: relative;
      animation: fly 1s ease-in-out infinite;
    ">
      <svg viewBox="0 0 24 24" fill="#f59e0b" style="
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 0 8px #f59e0b);
      ">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    </div>
    <style>
      @keyframes fly {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
    </style>
  `;

  return L.divIcon({
    html,
    className: "plane-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

interface MapControllerProps {
  mode: 'world' | 'country' | 'city';
  countrySlug?: string;
  citySlug?: string;
  flightProgress?: number;
  showFlight?: boolean;
}

function MapController({ mode, countrySlug, citySlug, flightProgress = 1, showFlight = false }: MapControllerProps) {
  const map = useMap();
  const countryData = countrySlug ? getCountryBySlug(countrySlug) : null;
  const [targetCenter, setTargetCenter] = useState<[number, number]>(WORLD_CENTER);
  const [targetZoom, setTargetZoom] = useState(WORLD_ZOOM);
  const [planePosition, setPlanePosition] = useState<[number, number]>([ORIGIN_POINT.lat, ORIGIN_POINT.lng]);

  useEffect(() => {
    if (mode === 'country' && countryData) {
      setTargetCenter([countryData.zoomCenter.lat, countryData.zoomCenter.lng]);
      setTargetZoom(countryData.zoomLevel);
    } else if (mode === 'city' && countryData) {
      const city = citySlug ? countryData.cities.find(c => c.slug === citySlug) : null;
      if (city) {
        setTargetCenter([city.coordinates.lat, city.coordinates.lng]);
        setTargetZoom(countryData.zoomLevel + 2);
      }
    } else {
      setTargetCenter(WORLD_CENTER);
      setTargetZoom(WORLD_ZOOM);
    }
  }, [mode, countrySlug, citySlug, countryData]);

  useEffect(() => {
    if (mode === 'country' && countryData && showFlight) {
      const startLat = ORIGIN_POINT.lat;
      const startLng = ORIGIN_POINT.lng;
      const endLat = countryData.cities[0].coordinates.lat;
      const endLng = countryData.cities[0].coordinates.lng;

      const lat = startLat + (endLat - startLat) * flightProgress;
      const lng = startLng + (endLng - startLng) * flightProgress;
      setPlanePosition([lat, lng]);
    }
  }, [flightProgress, mode, countryData, showFlight]);

  useEffect(() => {
    map.flyTo(targetCenter, targetZoom, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  }, [map, targetCenter, targetZoom]);

  return null;
}

interface OSMMapProps {
  mode: 'world' | 'country' | 'city';
  countrySlug?: string;
  citySlug?: string;
  onCountryClick?: (country: CountryData) => void;
  onCityClick?: (city: CityData) => void;
  className?: string;
}

export default function OSMMap({
  mode,
  countrySlug,
  citySlug,
  onCountryClick,
  onCityClick,
  className = "",
}: OSMMapProps) {
  const countryData = countrySlug ? getCountryBySlug(countrySlug) : null;
  const connections = countryData ? getCityConnections(countryData.cities) : [];
  const [flightProgress, setFlightProgress] = useState(0);
  const [showFlight, setShowFlight] = useState(false);

  useEffect(() => {
    if (mode === 'country') {
      setFlightProgress(0);
      setShowFlight(true);
      
      const duration = 2000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        setFlightProgress(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(() => setShowFlight(false), 500);
        }
      };
      
      setTimeout(() => requestAnimationFrame(animate), 500);
    } else {
      setShowFlight(false);
      setFlightProgress(0);
    }
  }, [mode, countrySlug]);

  const polylinePositions = connections.map(conn => [
    [conn.from.lat, conn.from.lng],
    [conn.to.lat, conn.to.lng],
  ] as [number, number][]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <MapContainer
        center={WORLD_CENTER}
        zoom={WORLD_ZOOM}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapController
          mode={mode}
          countrySlug={countrySlug}
          citySlug={citySlug}
          flightProgress={flightProgress}
          showFlight={showFlight}
        />

        {mode === 'world' && COUNTRIES_DATA.map((country) => (
          <Marker
            key={country.id}
            position={[country.coordinates.lat, country.coordinates.lng]}
            icon={createCustomIcon('#f59e0b', true)}
            eventHandlers={{
              click: () => onCountryClick?.(country),
            }}
          />
        ))}

        {countryData && mode === 'city' && (
          <>
            {countryData.cities.map((city, index) => (
              <Marker
                key={city.slug}
                position={[city.coordinates.lat, city.coordinates.lng]}
                icon={createCustomIcon(
                  city.slug === citySlug
                    ? '#10b981'
                    : '#f59e0b',
                  city.slug === citySlug
                )}
                eventHandlers={{
                  click: () => onCityClick?.(city),
                }}
              />
            ))}
            
            {polylinePositions.map((positions, index) => (
              <Polyline
                key={index}
                positions={positions}
                pathOptions={{
                  color: '#f59e0b',
                  weight: 3,
                  opacity: 1,
                }}
              />
            ))}
          </>
        )}

        {showFlight && countryData && countryData.cities[0] && (
          <Marker
            position={[
              ORIGIN_POINT.lat + (countryData.cities[0].coordinates.lat - ORIGIN_POINT.lat) * flightProgress,
              ORIGIN_POINT.lng + (countryData.cities[0].coordinates.lng - ORIGIN_POINT.lng) * flightProgress,
            ]}
            icon={createPlaneIcon()}
          />
        )}
      </MapContainer>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/80 via-transparent to-transparent" />
    </div>
  );
}
