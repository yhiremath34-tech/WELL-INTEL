import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  Compass,
  Map as MapIcon,
  BarChart3,
  FileText,
  User as UserIcon,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { isScrolled } = useScrollPosition();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Live Map', path: '/map' },
    { name: 'Water Intel', path: '/water-intelligence' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Reports', path: '/reports' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-2.5 bg-navy-950/85 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-black/20'
            : 'py-4 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-water-600 via-water-400 to-cyan-300 p-0.5 shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-shadow">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-wider text-white flex items-center gap-1">
                  WELL<span className="text-cyan-400">INTEL</span>
                </span>
                <span className="text-[9px] tracking-widest text-cyan-200/60 uppercase font-mono -mt-1 hidden sm:block">
                  Groundwater Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-navy-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/15">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                      active
                        ? 'text-white'
                        : 'text-slate-300 hover:text-cyan-300'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute inset-0 bg-gradient-to-r from-water-600 to-cyan-500 rounded-full -z-10 shadow-sm shadow-cyan-500/30"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full bg-navy-900/80 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-colors"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User Profile or Login */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full bg-navy-900/90 border border-cyan-500/25 hover:border-cyan-400/50 transition-all text-xs font-medium text-slate-200"
                  >
                    <img
                      src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                      alt="avatar"
                      className="w-6 h-6 rounded-full object-cover border border-cyan-400/60"
                    />
                    <span className="max-w-[100px] truncate">{user.full_name}</span>
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-52 rounded-xl bg-navy-950/95 border border-cyan-500/20 shadow-2xl p-2 z-50 backdrop-blur-xl"
                      >
                        <div className="px-3 py-2 border-b border-slate-800">
                          <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{user.email}</p>
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-cyan-500/20 text-cyan-300">
                            {user.role}
                          </span>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-water-500/10 rounded-lg transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            <span>My Dashboard</span>
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-water-500/10 rounded-lg transition-colors"
                          >
                            <UserIcon className="w-3.5 h-3.5" />
                            <span>My Profile</span>
                          </Link>
                        </div>

                        <div className="pt-1 border-t border-slate-800">
                          <button
                            onClick={() => {
                              signOut();
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-medium text-slate-300 hover:text-cyan-300 px-3 py-1.5"
                  >
                    Login
                  </Link>
                  <Link
                    to="/map"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-md shadow-cyan-500/20 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Get Started</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full bg-navy-900 border border-slate-700/60 flex items-center justify-center text-slate-300"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg bg-navy-900/80 border border-cyan-500/25 text-slate-200"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 inset-x-0 z-30 bg-navy-950/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl p-5 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive(link.path)
                      ? 'bg-water-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              ))}

              <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 bg-navy-900/80 rounded-xl">
                      <img
                        src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 truncate">
                        <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                        <p className="text-[10px] text-cyan-300 capitalize">{user.role}</p>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 rounded-xl text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200"
                    >
                      Profile & Reports
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="text-center py-2 rounded-xl text-xs font-semibold text-rose-400"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/map"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 font-bold"
                    >
                      Explore Map
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
