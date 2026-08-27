import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import CarCard from '../components/CarCard';
import ParticleBackground from '../components/3d/ParticleBackground';
import { Search, Filter, SlidersHorizontal, Car } from 'lucide-react';

const CATEGORIES = ['All', 'Supercar', 'Luxury', 'Electric', 'SUV'];

const Cars = () => {
  const { cars } = useAppContext();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const filteredCars = cars
    .filter((c) => {
      const matchesSearch =
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.brand?.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === 'All' || c.category?.toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.pricePerDay || a.price) - (b.pricePerDay || b.price);
      if (sortBy === 'price-high') return (b.pricePerDay || b.price) - (a.pricePerDay || a.price);
      return 0;
    });

  return (
    <div className="relative min-h-screen py-10 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5" />
            <span>FULL INVENTORY // {cars.length} VEHICLES AVAILABLE</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Explore All Vehicles
          </h1>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by brand, title (e.g. Porsche, Ferrari)..."
              className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs w-full outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  category === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input px-3 py-2 rounded-xl text-xs outline-none bg-slate-900 text-slate-200"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Vehicle Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center glass-card rounded-2xl border border-white/10 my-8">
            <Filter className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No vehicles found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search filters.</p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
