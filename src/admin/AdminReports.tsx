import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  AlertCircle,
  Filter,
  Search,
  X,
  Send,
  Calendar,
} from 'lucide-react';
import { reportService } from '../services/reportService';
import { WellReport, ReportStatus } from '../types/report';

export const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<WellReport[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Review & Action Modal
  const [activeReport, setActiveReport] = useState<WellReport | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionType, setActionType] = useState<ReportStatus>('RESOLVED');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await reportService.getReports();
      setReports(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = reports.filter((r) => {
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const codeMatch = (r.well_code || r.well_id).toLowerCase().includes(q);
      const userMatch = (r.user_name || '').toLowerCase().includes(q);
      const issueMatch = r.report_type.toLowerCase().includes(q);
      if (!codeMatch && !userMatch && !issueMatch) return false;
    }
    return true;
  });

  const handleOpenAction = (report: WellReport, status: ReportStatus) => {
    setActiveReport(report);
    setActionType(status);
    setAdminNotes(report.admin_notes || '');
    setIsConfirmOpen(true);
  };

  const handleExecuteAction = async () => {
    if (!activeReport) return;
    await reportService.updateReportStatus(activeReport.id, actionType, adminNotes);
    setIsConfirmOpen(false);
    setActiveReport(null);
    loadReports();
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'UNDER_REVIEW':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'REJECTED':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      default:
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Community Report Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Validate citizen science submissions, dispatch hydrology teams, and close tickets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-300">
            {reports.filter((r) => r.status === 'PENDING').length} Pending Review
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report ID, well, user, or issue..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="p-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Ticket States</option>
            <option value="PENDING">Pending Only</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Report ID</th>
                <th className="px-4 py-3">Station Code</th>
                <th className="px-4 py-3">Observer</th>
                <th className="px-4 py-3">Issue Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-mono">
                    Loading reports queue...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No community reports found.
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-navy-850/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-400">
                      #{rep.id.slice(-6)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-cyan-300">
                        {rep.well_code || rep.well_id}
                      </span>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{rep.well_name}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {rep.user_name || 'Citizen Scout'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-amber-300 font-semibold">{rep.report_type}</span>
                      <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                        {rep.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">
                      {new Date(rep.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(
                          rep.status
                        )}`}
                      >
                        {rep.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {rep.status !== 'UNDER_REVIEW' && rep.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleOpenAction(rep, 'UNDER_REVIEW')}
                            className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 font-semibold text-[11px] transition-colors"
                          >
                            Review
                          </button>
                        )}
                        {rep.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleOpenAction(rep, 'RESOLVED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-semibold text-[11px] transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                        {rep.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleOpenAction(rep, 'REJECTED')}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-semibold text-[11px] transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Action / Confirmation Modal */}
      <AnimatePresence>
        {isConfirmOpen && activeReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-navy-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {actionType === 'RESOLVED' && 'Resolve & Close Report'}
                    {actionType === 'UNDER_REVIEW' && 'Set Status: Under Review'}
                    {actionType === 'REJECTED' && 'Reject Report'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Station: <strong className="text-cyan-300">{activeReport.well_code}</strong> &bull;{' '}
                    {activeReport.report_type}
                  </p>
                </div>
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Report summary context */}
              <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                  Citizen Observation
                </span>
                <p className="text-slate-200 italic leading-relaxed">
                  "{activeReport.description}"
                </p>
              </div>

              {/* Admin notes input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Directorate Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Field crew dispatched. Replaced submersible casing seal and flushed sediment column..."
                  className="w-full p-3 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteAction}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                    actionType === 'RESOLVED'
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-navy-950 shadow-emerald-500/20'
                      : actionType === 'REJECTED'
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                      : 'bg-sky-500 hover:bg-sky-600 text-navy-950 shadow-sky-500/20'
                  }`}
                >
                  Confirm Status Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
