import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Alexander Mitchell',
    role: 'Business Executive',
    rating: 5,
    text: "Exceptional service from start to finish. The vehicle was immaculate, the booking process seamless, and the staff incredibly professional. This is how car rental should be.",
    avatar: null,
  },
  {
    name: 'Sarah Chen',
    role: 'Travel Enthusiast',
    rating: 5,
    text: "I've rented from many services, but this is the first time I felt truly valued. The car exceeded my expectations, and the flexible pickup made my trip stress-free.",
    avatar: null,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Photographer',
    rating: 5,
    text: "Needed a luxury vehicle for a photoshoot — they delivered beyond expectations. Pristine condition, great rates, and the concierge service was a wonderful touch.",
    avatar: null,
  },
];

const Testimonial = () => {
  return (
    <section className="max-w-[1400px] mx-auto section-padding py-16" aria-label="Customer testimonials">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-[2px] bg-accent" />
          <span className="text-xs font-medium tracking-[0.15em] text-accent uppercase">
            Testimonials
          </span>
          <div className="w-6 h-[2px] bg-accent" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary font-editorial tracking-tight">
          What Our Customers Say
        </h2>
        <p className="text-text-secondary mt-2">
          Real experiences from drivers who chose premium.
        </p>
      </div>

      {/* Testimonial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-xl border border-border hover:border-accent/30 transition-all group"
          >
            {/* Quote Icon */}
            <div className="mb-4">
              <Quote className="w-8 h-8 text-accent/20 group-hover:text-accent/40 transition-colors" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-0.5 mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>

            {/* Text */}
            <p className="text-sm text-text-secondary leading-relaxed mb-5">
              "{testimonial.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-sm font-bold text-accent">{testimonial.name[0]}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{testimonial.name}</p>
                <p className="text-xs text-text-secondary">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonial;