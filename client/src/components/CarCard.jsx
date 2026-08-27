import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { Gauge, Fuel, Users, ChevronRight, Sparkles } from 'lucide-react';

const CarCard = ({ car }) => {
  const { currency, navigate } = useAppContext();

  if (!car) return null;

  const carTitle = car.title || `${car.brand || ''} ${car.model || ''}`.trim() || 'Luxury Vehicle';
  const price = car.pricePerDay || car.price || 75000;
  const seats = car.seating_capacity || car.seats || 2;
  const fuel = car.fuel_type || car.fuelType || 'Petrol';
  const transmission = car.transmission || 'Automatic';

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/car-details/${car._id}`)}
      className="group relative rounded-3xl bg-white border border-zinc-200/90 hover:border-[#800020]/40 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Car Image Header */}
        <div className="relative w-full h-52 bg-zinc-100 overflow-hidden flex items-center justify-center p-3">
          <img
            src={car.image}
            alt={carTitle}
            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Badges */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider bg-white/95 border border-zinc-200 text-black backdrop-blur-md shadow-sm uppercase">
              {car.category || 'Supercar'}
            </span>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-rose-50 border border-rose-200 text-[#800020] backdrop-blur-md flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#800020] animate-pulse" />
              <span>Available</span>
            </span>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-5 flex flex-col gap-3.5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#800020] font-bold">{car.brand || 'Luxury Spec'}</span>
            <h3 className="text-base font-black text-black group-hover:text-[#800020] transition-colors truncate mt-0.5">
              {carTitle}
            </h3>
          </div>

          {/* Specs Telemetry */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-zinc-100 text-xs text-zinc-700 font-mono">
            <div className="flex items-center gap-1.5 bg-zinc-50 p-2 rounded-xl border border-zinc-100">
              <Gauge className="w-3.5 h-3.5 text-[#800020] shrink-0" />
              <span className="truncate text-[11px] font-medium">{transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-50 p-2 rounded-xl border border-zinc-100">
              <Fuel className="w-3.5 h-3.5 text-black shrink-0" />
              <span className="truncate text-[11px] font-medium">{fuel}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-50 p-2 rounded-xl border border-zinc-100">
              <Users className="w-3.5 h-3.5 text-[#800020] shrink-0" />
              <span className="truncate text-[11px] font-medium">{seats} Seats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Booking Action */}
      <div className="p-5 pt-0 flex items-center justify-between mt-2">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">Daily Rate</p>
          <p className="text-xl font-black text-black font-mono flex items-baseline gap-0.5">
            <span className="text-[#800020]">{currency}</span>
            <span>{typeof price === 'number' ? price.toLocaleString('en-IN') : price}</span>
            <span className="text-xs font-normal text-zinc-400 font-sans">/day</span>
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-black hover:bg-[#800020] text-white font-bold text-xs transition-all duration-200 flex items-center gap-1 shadow-sm cursor-pointer">
          <span>Inspect</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default CarCard;
