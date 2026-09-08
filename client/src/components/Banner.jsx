import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Percent } from 'lucide-react';

const Banner = () => {
  return (
    <section id="offers" className="py-24 bg-[#F3F1EC] border-b border-[#D8D5CF] overflow-hidden">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        <div className="border border-[#111111] bg-[#111111] text-[#F3F1EC] p-8 sm:p-14 lg:p-20 relative overflow-hidden">
          
          {/* Subtle Accent Glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#651F2A]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#651F2A]" />
                <span className="text-xs font-mono tracking-widest text-white/60 uppercase">
                  06 / CURATED PRIVILEGE
                </span>
              </div>

              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-editorial font-bold tracking-tight uppercase leading-[0.96] text-white">
                LONG WEEKEND.<br />
                <span className="text-white/60">SAVE UP TO 20%</span><br />
                ON SELECTED FLEET.
              </h2>

              <p className="text-sm font-body text-white/70 max-w-lg mt-6 leading-relaxed">
                Unlock preferential multi-day tariffs on Ferrari, Porsche, and Range Rover allocations. Complimentary chauffeur delivery to airport terminals and private addresses included.
              </p>

              <div className="flex flex-wrap items-center gap-6 mt-10">
                <Link
                  to="/cars"
                  data-cursor="book"
                  data-cursor-text="SAVE"
                  className="px-8 py-4 bg-[#651F2A] hover:bg-white hover:text-[#111111] text-white text-xs font-mono tracking-widest uppercase font-bold flex items-center gap-3 transition-all duration-300 shadow-md"
                >
                  <span>CLAIM PRIVILEGE RATE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
                  USE CODE: <span className="text-white font-bold underline">WEEKEND20</span> AT CHECKOUT
                </div>
              </div>
            </div>

            {/* Right Artwork */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
                  alt="Porsche 911 Performance"
                  className="w-full h-auto object-contain filter drop-shadow-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-xs border border-white/20 px-3 py-1.5 text-[9px] font-mono tracking-widest text-white uppercase">
                  RATE GUARANTEE: COMPREHENSIVE ZERO-DEDUCTIBLE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;