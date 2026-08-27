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
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-mono text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CURATED SELECTION</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Explore Premium Fleet
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Select from our ultra-exclusive, hand-picked collection of high-performance supercars and luxury vehicles.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                  : 'glass-card text-slate-400 hover:text-slate-200 hover:border-white/20'
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
        <div className="p-12 text-center glass-card rounded-2xl border border-white/10 my-8">
          <Filter className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">No vehicles matching category "{activeCategory}"</p>
          <button
            onClick={() => setActiveCategory('All')}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* View All Button */}
      <div className="mt-12 text-center">
        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold text-sm hover:bg-cyan-500 hover:text-slate-950 transition-all duration-300 shadow-xl cursor-pointer group"
        >
          <span>EXPLORE COMPLETE FLEET ({cars.length})</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

export default FeaturedSection;
