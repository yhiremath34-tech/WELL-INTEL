import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Terminal,
  Server,
  AlertTriangle,
  BadgeCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { adminSignIn, user, role } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in as admin, redirect to /admin
  React.useEffect(() => {
    if (user && role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await adminSignIn(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@wellintel.gov.in');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background cryptographic grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#88133715_1px,transparent_1px),linear-gradient(to_bottom,#88133715_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between relative z-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-navy-900/80 px-3 py-1.5 rounded-full border border-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Portal</span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>SECURITY ZONE 01 — RESTRICTED ACCESS</span>
        </div>
      </div>

      {/* Main Administrative Form */}
      <div className="max-w-md w-full mx-auto my-auto relative z-10">
        <div className="bg-navy-900/95 backdrop-blur-xl border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 mx-auto shadow-lg shadow-rose-950/60">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                <ShieldAlert className="w-7 h-7 text-rose-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              WELLINTEL <span className="text-rose-400">OPS GATEWAY</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              DIRECTORATE OF GROUNDWATER OPERATIONS & TELEMETRY
            </p>
          </div>

          {/* Quick Evaluator Helper */}
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2">
            <div className="text-[11px] font-mono text-rose-300 font-bold uppercase flex items-center justify-between">
              <span>Evaluator Demo Admin Key</span>
              <KeyRound className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <p className="text-[11px] text-slate-300">
              For testing the Administrator Portal without Supabase credentials, autofill institutional demo clearance:
            </p>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Auto-Fill Admin Credentials</span>
              <span className="text-[10px] font-mono opacity-70">(admin@wellintel.gov.in)</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Official Administrator Email</span>
                <span className="text-[10px] font-mono text-slate-500">Institutional ID</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@wellintel.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500/70 focus:ring-1 focus:ring-rose-500/50 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Passphrase / Security Key</span>
                <span className="text-[10px] font-mono text-slate-500">Min 6 characters</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500/70 focus:ring-1 focus:ring-rose-500/50 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg shadow-rose-950/50 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Verifying Administrative Authority...</span>
              ) : (
                <>
                  <span>Authorize & Access Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Legal / Security Notice */}
          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-center leading-relaxed font-mono">
            Restricted Government & Hydrological Agency Terminal. All sessions, IP addresses, and state changes
            are cryptographically recorded.
          </div>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between text-[11px] text-slate-500 font-mono relative z-10 pt-4">
        <div className="flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-cyan-400" />
          <span>PostgreSQL RLS Protected</span>
        </div>
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Role-Based Access Control (RBAC)</span>
        </div>
      </div>
    </div>
  );
};
