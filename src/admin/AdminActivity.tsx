import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  ShieldAlert,
  Clock,
  UserCheck,
  FileCheck,
  Layers,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface ActivityLog {
  id: string;
  user_email: string;
  user_role: string;
  action: string;
  category: 'AUTH' | 'WELL_DATA' | 'REPORT' | 'ROLE_CHANGE' | 'CMS';
  details: string;
  ip_address: string;
  timestamp: string;
  status: 'SUCCESS' | 'FLAGGED' | 'DENIED';
}

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-101',
    user_email: 'admin.director@wellintel.gov.in',
    user_role: 'admin',
    action: 'BROADCAST_UPDATE',
    category: 'CMS',
    details: 'Updated pre-monsoon coastal aquifer extraction throttle advisory.',
    ip_address: '103.117.158.42 (Bangalore)',
    timestamp: '2026-09-22T07:15:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'log-102',
    user_email: 'aditi.hegde@wellintel.org',
    user_role: 'user',
    action: 'REPORT_SUBMITTED',
    category: 'REPORT',
    details: 'Submitted high-salinity sensor report for well BLR-BW-0104.',
    ip_address: '49.206.12.89 (Mangalore)',
    timestamp: '2026-09-22T06:50:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'log-103',
    user_email: 'anonymous_visitor@117.200.4.12',
    user_role: 'unauthenticated',
    action: 'ADMIN_TERMINAL_PROBE',
    category: 'AUTH',
    details: 'Unauthenticated attempt to access /admin/wells blocked by AdminRoute barrier.',
    ip_address: '117.200.4.12 (Mysuru)',
    timestamp: '2026-09-22T05:32:00Z',
    status: 'DENIED',
  },
  {
    id: 'log-104',
    user_email: 'admin.director@wellintel.gov.in',
    user_role: 'admin',
    action: 'REPORT_TRIAGE',
    category: 'REPORT',
    details: 'Marked report #rep-001 as RESOLVED. Dispatched coastal field hydro crew.',
    ip_address: '103.117.158.42 (Bangalore)',
    timestamp: '2026-09-21T18:20:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'log-105',
    user_email: 'kavoor.field@wellintel.org',
    user_role: 'field_officer',
    action: 'WELL_TELEMETRY_SYNC',
    category: 'WELL_DATA',
    details: 'Synchronized piezoelectric water table level (42.5m) for Kavoor Well.',
    ip_address: '106.51.78.21 (Kavoor)',
    timestamp: '2026-09-21T14:10:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'log-106',
    user_email: 'suresh.p@field.org',
    user_role: 'field_officer',
    action: 'ROLE_ELEVATION',
    category: 'ROLE_CHANGE',
    details: 'User role updated from user to field_officer by Administrator Director.',
    ip_address: '103.117.158.42 (Bangalore)',
    timestamp: '2026-09-21T10:00:00Z',
    status: 'SUCCESS',
  },
];

export const AdminActivity: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user_email.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || log.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Audit & Access Surveillance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            User Activity Tracking & Security Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit log of all citizen reports, administrative actions, role elevations, and access events.
          </p>
        </div>

        <button
          onClick={() => {
            // refresh animation
            const refreshed = [...logs];
            setLogs(refreshed);
          }}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-navy-900 border border-slate-700 hover:border-slate-600 text-slate-300 flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live Trail</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search email, action, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-navy-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-rose-500 font-mono"
        >
          <option value="ALL">All Event Categories</option>
          <option value="AUTH">Authentication & Access (AUTH)</option>
          <option value="WELL_DATA">Telemetry & Well Registry</option>
          <option value="REPORT">Community Reports</option>
          <option value="CMS">CMS & Content Changes</option>
          <option value="ROLE_CHANGE">Role Permissions</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor (Email / Role)</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">IP Location</th>
                <th className="py-3 px-4">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-navy-850/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-white">{log.user_email}</div>
                    <span className="text-[10px] font-mono text-cyan-300 uppercase">
                      [{log.user_role}]
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-navy-950 border border-slate-700 text-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs">{log.details}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.ip_address}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : log.status === 'DENIED'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
