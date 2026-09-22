import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, AlertTriangle, ShieldCheck, Info, ChevronRight } from 'lucide-react';
import { EnvironmentalInsight } from '../../services/analyticsService';

interface AiInsightPanelProps {
  insights: EnvironmentalInsight[];
  onRefreshInsights: () => void;
  isLoading?: boolean;
}

export const AiInsightPanel: React.FC<AiInsightPanelProps> = ({
  insights,
  onRefreshInsights,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const current = insights[activeTab] || insights[0];

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'optimal':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      case 'critical':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        };
      default:
        return {
          icon: <Info className="w-4 h-4 text-cyan-400" />,
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        };
    }
  };

  return (
    <div className="relative p-6 rounded-3xl glass-card border border-cyan-500/30 shadow-2xl overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-cyan-500/15">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-water-500 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-wide">
                INTELLIGENT INSIGHTS
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Rule Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Deterministic environmental models calibrated with live telemetry
            </p>
          </div>
        </div>

        {/* Generate / Refresh Button */}
        <button
          onClick={onRefreshInsights}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-850 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 shadow transition-all disabled:opacity-50 group"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform`} />
          <span>Generate Insight</span>
        </button>
      </div>

      {/* Selector pills for multiple insights */}
      {insights.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {insights.map((ins, idx) => (
            <button
              key={ins.id}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === idx
                  ? 'bg-water-500/30 text-cyan-300 border border-cyan-400/50 shadow-sm'
                  : 'bg-navy-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {ins.title.split(' ')[0]} {ins.title.split(' ')[1]}
            </button>
          ))}
        </div>
      )}

      {/* Main Insight Card Content */}
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    getSeverityBadge(current.severity).bg
                  } mb-2`}
                >
                  {getSeverityBadge(current.severity).icon}
                  <span className="capitalize">{current.category.replace('_', ' ')} Evaluation</span>
                </span>
                <h4 className="text-xl font-bold text-white tracking-tight">
                  {current.title}
                </h4>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Model Confidence</span>
                <span className="text-lg font-extrabold text-cyan-400 font-mono">
                  {current.confidenceScore}%
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-navy-900/40 p-4 rounded-2xl border border-slate-800/80">
              "{current.summary}"
            </p>

            {/* Telemetry Metrics associated with this rule */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {current.metrics.map((m, i) => (
                <div key={i} className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">{m.label}</span>
                  <span className="text-sm font-bold text-white font-mono">{m.value}</span>
                </div>
              ))}
            </div>

            {/* Actionable Engineering Recommendation */}
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-2.5">
              <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-cyan-200">
                <strong className="text-white font-semibold">Recommended Action: </strong>
                {current.recommendation}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 text-right font-mono">
              Computed at: {current.generatedAt} (Based on local hydrostatic database)
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
