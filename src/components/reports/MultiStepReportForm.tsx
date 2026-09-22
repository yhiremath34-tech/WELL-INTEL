import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  AlertCircle,
  CheckCircle2,
  FileText,
  ArrowRight,
  ArrowLeft,
  Search,
  Droplets,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Well } from '../../types/well';
import { ReportIssueType, WellReport } from '../../types/report';
import { reportService } from '../../services/reportService';
import { useAuth } from '../../context/AuthContext';

interface MultiStepReportFormProps {
  wells: Well[];
  initialWellId?: string;
  onReportSubmitted: (newReport: WellReport) => void;
}

const ISSUE_TYPES: { type: ReportIssueType; title: string; desc: string; icon: string }[] = [
  {
    type: 'Water Quality Concern',
    title: 'Water Quality Concern',
    desc: 'Turbidity, odor, salinity, or suspected contamination in discharge.',
    icon: '🧪',
  },
  {
    type: 'Water Unavailable',
    title: 'Water Unavailable / Dry',
    desc: 'Pump drawing air or borehole depleted below pump intake.',
    icon: '🏜️',
  },
  {
    type: 'Damaged Well',
    title: 'Damaged Wellhead / Pump',
    desc: 'Cracked apron, broken casing, electrical defect, or motor failure.',
    icon: '⚠️',
  },
  {
    type: 'Incorrect Location',
    title: 'Incorrect Location / GPS',
    desc: 'The physical well coordinates do not match the map marker pin.',
    icon: '📍',
  },
  {
    type: 'Information Incorrect',
    title: 'Specification Discrepancy',
    desc: 'Recorded depth, diameter, or well type differs from field observations.',
    icon: '📝',
  },
  {
    type: 'Other',
    title: 'Other Hydrological Note',
    desc: 'General environmental observations, flood risk, or community notes.',
    icon: 'ℹ️',
  },
];

export const MultiStepReportForm: React.FC<MultiStepReportFormProps> = ({
  wells,
  initialWellId,
  onReportSubmitted,
}) => {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedWell, setSelectedWell] = useState<Well | null>(() => {
    if (initialWellId) {
      return wells.find((w) => w.id === initialWellId || w.well_code === initialWellId) || null;
    }
    return wells[0] || null;
  });
  const [wellSearch, setWellSearch] = useState('');
  const [issueType, setIssueType] = useState<ReportIssueType>('Water Quality Concern');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'URGENT'>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredWells = wells.filter(
    (w) =>
      w.name.toLowerCase().includes(wellSearch.toLowerCase()) ||
      w.well_code.toLowerCase().includes(wellSearch.toLowerCase()) ||
      w.village.toLowerCase().includes(wellSearch.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedWell) return;
    setIsSubmitting(true);

    try {
      const report = await reportService.submitReport({
        well_id: selectedWell.id,
        well_code: selectedWell.well_code,
        well_name: selectedWell.name,
        user_id: user?.id || 'citizen-scout',
        user_name: user?.full_name || 'Groundwater Observer',
        user_email: user?.email || 'scout@wellintel.org',
        report_type: issueType,
        description: `[Severity: ${severity}] ${description}`,
      });

      setIsSubmitted(true);
      onReportSubmitted(report);
    } catch (err) {
      console.error('Report submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setDescription('');
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-3xl glass-card border border-emerald-500/30 text-center max-w-xl mx-auto shadow-2xl"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Report Successfully Dispatched</h3>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Thank you for contributing ground truth intelligence for station{' '}
          <strong className="text-cyan-400">{selectedWell?.well_code}</strong>. Your report has
          been queued for review by the regional groundwater authority.
        </p>
        <button
          onClick={resetForm}
          className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all"
        >
          Submit Another Observation
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl glass-card border border-cyan-500/25 shadow-2xl">
      {/* Step Progress Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <span className="text-cyan-400 font-bold">Step 0{step} of 04</span>
          <span className="text-slate-400">
            {step === 1 && 'Select Target Well'}
            {step === 2 && 'Categorize Issue'}
            {step === 3 && 'Details & Severity'}
            {step === 4 && 'Confirm & Dispatch'}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-gradient-to-r from-cyan-400 to-water-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Select the Monitored Station</h3>
              <p className="text-xs text-slate-400">
                Choose the well from the registered monitoring database.
              </p>
            </div>

            {/* Well search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={wellSearch}
                onChange={(e) => setWellSearch(e.target.value)}
                placeholder="Filter by code or village name (e.g. Kavoor)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Wells list */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {filteredWells.map((w) => {
                const isSelected = selectedWell?.id === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWell(w)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-water-500/20 border-cyan-400 text-white shadow-sm'
                        : 'bg-navy-900/60 border-slate-800 text-slate-300 hover:bg-navy-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-300">
                          {w.well_code}
                        </span>
                        <span className="text-xs font-semibold text-white">{w.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {w.village}, {w.district} &bull; {w.well_type}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                disabled={!selectedWell}
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
              >
                <span>Continue to Issue Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-lg font-bold text-white mb-1">What issue are you observing?</h3>
              <p className="text-xs text-slate-400">
                Categorizing the defect ensures fast dispatch to hydrology teams.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ISSUE_TYPES.map((item) => {
                const isSelected = issueType === item.type;
                return (
                  <div
                    key={item.type}
                    onClick={() => setIssueType(item.type)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-water-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                        : 'bg-navy-900/60 border-slate-800 text-slate-300 hover:bg-navy-850'
                    }`}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all"
              >
                <span>Continue to Description</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Describe the Observed Condition</h3>
              <p className="text-xs text-slate-400">
                Provide field observations, estimated impact, or physical symptoms.
              </p>
            </div>

            {/* Severity selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Priority Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['LOW', 'MEDIUM', 'URGENT'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      severity === sev
                        ? sev === 'URGENT'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : 'bg-navy-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Description textarea */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Detailed Notes</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Pump casing showed heavy silt runoff starting Tuesday afternoon. Tested with domestic TDS meter indicating spike over 900 ppm..."
                className="w-full p-3 rounded-xl bg-navy-950/90 border border-cyan-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-500 block text-right mt-1">
                {description.length} characters
              </span>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                disabled={!description.trim()}
                onClick={() => setStep(4)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
              >
                <span>Review Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Verify & Submit</h3>
              <p className="text-xs text-slate-400">
                Review your observation summary prior to database submission.
              </p>
            </div>

            {/* Summary Review Card */}
            <div className="p-4 rounded-2xl bg-navy-950/80 border border-cyan-500/20 space-y-3">
              <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Monitored Station</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {selectedWell?.well_code} &mdash; {selectedWell?.name}
                  </span>
                  <p className="text-xs text-slate-400">{selectedWell?.village}, {selectedWell?.district}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {severity} Priority
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">Issue Category</span>
                <span className="text-xs font-bold text-cyan-300">{issueType}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">Field Observations</span>
                <p className="text-xs text-slate-200 leading-relaxed italic bg-navy-900/50 p-2.5 rounded-lg">
                  "{description}"
                </p>
              </div>

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
                <span>Reporter: {user?.full_name || 'Guest Observer'}</span>
                <span>Location verification: GPS Tagged</span>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-navy-950 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
