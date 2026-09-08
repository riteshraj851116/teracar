import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { X, ArrowRight, MapPin, Calendar, Car } from 'lucide-react';

const LOCATIONS = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Goa', 'Jaipur', 'Hyderabad'];
const CATEGORIES = ['All Categories', 'Supercar', 'Luxury', 'SUV', 'Sports', 'Electric'];

const SearchOverlay = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext();

  const [location, setLocation] = useState('Delhi NCR');
  const [dropLocation, setDropLocation] = useState('Same Location');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

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
    if (selectedCategory && selectedCategory !== 'All Categories') {
      query.set('category', selectedCategory);
    }
    navigate(`/cars?${query.toString()}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-[#F3F1EC] text-[#111111] overflow-y-auto flex flex-col justify-between p-6 sm:p-12 lg:p-16 animate-fade-in"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#D8D5CF] pb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#651F2A]" />
          <span className="text-xs font-mono tracking-widest text-[#707070] uppercase">
            01 / ADVANCED FLEET SEARCH
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 border border-[#D8D5CF] hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-all cursor-pointer"
          aria-label="Close search overlay"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Multi-Step Query Form */}
      <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto w-full my-auto py-10 flex flex-col gap-12">
        
        {/* Step 1: WHERE */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-mono tracking-widest text-[#707070] uppercase">
            01 — WHERE ARE YOU GOING?
          </span>
          <h2 className="text-3xl sm:text-5xl font-editorial font-bold tracking-tight uppercase">
            PICKUP LOCATION
          </h2>
          <div className="flex flex-wrap gap-2 pt-2">
            {LOCATIONS.map((loc) => (
              <button
                type="button"
                key={loc}
                onClick={() => setLocation(loc)}
                className={`px-4 py-2 text-xs font-mono tracking-wider uppercase border transition-all cursor-pointer ${
                  location === loc
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#111111] border-[#D8D5CF] hover:border-[#111111]'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: WHEN */}
        <div className="flex flex-col gap-4 border-t border-[#D8D5CF] pt-10">
          <span className="text-xs font-mono tracking-widest text-[#707070] uppercase">
            02 — WHEN DO YOU NEED THE VEHICLE?
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-[#707070] uppercase">Pickup Date</label>
              <input
                type="date"
                value={pickupDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-white border border-[#D8D5CF] p-4 text-sm font-mono focus:border-[#111111] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-[#707070] uppercase">Return Date</label>
              <input
                type="date"
                value={returnDate}
                min={pickupDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-white border border-[#D8D5CF] p-4 text-sm font-mono focus:border-[#111111] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 3: WHAT DO YOU WANT */}
        <div className="flex flex-col gap-4 border-t border-[#D8D5CF] pt-10">
          <span className="text-xs font-mono tracking-widest text-[#707070] uppercase">
            03 — WHAT VEHICLE CLASS SUITS YOUR JOURNEY?
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-4 text-left border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#111111] border-[#D8D5CF] hover:border-[#111111]'
                }`}
              >
                <span className="text-sm font-editorial font-bold block uppercase">{cat}</span>
                <span className="text-[10px] font-mono opacity-60 block mt-1">
                  {cat === 'All Categories' ? 'Entire Fleet' : 'Editorial Spec'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <button
            type="submit"
            data-cursor="explore"
            data-cursor-text="SEARCH"
            className="w-full py-5 bg-[#651F2A] hover:bg-[#111111] text-white font-editorial font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md"
          >
            <span>SHOW AVAILABLE CARS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Bottom Footer Info */}
      <div className="border-t border-[#D8D5CF] pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#707070] uppercase">
        <span>PRESS [ESC] TO CLOSE</span>
        <span>CAR RENTAL — ALL-INCLUSIVE CHAUFFEUR & SELF-DRIVE</span>
      </div>
    </div>
  );
};

export default SearchOverlay;
