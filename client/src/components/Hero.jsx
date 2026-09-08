import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Hero = ({ onOpenSearch }) => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const bgImageRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);
  const metaTopRef = useRef(null);
  const metaBottomRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // 07 — HERO ANIMATION (0.6 - 1.2s, smooth, elegant, no bouncing)
      // 1. Background image scale & fade in
      tl.fromTo(
        bgImageRef.current,
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' },
        0
      );

      // 2. Small label / top metadata reveals
      tl.fromTo(
        metaTopRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.2
      );

      // 3. Large headline reveals line-by-line
      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll('.hero-headline-line');
        tl.fromTo(
          lines,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.14,
            ease: 'power3.out',
          },
          0.3
        );
      }

      // 4. Supporting text reveals
      tl.fromTo(
        subtextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.7
      );

      // 5. CTAs appear
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.85
      );

      // 6. Bottom metadata reveals
      tl.fromTo(
        metaBottomRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        0.9
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] flex flex-col justify-between pt-12 pb-10 bg-[#0B0B0B] overflow-hidden select-none border-b border-white/14"
      aria-label="Hero section"
    >
      {/* 06 — Cinematic Automotive Image (Full viewport, dark treatment, subtle gradients) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={bgImageRef}
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2400&auto=format&fit=crop"
          alt="Premium Automotive Experience"
          className="w-full h-full object-cover object-center filter brightness-[0.52] contrast-[1.15]"
        />
        {/* Dark Cinematic Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-black/60" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0B0B0B]/85 via-transparent to-[#0B0B0B]/40" />
      </div>

      {/* 08 — Top Floating Automotive Metadata */}
      <div ref={metaTopRef} className="max-w-[1440px] mx-auto w-full section-padding relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/14">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest text-[#F4F2ED] uppercase font-semibold">
              CAR RENTAL
            </span>
            <span className="w-8 h-px bg-white/20" />
            <span className="text-[11px] font-mono tracking-widest text-[#9B9B9B] uppercase">
              PREMIUM MOBILITY
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-[11px] font-mono tracking-widest text-[#9B9B9B] uppercase">
            <span>DELHI</span>
            <span className="w-1 h-1 rounded-full bg-[#C5A880]" />
            <span>INDIA</span>
            <span className="w-1 h-1 rounded-full bg-[#C5A880]" />
            <span>GLOBAL DISPATCH AVAILABLE</span>
          </div>
        </div>
      </div>

      {/* 05 — Hero Composition & Typography */}
      <div className="max-w-[1440px] mx-auto w-full section-padding my-auto py-12 relative z-10">
        <div className="max-w-3xl">
          {/* Small Pre-Headline Tag */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
            <span className="text-xs font-mono tracking-widest text-[#C5A880] uppercase font-bold">
              PREMIUM FLEET / 2026
            </span>
          </div>

          {/* Large Headline (DRIVE WHAT MOVES YOU.) */}
          <div ref={headlineRef} className="overflow-hidden mb-6">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] font-display font-extrabold tracking-tight uppercase leading-[0.92] text-[#F4F2ED]">
              <span className="hero-headline-line block">DRIVE</span>
              <span className="hero-headline-line block text-[#F4F2ED]">WHAT</span>
              <span className="hero-headline-line block text-[#C5A880]">MOVES YOU.</span>
            </h1>
          </div>

          {/* Supporting Text */}
          <div ref={subtextRef} className="max-w-xl mb-10">
            <p className="text-base sm:text-lg font-body text-[#9B9B9B] leading-relaxed">
              Premium vehicles. Flexible rentals. Exceptional journeys.
            </p>
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              to="/cars"
              data-cursor="explore"
              data-cursor-text="FLEET"
              className="btn-club-primary"
            >
              <span>EXPLORE FLEET</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/cars"
              data-cursor="book"
              data-cursor-text="BOOK"
              className="btn-club-outline"
            >
              <span>BOOK A CAR</span>
            </Link>

            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                data-cursor="explore"
                data-cursor-text="SEARCH"
                className="hidden md:inline-flex text-xs font-mono tracking-wider uppercase text-[#9B9B9B] hover:text-[#F4F2ED] ml-4 transition-colors"
              >
                FIND YOUR CAR ⌘K →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 08 — Bottom Floating Automotive Metadata */}
      <div ref={metaBottomRef} className="max-w-[1440px] mx-auto w-full section-padding relative z-10">
        <div className="flex items-center justify-between pt-6 border-t border-white/14">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono tracking-widest text-[#9B9B9B] uppercase">
              SCROLL TO EXPLORE
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#C5A880] animate-bounce" />
          </div>

          <div className="text-[10px] font-mono text-[#9B9B9B] uppercase tracking-widest">
            2026 // ALL ALLOCATIONS FULLY COMPREHENSIVE INSURED
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;