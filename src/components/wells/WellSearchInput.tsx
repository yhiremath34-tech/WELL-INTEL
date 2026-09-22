import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Droplet, CheckCircle, ArrowUpRight } from 'lucide-react';

interface WellSearchInputProps {
  value: string;
  onChange: (query: string) => void;
  onSelectSuggestion?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const QUICK_SUGGESTIONS = [
  { label: 'W-1042', desc: 'Kavoor Community Borewell', type: 'code' },
  { label: 'Kavoor', desc: 'Mangalore sub-district cluster', type: 'location' },
  { label: 'Mangalore', desc: 'Coastal aquifer observation zone', type: 'district' },
  { label: 'Udupi', desc: 'Temples & coastal buffer wells', type: 'location' },
  { label: 'Bangalore', desc: 'High extraction urban network', type: 'location' },
  { label: 'Active Wells', desc: 'Show currently operational stations', type: 'filter' },
];

export const WellSearchInput: React.FC<WellSearchInputProps> = ({
  value,
  onChange,
  onSelectSuggestion,
  placeholder = 'Search wells, villages, districts...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter suggestions based on input
  const filteredSuggestions = QUICK_SUGGESTIONS.filter((s) =>
    s.label.toLowerCase().includes(value.toLowerCase()) ||
    s.desc.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-cyan-400 pointer-events-none transition-transform group-focus-within:scale-110" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-900/90 border border-cyan-500/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs sm:text-sm text-white placeholder-slate-400 outline-none transition-all shadow-inner"
        />
        {value && (
          <button
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Animated Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 z-30 rounded-xl bg-navy-950/95 border border-cyan-500/25 shadow-2xl p-2 backdrop-blur-xl"
          >
            <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-cyan-300/80 font-bold border-b border-slate-800/80 mb-1">
              Suggested Queries
            </div>

            <div className="space-y-1">
              {filteredSuggestions.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.type === 'filter') {
                      onChange('');
                      if (onSelectSuggestion) onSelectSuggestion('ACTIVE');
                    } else {
                      onChange(item.label);
                      if (onSelectSuggestion) onSelectSuggestion(item.label);
                    }
                    setIsOpen(false);
                  }}
                  className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-water-500/15 text-xs text-slate-200 hover:text-cyan-300 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    {item.type === 'code' && <Droplet className="w-3.5 h-3.5 text-cyan-400" />}
                    {item.type === 'location' && <MapPin className="w-3.5 h-3.5 text-water-400" />}
                    {item.type === 'district' && <MapPin className="w-3.5 h-3.5 text-teal-400" />}
                    {item.type === 'filter' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    <div>
                      <span className="font-semibold text-white group-hover:text-cyan-300 mr-2">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}

              {filteredSuggestions.length === 0 && (
                <div className="p-3 text-center text-xs text-slate-400">
                  Press enter to search for "{value}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
