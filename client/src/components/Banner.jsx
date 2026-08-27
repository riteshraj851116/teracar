import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { Car, ShieldCheck, Clock, Award, ChevronRight } from 'lucide-react';

const Banner = () => {
  const { navigate, isOwner, setIsOwner, axios } = useAppContext();

  const handleHostClick = async () => {
    if (isOwner) {
      navigate('/owner');
    } else {
      try {
        const { data } = await axios.post('/api/owner/change-role');
        if (data.success) {
          setIsOwner(true);
          navigate('/owner');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <section className="py-16 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden glass-card border border-purple-500/30 p-8 md:p-14 bg-gradient-to-r from-purple-950/60 via-slate-950 to-cyan-950/60 shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <span className="inline-flex items-center gap-1.5 self-start bg-purple-500/20 border border-purple-500/40 px-3 py-1 rounded-full text-xs font-mono text-purple-300">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>EARN WITH VELOCITY</span>
            </span>

            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Turn Your Luxury Vehicle Into A High-Yield Asset
            </h2>

            <p className="text-slate-300 text-sm md:text-base max-w-2xl">
              List your supercar or luxury vehicle on VELOCITY. Full insurance coverage, verified executive renters, and seamless automated payouts.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>$2M Comprehensive Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Instant Fleet Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated Payouts</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <button
              onClick={handleHostClick}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-black text-sm tracking-wide hover:brightness-110 transition-all shadow-xl shadow-purple-500/25 flex items-center gap-2 cursor-pointer group"
            >
              <span>LIST YOUR VEHICLE NOW</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
