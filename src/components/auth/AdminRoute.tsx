import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, KeyRound, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono tracking-widest text-rose-300 uppercase">
          Verifying Institutional Clearance...
        </p>
      </div>
    );
  }

  // Not logged in at all -> redirect to Admin Login portal
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Logged in as standard citizen/user -> 403 Forbidden screen
  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-navy-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-navy-900 border border-rose-500/30 rounded-3xl p-8 text-center shadow-2xl shadow-rose-950/40 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto mb-6 text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-block mb-3">
            SECURITY BARRIER 403: FORBIDDEN
          </span>

          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            Administrator Clearance Required
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            The account <span className="font-semibold text-cyan-300">{user.email}</span> is
            authenticated with role <span className="font-mono text-amber-300 uppercase">[{role}]</span>.
            Access to the Director Operations Hub is restricted strictly to authorized hydrologists
            and municipal administrators.
          </p>

          <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800 text-[11px] text-slate-400 mb-6 flex items-start gap-2.5 text-left">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              If you are an administrative officer, sign out of your citizen account and sign into the
              secure Administrator Access terminal.
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <Link
              to="/admin/login"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In to Admin Portal</span>
            </Link>

            <Link
              to="/"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-navy-850 hover:bg-navy-800 text-slate-300 border border-slate-700/60 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
