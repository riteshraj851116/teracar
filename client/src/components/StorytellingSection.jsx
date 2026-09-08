import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Award, Compass, Headset, ArrowRight } from 'lucide-react';

const PILLARS = [
  {
    number: '01',
    title: 'PREMIUM VEHICLES',
    desc: 'Each specimen in our registry is maintained to factory concours standards. Low mileage, immaculate interiors, and high-performance provenance.',
    icon: Award,
  },
  {
    number: '02',
    title: 'FLEXIBLE RENTALS',
    desc: 'Daily, weekend, and extended continental leases with transparent daily allocations and zero restrictive corporate lease contracts.',
    icon: Clock,
  },
  {
    number: '03',
    title: 'PROFESSIONAL SUPPORT',
    desc: 'Dedicated 24/7 concierge liaison and roadside technical support team assigned to your journey from ignition to return.',
    icon: Headset,
  },
  {
    number: '04',
    title: 'EASY PICKUP',
    desc: 'Curbside handover at private FBO airport terminals, five-star residences, or our private metropolitan club showrooms.',
    icon: Compass,
  },
  {
    number: '05',
    title: 'RELIABLE SERVICE',
    desc: 'Zero waiting queues, verified electronic handovers, full fuel reserves, and zero-liability comprehensive insurance protection.',
    icon: ShieldCheck,
  },
];

const StorytellingSection = () => {
  return (
    <section id="experience" className="py-28 bg-[#0B0B0B] text-[#F4F2ED] relative overflow-hidden border-b border-white/14 select-none">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
          <span className="text-xs font-mono tracking-widest text-[#C5A880] uppercase font-bold">
            03 // EXPERIENCE
          </span>
        </div>

        {/* 25 — Large Headline: THE CAR IS ONLY THE BEGINNING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/14 items-end">
          <div className="lg:col-span-8">
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-tight uppercase leading-[0.94] text-[#F4F2ED]">
              THE CAR<br />
              IS ONLY<br />
              <span className="text-[#C5A880]">THE BEGINNING.</span>
            </h2>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <p className="text-sm sm:text-base font-body text-[#9B9B9B] leading-relaxed">
              We approach automotive mobility as a high-discipline hospitality craft. Behind every ignition key is a frictionless ecosystem engineered around your time, privacy, and driving pleasure.
            </p>
            <div className="pt-2">
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#F4F2ED] hover:text-[#C5A880] transition-colors"
              >
                <span>EXPLORE MEMBERSHIP FLEET</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Large Visual + 5 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16 items-center">
          
          {/* Large Cinematic Automotive Image */}
          <div className="lg:col-span-5 relative aspect-4/5 overflow-hidden bg-[#141414] border border-white/14">
            <img
              src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop"
              alt="Automotive Club Experience"
              className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0B0B0B] via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#141414]/90 backdrop-blur-md border border-white/14">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] block mb-1">
                STANDARDS // 2026
              </span>
              <p className="text-xs font-mono text-[#F4F2ED] uppercase font-bold">
                100% FACTORY SPECIFICATION INSPECTED
              </p>
            </div>
          </div>

          {/* 5 Pillars List */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-white/10">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.number}
                  className="py-6 sm:py-7 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 group transition-colors hover:bg-[#141414]/40 sm:px-4"
                >
                  <span className="text-xs font-mono text-[#6E6E6E] group-hover:text-[#C5A880] transition-colors">
                    {pillar.number}
                  </span>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#C5A880]" />
                      <h3 className="text-base sm:text-lg font-display font-bold uppercase tracking-wider text-[#F4F2ED]">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm font-body text-[#9B9B9B] leading-relaxed pt-1">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorytellingSection;
