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

  const filteredCars = (cars || [])
    .filter((c) => {
      const title = (c.title || `${c.brand || ''} ${c.model || ''}`).toLowerCase();
      const brand = (c.brand || '').toLowerCase();
      const cat = (c.category || '').toLowerCase();
      const loc = (c.location || '').toLowerCase();
      const query = search.toLowerCase();

      const matchesSearch =
        title.includes(query) ||
        brand.includes(query) ||
        cat.includes(query) ||
        loc.includes(query);

      const matchesCategory =
        category === 'All' || cat === category.toLowerCase();

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const priceA = a.pricePerDay || a.price || 0;
      const priceB = b.pricePerDay || b.price || 0;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      return 0;
    });

  return (
    <div className="relative min-h-screen py-10 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono font-bold tracking-widest text-[#800020] uppercase flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5" />
            <span>FULL INVENTORY // {cars.length} LUXURY VEHICLES</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight">
            Explore All Vehicles
          </h1>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by brand, title, city (e.g. Porsche, Ferrari, Mumbai)..."
              className="glass-input pl-10 pr-4 py-2.5 rounded-2xl text-xs w-full outline-none font-medium"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  category === cat
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-zinc-50 text-zinc-700 hover:text-black border border-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input px-3 py-2 rounded-xl text-xs outline-none bg-white text-zinc-800 font-medium"
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
          <div className="p-16 text-center bg-white rounded-3xl border border-zinc-200 my-8 shadow-sm">
            <Filter className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-black">No vehicles found</h3>
            <p className="text-xs text-zinc-500 mt-1">Try resetting your search filters or browse all categories.</p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
              }}
              className="mt-4 px-5 py-2.5 rounded-2xl bg-black text-white font-bold text-xs shadow-sm"
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
