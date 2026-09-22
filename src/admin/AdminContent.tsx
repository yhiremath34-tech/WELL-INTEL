import React, { useState, useEffect } from 'react';
import {
  FileEdit,
  Save,
  Radio,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  broadcastEnabled: boolean;
  broadcastType: 'warning' | 'alert' | 'info';
  broadcastMessage: string;
  supportPhone: string;
  supportEmail: string;
}

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: 'Discover, Monitor & Safeguard Groundwater Near You.',
  heroSubtitle:
    'Real-time sub-surface telemetry, deterministic risk models, and community well audits across Karnataka.',
  broadcastEnabled: true,
  broadcastType: 'warning',
  broadcastMessage:
    'Regional Advisory: Coastal unconfined aquifers are at 12% lower recharge. Pumping throttles in effect.',
  supportPhone: '+91 80 2235 2568 (Groundwater Directorate)',
  supportEmail: 'director.water@karnataka.gov.in',
};

export const AdminContent: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem('wellintel_website_content');
      return saved ? JSON.parse(saved) : DEFAULT_CONTENT;
    } catch {
      return DEFAULT_CONTENT;
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function fetchRemoteContent() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase
            .from('website_content')
            .select('value')
            .eq('key', 'homepage_config')
            .maybeSingle();

          if (data?.value) {
            setContent(data.value);
            localStorage.setItem('wellintel_website_content', JSON.stringify(data.value));
          }
        } catch (e) {
          console.warn('Could not fetch remote content, using local fallback:', e);
        }
      }
    }
    fetchRemoteContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      localStorage.setItem('wellintel_website_content', JSON.stringify(content));

      if (isSupabaseConfigured && supabase) {
        await supabase.from('website_content').upsert({
          key: 'homepage_config',
          value: content,
          updated_at: new Date().toISOString(),
        });
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save website content:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Admin-Controlled Website Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Website Content & Broadcast Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Update public landing messages, emergency hydrology announcements, and regional contact telemetry
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Published live to website!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Emergency Broadcast Alert CMS */}
        <div className="bg-navy-900 border border-rose-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
              <h2 className="text-base font-bold text-white">
                Live Public Broadcast Advisory Banner
              </h2>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={content.broadcastEnabled}
                onChange={(e) =>
                  setContent({ ...content, broadcastEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded accent-rose-500 cursor-pointer"
              />
              <span className={content.broadcastEnabled ? 'text-rose-300 font-bold' : 'text-slate-500'}>
                {content.broadcastEnabled ? 'Active on Public Portal' : 'Disabled'}
              </span>
            </label>
          </div>

          <p className="text-xs text-slate-400">
            When enabled, this priority banner appears across all public pages for citizens.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Advisory Message
              </label>
              <input
                type="text"
                value={content.broadcastMessage}
                onChange={(e) =>
                  setContent({ ...content, broadcastMessage: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Severity Level
              </label>
              <select
                value={content.broadcastType}
                onChange={(e) =>
                  setContent({
                    ...content,
                    broadcastType: e.target.value as 'warning' | 'alert' | 'info',
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="warning">Warning (Amber Alert)</option>
                <option value="alert">Critical Hazard (Rose Alert)</option>
                <option value="info">General Information (Cyan)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hero Section Copy CMS */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Homepage Hero Configuration</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Hero Main Headline
              </label>
              <input
                type="text"
                value={content.heroTitle}
                onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Hero Sub-Headline / Description
              </label>
              <textarea
                rows={2}
                value={content.heroSubtitle}
                onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Directorate Official Contacts */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white">Public Directorate Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Directorate Hotline Phone
              </label>
              <input
                type="text"
                value={content.supportPhone}
                onChange={(e) => setContent({ ...content, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Official Inquiries Email
              </label>
              <input
                type="email"
                value={content.supportEmail}
                onChange={(e) => setContent({ ...content, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg shadow-rose-950/40 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Publishing Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish Website Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
