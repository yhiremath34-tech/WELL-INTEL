import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Activity,
  FileText,
  Users,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { wellService } from '../services/wellService';
import { reportService } from '../services/reportService';
import { Well } from '../types/well';
import { WellReport } from '../types/report';
import { CountUp } from '../components/animations/CountUp';

export const AdminDashboard: React.FC = () => {
  const [wells, setWells] = useState<Well[]>([]);
  const [reports, setReports] = useState<WellReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [w, r] = await Promise.all([
          wellService.getWells(),
          reportService.getReports(),
        ]);
        setWells(w);
        setReports(r);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const totalWells = wells.length;
  const activeWells = wells.filter((w) => w.status === 'ACTIVE').length;
  const pendingReports = reports.filter((r) => r.status === 'PENDING').length;
  const alertWells = wells.filter((w) => w.status === 'ALERT');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Directorate Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Groundwater station registry, field inspections, and community alerts
          </p>
        </div>

        <Link
          to="/admin/wells"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 transition-all"
        >
          <span>Manage Station Registry</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Section 24 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            <CountUp end={totalWells} />
          </div>
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1">
            Total Wells
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Registered in Karnataka DB</span>
        </div>

        <div className="p-6 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-400 mb-3">
            <Activity className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            <CountUp end={activeWells} />
          </div>
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1">
            Active Wells
          </div>
          <span className="text-[10px] text-teal-400 font-mono">Live telemetry active</span>
        </div>

        <div className="p-6 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-amber-300 font-mono">
            <CountUp end={pendingReports} />
          </div>
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1">
            Pending Reports
          </div>
          <span className="text-[10px] text-amber-400 font-mono">Awaiting administrative sign-off</span>
        </div>

        <div className="p-6 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400 mb-3">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            <CountUp end={142} />
          </div>
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1">
            Active Scouts & Users
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Field staff and observers</span>
        </div>
      </div>

      {/* Critical Alert Stations Feed */}
      <div className="p-6 rounded-3xl bg-navy-900/80 border border-rose-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">
              Critical Stations Requiring Hydrologist Attention ({alertWells.length})
            </h3>
          </div>
          <Link
            to="/admin/wells"
            className="text-xs font-bold text-rose-400 hover:text-rose-300"
          >
            Review All Stations &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alertWells.slice(0, 6).map((well) => (
            <div
              key={well.id}
              className="p-4 rounded-2xl bg-navy-950 border border-rose-500/30 space-y-2"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded">
                  {well.well_code}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Level: {well.water_level}m</span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{well.name}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{well.description}</p>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>{well.village}, {well.district}</span>
                <Link
                  to={`/wells/${well.id}`}
                  className="text-cyan-400 hover:underline font-bold"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-navy-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Add or Update Well Records</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Add new borewells, update sensor calibration water levels, or configure quality
              classifications.
            </p>
          </div>
          <Link
            to="/admin/wells"
            className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline"
          >
            <span>Open Well Registry CRUD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-navy-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Process Citizen Reports</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Review flagged issues, dispatch repairs, and provide administrative closure notes.
            </p>
          </div>
          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:underline"
          >
            <span>Open Report Management Workflow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
