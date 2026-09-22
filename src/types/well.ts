export type WellStatus = 'ACTIVE' | 'INACTIVE' | 'ALERT' | 'MAINTENANCE';
export type WellType = 'Borewell' | 'Open Dug Well' | 'Tube Well' | 'Monitoring Piezometer';
export type WaterQuality = 'Good' | 'Moderate' | 'Critical' | 'High Salinity' | 'Fluoride Concern';

export interface WellMeasurement {
  id: string;
  well_id: string;
  water_level: number; // in meters below ground level (mbgl)
  water_quality: WaterQuality;
  yield: number; // in Liters per hour (L/hr)
  measurement_date: string;
  notes?: string;
  created_at: string;
}

export interface Well {
  id: string;
  well_code: string;
  name: string;
  latitude: number;
  longitude: number;
  village: string;
  taluk: string;
  district: string;
  status: WellStatus;
  well_type: WellType;
  depth: number; // total well depth in meters
  water_level: number; // current water level in meters below ground level
  water_quality: WaterQuality;
  yield: number; // L/hr
  description?: string;
  last_inspected: string;
  created_at: string;
  updated_at: string;
  distance?: number; // computed dynamically based on user location (in km)
}

export interface WellFilterOptions {
  searchQuery: string;
  status?: WellStatus | 'ALL';
  wellType?: WellType | 'ALL';
  waterQuality?: WaterQuality | 'ALL';
  maxDistanceKm?: number;
  maxDepth?: number;
  maxWaterLevel?: number;
}
