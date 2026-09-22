import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Info } from 'lucide-react';
import { WellMap } from '../components/map/WellMap';
import { MapSidePanel } from '../components/map/MapSidePanel';
import { WellSearchInput } from '../components/wells/WellSearchInput';
import { WellFilterDrawer } from '../components/wells/WellFilterDrawer';
import { useWells } from '../hooks/useWells';
import { useLocation } from '../hooks/useLocation';
import type { Well } from '../types/well';
import { getStatusBadge, formatDistance } from '../lib/utils';

export const MapPage: React.FC = () => {
  const { latitude, longitude, requestLocation, error: locationError } = useLocation();
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(35);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { wells, filters, isLoading, updateFilters, resetFilters } = useWells(
    { searchQuery: '', status: 'ALL', wellType: 'ALL', waterQuality: 'ALL' },
    { latitude, longitude }
  );

  // Filter by radial distance if available
  const visibleWells = useMemo(() => {
    return wells.filter((w) => {
      if (w.distance === undefined) return true;
      return w.distance <= radiusKm;
    });
  }, [wells, radiusKm]);

  const handleSelectWell = (well: Well) => {
    setSelectedWell(well);
  };

  return (
    <div className="relative pt-16 h-screen flex flex-col bg-navy-950 text-slate-100 overflow-hidden">
      {/* Geolocation status warning banner if denied */}
      {locationError && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>{locationError}</span>
          </div>
          <button
            onClick={requestLocation}
            className="underline font-bold hover:text-white"
          >
            Retry Permission
          </button>
        </div>
      )}

      {/* Main Split Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* LEFT PANEL: 30% on desktop (Search + Filters + Station List) */}
        <div className="w-full lg:w-[32%] xl:w-[28%] bg-navy-900/95 border-r border-cyan-500/20 flex flex-col z-10 shadow-2xl">
          {/* Header search bar */}
          <div className="p-4 border-b border-cyan-500/15 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                  Telemetry GIS
                </h2>
              </div>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-navy-950 border border-cyan-500/30 text-cyan-300 hover:bg-navy-850 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

            <WellSearchInput
              value={filters.searchQuery}
              onChange={(query) => updateFilters({ searchQuery: query })}
              onSelectSuggestion={(val) => {
                if (val === 'ACTIVE') {
                  updateFilters({ status: 'ACTIVE' });
                } else {
                  updateFilters({ searchQuery: val });
                }
              }}
              placeholder="Search code (W-1042), village, taluk..."
            />

            {/* Quick stats counter */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
              <span>{visibleWells.length} wells in active zone</span>
              <span className="text-cyan-400 font-bold">&le; {radiusKm} km radius</span>
            </div>
          </div>

          {/* Scrollable list of wells */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400 animate-pulse font-mono">
                Querying spatial database...
              </div>
            ) : visibleWells.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-navy-950/60 border border-slate-800 space-y-2">
                <p className="text-sm font-semibold text-slate-300">No wells found matching criteria.</p>
                <p className="text-xs text-slate-400">Try broadening your radius slider or clearing search filters.</p>
                <button
                  onClick={resetFilters}
                  className="mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-cyan-300"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              visibleWells.map((well) => {
                const isSelected = selectedWell?.id === well.id;
                const statusBadge = getStatusBadge(well.status);
                return (
                  <div
                    key={well.id}
                    onClick={() => handleSelectWell(well)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-water-500/20 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-navy-950/60 border-slate-800/80 hover:bg-navy-850 hover:border-cyan-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          {well.well_code}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                        >
                          {statusBadge.label}
                        </span>
                      </div>
                      {well.distance !== undefined && (
                        <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                          {formatDistance(well.distance)}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-semibold text-white truncate">{well.name}</h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                      <span>{well.village}, {well.district}</span>
                      <span>Level: <strong className="text-slate-200">{well.water_level}m</strong></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL: 70% Interactive Map Canvas */}
        <div className="flex-1 h-full relative">
          <WellMap
            wells={visibleWells}
            selectedWell={selectedWell}
            onSelectWell={handleSelectWell}
            userLocation={{ latitude, longitude }}
            radiusKm={radiusKm}
            onLocateMe={requestLocation}
          />

          {/* Slide-in Animated Side Panel (Section 10) */}
          <MapSidePanel
            well={selectedWell}
            onClose={() => setSelectedWell(null)}
          />
        </div>
      </div>

      {/* Filter Drawer Component */}
      <WellFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onUpdateFilters={updateFilters}
        onReset={resetFilters}
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
      />
    </div>
  );
};
