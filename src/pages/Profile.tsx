import React, { useState, useEffect } from 'react';
import {
  Mail,
  Bell,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import type { WellReport } from '../types/report';

export const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [reports, setReports] = useState<WellReport[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'notifications' | 'settings'>('reports');

  useEffect(() => {
    async function loadUserReports() {
      if (user) {
        const data = await reportService.getUserReports(user.id);
        setReports(data);
      }
    }
    loadUserReports();
  }, [user]);

  if (!user) {
    return (
      <div className="pt-32 pb-20 text-center max-w-md mx-auto px-4">
        <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
        <p className="text-xs text-slate-400 mb-6">
          Please sign in to access your groundwater observer profile.
        </p>
      </div>
    );
  }

  const notifications = [
    {
      id: 'notif-1',
      title: 'Report Under Field Review',
      message: 'Your inspection log for station W-1045 has been assigned to Mangalore coastal team.',
      time: '2 hours ago',
      type: 'info',
    },
    {
      id: 'notif-2',
      title: 'Telemetry Synchronization',
      message: 'Monthly groundwater tables for September 2026 calibrated into regional model.',
      time: '1 day ago',
      type: 'success',
    },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-navy-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-cyan-500/25 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-500/20"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-cyan-500 text-navy-950 border border-white">
                {user.role}
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{user.full_name}</h1>
              <p className="text-xs text-slate-400 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>{user.email}</span>
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-navy-900 border border-slate-700 text-slate-300">
                  Karnataka Observer ID: #{user.id.slice(0, 8)}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-teal-500/15 border border-teal-500/30 text-teal-300">
                  Verified Scout
                </span>
              </div>
            </div>

            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-4">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reports'
                ? 'bg-water-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Submitted Reports ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'notifications'
                ? 'bg-water-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications (2)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-water-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-navy-900/40 border border-slate-800 text-xs text-slate-400">
                You have not submitted any field observations yet.
              </div>
            ) : (
              reports.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl glass-card border border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        {r.well_code || r.well_id}
                      </span>
                      <span className="text-xs font-semibold text-white">{r.report_type}</span>
                    </div>
                    <p className="text-xs text-slate-300 max-w-xl italic">"{r.description}"</p>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Submitted on {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                    {r.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl glass-card border border-slate-800 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white mb-0.5">{n.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white">Observation Preferences</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <label className="flex items-center justify-between p-3 rounded-xl bg-navy-900/60 border border-slate-800">
                <span>Receive regional drought drawdown alerts</span>
                <input type="checkbox" defaultChecked className="accent-cyan-400" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-navy-900/60 border border-slate-800">
                <span>Enable high-accuracy background GPS tracking</span>
                <input type="checkbox" defaultChecked className="accent-cyan-400" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-navy-900/60 border border-slate-800">
                <span>Email summaries of resolved community reports</span>
                <input type="checkbox" className="accent-cyan-400" />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
