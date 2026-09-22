import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplets,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { ParticleCanvas } from '../components/animations/ParticleCanvas';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loginAsDemoUser, loginAsDemoAdmin } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const res = await signUp(email, password, name);
        if (res.error) {
          setError(res.error);
        } else {
          navigate('/explore');
        }
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          setError(res.error);
        } else {
          navigate('/explore');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (type: 'user' | 'admin') => {
    if (type === 'admin') {
      loginAsDemoAdmin();
      navigate('/admin');
    } else {
      loginAsDemoUser();
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-stretch bg-navy-950 text-slate-100">
      {/* LEFT: Section 22 Animated Water Visualization */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-hero-gradient p-12 flex-col justify-between overflow-hidden border-r border-cyan-500/20">
        <ParticleCanvas count={40} />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-water-500 p-0.5 shadow-lg shadow-cyan-500/30">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Droplets className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <span className="text-xl font-black tracking-wider text-white">
              WELL<span className="text-cyan-400">INTEL</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AUTHORITATIVE TELEMETRY GATEWAY</span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight">
            Connecting Field Observers & Groundwater Science.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Log in to submit well inspections, trace sub-surface drawdown vectors, and collaborate
            with municipal water management authorities.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Instant GIS Proximity calculations across Karnataka',
              'Deterministic rule-based environmental risk models',
              'Community-sourced well verification audit trail',
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-cyan-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-mono">
          Secured with Supabase Auth & PostgreSQL Row-Level Security
        </div>
      </div>

      {/* RIGHT: Login / Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-black text-white tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isSignUp
                ? 'Join the groundwater intelligence observation network'
                : 'Enter your credentials to access your telemetry dashboard'}
            </p>
          </div>

          {/* Quick Demo Logins for Hackathon Evaluator */}
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 space-y-2">
            <div className="text-[11px] font-mono text-cyan-300 font-bold uppercase flex items-center justify-between">
              <span>Demo Quick-Access (Zero Setup)</span>
              <KeyRound className="w-3.5 h-3.5" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemo('user')}
                className="py-2 px-3 rounded-xl text-xs font-semibold bg-navy-900 hover:bg-navy-850 text-cyan-300 border border-cyan-500/30 transition-colors text-center"
              >
                Observer Scout
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-2 px-3 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors text-center"
              >
                Administrator Hub
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aditi Hegde"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-cyan-500/20 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="scout@wellintel.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-cyan-500/20 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-cyan-500/20 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : isSignUp ? 'Sign Up' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            {isSignUp ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-cyan-400 hover:underline"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-cyan-400 hover:underline"
                >
                  Sign Up
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
