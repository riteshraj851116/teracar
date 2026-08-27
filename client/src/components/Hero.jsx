import React from 'react';
import { useAppContext } from '../context/AppContext';
import Hero3DCanvas from './3d/Hero3DCanvas';
import { motion } from 'motion/react';
import { Search, Calendar, MapPin, ShieldCheck, Zap, Star } from 'lucide-react';

const Hero = () => {
  const { navigate, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/cars');
  };

  return (
    <section className="relative pt-6 pb-16 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Hero Content & Search Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 flex flex-col gap-6"
        >
          {/* Top Telemetry Chip */}
          <div className="inline-flex items-center gap-2 self-start bg-slate-900/80 border border-cyan-500/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-500/10">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>INSTANT DISPATCH // 3D REALTIME PREVIEW</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Drive The <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 neon-text-cyan">
              Future of Luxury
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
            Experience next-generation supercar & luxury rentals with interactive 3D studio inspection, zero hassle booking, and instant white-glove delivery.
          </p>

          {/* Search / Booking Glass Bar */}
          <form
            onSubmit={handleSearch}
            className="p-4 rounded-2xl glass-card border border-cyan-500/20 shadow-2xl flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Pickup Date Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Pickup Date</span>
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="glass-input px-3.5 py-2 rounded-xl text-xs outline-none w-full"
                />
              </div>

              {/* Return Date Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Return Date</span>
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="glass-input px-3.5 py-2 rounded-xl text-xs outline-none w-full"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-600 text-slate-950 font-bold text-sm tracking-wide hover:brightness-110 transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>SEARCH AVAILABLE VEHICLES</span>
            </button>
          </form>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
              <p className="text-xl font-bold text-cyan-400 font-mono">500+</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Supercars & Luxury</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
              <p className="text-xl font-bold text-purple-400 font-mono">100%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Verified Fleet</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
              <p className="text-xl font-bold text-amber-400 font-mono">4.95 ★</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Customer Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Three.js 3D Studio Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-6 w-full h-[420px] lg:h-[500px]"
        >
          <Hero3DCanvas />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
