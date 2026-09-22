import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  X,
  Droplet,
  ArrowRight,
  Gauge,
  Calendar,
  Layers,
  Sparkles,
  MapPin,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Well } from '../../types/well';
import { getStatusBadge, getQualityBadge, formatDistance } from '../../lib/utils';

interface MapSidePanelProps {
  well: Well | null;
  onClose: () => void;
}

export const MapSidePanel: React.FC<MapSidePanelProps> = ({ well, onClose }) => {
  if (!well) return null;

  const statusBadge = getStatusBadge(well.status);
  const qualityBadge = getQualityBadge(well.water_quality);

  return (
    <AnimatePresence>
      <motion.div
        key={well.id}
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="absolute top-4 right-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] z-30 bg-navy-950/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Panel Header */}
        <div className="relative p-5 border-b border-cyan-500/15 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {well.well_code}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor} animate-ping`} />
                  {statusBadge.label}
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
                {well.name}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>
                  {well.village}, {well.district}
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Close details panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Panel Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Proximity / Distance highlight */}
          {well.distance !== undefined && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/25">
              <span className="text-xs text-cyan-200">Proximity to Your Position</span>
              <span className="text-sm font-bold text-cyan-300 font-mono">
                {formatDistance(well.distance)}
              </span>
            </div>
          )}

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                <span>Water Level</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white font-mono">
                  {well.water_level}
                </span>
                <span className="text-[11px] text-slate-400">m bgl</span>
              </div>
              <span className="text-[9px] text-teal-400">Below ground level</span>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-water-400" />
                <span>Total Depth</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white font-mono">
                  {well.depth}
                </span>
                <span className="text-[11px] text-slate-400">meters</span>
              </div>
              <span className="text-[9px] text-slate-400">{well.well_type}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Water Quality</span>
              </div>
              <div className={`text-xs font-bold ${qualityBadge.text} truncate`}>
                {well.water_quality}
              </div>
              <span className="text-[9px] text-slate-400">Lab calibrated</span>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-teal-400" />
                <span>Yield Capacity</span>
              </div>
              <div className="text-sm font-bold text-slate-200 font-mono">
                {well.yield.toLocaleString()} <span className="text-[10px]">L/hr</span>
              </div>
              <span className="text-[9px] text-teal-300">Sustainable draw</span>
            </div>
          </div>

          {/* Description */}
          {well.description && (
            <div className="p-3 rounded-xl bg-navy-900/50 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Hydrogeology Summary
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {well.description}
              </p>
            </div>
          )}

          {/* Inspection Date */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Last Monitored:
            </span>
            <span className="font-mono text-slate-300">{well.last_inspected || 'Recent'}</span>
          </div>
        </div>

        {/* Panel Footer Action */}
        <div className="p-4 border-t border-cyan-500/20 bg-navy-900/80 flex items-center gap-2">
          <Link
            to={`/wells/${well.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>VIEW WELL DETAILS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={`/reports?well_id=${well.id}`}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Report an issue with this well"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
