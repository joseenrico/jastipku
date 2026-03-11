"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CountryData, CityData, ORIGIN_POINT } from './MapData';

export type AnimationPhase = 'idle' | 'zoom-in' | 'flying' | 'path-drawing' | 'arrived';

interface MapTransitionState {
  currentCountry: CountryData | null;
  currentCity: CityData | null;
  previousCountry: CountryData | null;
  previousCity: CityData | null;
  animationPhase: AnimationPhase;
  zoomLevel: number;
  viewCenter: { lat: number; lng: number };
  showPath: boolean;
  pathProgress: number;
  aircraftPosition: { lat: number; lng: number };
  isFlying: boolean;
  transitionKey: number;
}

interface MapTransitionContextType extends MapTransitionState {
  setCountry: (country: CountryData | null) => void;
  setCity: (city: CityData | null) => void;
  startTransition: (country: CountryData, city?: CityData) => void;
  resetToWorld: () => void;
  updatePathProgress: (progress: number) => void;
  updateAircraftPosition: (position: { lat: number; lng: number }) => void;
  setAnimationPhase: (phase: AnimationPhase) => void;
}

const initialState: MapTransitionState = {
  currentCountry: null,
  currentCity: null,
  previousCountry: null,
  previousCity: null,
  animationPhase: 'idle',
  zoomLevel: 1,
  viewCenter: { lat: 50, lng: 50 },
  showPath: false,
  pathProgress: 0,
  aircraftPosition: ORIGIN_POINT,
  isFlying: false,
  transitionKey: 0,
};

const MapTransitionContext = createContext<MapTransitionContextType | undefined>(undefined);

export function MapTransitionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MapTransitionState>(initialState);

  const setCountry = useCallback((country: CountryData | null) => {
    setState((prev) => ({
      ...prev,
      previousCountry: prev.currentCountry,
      currentCountry: country,
    }));
  }, []);

  const setCity = useCallback((city: CityData | null) => {
    setState((prev) => ({
      ...prev,
      previousCity: prev.currentCity,
      currentCity: city,
    }));
  }, []);

  const startTransition = useCallback((country: CountryData, city?: CityData) => {
    setState((prev) => ({
      ...prev,
      previousCountry: prev.currentCountry,
      previousCity: prev.currentCity,
      currentCountry: country,
      currentCity: city || null,
      animationPhase: 'zoom-in',
      zoomLevel: country.zoomLevel,
      viewCenter: country.zoomCenter,
      showPath: true,
      pathProgress: 0,
      aircraftPosition: ORIGIN_POINT,
      isFlying: true,
      transitionKey: prev.transitionKey + 1,
    }));
  }, []);

  const resetToWorld = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentCountry: null,
      currentCity: null,
      animationPhase: 'idle',
      zoomLevel: 1,
  viewCenter: { lat: 50, lng: 50 },
      showPath: false,
      pathProgress: 0,
      isFlying: false,
      transitionKey: prev.transitionKey + 1,
    }));
  }, []);

  const updatePathProgress = useCallback((progress: number) => {
    setState((prev) => ({
      ...prev,
      pathProgress: Math.min(1, Math.max(0, progress)),
    }));
  }, []);

  const updateAircraftPosition = useCallback((position: { lat: number; lng: number }) => {
    setState((prev) => ({
      ...prev,
      aircraftPosition: position,
    }));
  }, []);

  const setAnimationPhase = useCallback((phase: AnimationPhase) => {
    setState((prev) => ({
      ...prev,
      animationPhase: phase,
    }));
  }, []);

  return (
    <MapTransitionContext.Provider
      value={{
        ...state,
        setCountry,
        setCity,
        startTransition,
        resetToWorld,
        updatePathProgress,
        updateAircraftPosition,
        setAnimationPhase,
      }}
    >
      {children}
    </MapTransitionContext.Provider>
  );
}

export function useMapTransition() {
  const context = useContext(MapTransitionContext);
  if (context === undefined) {
    throw new Error('useMapTransition must be used within a MapTransitionProvider');
  }
  return context;
}
