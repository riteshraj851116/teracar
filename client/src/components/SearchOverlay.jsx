import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { X, ArrowRight, MapPin, Calendar, Car } from 'lucide-react';

const LOCATIONS = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Goa', 'Hyderabad', 'Jaipur'];
const CATEGORIES = ['ALL', 'SUV', 'LUXURY', 'SPORTS', 'ELECTRIC', 'SEDAN'];

const SearchOverlay = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext();

  const [location, setLocation] = useState('Delhi NCR');
  const [dropLocation, setDropLocation] = useState('Same as Pickup');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onClose();
    const query = new URLSearchParams();
    if (location) query.set('location', location);
    if (selectedCategory && selectedCategory !== 'ALL') {
      query.set('category', selectedCategory);
    }
    navigate(`/cars?${query.toString()}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-[#0B0B0B] text-[#F4F2ED] overflow-y-auto flex flex-col justify-between p-6 sm:p-12 lg:p-16 animate-fade-in select-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/14 pb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
          <span className="text-xs font-mono tracking-widest text-[#9B9B9B] uppercase">
            FIND YOUR CAR // ADVANCED SPEC SEARCH
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 border border-white/14 hover:border-white hover:bg-white hover:text-[#0B0B0B] transition-all cursor-pointer text-[#F4F2ED]"
          aria-label="Close search overlay"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Form: 16 — Advanced Search */}
      <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto w-full my-auto py-10 flex flex-col gap-12">
        
        {/* Large Heading 1: WHERE ARE YOU GOING? */}
        <div className="flex flex-col gap-5">
          <span className="text-xs font-mono tracking-widest text-[#C5A880] uppercase font-bold">
            01 // DESTINATION & SCHEDULE
          </span>

          <h2 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight uppercase leading-[0.95] text-[#F4F2ED]">
            WHERE ARE<br />
            YOU GOING?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#9B9B9B] block mb-2">
                PICKUP LOCATION
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="club-input"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} className="bg-[#141414] text-[#F4F2ED]">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#9B9B9B] block mb-2">
                DROP-OFF LOCATION
              </label>
              <input
                type="text"
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
                placeholder="Airport FBO, Hotel, or Same Location"
                className="club-input"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#9B9B9B] block mb-2">
                PICKUP DATE
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="club-input"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#9B9B9B] block mb-2">
                RETURN DATE
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="club-input"
              />
            </div>
          </div>
        </div>

        {/* Large Heading 2: WHAT DO YOU WANT TO DRIVE? */}
        <div className="flex flex-col gap-5 pt-8 border-t border-white/14">
          <span className="text-xs font-mono tracking-widest text-[#C5A880] uppercase font-bold">
            02 // CHASSIS PREFERENCE
          </span>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight uppercase leading-[0.95] text-[#F4F2ED]">
            WHAT DO YOU WANT<br />
            TO DRIVE?
          </h2>

          {/* Category Selector Buttons */}
          <div className="flex flex-wrap gap-3 mt-2">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-3 text-xs font-mono tracking-widest uppercase transition-all duration-300 border ${
                  selectedCategory === cat
                    ? 'bg-[#F4F2ED] text-[#0B0B0B] border-[#F4F2ED] font-bold shadow-lg'
                    : 'bg-[#141414] text-[#9B9B9B] border-white/14 hover:border-white/30 hover:text-[#F4F2ED]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 16 — CTA: SHOW CARS → */}
        <div className="pt-8 border-t border-white/14 flex items-center justify-between">
          <span className="text-xs font-mono text-[#9B9B9B] uppercase hidden sm:inline">
            DISPATCH ACTIVE ACROSS 6 AIRPORTS
          </span>

          <button
            type="submit"
            className="btn-club-primary py-4 px-8 text-xs font-bold w-full sm:w-auto"
          >
            <span>SHOW CARS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Bottom info */}
      <div className="border-t border-white/14 pt-6 text-center text-[10px] font-mono text-[#6E6E6E] uppercase">
        PRESS ESC OR ⌘K TO CLOSE
      </div>
    </div>
  );
};

export default SearchOverlay;
