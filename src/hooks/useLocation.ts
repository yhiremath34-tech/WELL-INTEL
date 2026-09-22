import { useState, useCallback } from 'react';

export interface LocationState {
  latitude: number;
  longitude: number;
  accuracy?: number;
  isLocating: boolean;
  error: string | null;
  hasPermission: boolean;
}

// Default fallback location: Kavoor, Mangalore, Karnataka
const DEFAULT_LAT = 12.9224;
const DEFAULT_LNG = 74.8681;

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LNG,
    isLocating: false,
    error: null,
    hasPermission: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
        isLocating: false,
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, isLocating: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          isLocating: false,
          error: null,
          hasPermission: true,
        });
      },
      (err) => {
        let msg = 'Location access is disabled.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission denied. Showing default region (Kavoor, Mangalore).';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setLocation((prev) => ({
          ...prev,
          isLocating: false,
          error: msg,
          hasPermission: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return {
    ...location,
    requestLocation,
    setDefaultLocation: () => {
      setLocation({
        latitude: DEFAULT_LAT,
        longitude: DEFAULT_LNG,
        isLocating: false,
        error: null,
        hasPermission: false,
      });
    },
  };
}
