import React, { useEffect, useState } from 'react';
import { Car } from 'lucide-react';

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
        return prev + 4;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (progress >= 100) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
          <Car className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-xl font-bold text-text-primary tracking-wider uppercase font-editorial block">
            CAR RENTAL
          </span>
          <span className="text-[10px] text-text-secondary tracking-widest uppercase">
            Premium Automotive
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-[3px] bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-text-muted mt-3 font-mono">
        Loading...
      </p>
    </div>
  );
};

export default Loader;