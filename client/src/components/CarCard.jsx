import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { Gauge, Fuel, Users, ChevronRight, ShieldCheck, Zap } from 'lucide-react';

const CarCard = ({ car }) => {
  const { currency, navigate } = useAppContext();

  if (!car) return null;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      onClick={() => navigate(`/car-details/${car._id}`)}
      className="group relative rounded-2xl glass-card border border-white/10 hover:border-cyan-500/50 overflow-hidden cursor-pointer shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Glow Hover Ambient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div>
        {/* Car Image Header Container */}
        <div className="relative w-full h-48 sm:h-52 bg-slate-950/80 overflow-hidden flex items-center justify-center p-4">
          <img
            src={car.image}
            alt={car.title}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-slate-950/80 border border-cyan-500/40 text-cyan-300 backdrop-blur-md uppercase">
              {car.category || 'Supercar'}
            </span>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 backdrop-blur-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available</span>
            </span>
          </div>
        </div>

        {/* Card Body Details */}
        <div className="p-5 flex flex-col gap-4">
          {/* Title & Brand */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">{car.brand || 'Luxury Spec'}</span>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
              {car.title}
            </h3>
          </div>

          {/* Specs Telemetry Chips */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5 text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-1.5 bg-slate-900/50 p-2 rounded-lg border border-white/5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{car.transmission || 'Auto'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/50 p-2 rounded-lg border border-white/5">
              <Fuel className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">{car.fuelType || 'Petrol'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/50 p-2 rounded-lg border border-white/5">
              <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{car.seats ? `${car.seats} Seats` : '2 Seats'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Booking Action */}
      <div className="p-5 pt-0 flex items-center justify-between mt-2">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Daily Rate</p>
          <p className="text-xl font-black text-white font-mono flex items-baseline gap-1">
            <span className="text-cyan-400">{currency}</span>
            <span>{car.pricePerDay || car.price}</span>
            <span className="text-xs font-normal text-slate-400 font-sans">/day</span>
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs border border-cyan-500/40 transition-all duration-300 flex items-center gap-1 group-hover:shadow-lg group-hover:shadow-cyan-500/30 cursor-pointer">
          <span>View 3D</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default CarCard;
