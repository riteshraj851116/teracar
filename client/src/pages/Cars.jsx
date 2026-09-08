import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import CarCard from '../components/CarCard';
import {
  Search,
  SlidersHorizontal,
  Filter,
  Fuel,
  Settings2,
  ArrowUpDown,
  RotateCcw,
  X,
  Users,
  ChevronDown,
  ChevronUp,
  Car
} from 'lucide-react';

const CATEGORIES = ['All', 'Economy', 'Sedan', 'SUV', 'Luxury', 'Sports', 'Convertible', 'Electric', 'Van', 'Supercar'];
const FUEL_TYPES = ['All', 'Petrol', 'Hybrid', 'Diesel', 'Electric'];
const TRANSMISSIONS = ['All', 'Automatic', 'Semi-Automatic', 'Manual'];
const SEAT_OPTIONS = ['All', '2', '4', '5', '7+'];
const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'luxury', label: 'Luxury First' },
];

const FilterSection = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-accent" />}
          {title}
        </span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
      </button>
      {isOpen && children}
    </div>
  );
};

const PillSelect = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-1.5">
    {options.map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
          value === opt
            ? 'bg-accent text-white border-accent'
            : 'bg-white text-text-secondary border-border hover:border-accent hover:text-accent'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const Cars = () => {
  const { cars, loadingCars, currency } = useAppContext();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [fuelType, setFuelType] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [seats, setSeats] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const maxAvailablePrice = useMemo(() => {
    if (!cars.length) return 5000;
    return Math.max(...cars.map(c => Number(c.pricePerDay || c.price || 0)), 2000);
  }, [cars]);

  const filteredCars = useMemo(() => {
    return cars
      .filter((c) => {
        const q = search.toLowerCase();
        const matchesSearch = !search ||
          c.title?.toLowerCase().includes(q) ||
          c.model?.toLowerCase().includes(q) ||
          c.brand?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q);

        const matchesCategory = category === 'All' || c.category?.toLowerCase() === category.toLowerCase();

        const carFuel = (c.fuel_type || c.fuelType || '').toLowerCase();
        const matchesFuel = fuelType === 'All' || carFuel.includes(fuelType.toLowerCase());

        const carTrans = (c.transmission || '').toLowerCase();
        const matchesTransmission = transmission === 'All' || carTrans.includes(transmission.toLowerCase());

        const carSeats = Number(c.seating_capacity || c.seats || 4);
        const matchesSeats = seats === 'All' ||
          (seats === '7+' ? carSeats >= 7 : carSeats === Number(seats));

        const price = Number(c.pricePerDay || c.price || 0);
        const matchesPrice = price <= maxPrice;

        return matchesSearch && matchesCategory && matchesFuel && matchesTransmission && matchesSeats && matchesPrice;
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
          case 'luxury': return priceB - priceA;
          default: return 0;
        }
      });
  }, [cars, search, category, fuelType, transmission, seats, maxPrice, sortBy]);

  const activeFiltersCount = [category, fuelType, transmission, seats].filter(v => v !== 'All').length + (maxPrice < maxAvailablePrice ? 1 : 0);

  const resetAllFilters = () => {
    setSearch('');
    setCategory('All');
    setFuelType('All');
    setTransmission('All');
    setSeats('All');
    setSortBy('recommended');
    setMaxPrice(maxAvailablePrice);
  };

  const FilterContent = () => (
    <div className="space-y-0">
      <FilterSection title="Category" icon={Car}>
        <PillSelect options={CATEGORIES} value={category} onChange={setCategory} />
      </FilterSection>

      <FilterSection title="Price Range" icon={null}>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Max: <strong className="text-text-primary">{currency}{maxPrice}/day</strong></span>
          </div>
          <input
            type="range"
            min={50}
            max={maxAvailablePrice}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-accent cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>{currency}50</span>
            <span>{currency}{maxAvailablePrice}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Transmission" icon={Settings2}>
        <PillSelect options={TRANSMISSIONS} value={transmission} onChange={setTransmission} />
      </FilterSection>

      <FilterSection title="Fuel Type" icon={Fuel}>
        <PillSelect options={FUEL_TYPES} value={fuelType} onChange={setFuelType} />
      </FilterSection>

      <FilterSection title="Seats" icon={Users}>
        <PillSelect options={SEAT_OPTIONS} value={seats} onChange={setSeats} />
      </FilterSection>

      {activeFiltersCount > 0 && (
        <button
          onClick={resetAllFilters}
          className="flex items-center gap-2 w-full justify-center py-2.5 text-sm text-accent hover:text-accent-dark transition-colors mt-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-10 max-w-[1400px] mx-auto section-padding">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-[2px] bg-accent" />
            <span className="text-xs font-medium tracking-[0.15em] text-accent uppercase">
              {filteredCars.length} vehicles available
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary font-editorial tracking-tight">
            Browse Cars
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden btn-outline px-4 py-2.5 text-sm rounded-lg"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm text-text-primary outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="sticky top-24 bg-white rounded-xl border border-border p-5">
            {/* Search */}
            <div className="relative mb-5 pb-5 border-b border-border">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cars..."
                className="premium-input pl-9 text-sm"
              />
            </div>

            <FilterContent />
          </div>
        </aside>

        {/* Car Results */}
        <div className="flex-1 min-w-0">
          {/* Search bar on mobile */}
          <div className="lg:hidden mb-6">
            <div className="relative">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cars..."
                className="premium-input pl-10 text-sm"
              />
            </div>
          </div>

          {loadingCars ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
                  <div className="h-52 skeleton" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-3/4 skeleton" />
                    <div className="h-4 w-1/2 skeleton" />
                    <div className="h-4 w-full skeleton" />
                    <div className="h-10 w-full skeleton mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-border">
              <Filter className="w-10 h-10 text-text-muted mb-3" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">No cars found</h3>
              <p className="text-sm text-text-secondary mb-4">Try adjusting your filters to see more results.</p>
              <button
                onClick={resetAllFilters}
                className="btn-primary px-6 py-2.5 rounded-lg text-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-[320px] max-w-[90vw] bg-white z-[70] shadow-2xl flex flex-col lg:hidden animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-base font-semibold text-text-primary">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterContent />
            </div>
            <div className="p-4 border-t border-border">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-primary w-full py-3 rounded-lg text-sm"
              >
                Show {filteredCars.length} Results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cars;