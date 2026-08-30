import React from 'react';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Alexander Wright',
    role: 'Tech Founder // Zurich',
    comment: 'The fleet dispatch preview was sensational. Delivered a flawless Porsche 911 GT3 RS directly to my private hangar in under 25 minutes with digital key access.',
    rating: 5,
  },
  {
    name: 'Elena Rostova',
    role: 'Managing Partner // Geneva',
    comment: 'TERACAR is in a league of its own. Zero friction, impeccable vehicle preparation, and white-glove concierge dispatch that exceeds five-star hotel standards.',
    rating: 5,
  },
  {
    name: 'Marcus Sterling',
    role: 'Collector & Pilot // London',
    comment: 'Detailed vehicle telemetry and specs gave me complete confidence before booking. The Ferrari performed with perfection on our weekend Alpine pass run.',
    rating: 5,
  },
];

const Testimonial = () => {
  return (
    <section className="py-12 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col mb-8 border-b border-[#E2E8F0] pb-4">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B]">
          JOURNALS // CLIENT EXPERIENCES
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold uppercase text-[#090D16] font-editorial tracking-tight mt-1">
          Endorsements
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((r, i) => (
          <div 
            key={i} 
            className="p-6 bg-white border border-[#E2E8F0] rounded-lg flex flex-col justify-between gap-4 shadow-xs"
          >
            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
              "{r.comment}"
            </p>
            
            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#090D16] uppercase tracking-wide">{r.name}</p>
                <p className="text-[9px] font-mono text-[#64748B] uppercase">{r.role}</p>
              </div>

              <div className="flex items-center gap-0.5">
                {[...Array(r.rating)].map((_, idx) => (
                  <Star key={idx} className="w-3 h-3 fill-[#090D16] text-[#090D16]" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </section>
  );
};

export default Testimonial;