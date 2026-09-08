import React, { useEffect, useState } from 'react';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 200);
          return 100;
        }
        return prev + 6;
      });
    }, 24);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#0B0B0B] text-[#F4F2ED] flex flex-col items-center justify-center select-none transition-opacity duration-500 ${
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
          <span className="text-xl sm:text-2xl font-display font-extrabold tracking-widest uppercase text-[#F4F2ED]">
            CAR RENTAL
          </span>
        </div>

        {/* Minimal Counter */}
        <div className="text-3xl sm:text-5xl font-mono font-bold tracking-tighter text-[#F4F2ED]">
          {String(progress).padStart(2, '0')} — 100
        </div>

        {/* Hairline Progress Bar */}
        <div className="w-48 h-px bg-white/14 relative overflow-hidden">
          <div
            className="h-full bg-[#C5A880] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] font-mono tracking-widest text-[#9B9B9B] uppercase">
          AUTOMOTIVE CLUB REGISTRY INITIALIZING
        </span>
      </div>
    </div>
  );
};

export default Loader;