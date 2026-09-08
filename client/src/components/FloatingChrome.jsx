import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FloatingChrome = ({ onOpenSearch }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Left Floating Information */}
      <div className="hidden lg:flex fixed top-4 left-6 z-40 items-center gap-3 pointer-events-none select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
        <span className="text-[10px] font-mono tracking-widest text-[#9B9B9B] uppercase">
          CAR RENTAL // PREMIUM MOBILITY
        </span>
      </div>

      {/* Top Right Floating Information */}
      <div className="hidden xl:flex fixed top-4 right-8 z-40 items-center gap-2 pointer-events-none select-none">
        <span className="text-[10px] font-mono tracking-widest text-[#9B9B9B] uppercase">
          DELHI / INDIA
        </span>
      </div>

      {/* Bottom Left: Scroll to explore */}
      <div
        className={`hidden md:flex fixed bottom-6 left-6 z-40 items-center gap-2 pointer-events-none select-none transition-opacity duration-500 ${
          scrollY > 400 ? 'opacity-0' : 'opacity-80'
        }`}
      >
        <span className="text-[10px] font-mono tracking-widest text-[#9B9B9B] uppercase">
          SCROLL TO EXPLORE ↓
        </span>
      </div>

      {/* Bottom Right: Floating 2026 + Quick Book CTA */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 pointer-events-auto">
        <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest text-[#9B9B9B] uppercase mr-2 pointer-events-none select-none">
          2026
        </span>

        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            data-cursor="explore"
            data-cursor-text="SEARCH"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-[#1B1B1B]/90 hover:bg-[#242424] text-[#F4F2ED] border border-white/14 text-[10px] font-mono tracking-widest uppercase transition-colors backdrop-blur-sm shadow-md"
          >
            <span>FIND A CAR</span>
            <span className="text-[#9B9B9B]">⌘K</span>
          </button>
        )}

        <Link
          to="/cars"
          data-cursor="book"
          data-cursor-text="RESERVE"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4F2ED] hover:bg-[#C5A880] text-[#0B0B0B] text-[10px] font-mono tracking-widest uppercase font-bold transition-all shadow-md"
        >
          <span>BOOK A CAR</span>
          <span>↗</span>
        </Link>
      </div>
    </>
  );
};

export default FloatingChrome;
