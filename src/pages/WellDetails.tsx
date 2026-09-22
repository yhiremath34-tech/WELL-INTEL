import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  MapPin,
  Calendar,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { wellService } from '../services/wellService';
import type { Well } from '../types/well';
import { WaterLevelVisualizer } from '../components/wells/WaterLevelVisualizer';
import { getMockHistoricalTelemetry } from '../data/sampleWells';
import { getStatusBadge, getQualityBadge } from '../lib/utils';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export const WellDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [well, setWell] = useState<Well | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '6m' | '1y'>('30d');

  useEffect(() => {
    async function loadWell() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await wellService.getWellById(id);
        setWell(data);
      } catch (err) {
        console.error('Failed to load well', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadWell();
  }, [id]);

  if (isLoading) {
    return <LoadingScreen message="Generating Station Intelligence Dossier..." />;
  }

  if (!well) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">Station Record Not Located</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested well code or identifier does not exist in the current monitoring database.
        </p>
        <Link
          to="/explore"
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-cyan-300"
        >
          Return to Well Directory
        </Link>
      </div>
    );
  }

  const statusBadge = getStatusBadge(well.status);
  const qualityBadge = getQualityBadge(well.water_quality);
  const historyData = getMockHistoricalTelemetry(well, period);

  // Saturation percentage
  const saturationRatio = Math.round(
    ((well.depth - well.water_level) / well.depth) * 100
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumbs & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to={`/reports?well_id=${well.id}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </Link>
            <Link
              to={`/map?lat=${well.latitude}&lng=${well.longitude}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-navy-900 border border-cyan-500/30 text-cyan-300 hover:bg-navy-850 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>View On Map</span>
            </Link>
          </div>
        </div>

        {/* Section 11: Top Intelligence Header */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-cyan-500/25 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {well.well_code}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-0.5 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusBadge.dotColor} animate-ping`} />
                  {statusBadge.label}
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  {well.well_type}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {well.name}
              </h1>

              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>
                  {well.village}, {well.taluk ? `${well.taluk}, ` : ''}{well.district}, Karnataka
                </span>
                <span className="font-mono text-slate-500">
                  ({well.latitude.toFixed(4)}° N, {well.longitude.toFixed(4)}° E)
                </span>
              </p>
            </div>

            {/* Quick KPI stats */}
            <div className="flex items-center gap-4 bg-navy-900/80 p-3 rounded-2xl border border-slate-800 shrink-0 font-mono">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">PUMP YIELD</span>
                <span className="text-base font-bold text-white">{well.yield.toLocaleString()} L/hr</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">QUALITY</span>
                <span className={`text-xs font-bold ${qualityBadge.text}`}>{well.water_quality}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 12: Animated Water Level Borehole Visualizer */}
        <WaterLevelVisualizer
          currentLevel={well.water_level}
          totalDepth={well.depth}
          avgLevel={Math.round((well.water_level * 1.1) * 10) / 10}
          status={well.status}
        />

        {/* Section 13: Historical Data Interactive Recharts */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-cyan-500/20 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Water Level History & Seasonal Depletion
              </h3>
              <p className="text-xs text-slate-400">
                Continuous acoustic sensor data showing hydrostatic head (meters below ground level)
              </p>
            </div>

            {/* Period Switcher */}
            <div className="flex items-center gap-1 bg-navy-900/90 p-1 rounded-xl border border-cyan-500/25">
              {(['7d', '30d', '6m', '1y'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                    period === p
                      ? 'bg-water-500 text-white shadow-sm shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="historyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071A2B',
                    borderColor: 'rgba(20, 184, 166, 0.4)',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="waterLevel"
                  stroke="#14B8A6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#historyGrad)"
                  name="Water Table (m bgl)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 14: WATER INTELLIGENCE Assessment Indicators */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-cyan-500/20 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-cyan-500/15">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-wide uppercase">
              WATER INTELLIGENCE ASSESSMENT
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Indicator 1: Circular Progress Gauge */}
            <div className="p-5 rounded-2xl bg-navy-900/60 border border-slate-800 text-center flex flex-col items-center justify-center">
              <div className="relative w-28 h-28 flex items-center justify-center mb-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-cyan-400"
                    strokeDasharray={`${saturationRatio}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center font-mono">
                  <span className="text-xl font-black text-white">{saturationRatio}%</span>
                  <span className="text-[9px] text-cyan-300">STORAGE</span>
                </div>
              </div>
              <span className="text-xs font-bold text-white">Aquifer Saturation</span>
              <span className="text-[10px] text-teal-400 font-mono">NORMAL STATUS</span>
            </div>

            {/* Indicator 2: Hydrogeology Details */}
            <div className="p-5 rounded-2xl bg-navy-900/60 border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Well Characteristics</span>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Depth</span>
                  <span className="font-bold text-white font-mono">{well.depth} m</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Water Level</span>
                  <span className="font-bold text-cyan-300 font-mono">{well.water_level} m bgl</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Aquifer Type</span>
                  <span className="font-semibold text-white">{well.well_type}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                Bedrock: Archean Peninsular Gneiss
              </div>
            </div>

            {/* Indicator 3: Potability Evaluation */}
            <div className="p-5 rounded-2xl bg-navy-900/60 border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Potability Index</span>
              <div className="my-2">
                <div className="text-xl font-extrabold text-white">{well.water_quality}</div>
                <p className="text-xs text-slate-300 mt-1">
                  Chemical screening shows within permissible limits for standard domestic utility.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                TDS: ~380 ppm &bull; pH: 7.2
              </div>
            </div>

            {/* Indicator 4: Field Inspection Status */}
            <div className="p-5 rounded-2xl bg-navy-900/60 border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Inspection Log</span>
              <div className="my-2">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>{well.last_inspected || '2026-09-18'}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Acoustic sensor calibrated. Zero silt obstruction recorded.
                </p>
              </div>
              <Link
                to={`/reports?well_id=${well.id}`}
                className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Submit Field Note</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
