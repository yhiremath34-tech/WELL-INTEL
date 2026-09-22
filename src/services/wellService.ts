import type { Well, WellFilterOptions } from '../types/well';
import { DEMO_WELLS } from '../data/sampleWells';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { calculateDistanceKm } from '../lib/utils';

const STORAGE_KEY = 'wellintel_custom_wells';

// Local store initialization
function getLocalWells(): Well[] {
  try {
    const custom = localStorage.getItem(STORAGE_KEY);
    if (!custom) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_WELLS));
      return DEMO_WELLS;
    }
    return JSON.parse(custom);
  } catch {
    return DEMO_WELLS;
  }
}

function saveLocalWells(wells: Well[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wells));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export const wellService = {
  async getWells(filters?: WellFilterOptions): Promise<Well[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('wells').select('*');

        if (filters?.status && filters.status !== 'ALL') {
          query = query.eq('status', filters.status);
        }
        if (filters?.wellType && filters.wellType !== 'ALL') {
          query = query.eq('well_type', filters.wellType);
        }
        if (filters?.waterQuality && filters.waterQuality !== 'ALL') {
          query = query.eq('water_quality', filters.waterQuality);
        }
        if (filters?.searchQuery) {
          const q = `%${filters.searchQuery}%`;
          query = query.or(`name.ilike.${q},well_code.ilike.${q},village.ilike.${q},district.ilike.${q}`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data as Well[];
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local dataset:', err);
      }
    }

    // Local reactive store fallback
    let results = [...getLocalWells()];

    if (filters) {
      if (filters.status && filters.status !== 'ALL') {
        results = results.filter((w) => w.status === filters.status);
      }
      if (filters.wellType && filters.wellType !== 'ALL') {
        results = results.filter((w) => w.well_type === filters.wellType);
      }
      if (filters.waterQuality && filters.waterQuality !== 'ALL') {
        results = results.filter((w) => w.water_quality === filters.waterQuality);
      }
      if (filters.maxDepth && filters.maxDepth > 0) {
        results = results.filter((w) => w.depth <= (filters.maxDepth || 999));
      }
      if (filters.maxWaterLevel && filters.maxWaterLevel > 0) {
        results = results.filter((w) => w.water_level <= (filters.maxWaterLevel || 999));
      }
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        results = results.filter(
          (w) =>
            w.well_code.toLowerCase().includes(q) ||
            w.name.toLowerCase().includes(q) ||
            w.village.toLowerCase().includes(q) ||
            w.taluk.toLowerCase().includes(q) ||
            w.district.toLowerCase().includes(q) ||
            w.status.toLowerCase().includes(q)
        );
      }
    }

    return results;
  },

  async getWellById(id: string): Promise<Well | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('wells')
          .select('*')
          .or(`id.eq.${id},well_code.eq.${id}`)
          .single();
        if (!error && data) {
          return data as Well;
        }
      } catch (e) {
        console.warn('Supabase single well query error, using local fallback', e);
      }
    }

    const local = getLocalWells();
    const found = local.find((w) => w.id === id || w.well_code.toLowerCase() === id.toLowerCase());
    return found || null;
  },

  async getNearbyWells(lat: number, lng: number, radiusKm: number = 35): Promise<Well[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('get_nearby_wells', {
          lat,
          lng,
          radius_km: radiusKm,
        });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            ...d,
            distance: d.distance_km,
          })) as Well[];
        }
      } catch (err) {
        console.warn('Supabase get_nearby_wells RPC error, using client calculation', err);
      }
    }

    const local = getLocalWells();
    const withDistance = local
      .map((w) => {
        const distance = calculateDistanceKm(lat, lng, w.latitude, w.longitude);
        return { ...w, distance };
      })
      .filter((w) => w.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return withDistance;
  },

  async createWell(newWellData: Omit<Well, 'id' | 'created_at' | 'updated_at'>): Promise<Well> {
    const timestamp = new Date().toISOString();
    const newWell: Well = {
      ...newWellData,
      id: `well-${Date.now()}`,
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('wells').insert(newWell).select().single();
        if (!error && data) {
          return data as Well;
        }
      } catch (e) {
        console.warn('Failed to insert well into Supabase, saving locally', e);
      }
    }

    const wells = getLocalWells();
    const updated = [newWell, ...wells];
    saveLocalWells(updated);
    return newWell;
  },

  async updateWell(id: string, updates: Partial<Well>): Promise<Well | null> {
    const timestamp = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('wells')
          .update({ ...updates, updated_at: timestamp })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          return data as Well;
        }
      } catch (e) {
        console.warn('Failed to update well in Supabase, updating locally', e);
      }
    }

    const wells = getLocalWells();
    const index = wells.findIndex((w) => w.id === id);
    if (index === -1) return null;

    const updatedWell = {
      ...wells[index],
      ...updates,
      updated_at: timestamp,
    };
    wells[index] = updatedWell;
    saveLocalWells(wells);
    return updatedWell;
  },

  async deleteWell(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('wells').delete().eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.warn('Failed to delete well in Supabase, deleting locally', e);
      }
    }

    const wells = getLocalWells();
    const filtered = wells.filter((w) => w.id !== id);
    saveLocalWells(filtered);
    return true;
  },

  resetToDefaultDemo() {
    saveLocalWells(DEMO_WELLS);
  }
};
