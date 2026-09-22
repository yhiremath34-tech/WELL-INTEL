import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { WellStatus, WaterQuality } from "../types/well";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Haversine formula to compute great-circle distance between two points in km
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function formatDistance(km: number | undefined): string {
  if (km === undefined || isNaN(km)) return 'Unknown distance';
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }
  return `${km.toFixed(1)} km away`;
}

export function getStatusBadge(status: WellStatus): {
  label: string;
  bg: string;
  text: string;
  border: string;
  dotColor: string;
  pulseClass: string;
} {
  switch (status) {
    case 'ACTIVE':
      return {
        label: 'Active',
        bg: 'bg-teal-500/10 dark:bg-teal-500/20',
        text: 'text-teal-600 dark:text-teal-400',
        border: 'border-teal-500/30',
        dotColor: 'bg-teal-400',
        pulseClass: 'bg-teal-400',
      };
    case 'INACTIVE':
      return {
        label: 'Inactive',
        bg: 'bg-slate-500/10 dark:bg-slate-700/20',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-500/30',
        dotColor: 'bg-slate-400',
        pulseClass: 'bg-slate-400',
      };
    case 'ALERT':
      return {
        label: 'Alert',
        bg: 'bg-rose-500/10 dark:bg-rose-500/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/30',
        dotColor: 'bg-rose-500',
        pulseClass: 'bg-rose-500',
      };
    case 'MAINTENANCE':
      return {
        label: 'Maintenance',
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/30',
        dotColor: 'bg-amber-400',
        pulseClass: 'bg-amber-400',
      };
  }
}

export function getQualityBadge(quality: WaterQuality): {
  label: string;
  bg: string;
  text: string;
} {
  switch (quality) {
    case 'Good':
      return { label: 'Good Potable', bg: 'bg-emerald-500/15', text: 'text-emerald-400' };
    case 'Moderate':
      return { label: 'Moderate Quality', bg: 'bg-sky-500/15', text: 'text-sky-400' };
    case 'High Salinity':
      return { label: 'High Salinity', bg: 'bg-amber-500/15', text: 'text-amber-400' };
    case 'Fluoride Concern':
      return { label: 'Fluoride Alert', bg: 'bg-orange-500/15', text: 'text-orange-400' };
    case 'Critical':
      return { label: 'Critical / Non-Potable', bg: 'bg-rose-500/15', text: 'text-rose-400' };
  }
}
