import { useState, useEffect, useCallback } from 'react';
import type { Well, WellFilterOptions } from '../types/well';
import { wellService } from '../services/wellService';
import { calculateDistanceKm } from '../lib/utils';

export function useWells(
  initialFilters?: WellFilterOptions,
  userLocation?: { latitude: number; longitude: number }
) {
  const [wells, setWells] = useState<Well[]>([]);
  const [filters, setFilters] = useState<WellFilterOptions>(initialFilters || { searchQuery: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWells = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await wellService.getWells(filters);

      // Attach distance if userLocation is available
      if (userLocation) {
        const enriched = data.map((w) => ({
          ...w,
          distance: calculateDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            w.latitude,
            w.longitude
          ),
        }));
        setWells(enriched);
      } else {
        setWells(data);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to retrieve well records. Please retry.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, userLocation?.latitude, userLocation?.longitude]);

  useEffect(() => {
    fetchWells();
  }, [fetchWells]);

  const updateFilters = (newFilters: Partial<WellFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({ searchQuery: '', status: 'ALL', wellType: 'ALL', waterQuality: 'ALL' });
  };

  return {
    wells,
    filters,
    isLoading,
    error,
    refetch: fetchWells,
    updateFilters,
    resetFilters,
  };
}
