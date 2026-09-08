import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Sparkles, Compass, Clock } from 'lucide-react';

const CHAPTERS = [
  {
    number: '01',
    word: 'DRIVE',
    title: 'THE PURSUIT OF MOTION',
    text: 'We curate machines that redefine mechanical engagement. Direct steering racks, twin-turbocharged powerbands, and active aerodynamics made accessible on your timeline.',
    metric: '630+ HP PEAK RATED',
  },
  {
    number: '02',
    word: 'DISCOVER',
    title: 'UNRESTRICTED HIGHWAYS',
    text: 'Every vehicle delivery is pre-mapped and GPS-synchronized. From early morning mountain passes to late-night cross-country journeys with comprehensive zero-liability coverage.',
    metric: 'UNLIMITED MILEAGE OPTIONS',
  },
  {
    number: '03',
    word: 'ESCAPE',
    title: 'THE CONCIERGE PROMISE',
    text: 'Tarmac-side handover at private aviation terminals or discreet white-glove arrival at your residence. Fully fueled, sanitized, and detailed to concours standards.',
    metric: '100% WHITE-GLOVE DISPATCH',
  },
  {
    number: '04',
    word: 'ARRIVE',
    title: 'TIMELESS DISTINCTION',
    text: 'Whether commanding the room in a long-wheelbase flagship or setting the pace in a mid-engine track weapon, arrive with unmistakable poise and precision.',
    metric: 'ALL-INCLUSIVE TRANSPARENT TARIFFS',
  },
];

const StorytellingSection = () => {
  return (
    <section className="py-28 bg-[#111111] text-[#F3F1EC] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        {/* Section Lead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16 border-b border-white/10">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#D8D5CF]/70 uppercase block mb-3">
              05 / CHRONICLE
            </span>
            <h2 className="text-4xl sm:text-7xl font-editorial font-bold tracking-tight uppercase text-white">
              THE JOURNEY<br />ARCHIVE.
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-xs font-mono uppercase tracking-widest text-white/60 leading-relaxed">
              Automotive rental elevated into high-end curated travel. Four pillars governing our entire fleet philosophy.
            </p>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 pt-10">
          {CHAPTERS.map((ch) => (
            <div
              key={ch.number}
              className="py-8 md:py-0 md:px-8 first:pl-0 last:pr-0 flex flex-col justify-between min-h-[360px] group"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-white/40 mb-6">
                  <span>SECTION {ch.number}</span>
                  <span className="group-hover:text-[#651F2A] transition-colors">↗</span>
                </div>

                {/* Oversized Typographic Word */}
                <h3 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-bold tracking-tighter uppercase text-white/20 group-hover:text-white transition-colors duration-500 mb-6">
                  {ch.word}
                </h3>

                <h4 className="text-sm font-editorial font-bold uppercase tracking-wider text-white mb-2">
                  {ch.title}
                </h4>

                <p className="text-xs font-body text-white/60 leading-relaxed">
                  {ch.text}
                </p>
              </div>

              <div className="pt-8 border-t border-white/10 mt-8">
                <span className="text-[10px] font-mono tracking-widest text-[#D8D5CF]/60 uppercase block">
                  {ch.metric}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Storytelling Bottom Callout */}
        <div className="mt-20 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#651F2A] animate-ping" />
            <span className="text-xs font-mono tracking-widest uppercase text-white/80">
              DISPATCH ACTIVE ACROSS 6 AIRPORTS TODAY
            </span>
          </div>

          <Link
            to="/cars"
            data-cursor="book"
            data-cursor-text="START"
            className="inline-flex items-center gap-3 px-6 py-3.5 bg-white hover:bg-[#651F2A] text-[#111111] hover:text-white text-xs font-mono tracking-widest uppercase font-bold transition-all shadow-md"
          >
            <span>RESERVE YOUR ALLOCATION</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StorytellingSection;
