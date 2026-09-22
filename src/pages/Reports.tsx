import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { MultiStepReportForm } from '../components/reports/MultiStepReportForm';
import { reportService } from '../services/reportService';
import { useWells } from '../hooks/useWells';
import type { WellReport, ReportStatus } from '../types/report';

export const Reports: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialWellId = searchParams.get('well_id') || undefined;

  const { wells } = useWells();
  const [reports, setReports] = useState<WellReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  const fetchReports = async () => {
    setIsLoadingReports(true);
    try {
      const data = await reportService.getReports();
      setReports(data);
    } catch (err) {
      console.error('Error loading reports', err);
    } finally {
      setIsLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReportSubmitted = (newReport: WellReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'RESOLVED':
        return {
          icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          label: 'Resolved',
        };
      case 'UNDER_REVIEW':
        return {
          icon: <Clock className="w-3.5 h-3.5 text-sky-400" />,
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          label: 'Under Review',
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          label: 'Rejected',
        };
      default:
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          label: 'Pending Review',
        };
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CITIZEN SCIENCE & VERIFICATION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Help Improve Well Intelligence
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Report location discrepancies, pump hardware failures, or acute water quality issues.
            Your submissions feed directly into field inspection dispatch workflows.
          </p>
        </div>

        {/* Multi-step Submission Form */}
        <MultiStepReportForm
          wells={wells}
          initialWellId={initialWellId}
          onReportSubmitted={handleReportSubmitted}
        />

        {/* Recent Community Submissions Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Recent Community Observations
              </h3>
              <p className="text-xs text-slate-400">
                Live audit trail of citizen and field officer submissions
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              {reports.length} Reports Logged
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoadingReports ? (
              <div className="col-span-2 py-12 text-center text-xs font-mono text-slate-400">
                Loading community reports...
              </div>
            ) : reports.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-xs text-slate-400">
                No reports submitted yet. Be the first to flag an observation!
              </div>
            ) : (
              reports.map((report) => {
                const badge = getStatusBadge(report.status);
                return (
                  <div
                    key={report.id}
                    className="p-5 rounded-2xl glass-card border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                            {report.well_code || report.well_id}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {report.well_name || 'Monitoring Station'}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-amber-300">
                          {report.report_type}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.bg}`}
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-navy-900/50 p-3 rounded-xl border border-slate-800">
                      "{report.description}"
                    </p>

                    {report.admin_notes && (
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
                        <strong className="text-white">Admin Resolution Note:</strong>{' '}
                        {report.admin_notes}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                      <span>Reported by: {report.user_name || 'Citizen Scout'}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
