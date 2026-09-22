import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Droplets,
  Activity,
  Layers,
  ArrowRight,
  FileText,
  Radio,
} from 'lucide-react';
import { ParticleCanvas } from '../components/animations/ParticleCanvas';
import { WaveContainer } from '../components/animations/WaveContainer';
import { CountUp } from '../components/animations/CountUp';
import { WellCard } from '../components/wells/WellCard';
import { DEMO_WELLS } from '../data/sampleWells';

export const Home: React.FC = () => {
  // Grab 3 nearby wells for the preview
  const previewWells = DEMO_WELLS.slice(0, 3).map((w, idx) => ({
    ...w,
    distance: idx === 0 ? 0.8 : idx === 1 ? 1.2 : 2.4,
  }));

  const [broadcast, setBroadcast] = React.useState<any>(() => {
    try {
      const saved = localStorage.getItem('wellintel_website_content');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  return (
    <div className="relative min-h-screen bg-navy-950 text-slate-100 overflow-hidden">
      {/* ========================================================================= */}
      {/* ADMIN CONTROLLED BROADCAST ADVISORY BANNER */}
      {/* ========================================================================= */}
      {broadcast?.broadcastEnabled && (
        <div
          className={`pt-18 pb-2 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2 border-b z-30 relative transition-all ${
            broadcast.broadcastType === 'alert'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/40'
              : broadcast.broadcastType === 'warning'
              ? 'bg-amber-950/90 text-amber-200 border-amber-500/40'
              : 'bg-cyan-950/90 text-cyan-200 border-cyan-500/40'
          }`}
        >
          <Radio className="w-3.5 h-3.5 animate-pulse shrink-0 text-rose-400" />
          <span>{broadcast.broadcastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1 & 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden bg-hero-gradient">
        {/* Subtle Ambient Particle Luminescence */}
        <ParticleCanvas count={55} />

        {/* Background radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Glowing Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/80 border border-cyan-400/40 shadow-[0_0_15px_rgba(56,189,248,0.25)] text-xs font-mono font-semibold tracking-wider text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>SMART GROUNDWATER INTELLIGENCE</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Discover the Water <br />
                <span className="text-gradient-water">Beneath You.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Explore <span className="text-cyan-300 font-semibold">Nearby Wells</span>, understand
                sub-surface groundwater information, and turn location data into meaningful
                environmental intelligence.
              </p>

              {/* Magnetic Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/explore"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-water-500 via-cyan-400 to-teal-400 text-navy-950 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 group"
                >
                  <Compass className="w-4 h-4 text-navy-950 group-hover:rotate-45 transition-transform" />
                  <span>EXPLORE NEARBY WELLS</span>
                </Link>

                <Link
                  to="/map"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-navy-900/90 text-slate-200 hover:text-white border border-cyan-500/30 hover:border-cyan-400/60 shadow-lg hover:shadow-cyan-500/10 transition-all transform hover:-translate-y-0.5 group"
                >
                  <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>VIEW LIVE MAP</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Live Status Indicators */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>PostGIS Geolocation Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Realtime Hydrostatic Telemetry</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Section 5 Interactive Hero Map Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="lg:col-span-5 relative"
            >
              {/* Decorative Frame */}
              <div className="relative mx-auto max-w-md rounded-3xl p-1 bg-gradient-to-tr from-cyan-500/30 via-water-500/20 to-transparent shadow-2xl">
                <div className="relative rounded-[22px] bg-navy-900/90 border border-cyan-500/20 p-5 overflow-hidden backdrop-blur-xl">
                  {/* Radar grid lines */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12)_0%,transparent_70%)] pointer-events-none" />
                  <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#38BDF8_1px,transparent_1px),linear-gradient(to_bottom,#38BDF8_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

                  {/* Header bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 relative z-10 mb-4">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-white tracking-wider">
                        KA-MNG RADAR SECTOR
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      LIVE
                    </span>
                  </div>

                  {/* Visual Map Simulation Area */}
                  <div className="relative h-56 rounded-2xl bg-navy-950/90 border border-slate-800 flex items-center justify-center overflow-hidden mb-4">
                    {/* User Location Radar Center */}
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-28 h-28 rounded-full border border-cyan-400/25 animate-ripple" />
                      <div className="absolute w-44 h-44 rounded-full border border-teal-400/15 animate-ripple [animation-delay:1s]" />
                      <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_15px_#38BDF8] flex items-center justify-center z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-navy-950" />
                      </div>
                      <span className="absolute top-6 text-[9px] font-mono text-cyan-300 font-bold tracking-wider">
                        YOUR POSITION
                      </span>
                    </div>

                    {/* Surrounding Well Pins (Pulsing) */}
                    <div className="absolute top-8 left-10 flex flex-col items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-teal-400 animate-ping absolute" />
                      <div className="w-3.5 h-3.5 rounded-full bg-teal-500 border border-cyan-300 z-10" />
                      <span className="text-[8px] font-mono text-teal-300 mt-1">W-1042</span>
                    </div>

                    <div className="absolute bottom-10 left-16 flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-teal-500 border border-cyan-300 z-10" />
                      <span className="text-[8px] font-mono text-teal-300 mt-1">W-1044</span>
                    </div>

                    <div className="absolute top-12 right-12 flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping absolute" />
                      <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-300 z-10" />
                      <span className="text-[8px] font-mono text-rose-300 mt-1">W-1045</span>
                    </div>

                    <div className="absolute bottom-12 right-16 flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-teal-500 border border-cyan-300 z-10" />
                      <span className="text-[8px] font-mono text-teal-300 mt-1">W-1043</span>
                    </div>
                  </div>

                  {/* Section 5 Animated Floating Data Card: W-1042 */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="p-3.5 rounded-xl bg-navy-950/95 border border-cyan-400/40 shadow-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          NEARBY WELL
                        </span>
                        <span className="text-xs font-mono font-black text-cyan-300">W-1042</span>
                        <span className="text-[10px] font-mono font-bold text-teal-400 px-1.5 py-0.2 rounded bg-teal-500/20">
                          ACTIVE
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <span>1.2 km away</span>
                        <span>&bull;</span>
                        <span>
                          Water Level: <strong className="text-white font-mono">18.4 m</strong>
                        </span>
                      </div>
                    </div>
                    <Link
                      to="/wells/well-1042"
                      className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors"
                      title="Inspect station"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section bottom wavy transition */}
        <WaveContainer
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          fillColor="#06131F"
        />
      </section>

      {/* ========================================================================= */}
      {/* 3. LIVE STATISTICS SECTION */}
      {/* ========================================================================= */}
      <section className="relative py-20 bg-navy-900 border-b border-cyan-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1: Total Wells */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl glass-card border border-cyan-500/20 shadow-lg relative overflow-hidden group hover:border-cyan-400/40 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mb-1">
                <CountUp end={1248} />
              </div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                TOTAL WELLS
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Total wells monitored</span>
                <span className="text-teal-400 font-mono font-semibold">+8.4%</span>
              </div>
            </motion.div>

            {/* Stat 2: Active Wells */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl glass-card border border-teal-500/20 shadow-lg relative overflow-hidden group hover:border-teal-400/40 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-400 mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mb-1">
                <CountUp end={1086} />
              </div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                ACTIVE WELLS
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Operational telemetry</span>
                <span className="text-teal-400 font-mono font-semibold">87% ratio</span>
              </div>
            </motion.div>

            {/* Stat 3: Nearby Wells */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl glass-card border border-water-500/20 shadow-lg relative overflow-hidden group hover:border-water-400/40 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-water-500/15 flex items-center justify-center text-cyan-300 mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mb-1">
                <CountUp end={24} />
              </div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                NEARBY WELLS
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Within 5 km radius</span>
                <span className="text-cyan-400 font-mono font-semibold">Live GPS</span>
              </div>
            </motion.div>

            {/* Stat 4: Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-2xl glass-card border border-amber-500/20 shadow-lg relative overflow-hidden group hover:border-amber-400/40 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mb-1">
                <CountUp end={37} />
              </div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                REPORTS
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Community verifications</span>
                <span className="text-amber-300 font-mono font-semibold">Active</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY THIS MATTERS (Section 40) */}
      {/* ========================================================================= */}
      <section className="py-24 relative bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 block mb-2">
              Impact & Purpose
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Groundwater Intelligence Matters
            </h2>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Over 85% of rural drinking supplies and 60% of irrigated agriculture depend upon
              invisible subterranean aquifers. WellIntel brings visibility to what lies beneath.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: DISCOVER */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-3xl glass-card border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-400/50 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase block mb-1">
                01 &mdash; DISCOVER
              </span>
              <h3 className="text-xl font-bold text-white mb-3">Find wells around you.</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Use your real-time GPS coordinate to locate public borewells, open dug wells, and
                monitoring piezometers within custom radial boundaries.
              </p>
            </motion.div>

            {/* Card 2: UNDERSTAND */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="p-8 rounded-3xl glass-card border border-teal-500/20 relative overflow-hidden group hover:border-teal-400/50 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-400 flex items-center justify-center mb-6">
                <Droplets className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-teal-400 tracking-wider uppercase block mb-1">
                02 &mdash; UNDERSTAND
              </span>
              <h3 className="text-xl font-bold text-white mb-3">
                Explore available well information.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inspect casing depth, current hydrostatic water levels, water quality indicators,
                and sustainable extraction yields verified against geological models.
              </p>
            </motion.div>

            {/* Card 3: MONITOR */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-8 rounded-3xl glass-card border border-water-500/20 relative overflow-hidden group hover:border-water-400/50 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-water-500/15 text-cyan-300 flex items-center justify-center mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider uppercase block mb-1">
                03 &mdash; MONITOR
              </span>
              <h3 className="text-xl font-bold text-white mb-3">
                Track changes & community reports.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Follow multi-month seasonal depletion curves and report damaged wellheads, pump
                failures, or salinity ingress to help improve hydrological data accuracy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE MAP PREVIEW TEASER */}
      {/* ========================================================================= */}
      <section className="py-20 bg-navy-900 border-y border-cyan-500/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl glass-card border border-cyan-500/30 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 inline-block">
                  Dedicated GIS Workspace
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  High-Precision Environmental GIS Mapping
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Our dedicated full-screen GIS map view combines CartoDB dark telemetry tiles,
                  dynamic radius calculations, pulsing operational markers, and an interactive slide-in
                  intelligence panel for every tapped well.
                </p>
                <div className="pt-2">
                  <Link
                    to="/map"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all"
                  >
                    <span>Launch Fullscreen Map Interface</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="p-4 rounded-2xl bg-navy-950/80 border border-cyan-500/25 text-center space-y-3 shadow-xl">
                  <div className="h-44 rounded-xl bg-navy-900 flex items-center justify-center relative overflow-hidden border border-slate-800">
                    <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
                    <div className="text-center z-10 space-y-1">
                      <Radio className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
                      <div className="text-xs font-mono font-bold text-white">
                        LIVE KARNATAKA GRID ACTIVE
                      </div>
                      <div className="text-[10px] text-cyan-300">
                        Mangalore &bull; Udupi &bull; Bangalore &bull; Mysore
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-mono px-2">
                    <span>Cluster Radius: 30 km</span>
                    <span className="text-teal-400 font-bold">75+ Calibrated Nodes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. NEARBY WELLS PREVIEW */}
      {/* ========================================================================= */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 block mb-1">
                Featured Locations
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight">
                Nearby Wells Around You
              </h2>
            </div>
            <Link
              to="/explore"
              className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>View All Wells In Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewWells.map((well) => (
              <WellCard key={well.id} well={well} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. HOW IT WORKS (Section 41) */}
      {/* ========================================================================= */}
      <section className="py-24 bg-navy-900 border-t border-cyan-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 block mb-2">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How WellIntel Works
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Three seamless steps from location permission to comprehensive groundwater telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl glass-card border border-cyan-500/20 relative">
              <span className="text-3xl font-black font-mono text-cyan-400/40 block mb-4">
                01
              </span>
              <h3 className="text-lg font-bold text-white mb-2">ALLOW LOCATION</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Authorize high-accuracy browser geolocation to pinpoint your exact coordinates
                against the regional spatial coordinate index.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl glass-card border border-teal-500/20 relative">
              <span className="text-3xl font-black font-mono text-teal-400/40 block mb-4">
                02
              </span>
              <h3 className="text-lg font-bold text-white mb-2">EXPLORE</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Discover nearby wells sorted by proximity, filter by well type or water quality,
                and inspect live status indicators on the interactive radar map.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl glass-card border border-water-500/20 relative">
              <span className="text-3xl font-black font-mono text-water-400/40 block mb-4">
                03
              </span>
              <h3 className="text-lg font-bold text-white mb-2">UNDERSTAND</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Explore animated vertical borehole water level visualizers, 12-month depletion
                charts, and rule-based environmental risk intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="py-24 bg-gradient-to-b from-navy-900 to-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-radial pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 inline-block">
            READY FOR EXPLORATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Start Discovering the Groundwater Intelligence Around You
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Gain immediate visibility into subterranean water resources. Built with modern GIS,
            Framer Motion animations, Supabase PostgreSQL, and live telemetry visualizations.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/explore"
              className="px-8 py-3.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-xl shadow-cyan-500/30 transition-all"
            >
              FIND WELLS NEAR ME
            </Link>
            <Link
              to="/analytics"
              className="px-8 py-3.5 rounded-2xl text-xs font-bold bg-navy-900 text-slate-200 hover:text-white border border-cyan-500/30 hover:border-cyan-400 transition-all"
            >
              VIEW GROUNDWATER ANALYTICS
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. FOOTER (Section 42) */}
      {/* ========================================================================= */}
      <footer className="py-12 bg-navy-950 border-t border-cyan-500/15 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-lg font-black tracking-wider text-white">
                WELL<span className="text-cyan-400">INTEL</span>
              </span>
              <p className="text-[11px] text-slate-400 max-w-sm text-center md:text-left">
                Smart intelligence for a better understanding of groundwater resources.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-xs font-medium">
              <Link to="/explore" className="hover:text-cyan-400 transition-colors">
                Explore
              </Link>
              <Link to="/map" className="hover:text-cyan-400 transition-colors">
                Live Map
              </Link>
              <Link to="/analytics" className="hover:text-cyan-400 transition-colors">
                Analytics
              </Link>
              <Link to="/reports" className="hover:text-cyan-400 transition-colors">
                Community Reports
              </Link>
              <Link to="/login" className="hover:text-cyan-400 transition-colors">
                Observer Login
              </Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
            <span>&copy; 2026 WellIntel Environmental Intelligence Platform. All rights reserved.</span>
            <span>Demonstration Data &bull; Karnataka CGWB Calibration</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
