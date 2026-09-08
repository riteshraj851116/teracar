import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

const Hero = ({ onOpenSearch }) => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const carImageRef = useRef(null);
  const metaRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Precise, cinematic GSAP timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Metadata entrance
      tl.fromTo(
        metaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.0, delay: 0.2 }
      );

      // Oversized typography line-by-line reveal
      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll('.hero-line');
        tl.fromTo(
          lines,
          { y: 60, opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)' },
          {
            y: 0,
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 1.2,
            stagger: 0.15,
          },
          '-=0.7'
        );
      }

      // Vehicle image scale & reveal
      tl.fromTo(
        carImageRef.current,
        { scale: 0.92, opacity: 0, x: 40 },
        { scale: 1, opacity: 1, x: 0, duration: 1.5, ease: 'power2.out' },
        '-=1.2'
      );

      // CTAs
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.8'
      );

      // Scroll indicator subtle float
      gsap.to(scrollRef.current, {
        y: 6,
        repeat: -1,
        yoyo: true,
        duration: 1.8,
        ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] flex flex-col justify-between pt-12 pb-10 bg-[#F3F1EC] overflow-hidden select-none border-b border-[#D8D5CF]"
      aria-label="Hero section"
    >
      {/* Top Metadata Strip */}
      <div ref={metaRef} className="max-w-[1440px] mx-auto w-full section-padding">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#D8D5CF]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest text-[#111111] uppercase font-bold">
              01 / CAR RENTAL
            </span>
            <span className="w-8 h-px bg-[#D8D5CF]" />
            <span className="text-[11px] font-mono tracking-widest text-[#707070] uppercase">
              ALL-INCLUSIVE AUTOMOTIVE FLEET
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-[11px] font-mono tracking-widest text-[#707070] uppercase">
            <span>CHAUFFEUR & SELF-DRIVE</span>
            <span className="w-1 h-1 rounded-full bg-[#651F2A]" />
            <span>DISCREET AIRPORT DISPATCH</span>
          </div>
        </div>
      </div>

      {/* Hero Visual Composition */}
      <div className="max-w-[1440px] mx-auto w-full section-padding my-auto py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Foreground Typography */}
          <div className="lg:col-span-8 z-10">
            <div ref={headlineRef} className="overflow-hidden">
              <h1 className="text-5xl sm:text-7xl md:text-8xl xl:text-[7.5rem] font-editorial font-bold tracking-tight uppercase leading-[0.92] text-[#111111]">
                <span className="hero-line block">DRIVE</span>
                <span className="hero-line block text-[#111111]">SOMETHING</span>
                <span className="hero-line block text-[#651F2A]">EXCEPTIONAL.</span>
              </h1>
            </div>

            {/* Editorial Subtitle & CTAs */}
            <div ref={ctaRef} className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Link
                to="/cars"
                data-cursor="explore"
                data-cursor-text="FLEET"
                className="px-8 py-4 bg-[#111111] hover:bg-[#651F2A] text-white text-xs font-mono tracking-widest uppercase font-bold flex items-center gap-3 transition-all duration-300 shadow-md"
              >
                <span>EXPLORE FLEET</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={onOpenSearch}
                data-cursor="explore"
                data-cursor-text="SEARCH"
                className="px-8 py-4 bg-transparent hover:bg-white text-[#111111] border border-[#111111] text-xs font-mono tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer"
              >
                FIND MY CAR
              </button>

              <div className="text-[11px] font-mono text-[#707070] uppercase tracking-wider pl-2 sm:border-l sm:border-[#D8D5CF]">
                PORSCHE • FERRARI • MCLAREN • ROLLS-ROYCE
              </div>
            </div>
          </div>

          {/* Right / Overlapping Massive Vehicle Artwork */}
          <div className="lg:col-span-4 relative flex items-center justify-center lg:justify-end">
            <div
              ref={carImageRef}
              data-cursor="view"
              data-cursor-text="PORSCHE"
              className="relative w-full max-w-[620px] lg:max-w-none lg:w-[130%] lg:-ml-[25%] pointer-events-auto"
            >
              {/* Soft background aura */}
              <div className="absolute inset-0 bg-radial from-black/5 via-transparent to-transparent -z-10 blur-xl scale-95" />
              
              <img
                src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1400&auto=format&fit=crop"
                alt="Porsche 911 GT3 RS Flagship"
                className="w-full h-auto object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Monospaced spec badge */}
              <div className="absolute bottom-2 right-4 bg-white/90 backdrop-blur-xs border border-[#D8D5CF] p-2.5 text-[9px] font-mono tracking-widest uppercase text-[#111111] hidden sm:block">
                <span className="font-bold text-[#651F2A]">GT3 RS</span> // 518 HP • 4.0L
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Viewport Indicators */}
      <div className="max-w-[1440px] mx-auto w-full section-padding">
        <div className="flex items-center justify-between pt-6 border-t border-[#D8D5CF]">
          
          {/* Scroll Indicator */}
          <div ref={scrollRef} className="flex items-center gap-3">
            <span className="text-[10px] font-mono tracking-widest text-[#707070] uppercase">
              SCROLL
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#651F2A]" />
            <span className="text-[10px] font-mono text-[#111111] font-bold">
              01
            </span>
          </div>

          <div className="text-[10px] font-mono text-[#707070] uppercase tracking-widest">
            EDITION 2026 // ALL VEHICLES FULLY INSURED
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;