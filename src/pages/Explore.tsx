import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  RefreshCw,
  AlertTriangle,
  ArrowUpDown,
  Navigation,
} from 'lucide-react';
import { WellCard } from '../components/wells/WellCard';
import { WellSearchInput } from '../components/wells/WellSearchInput';
import { useWells } from '../hooks/useWells';
import { useLocation } from '../hooks/useLocation';
import type { WellStatus } from '../types/well';

export const Explore: React.FC = () => {
  const {
    latitude,
    longitude,
    isLocating,
    requestLocation,
    hasPermission,
  } = useLocation();

  const [radiusKm, setRadiusKm] = useState<number>(35);
  const [selectedStatus, setSelectedStatus] = useState<WellStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'water_level' | 'depth'>('distance');

  const { wells, isLoading } = useWells(
    { searchQuery, status: selectedStatus },
    { latitude, longitude }
  );

  // Filter by radial distance & search, then sort
  const sortedNearbyWells = useMemo(() => {
    let list = wells.filter((w) => {
      if (w.distance !== undefined && w.distance > radiusKm) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distance ?? 999) - (b.distance ?? 999);
      }
      if (sortBy === 'water_level') {
        return a.water_level - b.water_level;
      }
      if (sortBy === 'depth') {
        return b.depth - a.depth;
      }
      return 0;
    });

    return list;
  }, [wells, radiusKm, sortBy]);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero Banner */}
        <div className="relative p-8 sm:p-12 rounded-3xl glass-card border border-cyan-500/25 mb-10 overflow-hidden shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                <Compass className="w-3.5 h-3.5 animate-spin [animation-duration:10s]" />
                <span>SPATIAL PROXIMITY INDEX</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Wells Around You
              </h1>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                Discover active borewells, open dug wells, and continuous telemetry stations
                calibrated from your current GPS position.
              </p>
            </div>

            {/* USE MY LOCATION Trigger Button */}
            <div className="flex flex-col items-start md:items-end gap-2">
              <button
                onClick={requestLocation}
                disabled={isLocating}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-50 transform hover:-translate-y-0.5"
              >
                <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Acquiring GPS...' : 'USE MY LOCATION'}</span>
              </button>

              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${hasPermission ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>
                  {hasPermission
                    ? `GPS Locked: ${latitude.toFixed(3)}° N, ${longitude.toFixed(3)}° E`
                    : 'Kavoor / Mangalore reference point'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar: Search + Radius + Status Filter + Sort */}
        <div className="p-5 rounded-2xl glass-card border border-cyan-500/20 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6">
              <WellSearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search well code (W-1042), village, or taluk..."
              />
            </div>

            {/* Radius Slider */}
            <div className="md:col-span-3 px-2">
              <div className="flex justify-between text-xs mb-1 text-slate-300">
                <span>Radius:</span>
                <span className="font-mono font-bold text-cyan-400">{radiusKm} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-3 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-cyan-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-navy-900 border border-cyan-500/20 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
              >
                <option value="distance">Sort by Closest First</option>
                <option value="water_level">Sort by Shallowest Water Level</option>
                <option value="depth">Sort by Deepest Borehole</option>
              </select>
            </div>
          </div>

          {/* Quick Status Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'ACTIVE', 'ALERT', 'MAINTENANCE', 'INACTIVE'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedStatus === st
                      ? 'bg-water-500 text-white shadow-sm shadow-cyan-500/30'
                      : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-cyan-300">
              Showing {sortedNearbyWells.length} verified stations
            </div>
          </div>
        </div>

        {/* Wells Grid */}
        {isLoading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
            <p className="text-sm font-mono text-slate-400">Computing spatial distances...</p>
          </div>
        ) : sortedNearbyWells.length === 0 ? (
          <div className="py-20 text-center p-8 rounded-3xl glass-card border border-slate-800 max-w-lg mx-auto">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No wells found nearby</h3>
            <p className="text-xs text-slate-400 mb-6">
              There are no recorded stations within {radiusKm} km matching your filter criteria.
            </p>
            <button
              onClick={() => {
                setRadiusKm(75);
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-cyan-300 hover:bg-slate-700"
            >
              Expand Search Radius to 75 km
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedNearbyWells.map((well) => (
              <WellCard key={well.id} well={well} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
