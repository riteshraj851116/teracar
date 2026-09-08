import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, ArrowUpRight, Shield, Activity, Users, Fuel, Gauge } from 'lucide-react';

const FeaturedSection = () => {
  const { cars, currency } = useAppContext();
  const navigate = useNavigate();

  const [hoveredCar, setHoveredCar] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const containerRef = useRef(null);
  const floatingImageRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice(window.matchMedia('(hover: none) or (pointer: coarse)').matches);
    }

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      // GSAP smooth interpolation for floating vehicle image
      if (floatingImageRef.current && !isTouchDevice) {
        gsap.to(floatingImageRef.current, {
          x: e.clientX + 30,
          y: e.clientY - 120,
          duration: 0.35,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTouchDevice]);

  const showcaseFleet = cars.slice(0, 6);

  return (
    <section className="py-28 bg-[#0B0B0B] border-b border-white/14 relative select-none" aria-label="Fleet showcase">
      <div ref={containerRef} className="max-w-[1440px] mx-auto section-padding">
        
        {/* 10 — Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-14 border-b border-white/14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono tracking-widest text-[#9B9B9B] uppercase">
                02 // COLLECTION
              </span>
              <span className="w-8 h-px bg-white/20" />
              <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase font-bold">
                CURATED AUTOMOTIVE REGISTRY
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight uppercase text-[#F4F2ED]">
              THE FLEET
            </h2>
            <p className="text-sm font-mono uppercase tracking-widest text-[#9B9B9B] mt-2">
              BUILT FOR EVERY JOURNEY.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-mono text-[#9B9B9B] uppercase hidden sm:inline">
              01 — {String(showcaseFleet.length).padStart(2, '0')} SPECIMENS
            </span>
            <Link
              to="/cars"
              data-cursor="explore"
              data-cursor-text="ALL"
              className="btn-club-outline text-[11px] py-2.5 px-5"
            >
              VIEW ALL ({cars.length}) →
            </Link>
          </div>
        </div>

        {/* 10 & 11 — Large Horizontal Vehicle Rows */}
        <div className="divide-y divide-white/14">
          {showcaseFleet.map((car, index) => {
            const num = String(index + 1).padStart(2, '0');
            const isHovered = hoveredCar?._id === car._id;
            const price = Number(car.pricePerDay || car.price || 12000);

            return (
              <div
                key={car._id}
                onMouseEnter={() => !isTouchDevice && setHoveredCar(car)}
                onMouseLeave={() => !isTouchDevice && setHoveredCar(null)}
                onClick={() => navigate(`/car/${car._id}`)}
                data-cursor="view"
                data-cursor-text="VIEW"
                className={`py-10 sm:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 group cursor-pointer transition-all duration-300 ${
                  isHovered ? 'bg-[#141414] -mx-4 px-4 sm:-mx-6 sm:px-6' : 'hover:bg-[#141414]/50'
                }`}
              >
                {/* Left: Number + Vehicle Identity */}
                <div className="flex items-baseline gap-6 sm:gap-10">
                  <span className="text-sm font-mono text-[#6E6E6E] group-hover:text-[#C5A880] transition-colors select-none">
                    {num}
                  </span>

                  <div className="transition-transform duration-300 group-hover:translate-x-3">
                    <h3 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight uppercase text-[#F4F2ED] group-hover:text-[#C5A880] transition-colors">
                      {car.brand} {car.model}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#9B9B9B] uppercase mt-3">
                      <span className="font-bold text-[#F4F2ED]">{car.category || 'Performance'}</span>
                      <span>//</span>
                      <span>{car.transmission || 'Automatic'}</span>
                      <span>//</span>
                      <span>{car.year || '2026'} SPEC</span>
                      <span>//</span>
                      <span>{car.location || 'DELHI NCR'}</span>
                    </div>
                  </div>
                </div>

                {/* Mobile / Tablet Inline Image */}
                <div className="block lg:hidden w-full h-48 sm:h-60 bg-[#141414] border border-white/10 p-4 my-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={car.image}
                    alt={car.title}
                    className="max-h-full max-w-full object-contain filter brightness-[0.9] drop-shadow-xl"
                  />
                </div>

                {/* Right: Tariff & View CTA */}
                <div className="flex items-center justify-between lg:justify-end gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                  <div className="text-left lg:text-right font-mono">
                    <span className="text-xl sm:text-2xl font-bold text-[#F4F2ED] block">
                      {currency}{price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#9B9B9B] tracking-widest uppercase block">
                      PER 24-HOUR ALLOCATION
                    </span>
                  </div>

                  {/* 11 — Vehicle Hover CTA: VIEW VEHICLE → */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono tracking-widest uppercase text-[#9B9B9B] group-hover:text-[#F4F2ED] hidden sm:inline transition-colors">
                      VIEW VEHICLE
                    </span>
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:border-[#C5A880] group-hover:bg-[#C5A880] group-hover:text-[#0B0B0B] text-[#F4F2ED] transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 12 — Floating Vehicle Preview Image Follower (Desktop Only with GSAP) */}
        {!isTouchDevice && hoveredCar && (
          <div
            ref={floatingImageRef}
            className="fixed pointer-events-none z-50 hidden lg:block"
            style={{
              left: 0,
              top: 0,
            }}
          >
            <div className="w-88 bg-[#1B1B1B]/95 border border-white/20 p-4 shadow-2xl backdrop-blur-md flex flex-col justify-between">
              <div className="flex items-center justify-between text-[9px] font-mono text-[#9B9B9B] uppercase border-b border-white/10 pb-2">
                <span className="font-bold text-[#F4F2ED]">{hoveredCar.brand} {hoveredCar.model}</span>
                <span className="text-[#C5A880] font-bold">AVAILABLE NOW</span>
              </div>
              <div className="h-32 flex items-center justify-center p-2">
                <img
                  src={hoveredCar.image}
                  alt=""
                  className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                />
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-[#9B9B9B] border-t border-white/10 pt-2">
                <span>LOCATION: {hoveredCar.location || 'DELHI NCR'}</span>
                <span className="text-[#C5A880] font-bold">VIEW VEHICLE →</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;