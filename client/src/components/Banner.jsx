import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Percent } from 'lucide-react';

const Banner = () => {
  return (
    <section id="offers" className="py-24 bg-[#0B0B0B] border-b border-white/14 overflow-hidden select-none">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        <div className="border border-white/14 bg-[#141414] text-[#F4F2ED] p-8 sm:p-14 lg:p-20 relative overflow-hidden">
          
          {/* Subtle Warm Automotive Ambient Aura */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                <span className="text-xs font-mono tracking-widest text-[#C5A880] uppercase font-bold">
                  PRIVILEGE OFFERS // 2026
                </span>
              </div>

              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight uppercase leading-[0.96] text-[#F4F2ED]">
                LONG WEEKEND.<br />
                <span className="text-[#9B9B9B]">SAVE UP TO 20%</span><br />
                ON SELECTED FLEET.
              </h2>

              <p className="text-sm font-body text-[#9B9B9B] max-w-lg mt-6 leading-relaxed">
                Unlock preferential multi-day allocations on Ferrari, Porsche, and Range Rover models. Complimentary curbside delivery to airport terminals and private residences included.
              </p>

              <div className="flex flex-wrap items-center gap-6 mt-10">
                <Link
                  to="/cars"
                  data-cursor="book"
                  data-cursor-text="SAVE"
                  className="btn-club-primary py-3.5 px-7 text-xs font-bold"
                >
                  <span>CLAIM PRIVILEGE TARIFF</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-[11px] font-mono tracking-widest text-[#9B9B9B] uppercase">
                  PROMO CODE: <span className="text-[#C5A880] font-bold underline">WEEKEND20</span> AT CHECKOUT
                </div>
              </div>
            </div>

            {/* Right Artwork */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
                  alt="Automotive Club Specimen"
                  className="w-full h-auto object-contain filter drop-shadow-2xl brightness-[0.8] contrast-[1.1] hover:brightness-[0.95] transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;