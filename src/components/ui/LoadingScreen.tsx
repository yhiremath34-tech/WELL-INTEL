import React from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen: React.FC<{ message?: string }> = ({
  message = 'Synchronizing groundwater telemetry...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-950 text-white select-none">
      {/* Expanding Ripple Rings */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-32 h-32 rounded-full border border-cyan-400/20 animate-ripple" />
        <div className="absolute w-44 h-44 rounded-full border border-teal-400/20 animate-ripple [animation-delay:0.7s]" />
        <div className="absolute w-56 h-56 rounded-full border border-water-500/20 animate-ripple [animation-delay:1.4s]" />

        {/* Center glowing badge */}
        <motion.div
          className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 via-water-500 to-navy-800 p-0.5 shadow-[0_0_40px_rgba(56,189,248,0.4)] flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
            <svg
              className="w-10 h-10 text-cyan-400 animate-pulse-subtle"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
              <path d="M12 12v4" />
              <path d="M10 14h4" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Brand title */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-water-400">
          WELLINTEL
        </h1>
        <p className="mt-2 text-xs font-mono tracking-wider text-cyan-300/70 uppercase">
          {message}
        </p>
      </motion.div>
    </div>
  );
};
