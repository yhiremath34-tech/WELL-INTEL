import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { WellFilterOptions, WellStatus, WellType, WaterQuality } from '../../types/well';

interface WellFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: WellFilterOptions;
  onUpdateFilters: (newFilters: Partial<WellFilterOptions>) => void;
  onReset: () => void;
  radiusKm: number;
  onRadiusChange: (radius: number) => void;
}

export const WellFilterDrawer: React.FC<WellFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onReset,
  radiusKm,
  onRadiusChange,
}) => {
  const statuses: (WellStatus | 'ALL')[] = ['ALL', 'ACTIVE', 'ALERT', 'MAINTENANCE', 'INACTIVE'];
  const wellTypes: (WellType | 'ALL')[] = [
    'ALL',
    'Borewell',
    'Open Dug Well',
    'Tube Well',
    'Monitoring Piezometer',
  ];
  const waterQualities: (WaterQuality | 'ALL')[] = [
    'ALL',
    'Good',
    'Moderate',
    'High Salinity',
    'Fluoride Concern',
    'Critical',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-80 sm:w-96 max-w-full bg-navy-950 border-r border-cyan-500/25 z-50 p-6 flex flex-col shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white tracking-wide">Filter Intelligence</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Sections */}
            <div className="space-y-6 flex-1">
              {/* Proximity Radius Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">Observation Radius</label>
                  <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10">
                    {radiusKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={radiusKm}
                  onChange={(e) => onRadiusChange(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>5 km (Local)</span>
                  <span>75 km</span>
                  <span>150 km (Regional)</span>
                </div>
              </div>

              {/* Well Status */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2.5">Operational Status</label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateFilters({ status: st })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        (filters.status || 'ALL') === st
                          ? 'bg-water-500 text-white shadow-md shadow-cyan-500/30 border border-cyan-400/40'
                          : 'bg-navy-900/90 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Well Type */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Hydraulic Well Type</label>
                <select
                  value={filters.wellType || 'ALL'}
                  onChange={(e) => onUpdateFilters({ wellType: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-navy-900 border border-cyan-500/20 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
                >
                  {wellTypes.map((type) => (
                    <option key={type} value={type} className="bg-navy-950">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Water Quality */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2.5">Water Quality Grade</label>
                <div className="space-y-1.5">
                  {waterQualities.map((qual) => (
                    <label
                      key={qual}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-navy-900/80 cursor-pointer text-xs text-slate-300 transition-colors"
                    >
                      <input
                        type="radio"
                        name="waterQualityRadio"
                        checked={(filters.waterQuality || 'ALL') === qual}
                        onChange={() => onUpdateFilters({ waterQuality: qual })}
                        className="accent-cyan-400"
                      />
                      <span>{qual}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Maximum Depth Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">Max Casing Depth</label>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {filters.maxDepth ? `${filters.maxDepth} m` : 'Any'}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="250"
                  step="10"
                  value={filters.maxDepth || 250}
                  onChange={(e) => onUpdateFilters({ maxDepth: Number(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <button
                onClick={onReset}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Apply Filters</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
