import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  X,
  ArrowUpRight,
  Heart,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const CATEGORIES = ['All', 'Supercar', 'Luxury', 'SUV', 'Sports', 'Electric'];
const TRANSMISSIONS = ['All', 'Automatic', 'Manual', 'Dual-Clutch'];
const SORT_OPTIONS = [
  { value: 'recommended', label: 'CURATED ORDER' },
  { value: 'price-low', label: 'TARIFF: ASCENDING' },
  { value: 'price-high', label: 'TARIFF: DESCENDING' },
  { value: 'newest', label: 'NEWEST MODEL' },
];

const Cars = () => {
  const { cars, loadingCars, currency, favorites, toggleFavorite } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [search, setSearch] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [transmission, setTransmission] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [maxPrice, setMaxPrice] = useState(25000);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialLocation) setSearch(initialLocation);
    if (initialCategory) setCategory(initialCategory);
  }, [initialLocation, initialCategory]);

  const maxAvailablePrice = useMemo(() => {
    if (!cars.length) return 25000;
    return Math.max(...cars.map(c => Number(c.pricePerDay || c.price || 0)), 2000);
  }, [cars]);

  const filteredCars = useMemo(() => {
    return cars
      .filter((c) => {
        const q = search.toLowerCase().trim();
        const matchesSearch = !q ||
          c.title?.toLowerCase().includes(q) ||
          c.model?.toLowerCase().includes(q) ||
          c.brand?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q);

        const matchesCategory = category === 'All' || c.category?.toLowerCase() === category.toLowerCase();
        const carTrans = (c.transmission || '').toLowerCase();
        const matchesTransmission = transmission === 'All' || carTrans.includes(transmission.toLowerCase());
        const price = Number(c.pricePerDay || c.price || 0);
        const matchesPrice = price <= maxPrice;

        return matchesSearch && matchesCategory && matchesTransmission && matchesPrice;
      })
      .sort((a, b) => {
        const priceA = Number(a.pricePerDay || a.price || 0);
        const priceB = Number(b.pricePerDay || b.price || 0);
        const yearA = a.year || 2020;
        const yearB = b.year || 2020;

        switch (sortBy) {
          case 'price-low': return priceA - priceB;
          case 'price-high': return priceB - priceA;
          case 'newest': return yearB - yearA;
          default: return 0;
        }
      });
  }, [cars, search, category, transmission, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setTransmission('All');
    setSortBy('recommended');
    setMaxPrice(maxAvailablePrice);
    setSearchParams({});
  };

  const FilterPanel = () => (
    <div className="flex flex-col gap-8 text-xs font-mono">
      {/* Category Pills */}
      <div>
        <span className="text-[#707070] uppercase tracking-widest block mb-3 font-bold">
          01 // CATEGORY
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 border uppercase transition-all cursor-pointer ${
                category === cat
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-[#111111] border-[#D8D5CF] hover:border-[#111111]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Maximum Daily Tariff */}
      <div className="border-t border-[#D8D5CF] pt-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-[#707070] uppercase tracking-widest font-bold">
            02 // MAX TARIFF
          </span>
          <span className="font-bold text-[#111111]">
            {currency}{maxPrice.toLocaleString()} / DAY
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={maxAvailablePrice}
          step={250}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#651F2A] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#707070] mt-1">
          <span>{currency}500</span>
          <span>{currency}{maxAvailablePrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Transmission */}
      <div className="border-t border-[#D8D5CF] pt-6">
        <span className="text-[#707070] uppercase tracking-widest block mb-3 font-bold">
          03 // TRANSMISSION
        </span>
        <div className="flex flex-wrap gap-1.5">
          {TRANSMISSIONS.map((trans) => (
            <button
              key={trans}
              onClick={() => setTransmission(trans)}
              className={`px-3 py-1.5 border uppercase transition-all cursor-pointer ${
                transmission === trans
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-[#111111] border-[#D8D5CF] hover:border-[#111111]'
              }`}
            >
              {trans}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="border-t border-[#D8D5CF] pt-6">
        <button
          onClick={resetFilters}
          className="w-full py-2.5 border border-[#D8D5CF] hover:border-[#111111] hover:bg-[#111111] hover:text-white uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET SPECIFICATIONS</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 bg-[#F3F1EC] text-[#111111]">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        {/* Page Header */}
        <div className="pb-10 border-b border-[#D8D5CF] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono tracking-widest text-[#707070] uppercase">
                01 / FLEET CATALOGUE
              </span>
              <span className="w-8 h-px bg-[#D8D5CF]" />
              <span className="text-[10px] font-mono tracking-widest text-[#651F2A] uppercase font-bold">
                {filteredCars.length} OF {cars.length} AVAILABLE
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-editorial font-bold tracking-tight uppercase leading-none text-[#111111]">
              ALL VEHICLES.
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden px-4 py-2.5 border border-[#111111] text-xs font-mono uppercase flex items-center gap-2"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>FILTERS</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 border border-[#D8D5CF] bg-white px-3 py-2 text-xs font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#707070]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent uppercase outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Split Layout: Filters Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 items-start">
          
          {/* Left: Sticky Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 border border-[#D8D5CF] bg-white p-6">
            <div className="relative mb-6 pb-6 border-b border-[#D8D5CF]">
              <Search className="w-3.5 h-3.5 text-[#707070] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brand, model, city..."
                className="w-full pl-8 pr-3 py-2 bg-[#F3F1EC] text-xs font-mono border border-[#D8D5CF] focus:border-[#111111] focus:outline-none"
              />
            </div>
            <FilterPanel />
          </aside>

          {/* Right: Vehicle Results List */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Mobile Inline Search */}
            <div className="lg:hidden relative">
              <Search className="w-3.5 h-3.5 text-[#707070] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vehicles..."
                className="w-full pl-9 pr-3 py-3 bg-white text-xs font-mono border border-[#D8D5CF] focus:border-[#111111] focus:outline-none"
              />
            </div>

            {loadingCars ? (
              <div className="py-24 text-center text-xs font-mono uppercase tracking-widest text-[#707070]">
                Accessing fleet database...
              </div>
            ) : filteredCars.length > 0 ? (
              <div className="flex flex-col divide-y divide-[#D8D5CF] border-t border-b border-[#D8D5CF]">
                {filteredCars.map((car, idx) => {
                  const num = String(idx + 1).padStart(2, '0');
                  const isSaved = favorites.includes(car._id);
                  const price = Number(car.pricePerDay || car.price || 12000);

                  return (
                    <div
                      key={car._id}
                      className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group hover:bg-white/40 transition-colors"
                    >
                      {/* Number & Name (Cols 1-5) */}
                      <div className="md:col-span-5 flex items-start gap-4 sm:gap-6">
                        <span className="text-xs font-mono text-[#707070] pt-1">
                          {num}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#707070] uppercase tracking-wider mb-1">
                            <span>{car.category || 'Luxury'}</span>
                            <span>•</span>
                            <span>{car.location || 'Delhi NCR'}</span>
                          </div>
                          <Link
                            to={`/car/${car._id}`}
                            data-cursor="view"
                            data-cursor-text="CAR"
                            className="text-2xl sm:text-3xl font-editorial font-bold tracking-tight uppercase text-[#111111] group-hover:text-[#651F2A] transition-colors block"
                          >
                            {car.brand} {car.model}
                          </Link>
                          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#707070] uppercase mt-2">
                            <span>{car.transmission || 'Automatic'}</span>
                            <span>/</span>
                            <span>{car.fuel_type || 'Petrol'}</span>
                            <span>/</span>
                            <span>{car.seating_capacity || 4} Seats</span>
                          </div>
                        </div>
                      </div>

                      {/* Image Stage (Cols 6-8) */}
                      <div className="md:col-span-4 h-36 bg-white/60 border border-[#D8D5CF] p-3 flex items-center justify-center relative overflow-hidden">
                        <img
                          src={car.image}
                          alt={car.title}
                          className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={() => toggleFavorite(car._id)}
                          className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white text-[#111111] border border-[#D8D5CF] cursor-pointer"
                          title="Save to wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#651F2A] text-[#651F2A]' : ''}`} />
                        </button>
                      </div>

                      {/* Price & Booking Actions (Cols 9-12) */}
                      <div className="md:col-span-3 flex flex-col md:items-end justify-center gap-3">
                        <div className="text-left md:text-right font-mono">
                          <span className="text-xl sm:text-2xl font-bold text-[#111111] block">
                            {currency}{price.toLocaleString()}
                          </span>
                          <span className="text-[9px] text-[#707070] uppercase tracking-widest block">
                            PER 24 HOURS
                          </span>
                        </div>

                        <Link
                          to={`/car/${car._id}`}
                          data-cursor="book"
                          data-cursor-text="RESERVE"
                          className="px-5 py-2.5 bg-[#111111] hover:bg-[#651F2A] text-white text-xs font-mono tracking-widest uppercase font-bold inline-flex items-center justify-center gap-2 transition-colors w-full md:w-auto"
                        >
                          <span>RESERVE</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 text-center border border-[#D8D5CF] bg-white p-8">
                <span className="text-xs font-mono uppercase tracking-widest text-[#707070] block mb-2">
                  NO MATCHING ALLOCATIONS FOUND
                </span>
                <p className="text-sm font-body text-[#707070] mb-6">
                  Try broadening your location, category, or tariff threshold.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-[#111111] text-white text-xs font-mono uppercase font-bold"
                >
                  RESET ALL CRITERIA
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-screen Mobile Filter Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#F3F1EC] p-6 flex flex-col justify-between overflow-y-auto lg:hidden">
          <div className="flex items-center justify-between border-b border-[#D8D5CF] pb-4 mb-6">
            <span className="text-xs font-mono tracking-widest text-[#707070] uppercase">
              FILTER SPECIFICATIONS
            </span>
            <button onClick={() => setMobileDrawerOpen(false)} className="p-2 border border-[#D8D5CF]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <FilterPanel />
          <div className="pt-6 border-t border-[#D8D5CF] mt-6">
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="w-full py-4 bg-[#111111] text-white text-xs font-mono uppercase font-bold"
            >
              SHOW {filteredCars.length} VEHICLES
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;