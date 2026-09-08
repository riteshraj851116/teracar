import React, { useEffect, useState } from 'react';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 250);
          return 100;
        }
        return prev + 5;
      });
    }, 28);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#F3F1EC] text-[#111111] flex flex-col items-center justify-center select-none transition-opacity duration-500 ${
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#651F2A]" />
          <span className="text-xl sm:text-2xl font-editorial font-bold tracking-tight uppercase">
            CAR RENTAL
          </span>
        </div>

        {/* Minimal Editorial Counter */}
        <div className="text-3xl sm:text-5xl font-mono font-bold tracking-tighter">
          {String(progress).padStart(2, '0')} — 100
        </div>

        {/* Hairline Progress Bar */}
        <div className="w-44 h-px bg-[#D8D5CF] relative overflow-hidden">
          <div
            className="h-full bg-[#111111] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] font-mono tracking-widest text-[#707070] uppercase">
          INITIALIZING AUTOMOTIVE PLATFORM
        </span>
      </div>
    </div>
  );
};

export default Loader;