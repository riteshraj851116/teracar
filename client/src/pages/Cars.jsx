import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  X,
  ArrowRight,
  Heart,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const CATEGORIES = ['All', 'Supercar', 'Luxury', 'SUV', 'Sports', 'Electric', 'Sedan'];
const BRANDS = ['All', 'Porsche', 'Ferrari', 'Range Rover', 'BMW', 'Mercedes-Benz', 'Audi', 'McLaren', 'Aston Martin'];
const TRANSMISSIONS = ['All', 'Automatic', 'Manual', 'Dual-Clutch'];
const FUEL_TYPES = ['All', 'Petrol', 'Hybrid', 'Electric', 'Diesel'];
const SORT_OPTIONS = [
  { value: 'recommended', label: 'RECOMMENDED' },
  { value: 'price-low', label: 'PRICE: LOW TO HIGH' },
  { value: 'price-high', label: 'PRICE: HIGH TO LOW' },
  { value: 'rating', label: 'RATING' },
  { value: 'newest', label: 'NEWEST' },
];

const Cars = () => {
  const { cars, loadingCars, currency, favorites, toggleFavorite } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [search, setSearch] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [fuelType, setFuelType] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [maxPrice, setMaxPrice] = useState(30000);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialLocation) setSearch(initialLocation);
    if (initialCategory) setCategory(initialCategory);
  }, [initialLocation, initialCategory]);

  const maxAvailablePrice = useMemo(() => {
    if (!cars.length) return 30000;
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
        const matchesBrand = brand === 'All' || c.brand?.toLowerCase().includes(brand.toLowerCase());
        const carTrans = (c.transmission || '').toLowerCase();
        const matchesTransmission = transmission === 'All' || carTrans.includes(transmission.toLowerCase());
        const carFuel = (c.fuel_type || c.fuel || '').toLowerCase();
        const matchesFuel = fuelType === 'All' || carFuel.includes(fuelType.toLowerCase());
        const price = Number(c.pricePerDay || c.price || 0);
        const matchesPrice = price <= maxPrice;

        return matchesSearch && matchesCategory && matchesBrand && matchesTransmission && matchesFuel && matchesPrice;
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
          case 'rating': return 4.9 - 4.8;
          default: return 0;
        }
      });
  }, [cars, search, category, brand, transmission, fuelType, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setBrand('All');
    setTransmission('All');
    setFuelType('All');
    setSortBy('recommended');
    setMaxPrice(maxAvailablePrice);
    setSearchParams({});
  };

  const FilterPanel = () => (
    <div className="flex flex-col gap-8 text-xs font-mono">
      {/* 17 — Category / Type Filter */}
      <div>
        <span className="text-[#9B9B9B] uppercase tracking-widest block mb-3 font-bold">
          TYPE
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 border text-[11px] uppercase transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-[#F4F2ED] text-[#0B0B0B] border-[#F4F2ED] font-bold'
                  : 'bg-[#141414] text-[#9B9B9B] border-white/14 hover:border-white/30 hover:text-[#F4F2ED]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 17 — Brand Filter */}
      <div>
        <span className="text-[#9B9B9B] uppercase tracking-widest block mb-3 font-bold">
          BRAND
        </span>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="club-input text-xs"
        >
          {BRANDS.map((b) => (
            <option key={b} value={b} className="bg-[#141414] text-[#F4F2ED]">
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* 17 — Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#9B9B9B] uppercase tracking-widest font-bold">
            PRICE CAP
          </span>
          <span className="text-[#F4F2ED] font-bold">
            UP TO {currency}{maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={3000}
          max={maxAvailablePrice}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#C5A880] cursor-pointer bg-[#242424]"
        />
        <div className="flex justify-between text-[10px] text-[#6E6E6E] mt-1">
          <span>{currency}3,000</span>
          <span>{currency}{maxAvailablePrice.toLocaleString()}</span>
        </div>
      </div>

      {/* 17 — Transmission */}
      <div>
        <span className="text-[#9B9B9B] uppercase tracking-widest block mb-3 font-bold">
          TRANSMISSION
        </span>
        <div className="flex flex-wrap gap-1.5">
          {TRANSMISSIONS.map((trans) => (
            <button
              key={trans}
              onClick={() => setTransmission(trans)}
              className={`px-3 py-1.5 border text-[11px] uppercase transition-colors cursor-pointer ${
                transmission === trans
                  ? 'bg-[#F4F2ED] text-[#0B0B0B] border-[#F4F2ED] font-bold'
                  : 'bg-[#141414] text-[#9B9B9B] border-white/14 hover:border-white/30 hover:text-[#F4F2ED]'
              }`}
            >
              {trans}
            </button>
          ))}
        </div>
      </div>

      {/* 17 — Fuel System */}
      <div>
        <span className="text-[#9B9B9B] uppercase tracking-widest block mb-3 font-bold">
          FUEL
        </span>
        <div className="flex flex-wrap gap-1.5">
          {FUEL_TYPES.map((f) => (
            <button
              key={f}
              onClick={() => setFuelType(f)}
              className={`px-3 py-1.5 border text-[11px] uppercase transition-colors cursor-pointer ${
                fuelType === f
                  ? 'bg-[#F4F2ED] text-[#0B0B0B] border-[#F4F2ED] font-bold'
                  : 'bg-[#141414] text-[#9B9B9B] border-white/14 hover:border-white/30 hover:text-[#F4F2ED]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Filter Action */}
      <button
        onClick={resetFilters}
        className="flex items-center justify-center gap-2 py-3 border border-white/14 hover:border-white/40 text-xs font-mono tracking-widest uppercase text-[#9B9B9B] hover:text-[#F4F2ED] transition-colors cursor-pointer bg-[#141414]"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>RESET CRITERIA</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F4F2ED] pb-24 select-none">
      
      {/* 17 — Top Header Strip */}
      <div className="border-b border-white/14 bg-[#0B0B0B] py-12">
        <div className="max-w-[1440px] mx-auto section-padding">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
            <span className="text-xs font-mono tracking-widest text-[#C5A880] uppercase font-bold">
              REGISTRY DIRECTORY // 2026
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {/* 17 — Top: 24 VEHICLES AVAILABLE */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight uppercase text-[#F4F2ED]">
                {filteredCars.length} VEHICLES AVAILABLE
              </h1>
              <p className="text-xs font-mono text-[#9B9B9B] uppercase tracking-widest mt-2">
                FILTER BY DESTINATION, CHASSIS CATEGORY, OR FACTORY POWERTRAIN
              </p>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
              <input
                type="text"
                placeholder="SEARCH MAKE, MODEL, CITY..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="club-input pl-10 text-xs"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Filter & Sort Bar */}
      <div className="border-b border-white/14 bg-[#141414] py-3.5 sticky top-[61px] z-30 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto section-padding flex items-center justify-between gap-4 text-xs font-mono">
          
          {/* Mobile Filter Drawer Trigger */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 px-3 py-1.5 border border-white/14 text-[#F4F2ED]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>FILTERS</span>
          </button>

          {/* Active criteria chips */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-[#6E6E6E] uppercase">ACTIVE:</span>
            {category !== 'All' && (
              <span className="px-2.5 py-0.5 bg-[#1B1B1B] border border-white/14 text-[#F4F2ED]">
                {category}
              </span>
            )}
            {brand !== 'All' && (
              <span className="px-2.5 py-0.5 bg-[#1B1B1B] border border-white/14 text-[#F4F2ED]">
                {brand}
              </span>
            )}
            {transmission !== 'All' && (
              <span className="px-2.5 py-0.5 bg-[#1B1B1B] border border-white/14 text-[#F4F2ED]">
                {transmission}
              </span>
            )}
            {search && (
              <span className="px-2.5 py-0.5 bg-[#1B1B1B] border border-white/14 text-[#F4F2ED]">
                "{search}"
              </span>
            )}
          </div>

          {/* 17 — Sort Dropdown: RECOMMENDED, PRICE, RATING, NEWEST */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-[#6E6E6E] uppercase hidden sm:inline">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#1B1B1B] border border-white/14 text-[#F4F2ED] px-3 py-1.5 text-xs font-mono uppercase cursor-pointer outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#141414] text-[#F4F2ED]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Filters + Right Results */}
      <div className="max-w-[1440px] mx-auto section-padding pt-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Desktop Left Filter Sidebar */}
          <div className="hidden md:block md:col-span-3 sticky top-28 border border-white/14 p-6 bg-[#141414]">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/14">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#F4F2ED]">
                CRITERIA
              </span>
              <span className="text-[10px] font-mono text-[#9B9B9B]">
                {filteredCars.length} MATCHED
              </span>
            </div>
            <FilterPanel />
          </div>

          {/* Right Fleet Cards Grid */}
          <div className="md:col-span-9">
            {loadingCars ? (
              <div className="py-24 text-center">
                <span className="text-xs font-mono uppercase tracking-widest text-[#9B9B9B]">
                  LOADING FLEET TELEMETRY...
                </span>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="py-24 text-center border border-white/14 bg-[#141414] p-10">
                <p className="text-base font-mono uppercase tracking-widest text-[#9B9B9B] mb-6">
                  NO SPECIMENS MATCH YOUR SPECIFICATION CRITERIA.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn-club-primary"
                >
                  RESET ALL CRITERIA
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredCars.map((car, index) => {
                  const num = String(index + 1).padStart(2, '0');
                  const isFav = favorites?.includes(car._id);
                  const price = Number(car.pricePerDay || car.price || 12000);

                  return (
                    <div
                      key={car._id}
                      className="club-card flex flex-col justify-between group overflow-hidden"
                    >
                      {/* Card Top Strip */}
                      <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="text-[#6E6E6E]">{num}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                          <span className="text-[#9B9B9B] uppercase font-bold">
                            {car.category || 'Performance'}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(car._id);
                          }}
                          className={`p-2 transition-colors cursor-pointer ${
                            isFav ? 'text-[#C5A880]' : 'text-[#6E6E6E] hover:text-white'
                          }`}
                          aria-label="Save to wishlist"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-[#C5A880]' : ''}`} />
                        </button>
                      </div>

                      {/* Card Vehicle Image Stage */}
                      <Link
                        to={`/car/${car._id}`}
                        className="relative h-64 p-6 bg-[#141414] flex items-center justify-center overflow-hidden"
                      >
                        <img
                          src={car.image}
                          alt={car.title}
                          className="max-h-full max-w-full object-contain filter brightness-[0.9] drop-shadow-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </Link>

                      {/* Card Identity & Specs */}
                      <div className="p-6 border-t border-white/10 space-y-4">
                        <div>
                          <span className="text-[10px] font-mono tracking-widest text-[#9B9B9B] uppercase block">
                            {car.location || 'DELHI NCR'} // {car.year || '2026'} MODEL
                          </span>
                          <Link
                            to={`/car/${car._id}`}
                            className="text-2xl font-display font-bold uppercase text-[#F4F2ED] group-hover:text-[#C5A880] transition-colors mt-1 block"
                          >
                            {car.brand} {car.model}
                          </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-white/10 text-[10px] font-mono text-[#9B9B9B] uppercase">
                          <div>
                            <span className="text-[#6E6E6E] block">GEARBOX</span>
                            <span className="text-[#F4F2ED] font-bold">{car.transmission || 'Automatic'}</span>
                          </div>
                          <div>
                            <span className="text-[#6E6E6E] block">POWER</span>
                            <span className="text-[#F4F2ED] font-bold">{car.fuel_type || car.fuel || 'Petrol'}</span>
                          </div>
                          <div>
                            <span className="text-[#6E6E6E] block">CAPACITY</span>
                            <span className="text-[#F4F2ED] font-bold">{car.seating_capacity || car.seats || 2} SEATS</span>
                          </div>
                        </div>

                        {/* Card Tariff & Action */}
                        <div className="pt-2 flex items-center justify-between">
                          <div className="font-mono">
                            <span className="text-xl font-bold text-[#F4F2ED] block">
                              {currency}{price.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-[#9B9B9B] tracking-widest uppercase block">
                              PER 24-HR ALLOCATION
                            </span>
                          </div>

                          <Link
                            to={`/car/${car._id}`}
                            className="btn-club-primary py-2 px-4 text-[10px] font-bold"
                          >
                            <span>RESERVE</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-sm bg-[#141414] h-full shadow-2xl border-l border-white/14 z-10 flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/14 mb-6">
                <span className="text-sm font-mono font-bold uppercase text-[#F4F2ED]">
                  FILTER FLEET
                </span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-[#F4F2ED]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanel />
            </div>

            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="w-full mt-6 btn-club-primary py-3 text-xs"
            >
              APPLY CRITERIA ({filteredCars.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;