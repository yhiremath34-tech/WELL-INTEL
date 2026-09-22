import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, ArrowDown, Activity, Sparkles } from 'lucide-react';

interface WaterLevelVisualizerProps {
  currentLevel: number; // in meters below ground level (e.g. 18.4m)
  totalDepth: number; // total depth in meters (e.g. 62m)
  avgLevel?: number; // historical average (e.g. 21.0m)
  status?: string;
  className?: string;
}

export const WaterLevelVisualizer: React.FC<WaterLevelVisualizerProps> = ({
  currentLevel,
  totalDepth,
  avgLevel = Math.round((currentLevel * 1.15) * 10) / 10,
  status = 'ACTIVE',
  className = '',
}) => {
  // Ensure valid values
  const depth = Math.max(10, totalDepth);
  const safeCurrent = Math.min(depth - 1, Math.max(0.5, currentLevel));
  const safeAvg = Math.min(depth - 1, Math.max(0.5, avgLevel));

  // In groundwater hydrology: water level is measured in "meters below ground level" (mbgl).
  // Therefore, a smaller number means water is closer to the surface (more water in well).
  // Water column height percentage from the bottom = (1 - currentLevel / depth) * 100%
  const waterColumnPercent = Math.max(8, Math.min(92, ((depth - safeCurrent) / depth) * 100));
  const avgColumnPercent = Math.max(8, Math.min(92, ((depth - safeAvg) / depth) * 100));

  return (
    <div className={`relative p-6 rounded-2xl glass-card border border-water-500/25 ${className}`}>
      {/* Header telemetry badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-water-500/20 flex items-center justify-center text-cyan-400">
            <Droplet className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">
              Borehole Aquifer Column
            </h4>
            <p className="text-xs text-slate-400">Hydrostatic Water Column & Depth Cross-Section</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          <Sparkles className="w-3 h-3" />
          <span>Realtime Telemetry</span>
        </div>
      </div>

      {/* Main Borehole Visual Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: The Vertical Glass Cylinder Well */}
        <div className="md:col-span-6 flex justify-center py-2">
          <div className="relative w-44 h-72 rounded-2xl bg-navy-900/90 border-2 border-slate-700/60 shadow-2xl overflow-hidden flex flex-col justify-end p-1.5">
            {/* Ground surface indicator at top */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-amber-950/40 to-transparent border-b border-amber-800/40 z-20 flex items-center justify-between px-3 text-[10px] text-amber-300/80 font-mono">
              <span>0.0 m (Surface)</span>
              <span>Ground Level</span>
            </div>

            {/* Depth tick lines */}
            <div className="absolute inset-y-8 left-2 right-2 flex flex-col justify-between pointer-events-none z-10 opacity-30">
              {[0.25, 0.5, 0.75].map((pct, idx) => (
                <div key={idx} className="w-full flex items-center justify-between border-t border-dashed border-cyan-400 text-[9px] text-cyan-300 font-mono">
                  <span>{(depth * pct).toFixed(0)}m</span>
                  <span>—</span>
                </div>
              ))}
            </div>

            {/* Average Level Dotted Line */}
            <div
              className="absolute left-0 right-0 z-20 pointer-events-none transition-all duration-700"
              style={{ bottom: `${avgColumnPercent}%` }}
            >
              <div className="w-full border-t-2 border-dotted border-amber-400/80 relative">
                <span className="absolute -top-4 right-2 text-[9px] bg-amber-950/90 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/40 font-mono">
                  Hist. Avg: {safeAvg}m
                </span>
              </div>
            </div>

            {/* Current Water Level Surface Marker Line */}
            <div
              className="absolute left-0 right-0 z-20 pointer-events-none transition-all duration-1000"
              style={{ bottom: `${waterColumnPercent}%` }}
            >
              <div className="w-full border-t-2 border-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.8)] relative">
                <span className="absolute -top-5 left-2 text-[10px] bg-navy-950/95 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-400/50 shadow flex items-center gap-1 font-mono">
                  <ArrowDown className="w-2.5 h-2.5 text-cyan-400" />
                  {safeCurrent}m bgl
                </span>
              </div>
            </div>

            {/* Animated Fluid Water Mass */}
            <motion.div
              className="relative w-full rounded-b-xl overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: `${waterColumnPercent}%` }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              style={{
                background: 'linear-gradient(180deg, #38BDF8 0%, #168AAD 35%, #083344 100%)',
              }}
            >
              {/* Wavy Surface Crest */}
              <div className="absolute top-0 left-0 right-0 w-[200%] h-4 -translate-y-1/2 overflow-hidden pointer-events-none opacity-80 animate-wave">
                <svg viewBox="0 0 1200 120" className="w-full h-full text-cyan-300 fill-current">
                  <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z" />
                </svg>
              </div>

              {/* Light reflection highlight overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 pointer-events-none" />

              {/* Floating micro-bubbles inside water */}
              <div className="absolute bottom-2 left-6 w-1.5 h-1.5 rounded-full bg-cyan-200/70 animate-ping" />
              <div className="absolute bottom-8 right-8 w-2 h-2 rounded-full bg-cyan-100/50 animate-bounce" />
              <div className="absolute bottom-16 left-12 w-1 h-1 rounded-full bg-white/60 animate-pulse" />

              {/* Water status caption inside cylinder */}
              <div className="absolute bottom-2 inset-x-0 text-center text-[10px] font-mono text-cyan-100/80 font-semibold tracking-wider">
                ACTIVE WATER COLUMN
              </div>
            </motion.div>

            {/* Well bottom foundation */}
            <div className="relative z-20 text-center py-0.5 bg-slate-900 border-t border-slate-700/80 text-[10px] font-mono text-slate-400">
              Bore Bedrock: {depth}m
            </div>
          </div>
        </div>

        {/* Right: Key Telemetry Cards */}
        <div className="md:col-span-6 space-y-3">
          <div className="p-3.5 rounded-xl bg-navy-900/60 border border-cyan-500/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Current Water Table</span>
              <span className="text-cyan-400 font-semibold">Active Sensor</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                {safeCurrent}
              </span>
              <span className="text-sm text-cyan-300 font-medium">meters (mbgl)</span>
            </div>
            <div className="mt-2 text-xs text-slate-300">
              Depth to groundwater from the surface aperture.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-navy-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                <Activity className="w-3 h-3 text-amber-400" />
                <span>Historical Avg</span>
              </div>
              <div className="text-lg font-bold text-slate-200 font-mono">
                {safeAvg} m
              </div>
              <span className="text-[10px] text-slate-400">30-day baseline</span>
            </div>

            <div className="p-3 rounded-xl bg-navy-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                <ArrowDown className="w-3 h-3 text-teal-400" />
                <span>Total Bore Depth</span>
              </div>
              <div className="text-lg font-bold text-slate-200 font-mono">
                {depth} m
              </div>
              <span className="text-[10px] text-slate-400">Well casing base</span>
            </div>
          </div>

          {/* Aquifer Saturation Bar */}
          <div className="p-3 rounded-xl bg-navy-900/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400">Aquifer Storage Saturation</span>
              <span className="text-teal-300 font-bold font-mono">
                {waterColumnPercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: `${waterColumnPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
