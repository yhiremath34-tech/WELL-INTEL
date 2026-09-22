import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets,
  Layers,
  FileCheck,
  AlertTriangle,
  Compass,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  Bookmark,
  ShieldCheck,
  TrendingDown,
  Activity,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import { wellService } from '../services/wellService';
import { WellReport } from '../types/report';
import { Well } from '../types/well';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<WellReport[]>([]);
  const [monitoredWells, setMonitoredWells] = useState<Well[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      setIsLoading(true);
      try {
        const [allReports, allWells] = await Promise.all([
          reportService.getReports(),
          wellService.getWells(),
        ]);
        // For current user, show their reports or sample observer reports
        setReports(allReports);
        setMonitoredWells(allWells.slice(0, 3));
      } catch (err) {
        console.error('Failed to load user portal data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUserData();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-cyan-500/25 p-6 sm:p-10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <img
                src={
                  user?.avatar_url ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                }
                alt="Avatar"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-400/80 shadow-lg shadow-cyan-500/20"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                    Field Observer Account
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome back, {user?.full_name || 'Groundwater Observer'}
                </h1>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  {user?.email} • Karnataka Sub-surface Hydrology Observatory
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/reports"
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Field Report</span>
              </Link>
              <Link
                to="/map"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-navy-800 hover:bg-navy-750 text-cyan-300 border border-cyan-500/25 transition-colors flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Live GIS Radar</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Tracked Wells</span>
              <Bookmark className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{monitoredWells.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Active telemetry bookmarks</div>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>My Submissions</span>
              <FileCheck className="w-4 h-4 text-water-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{reports.length}</div>
            <div className="text-[11px] text-emerald-400 mt-1">
              {reports.filter((r) => r.status === 'RESOLVED').length} verified & closed
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Area Depletion Rate</span>
              <TrendingDown className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono">-0.42 m/yr</div>
            <div className="text-[11px] text-slate-400 mt-1">Dakshina Kannada / Udupi</div>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Network Status</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">OPTIMAL</div>
            <div className="text-[11px] text-slate-400 mt-1">2,840 stations synchronizing</div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: My Activity & Reports */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-navy-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">My Field Observation Reports</h2>
                  <p className="text-xs text-slate-400">
                    Community-flagged issues submitted for Directorate hydrologist triage
                  </p>
                </div>
                <Link
                  to="/reports"
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Submit New</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {reports.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500">
                  No issues logged yet. If you observe a dry or broken well, submit a report.
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.slice(0, 5).map((rep) => (
                    <div
                      key={rep.id}
                      className="p-4 rounded-xl bg-navy-950/70 border border-slate-800/80 hover:border-cyan-500/20 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-white">{rep.report_type}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            rep.status === 'RESOLVED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : rep.status === 'UNDER_REVIEW'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 mb-2">{rep.description}</p>
                      {rep.admin_notes && (
                        <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-200 mb-2">
                          <span className="font-semibold text-cyan-300">Admin Response: </span>
                          {rep.admin_notes}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>Report #{rep.id.slice(0, 8)}</span>
                        <span>{new Date(rep.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Bookmarked Wells & Quick Advisories */}
          <div className="space-y-6">
            <div className="bg-navy-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white">Monitored Stations</h2>
                <Link to="/explore" className="text-xs text-cyan-400 hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {monitoredWells.map((well) => (
                  <Link
                    key={well.id}
                    to={`/wells/${well.id}`}
                    className="block p-3 rounded-xl bg-navy-950/70 border border-slate-800 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {well.name}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">
                        {well.water_level}m
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <MapPin className="w-3 h-3 text-cyan-500" />
                      <span>
                        {well.taluk}, {well.district}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Environmental Safety Notice */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-water-950/30 border border-cyan-500/20 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Regional Pre-Monsoon Advisory</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Coastal unconfined aquifers currently register a 12% drop in recharge levels.
                Agricultural borewells are advised to restrict pumping cycles to 4 hours per day.
              </p>
              <Link
                to="/water-intelligence"
                className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:underline pt-1"
              >
                <span>Read Full Aquifer Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
