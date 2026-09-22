import React, { useState, useMemo } from 'react';
import {
  Layers,
  Droplets,
  Activity,
  ArrowDown,
  BarChart3,
  Filter,
} from 'lucide-react';
import { useWells } from '../hooks/useWells';
import { analyticsService, type EnvironmentalInsight } from '../services/analyticsService';
import { AiInsightPanel } from '../components/analytics/AiInsightPanel';
import { GroundwaterCharts } from '../components/analytics/GroundwaterCharts';
import { CountUp } from '../components/animations/CountUp';

export const Analytics: React.FC = () => {
  const { wells } = useWells();
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInsights, setGeneratedInsights] = useState<EnvironmentalInsight[]>([]);

  // Filter wells by district if selected
  const filteredWells = useMemo(() => {
    if (districtFilter === 'ALL') return wells;
    return wells.filter((w) => w.district.toLowerCase().includes(districtFilter.toLowerCase()));
  }, [wells, districtFilter]);

  // Aggregate summary
  const summary = useMemo(() => {
    return analyticsService.calculateSummary(filteredWells);
  }, [filteredWells]);

  // Insights derived from current active set
  const insights = useMemo(() => {
    if (generatedInsights.length > 0) return generatedInsights;
    return analyticsService.generateEnvironmentalInsights(filteredWells);
  }, [filteredWells, generatedInsights]);

  const handleRefreshInsights = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const refreshed = analyticsService.generateEnvironmentalInsights(filteredWells);
      setGeneratedInsights(refreshed);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <div className="p-8 rounded-3xl glass-card border border-cyan-500/25 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-3">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>STATEWIDE ENVIRONMENTAL INTELLIGENCE</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Groundwater Intelligence
              </h1>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed mt-2">
                Realtime aggregate telemetry, aquifer depletion trajectory, and environmental
                potability analysis across monitored stations.
              </p>
            </div>

            {/* Regional Filter Selector */}
            <div className="flex items-center gap-3 bg-navy-900/90 p-2 rounded-2xl border border-cyan-500/25">
              <Filter className="w-4 h-4 text-cyan-400 ml-2" />
              <select
                value={districtFilter}
                onChange={(e) => {
                  setDistrictFilter(e.target.value);
                  setGeneratedInsights([]);
                }}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none pr-3 cursor-pointer"
              >
                <option value="ALL" className="bg-navy-950">All Karnataka Regions</option>
                <option value="Dakshina Kannada" className="bg-navy-950">Dakshina Kannada (Coastal)</option>
                <option value="Bengaluru" className="bg-navy-950">Bengaluru Urban (Plateau)</option>
                <option value="Udupi" className="bg-navy-950">Udupi Coastal District</option>
                <option value="Mysuru" className="bg-navy-950">Mysuru Watershed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 19: KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Wells */}
          <div className="p-6 rounded-2xl glass-card border border-cyan-500/20 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mb-1">
              <CountUp end={summary.totalWells} />
            </div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Total Wells
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono">
              Monitored telemetry units
            </div>
          </div>

          {/* Card 2: Average Water Level */}
          <div className="p-6 rounded-2xl glass-card border border-water-500/20 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-water-500/15 flex items-center justify-center text-cyan-300 mb-3">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mb-1">
              <CountUp end={summary.avgWaterLevel} decimals={1} suffix=" m" />
            </div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Average Water Level
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono">
              Below ground level (bgl)
            </div>
          </div>

          {/* Card 3: Active Wells */}
          <div className="p-6 rounded-2xl glass-card border border-teal-500/20 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-400 mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mb-1">
              <CountUp end={summary.activeWells} />
            </div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Active Wells
            </div>
            <div className="text-[11px] text-teal-400 mt-2 font-mono">
              {summary.totalWells > 0
                ? `${Math.round((summary.activeWells / summary.totalWells) * 100)}% uptime`
                : '0%'}
            </div>
          </div>

          {/* Card 4: Average Depth */}
          <div className="p-6 rounded-2xl glass-card border border-amber-500/20 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 mb-3">
              <ArrowDown className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mb-1">
              <CountUp end={summary.avgDepth} decimals={1} suffix=" m" />
            </div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Average Depth
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono">
              Total borehole casing depth
            </div>
          </div>
        </div>

        {/* Section 20: AI INSIGHTS PANEL */}
        <AiInsightPanel
          insights={insights}
          onRefreshInsights={handleRefreshInsights}
          isLoading={isGenerating}
        />

        {/* Section 19: Comprehensive Recharts Charts */}
        <GroundwaterCharts summary={summary} />
      </div>
    </div>
  );
};
