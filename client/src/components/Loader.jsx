import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onComplete) {
            setTimeout(onComplete, 300);
          }
          return 100;
        }
        const step = Math.floor(Math.random() * 20) + 15;
        return Math.min(prev + step, 100);
      });
    }, 35);

    const safetyTimeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1200);

    return () => {
      clearInterval(timer);
      clearTimeout(safetyTimeout);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#F8FAFC] text-[#090D16] overflow-hidden select-none"
      >
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm w-full px-6">
          {/* Swiss Studio Monogram */}
          <div className="w-12 h-12 bg-[#090D16] rounded-xl flex items-center justify-center text-white font-black text-sm tracking-wider shadow-sm">
            TC
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-xl font-bold tracking-[0.2em] text-[#090D16] uppercase font-editorial">
              TERACAR
            </h1>
            <p className="text-[9px] font-mono uppercase text-[#64748B] tracking-[0.25em]">
              Swiss Architectural Fleet
            </p>
          </div>

          {/* Clean Progress Bar */}
          <div className="w-full flex flex-col gap-2 mt-2">
            <div className="w-full h-[2px] bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#090D16]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono text-[#64748B] uppercase tracking-wider">
              <span>INITIALIZING STUDIO</span>
              <span className="font-bold text-[#090D16]">{progress}%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;