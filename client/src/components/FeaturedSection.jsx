import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Gauge, Fuel, Users } from 'lucide-react';

const FeaturedSection = () => {
  const { cars, currency } = useAppContext();
  const navigate = useNavigate();

  const [hoveredCar, setHoveredCar] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice(window.matchMedia('(hover: none) or (pointer: coarse)').matches);
    }

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const showcaseFleet = cars.slice(0, 6);

  return (
    <section className="py-24 bg-[#F3F1EC] border-b border-[#D8D5CF] relative" aria-label="Fleet showcase">
      <div ref={containerRef} className="max-w-[1440px] mx-auto section-padding">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#D8D5CF]">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono tracking-widest text-[#707070] uppercase">
                02 / ARCHIVE
              </span>
              <span className="w-8 h-px bg-[#D8D5CF]" />
              <span className="text-[10px] font-mono tracking-widest text-[#651F2A] uppercase font-bold">
                TIER-ONE PERFORMANCE
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-editorial font-bold tracking-tight uppercase text-[#111111]">
              SELECTED FLEET.
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-mono text-[#707070] uppercase">
              01 — {String(showcaseFleet.length).padStart(2, '0')} VEHICLES LISTED
            </span>
            <Link
              to="/cars"
              data-cursor="explore"
              data-cursor-text="ALL"
              className="px-5 py-2.5 border border-[#111111] hover:bg-[#111111] hover:text-white text-xs font-mono tracking-widest uppercase transition-all duration-300"
            >
              VIEW FULL FLEET ({cars.length})
            </Link>
          </div>
        </div>

        {/* Fleet Rows Container */}
        <div className="divide-y divide-[#D8D5CF]">
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
                data-cursor-text="SPEC"
                className={`py-8 sm:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group cursor-pointer transition-all duration-300 ${
                  isHovered ? 'bg-white/60 -mx-4 px-4 sm:-mx-6 sm:px-6' : 'hover:bg-white/20'
                }`}
              >
                {/* Left: Number + Vehicle Identity */}
                <div className="flex items-baseline gap-6 sm:gap-10">
                  <span className="text-xs sm:text-sm font-mono text-[#707070] select-none">
                    {num}
                  </span>

                  <div className="transition-transform duration-300 group-hover:translate-x-3">
                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-editorial font-bold tracking-tight uppercase text-[#111111] group-hover:text-[#651F2A] transition-colors">
                      {car.brand} {car.model}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#707070] uppercase mt-2">
                      <span className="font-bold text-[#111111]">{car.category || 'Luxury'}</span>
                      <span>•</span>
                      <span>{car.transmission || 'Automatic'}</span>
                      <span>•</span>
                      <span>{car.year || '2024'} MODEL</span>
                    </div>
                  </div>
                </div>

                {/* Mobile / Tablet Inline Vehicle Image */}
                <div className="block lg:hidden w-full h-44 sm:h-56 bg-white/40 border border-[#D8D5CF] p-4 my-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={car.image}
                    alt={car.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  />
                </div>

                {/* Right: Tariff & Reservation CTA */}
                <div className="flex items-center justify-between lg:justify-end gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#D8D5CF]">
                  <div className="text-left lg:text-right font-mono">
                    <span className="text-lg sm:text-2xl font-bold text-[#111111] block">
                      {currency}{price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#707070] tracking-widest uppercase block">
                      PER 24-HOUR ALLOCATION
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-full border border-[#D8D5CF] flex items-center justify-center group-hover:border-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Vehicle Preview (Desktop Mouse Follower) */}
        {!isTouchDevice && hoveredCar && (
          <div
            className="fixed pointer-events-none z-40 hidden lg:block transition-opacity duration-200"
            style={{
              left: `${mousePos.x + 30}px`,
              top: `${mousePos.y - 120}px`,
            }}
          >
            <div className="w-80 h-48 bg-white/95 border border-[#111111] p-3 shadow-2xl backdrop-blur-md flex flex-col justify-between animate-scale-in">
              <div className="flex items-center justify-between text-[9px] font-mono text-[#707070] uppercase border-b border-[#D8D5CF] pb-1.5">
                <span>{hoveredCar.brand} {hoveredCar.model}</span>
                <span className="text-[#651F2A] font-bold">READY TO DISPATCH</span>
              </div>
              <div className="h-28 flex items-center justify-center p-2">
                <img
                  src={hoveredCar.image}
                  alt=""
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-[#111111] border-t border-[#D8D5CF] pt-1">
                <span>LOCATION: {hoveredCar.location || 'DELHI NCR'}</span>
                <span>CLICK TO VIEW SPEC →</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;