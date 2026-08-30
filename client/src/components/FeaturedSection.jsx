import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import CarCard from './CarCard';
import { ArrowRight, Filter } from 'lucide-react';
import { playUiClick } from '../utils/audioEngine';

const CATEGORIES = ['All', 'Supercar', 'Sedan', 'SUV', 'Electric'];

const FeaturedSection = () => {
  const { cars, navigate, loadingCars } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCars =
    activeCategory === 'All'
      ? cars
      : cars.filter(
          (car) =>
            car.category?.toLowerCase() === activeCategory.toLowerCase() ||
            car.brand?.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <section className="py-12 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[#E2E8F0] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block mb-1">
            COLLECTION // AVAILABLE ATELIER FLEET
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#090D16] uppercase font-editorial tracking-tight">
            Curated Showroom
          </h2>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playUiClick();
                setActiveCategory(cat);
              }}
              className={`px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded border transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#090D16] text-white border-[#090D16]'
                  : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#090D16] hover:text-[#090D16]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loadingCars ? (
        <div className="py-20 text-center text-xs font-mono tracking-widest text-[#64748B] uppercase">
          Loading atelier fleet...
        </div>
      ) : filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.slice(0, 6).map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white border border-[#E2E8F0] rounded text-center flex flex-col items-center gap-3 my-4">
          <Filter className="w-8 h-8 text-[#94A3B8]" />
          <p className="text-[#090D16] font-mono uppercase text-sm font-bold">No vehicles found in "{activeCategory}"</p>
          <button
            onClick={() => setActiveCategory('All')}
            className="px-4 py-2 bg-[#090D16] text-white rounded text-[10px] font-mono uppercase tracking-wider cursor-pointer"
          >
            Show All
          </button>
        </div>
      )}

      {/* View All */}
      <div className="mt-10 text-center">
        <button
          onClick={() => {
            playUiClick();
            navigate('/cars');
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#090D16] border border-[#E2E8F0] hover:border-[#090D16] rounded text-xs font-mono uppercase font-semibold tracking-wider transition-colors cursor-pointer shadow-xs"
        >
          <span>View Complete Catalog ({cars.length} Models)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      
    </section>
  );
};

export default FeaturedSection;