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
      {/* Top Left Floating Utility */}
      <div className="hidden lg:flex fixed top-4 left-6 z-40 items-center gap-3 pointer-events-none select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#651F2A] animate-pulse" />
        <span className="text-[10px] font-mono tracking-widest text-[#707070] uppercase">
          CAR RENTAL — EST. 2026
        </span>
      </div>

      {/* Top Right Floating Utility */}
      <div className="hidden xl:flex fixed top-4 right-8 z-40 items-center gap-2 pointer-events-none select-none">
        <span className="text-[10px] font-mono tracking-widest text-[#707070] uppercase">
          DELHI / MUMBAI / WORLDWIDE
        </span>
      </div>

      {/* Bottom Left: Scroll to explore */}
      <div
        className={`hidden md:flex fixed bottom-6 left-6 z-40 items-center gap-2 pointer-events-none select-none transition-opacity duration-500 ${
          scrollY > 400 ? 'opacity-0' : 'opacity-70'
        }`}
      >
        <span className="text-[10px] font-mono tracking-widest text-[#111111] uppercase">
          SCROLL TO EXPLORE ↓
        </span>
      </div>

      {/* Bottom Right: Quick Book or Search Action */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 pointer-events-auto">
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            data-cursor="explore"
            data-cursor-text="SEARCH"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-[#F3F1EC]/90 hover:bg-[#111111] text-[#111111] hover:text-white border border-[#D8D5CF] hover:border-[#111111] text-[10px] font-mono tracking-widest uppercase transition-all backdrop-blur-sm shadow-xs"
          >
            <span>FIND A CAR</span>
            <span>⌘K</span>
          </button>
        )}

        <Link
          to="/cars"
          data-cursor="book"
          data-cursor-text="FLEET"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#111111] hover:bg-[#651F2A] text-white text-[10px] font-mono tracking-widest uppercase transition-all shadow-sm"
        >
          <span>BOOK A CAR</span>
          <span className="font-sans">↗</span>
        </Link>
      </div>
    </>
  );
};

export default FloatingChrome;
