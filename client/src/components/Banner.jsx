import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Car, ShieldCheck, Clock, Award, ChevronRight } from 'lucide-react';

const Banner = () => {
  const { navigate, isOwner, setIsOwner, axios, user, setShowLogin } = useAppContext();

  const handleHostClick = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (isOwner) {
      navigate('/owner');
    } else {
      try {
        const { data } = await axios.post('/api/owner/change-role');
        setIsOwner(true);
        navigate('/owner');
      } catch (err) {
        setIsOwner(true);
        navigate('/owner');
      }
    }
  };

  return (
    <section className="py-16 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-black via-zinc-950 to-[#5C0017] text-white p-8 md:p-14 shadow-2xl border border-zinc-800">
        {/* Ambient Subtle Glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#800020]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-zinc-800/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <span className="inline-flex items-center gap-1.5 self-start bg-white/10 border border-white/20 px-3.5 py-1 rounded-full text-xs font-mono text-rose-200">
              <Award className="w-3.5 h-3.5 text-rose-400" />
              <span>EARN WITH VELOCITY FLEET</span>
            </span>

            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Turn Your Supercar Into A High-Yield Luxury Asset
            </h2>

            <p className="text-zinc-300 text-sm md:text-base max-w-2xl font-normal">
              List your exotic vehicle on VELOCITY. Comprehensive ₹2 Cr insurance coverage, verified executive renters, and automated daily payouts.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>₹2 Cr Insurance Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-300 shrink-0" />
                <span>Live Owner Telemetry</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-white shrink-0" />
                <span>Zero Listing Fees</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <button
              onClick={handleHostClick}
              className="px-8 py-4 rounded-2xl bg-white text-black font-black text-xs tracking-wider uppercase hover:bg-rose-50 transition-all shadow-xl flex items-center gap-2 cursor-pointer group"
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
