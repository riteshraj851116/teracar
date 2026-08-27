import React from 'react';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Alexander Wright',
    role: 'Tech Executive',
    comment: 'The 3D studio preview was spot on. Delivered a flawless Porsche 911 GT3 RS directly to my private hangar in 20 minutes.',
    stars: 5,
  },
  {
    name: 'Elena Rostova',
    role: 'Venture Partner',
    comment: 'VELOCITY is in a league of its own. Zero paperwork, seamless digital key authentication, and immaculate supercars.',
    stars: 5,
  },
  {
    name: 'Marcus Sterling',
    role: 'Motorsport Enthusiast',
    comment: 'Interactive 3D vehicle inspection gave me full confidence before booking. The Ferrari F8 performed flawlessly on track.',
    stars: 5,
  },
];

const Testimonial = () => {
  return (
    <section className="py-16 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs font-mono font-bold tracking-widest text-cyan-600 uppercase">REVIEWS // EXECUTIVE FEEDBACK</span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-1">Trusted By Industry Leaders</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((r, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow">
            <Quote className="w-8 h-8 text-cyan-600/30" />
            <p className="text-slate-600 text-sm italic leading-relaxed">"{r.comment}"</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-900">{r.name}</p>
                <p className="text-[11px] font-mono text-cyan-600">{r.role}</p>
              </div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(r.stars)].map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
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
