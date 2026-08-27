import React from 'react';
import { useAppContext } from '../context/AppContext';
import HeroVisual3D from './3d/HeroVisual3D';
import { motion } from 'motion/react';
import { Search, Calendar, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

const Hero = () => {
  const { navigate, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/cars');
  };

  return (
    <section className="relative pt-8 pb-16 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden">
      {/* Background Soft Maroon & Slate Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-100/50 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-zinc-200/50 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Hero Copywriting with Maroon and Black Palette */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 flex flex-col gap-6"
        >
          {/* Top Telemetry Chip */}
          <div className="inline-flex items-center gap-2 self-start bg-rose-50/90 border border-rose-200/80 px-4 py-1.5 rounded-full text-xs font-mono text-[#800020] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#800020] fill-[#800020]" />
            <span className="font-bold tracking-wide">LUXURY MOBILITY // INSTANT DISPATCH</span>
          </div>

          {/* Main Title: Black & Deep Maroon */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-black">
            Drive The <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#800020] via-[#991B1B] to-black">
              Future of Luxury
            </span>
          </h1>

          <p className="text-sm md:text-base text-zinc-700 leading-relaxed font-normal">
            Experience an elite fleet of exotic supercars and executive vehicles with seamless white-glove delivery, zero security deposit, and transparent daily rates.
          </p>

          {/* Search & Reservation Glass Card */}
          <form
            onSubmit={handleSearch}
            className="p-5 rounded-3xl bg-white/80 backdrop-blur-2xl border border-zinc-200/90 shadow-xl flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Pickup Date */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-black font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Pickup Date</span>
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="glass-input px-3.5 py-2.5 rounded-2xl text-xs outline-none w-full font-medium"
                />
              </div>

              {/* Return Date */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-black font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Return Date</span>
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="glass-input px-3.5 py-2.5 rounded-2xl text-xs outline-none w-full font-medium"
                />
              </div>
            </div>

            {/* Action Button: Black with Maroon Accent */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-black text-white font-bold text-xs tracking-wider uppercase hover:bg-[#800020] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>SEARCH AVAILABLE SUPERCAR FLEET</span>
            </button>
          </form>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-1 text-center">
            <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-zinc-200/90 shadow-sm">
              <p className="text-xl font-black text-black font-mono">12+</p>
              <p className="text-[11px] text-zinc-600 font-medium mt-0.5">Exotics in Fleet</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-zinc-200/90 shadow-sm">
              <p className="text-xl font-black text-[#800020] font-mono">100%</p>
              <p className="text-[11px] text-zinc-600 font-medium mt-0.5">Verified Fleet</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-zinc-200/90 shadow-sm">
              <p className="text-xl font-black text-black font-mono">4.98 ★</p>
              <p className="text-[11px] text-zinc-600 font-medium mt-0.5">VIP Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Three.js Interactive Kinetic Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-6 w-full h-[460px] lg:h-[540px]"
        >
          <HeroVisual3D />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
