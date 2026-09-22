import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Droplets,
  ArrowRight,
  Layers,
  Sparkles,
  Gauge,
} from 'lucide-react';
import { Well } from '../../types/well';
import { getStatusBadge, getQualityBadge, formatDistance } from '../../lib/utils';

interface WellCardProps {
  well: Well;
  onClick?: () => void;
  isSelected?: boolean;
}

export const WellCard: React.FC<WellCardProps> = ({ well, onClick, isSelected = false }) => {
  const statusBadge = getStatusBadge(well.status);
  const qualityBadge = getQualityBadge(well.water_quality);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`group relative p-5 rounded-2xl glass-card transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected
          ? 'border-cyan-400/80 shadow-[0_0_25px_rgba(56,189,248,0.25)] bg-navy-900/90'
          : 'hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10'
      }`}
    >
      {/* Ambient background glow on hover */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
              {well.well_code}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor} animate-pulse`} />
              {statusBadge.label}
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {well.name}
          </h3>
        </div>

        {/* Distance Badge */}
        {well.distance !== undefined && (
          <span className="shrink-0 text-xs font-mono font-semibold px-2 py-1 rounded-lg bg-navy-950/80 text-cyan-300 border border-cyan-500/20 shadow-sm">
            {formatDistance(well.distance)}
          </span>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="truncate">
          {well.village}, {well.taluk ? `${well.taluk}, ` : ''}{well.district}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-navy-950/60 border border-slate-800/80 mb-4">
        <div>
          <span className="text-[10px] text-slate-400 block mb-0.5 flex items-center gap-1">
            <Droplets className="w-3 h-3 text-cyan-400" />
            Water Level
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-white font-mono">{well.water_level}</span>
            <span className="text-[10px] text-slate-400">m bgl</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block mb-0.5 flex items-center gap-1">
            <Layers className="w-3 h-3 text-water-400" />
            Depth
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-white font-mono">{well.depth}</span>
            <span className="text-[10px] text-slate-400">m</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Details Link */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <span className={`text-[11px] font-medium ${qualityBadge.text}`}>
          {well.water_quality}
        </span>
        <Link
          to={`/wells/${well.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
};
