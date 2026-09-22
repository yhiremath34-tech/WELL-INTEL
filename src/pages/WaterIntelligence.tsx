import React, { useState } from 'react';
import {
  Droplets,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  Info,
  Compass,
  ArrowRight,
  Activity,
  Gauge,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const WaterIntelligence: React.FC = () => {
  const [wellDepth, setWellDepth] = useState<number>(120);
  const [waterLevel, setWaterLevel] = useState<number>(35);
  const [dailyExtraction, setDailyExtraction] = useState<number>(4500);

  // Safe yield computation simulation
  const waterColumn = Math.max(0, wellDepth - waterLevel);
  const estimatedStorageLiters = Math.round(waterColumn * 3.14159 * 0.075 * 0.075 * 1000); // 6" casing approx
  const safeDailyMax = Math.round(estimatedStorageLiters * 0.6);
  const isOverExtracting = dailyExtraction > safeDailyMax;

  const aquifers = [
    {
      name: 'Peninsular Gneiss Complex',
      coverage: 'South & Central Karnataka (Bangalore, Mysore, Hassan)',
      depthRange: '60m – 300m',
      yieldClass: 'Medium to Low',
      rechargeRate: '8% - 12% of rainfall',
      vulnerability: 'High fracture depletion; slow recharge.',
      color: 'border-cyan-500/40 bg-cyan-950/20',
    },
    {
      name: 'Deccan Traps (Basalt)',
      coverage: 'Northern Karnataka (Belagavi, Bidar, Kalaburagi, Vijayapura)',
      depthRange: '30m – 120m',
      yieldClass: 'High to Moderate',
      rechargeRate: '14% - 18% of rainfall',
      vulnerability: 'Vesicular intertrappean layers prone to seasonal drying.',
      color: 'border-emerald-500/40 bg-emerald-950/20',
    },
    {
      name: 'Coastal Alluvium & Laterites',
      coverage: 'Dakshina Kannada, Udupi, Uttara Kannada',
      depthRange: '15m – 80m',
      yieldClass: 'High Seasonal Yield',
      rechargeRate: '22% - 28% of rainfall',
      vulnerability: 'Saltwater intrusion risk when over-pumped near coastline.',
      color: 'border-amber-500/40 bg-amber-950/20',
    },
    {
      name: 'Dharwar Schistose Formations',
      coverage: 'Dharwad, Gadag, Bellary, Chitradurga',
      depthRange: '80m – 220m',
      yieldClass: 'Low to Moderate',
      rechargeRate: '6% - 10% of rainfall',
      vulnerability: 'Elevated fluoride & total dissolved solids in fractured zones.',
      color: 'border-purple-500/40 bg-purple-950/20',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HYDROGEOLOGY SCIENCE MODULE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Karnataka Aquifer & Groundwater Intelligence
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Understand the subterranean geological formations, extraction safety thresholds, and water
            table recharge dynamics across peninsular India.
          </p>
        </div>

        {/* Aquifer Formations Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Major Sub-Surface Hydrogeological Formations</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Central Ground Water Board (CGWB) Standards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aquifers.map((aq) => (
              <div
                key={aq.name}
                className={`p-6 rounded-2xl border backdrop-blur-md transition-all hover:scale-[1.01] ${aq.color}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white">{aq.name}</h3>
                  <span className="text-xs font-mono text-cyan-300">{aq.depthRange}</span>
                </div>
                <div className="text-xs text-slate-300 space-y-2">
                  <p>
                    <strong className="text-white">Coverage:</strong> {aq.coverage}
                  </p>
                  <p>
                    <strong className="text-white">Yield Class:</strong> {aq.yieldClass}
                  </p>
                  <p>
                    <strong className="text-white">Recharge Potential:</strong> {aq.rechargeRate}
                  </p>
                  <div className="pt-2 border-t border-slate-700/50 flex items-start gap-2 text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{aq.vulnerability}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Safe Yield Calculator */}
        <div className="bg-navy-900 border border-cyan-500/25 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <div>
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-widest font-mono mb-1">
                <Sliders className="w-4 h-4" />
                <span>Deterministic Hydraulic Simulation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Borewell Storage & Sustainable Extraction Estimator
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Adjust well geometry and daily usage to evaluate aquifer stress and prevent borehole cavitation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Depth Slider */}
              <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Total Well Depth</span>
                  <span className="font-mono text-cyan-400 font-bold">{wellDepth} meters</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="350"
                  step="5"
                  value={wellDepth}
                  onChange={(e) => setWellDepth(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <span className="text-[10px] text-slate-500 block font-mono">Range: 40m – 350m</span>
              </div>

              {/* Water Level Slider */}
              <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Static Water Table</span>
                  <span className="font-mono text-water-400 font-bold">{waterLevel} meters</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max={wellDepth - 5}
                  step="1"
                  value={waterLevel}
                  onChange={(e) => setWaterLevel(Number(e.target.value))}
                  className="w-full accent-water-400"
                />
                <span className="text-[10px] text-slate-500 block font-mono">
                  Active Column: {waterColumn}m
                </span>
              </div>

              {/* Extraction Slider */}
              <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Daily Extraction</span>
                  <span className="font-mono text-amber-400 font-bold">{dailyExtraction} L/day</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="250"
                  value={dailyExtraction}
                  onChange={(e) => setDailyExtraction(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
                <span className="text-[10px] text-slate-500 block font-mono">Household / Farm Demand</span>
              </div>
            </div>

            {/* Computation Result Output */}
            <div
              className={`p-6 rounded-2xl border transition-all ${
                isOverExtracting
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                  : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isOverExtracting ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {isOverExtracting ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {isOverExtracting ? 'Critical: Extraction Exceeds Recommended Safe Yield' : 'Sustainable Extraction Profile'}
                    </h3>
                    <p className="text-xs opacity-80 mt-0.5">
                      Estimated storage column: <span className="font-mono font-bold text-white">{estimatedStorageLiters.toLocaleString()} Liters</span>. 
                      Recommended maximum daily throttle: <span className="font-mono font-bold text-white">{safeDailyMax.toLocaleString()} Liters/day</span>.
                    </p>
                  </div>
                </div>

                <Link
                  to="/map"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-950 text-cyan-300 border border-cyan-500/30 hover:bg-navy-850 shrink-0 text-center flex items-center justify-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Inspect Nearby Borewells</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Drinking Water Quality Standards (BIS 10500:2012) */}
        <div className="bg-navy-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Indian Potable Water Quality Thresholds (BIS 10500)</h2>
            <p className="text-xs text-slate-400 mt-1">
              Field benchmarks monitored by WellIntel sensors across municipal monitoring wells.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-navy-950 border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 uppercase block mb-1">pH Acidity / Alkalinity</span>
              <div className="text-xl font-bold text-white font-mono">6.5 – 8.5</div>
              <p className="text-[11px] text-slate-400 mt-1">Acceptable limit for human consumption</p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-slate-800">
              <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1">Total Dissolved Solids</span>
              <div className="text-xl font-bold text-white font-mono">&lt; 500 mg/L</div>
              <p className="text-[11px] text-slate-400 mt-1">Permissible up to 2000 mg/L if no alternative</p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-slate-800">
              <span className="text-[10px] font-mono text-amber-400 uppercase block mb-1">Fluoride (F-)</span>
              <div className="text-xl font-bold text-white font-mono">&lt; 1.0 mg/L</div>
              <p className="text-[11px] text-slate-400 mt-1">Values &gt; 1.5 mg/L cause dental fluorosis</p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-slate-800">
              <span className="text-[10px] font-mono text-rose-400 uppercase block mb-1">Nitrate (NO3-)</span>
              <div className="text-xl font-bold text-white font-mono">&lt; 45 mg/L</div>
              <p className="text-[11px] text-slate-400 mt-1">High levels indicate agricultural fertilizer seepage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
