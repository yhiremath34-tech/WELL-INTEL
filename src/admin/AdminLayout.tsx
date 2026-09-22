import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FileCheck,
  Users,
  ArrowLeft,
  ShieldAlert,
  Droplets,
  LogOut,
  Globe,
  Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Well Management', path: '/admin/wells', icon: Layers },
    { name: 'Water Quality Data', path: '/admin/water', icon: Droplets },
    { name: 'Community Reports', path: '/admin/reports', icon: FileCheck },
    { name: 'Users & Roles', path: '/admin/users', icon: Users },
    { name: 'Website Content CMS', path: '/admin/content', icon: Globe },
    { name: 'Activity & Audit Log', path: '/admin/activity', icon: Activity },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-navy-900 border-b md:border-b-0 md:border-r border-rose-500/20 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header Branding */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
              </div>
              <div>
                <span className="text-sm font-black tracking-wider text-white">ADMIN HUB</span>
                <span className="text-[9px] text-rose-300 font-mono block">Directorate Mode</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-navy-850'
                  }`}
                >
                  <Icon className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Footing */}
        <div className="pt-6 border-t border-slate-800 mt-6 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-navy-950 text-cyan-300 border border-cyan-500/20 hover:bg-navy-850 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Portal</span>
          </Link>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="truncate max-w-[120px]">{user?.full_name || 'Admin'}</span>
            <button
              onClick={handleLogout}
              className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
