import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, MapPin, Headphones } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'Every rental includes comprehensive insurance coverage for your peace of mind.',
  },
  {
    icon: Clock,
    title: 'Flexible Duration',
    description: 'Rent for a day, a week, or a month. We adapt to your schedule.',
  },
  {
    icon: MapPin,
    title: 'Convenient Pickup',
    description: 'Multiple locations across the city. Pick up and drop off where it suits you.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated team is available around the clock to assist you.',
  },
];

const Banner = () => {
  return (
    <section className="relative py-20 overflow-hidden" aria-label="Why choose us">
      {/* Background */}
      <div className="absolute inset-0 bg-text-primary" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(100, 30, 43, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(100, 30, 43, 0.2) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative max-w-[1400px] mx-auto section-padding">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-[2px] bg-accent" />
            <span className="text-xs font-medium tracking-[0.15em] text-accent uppercase">
              Why Choose Us
            </span>
            <div className="w-6 h-[2px] bg-accent" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-editorial tracking-tight">
            Crafted for Excellence
          </h2>
          <p className="text-white/60 mt-3 text-base">
            We don't just rent cars — we deliver premium automotive experiences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-all text-[15px]"
          >
            Start Your Journey
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Banner;