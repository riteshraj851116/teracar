import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import CarCard from '../components/CarCard';
import CarComparisonModal from '../components/CarComparisonModal';
import { 
  Search, 
  SlidersHorizontal, 
  Car, 
  Filter, 
  Scale, 
  Fuel, 
  Gauge, 
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { playUiClick } from '../utils/audioEngine';

const CATEGORIES = ['All', 'Supercar', 'Luxury', 'Electric', 'SUV', 'Sedan'];
const FUEL_TYPES = ['All', 'Petrol', 'Hybrid', 'Diesel', 'Electric'];
const TRANSMISSIONS = ['All', 'Automatic', 'Semi-Automatic', 'Manual'];

const Cars = () => {
  const { cars, loadingCars, currency } = useAppContext();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [fuelType, setFuelType] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(2500);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const maxAvailablePrice = useMemo(() => {
    if (!cars.length) return 2500;
    return Math.max(...cars.map(c => Number(c.pricePerDay || c.price || 0)), 1500);
  }, [cars]);

  const filteredCars = useMemo(() => {
    return cars
      .filter((c) => {
        const q = search.toLowerCase();
        const titleMatch = c.title?.toLowerCase().includes(q);
        const modelMatch = c.model?.toLowerCase().includes(q);
        const brandMatch = c.brand?.toLowerCase().includes(q);
        const categoryMatch = c.category?.toLowerCase().includes(q);
        const locationMatch = c.location?.toLowerCase().includes(q);
        const matchesSearch = !search || titleMatch || modelMatch || brandMatch || categoryMatch || locationMatch;

        const matchesCategory =
          category === 'All' || c.category?.toLowerCase() === category.toLowerCase();

        const carFuel = (c.fuel_type || c.fuelType || '').toLowerCase();
        const matchesFuel = fuelType === 'All' || carFuel.includes(fuelType.toLowerCase());

        const carTrans = (c.transmission || '').toLowerCase();
        const matchesTransmission = transmission === 'All' || carTrans.includes(transmission.toLowerCase());

        const price = Number(c.pricePerDay || c.price || 0);
        const matchesPrice = price <= maxPrice;

        return matchesSearch && matchesCategory && matchesFuel && matchesTransmission && matchesPrice;
      })
      .sort((a, b) => {
        const priceA = a.pricePerDay || a.price || 0;
        const priceB = b.pricePerDay || b.price || 0;
        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        return 0;
      });
  }, [cars, search, category, fuelType, transmission, maxPrice, sortBy]);

  const resetAllFilters = () => {
    playUiClick();
    setSearch('');
    setCategory('All');
    setFuelType('All');
    setTransmission('All');
    setSortBy('featured');
    setMaxPrice(maxAvailablePrice);
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#64748B] uppercase block">
              CATALOG // {cars.length} AVAILABLE CHASSIS
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#090D16] uppercase font-editorial tracking-tight mt-1">
              Atelier Fleet
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { playUiClick(); setCompareModalOpen(true); }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-[#F8FAFC] text-[#090D16] border border-[#E2E8F0] rounded text-xs font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>
            <button
              onClick={() => { playUiClick(); setShowAdvancedFilters(!showAdvancedFilters); }}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded text-xs font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                showAdvancedFilters
                  ? 'bg-[#090D16] text-white border border-[#090D16]'
                  : 'bg-white text-[#090D16] border border-[#E2E8F0] hover:border-[#090D16]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Primary Filter Bar */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 flex flex-col gap-4 shadow-xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH MODEL, BRAND, CITY..."
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded pl-10 pr-4 py-2.5 text-xs font-mono text-[#090D16] uppercase placeholder:text-[#94A3B8] outline-none focus:border-[#090D16]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { playUiClick(); setCategory(cat); }}
                  className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded border transition-colors cursor-pointer whitespace-nowrap ${
                    category === cat
                      ? 'bg-[#090D16] text-white border-[#090D16]'
                      : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:border-[#090D16]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#64748B]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-mono uppercase text-[#090D16] outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters Expand */}
          {showAdvancedFilters && (
            <div className="pt-3 border-t border-[#E2E8F0] grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono uppercase text-[#64748B] flex items-center gap-1">
                  <Fuel className="w-3 h-3" />
                  Powertrain
                </label>
                <div className="flex flex-wrap gap-1">
                  {FUEL_TYPES.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFuelType(f)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase border cursor-pointer ${
                        fuelType === f
                          ? 'bg-[#090D16] text-white border-[#090D16]'
                          : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono uppercase text-[#64748B] flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  Transmission
                </label>
                <div className="flex flex-wrap gap-1">
                  {TRANSMISSIONS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTransmission(t)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase border cursor-pointer ${
                        transmission === t
                          ? 'bg-[#090D16] text-white border-[#090D16]'
                          : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] font-mono uppercase">
                  <span className="text-[#64748B]">Max Rate:</span>
                  <span className="font-bold text-[#090D16]">{currency}{maxPrice}/day</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={maxAvailablePrice}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="accent-[#090D16] cursor-pointer"
                />
                <button
                  onClick={resetAllFilters}
                  className="self-end text-[9px] font-mono uppercase text-[#64748B] hover:text-[#090D16] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Grid */}
        {loadingCars ? (
          <div className="py-20 text-center text-xs font-mono tracking-widest text-[#64748B] uppercase">
            Querying atelier database...
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white border border-[#E2E8F0] rounded-lg flex flex-col items-center gap-3">
            <Filter className="w-8 h-8 text-[#94A3B8]" />
            <h3 className="text-base font-bold text-[#090D16] uppercase font-mono">No Matching Chassis Found</h3>
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 bg-[#090D16] text-white rounded text-xs font-mono uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <CarComparisonModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />
    </div>
  );
};

export default Cars;