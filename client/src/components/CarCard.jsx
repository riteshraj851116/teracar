import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Gauge, Fuel, Users, ArrowRight, Heart, Scale } from 'lucide-react';
import { playUiClick } from '../utils/audioEngine';

const CarCard = ({ car }) => {
  const { currency, navigate, toggleFavorite, isFavorite, addToCompare } = useAppContext();

  if (!car) return null;

  const displayTitle = car.title || `${car.brand || ''} ${car.model || 'Spec'}`.trim() || 'Precision Chassis';
  const displayBrand = car.brand || 'TERACAR';
  const displayCategory = car.category || 'Luxury';
  const price = car.pricePerDay || car.price || 0;
  const isFav = isFavorite(car._id);

  return (
    <div
      onClick={() => navigate(`/car-details/${car._id}`)}
      className="group relative bg-white border border-[#E2E8F0] hover:border-[#090D16] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md"
    >
      <div>
        {/* Car Image Stage */}
        <div className="relative w-full h-48 sm:h-52 bg-[#F8FAFC] overflow-hidden flex items-center justify-center p-4">
          <img
            src={car.image}
            alt={displayTitle}
            className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Top Badges & Actions */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto">
            <span className="px-2.5 py-0.5 bg-white border border-[#E2E8F0] text-[#090D16] text-[9px] font-mono font-bold tracking-wider uppercase rounded">
              {displayCategory}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playUiClick();
                  addToCompare(car);
                }}
                title="Add to Comparison"
                className="w-7 h-7 rounded bg-white border border-[#E2E8F0] hover:border-[#090D16] flex items-center justify-center text-[#64748B] hover:text-[#090D16] transition-colors cursor-pointer"
              >
                <Scale className="w-3 h-3" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playUiClick();
                  toggleFavorite(car._id);
                }}
                title={isFav ? "Remove from Saved" : "Save Vehicle"}
                className={`w-7 h-7 rounded bg-white border transition-colors flex items-center justify-center cursor-pointer ${
                  isFav
                    ? 'border-rose-300 text-rose-600 bg-rose-50'
                    : 'border-[#E2E8F0] text-[#64748B] hover:text-rose-600'
                }`}
              >
                <Heart className={`w-3 h-3 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 flex flex-col gap-3">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#64748B]">
              {displayBrand}
            </span>
            <h3 className="text-base font-bold uppercase text-[#090D16] tracking-tight truncate font-editorial">
              {displayTitle}
            </h3>
          </div>

          {/* Specifications Specs Bar */}
          <div className="grid grid-cols-3 gap-1.5 py-2.5 border-y border-[#E2E8F0] text-[9px] text-[#64748B] font-mono uppercase">
            <div className="flex items-center gap-1 truncate text-[#090D16]">
              <Gauge className="w-3 h-3 text-[#64748B]" />
              <span className="truncate">{car.transmission || 'Auto'}</span>
            </div>
            <div className="flex items-center gap-1 truncate border-l border-[#E2E8F0] pl-1.5 text-[#090D16]">
              <Fuel className="w-3 h-3 text-[#64748B]" />
              <span className="truncate">{car.fuel_type || car.fuelType || 'Petrol'}</span>
            </div>
            <div className="flex items-center gap-1 truncate border-l border-[#E2E8F0] pl-1.5 text-[#090D16]">
              <Users className="w-3 h-3 text-[#64748B]" />
              <span className="truncate">{car.seating_capacity || car.seats ? `${car.seating_capacity || car.seats} Seats` : '2 Seats'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Daily Price & Action */}
      <div className="p-4 pt-0 flex items-center justify-between">
        <div>
          <p className="text-[8px] font-mono uppercase tracking-wider text-[#64748B]">Daily Rate</p>
          <p className="text-lg font-bold text-[#090D16] font-mono leading-tight">
            <span>{currency}</span>
            <span>{price}</span>
            <span className="text-[9px] text-[#64748B] font-normal font-sans ml-1">/ day</span>
          </p>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/car-details/${car._id}`);
          }}
          className="px-3.5 py-2 bg-[#090D16] group-hover:bg-[#1E293B] text-white rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Reserve</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CarCard;