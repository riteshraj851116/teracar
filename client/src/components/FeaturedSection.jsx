import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import CarCard from './CarCard';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Supercar', 'Luxury', 'Electric', 'SUV'];

const FeaturedSection = () => {
  const { cars, navigate } = useAppContext();
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
    <section className="py-16 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full text-xs font-mono text-[#800020] font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CURATED VEHICLE FLEET</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">
            Explore Premium Fleet
          </h2>
          <p className="text-zinc-600 text-sm mt-1 max-w-xl font-normal">
            Select from our ultra-exclusive collection of high-performance supercars, grand tourers, and electric luxury vehicles.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer shadow-sm ${
                activeCategory === cat
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white text-zinc-700 border border-zinc-200 hover:text-black hover:border-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Car Cards Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.slice(0, 6).map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 my-8 shadow-sm">
          <Filter className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <p className="text-black font-bold">No vehicles matching category "{activeCategory}"</p>
          <button
            onClick={() => setActiveCategory('All')}
            className="mt-4 px-4 py-2 rounded-xl bg-zinc-100 text-black border border-zinc-300 text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* View All Button */}
      <div className="mt-12 text-center">
        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border border-zinc-300 text-black font-bold text-xs tracking-wider uppercase hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer group"
        >
          <span>EXPLORE COMPLETE FLEET ({cars.length} VEHICLES)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

export default FeaturedSection;
