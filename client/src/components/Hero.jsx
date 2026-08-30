import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Gauge, 
  Zap, 
  Fuel, 
  ChevronRight,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { playUiClick } from '../utils/audioEngine';

const SHOWCASE_VEHICLES = [
  {
    id: "showcase-1",
    name: "Porsche 911 GT3 RS",
    category: "Hypercar",
    power: "518 BHP",
    accel: "3.0s",
    topSpeed: "296 KM/H",
    price: "₹45,000",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
    tag: "Track Ready"
  },
  {
    id: "showcase-2",
    name: "BMW M8 Gran Coupé",
    category: "Grand Tourer",
    power: "617 BHP",
    accel: "3.2s",
    topSpeed: "305 KM/H",
    price: "₹38,000",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop",
    tag: "Executive V8"
  },
  {
    id: "showcase-3",
    name: "Mercedes-AMG G63",
    category: "SUV",
    power: "577 BHP",
    accel: "4.5s",
    topSpeed: "240 KM/H",
    price: "₹42,000",
    image: "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?q=80&w=1200&auto=format&fit=crop",
    tag: "Bespoke Luxury"
  },
  {
    id: "showcase-4",
    name: "Audi RS e-tron GT",
    category: "Electric",
    power: "637 BHP",
    accel: "3.1s",
    topSpeed: "250 KM/H",
    price: "₹35,000",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop",
    tag: "Zero Emission"
  }
];

const Hero = () => {
  const { navigate, pickupDate, setPickupDate, returnDate, setReturnDate, cars } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [location, setLocation] = useState("Zurich");
  const [activeShowcaseIndex, setActiveShowcaseIndex] = useState(0);
  const [previewModalVehicle, setPreviewModalVehicle] = useState(null);

  const categories = ["All", "Hypercar", "SUV", "Sedan", "Electric"];

  const handleSearch = (e) => {
    e.preventDefault();
    playUiClick();
    navigate('/cars');
  };

  const currentVehicle = SHOWCASE_VEHICLES[activeShowcaseIndex];

  return (
    <section className="relative pt-6 pb-16 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      
      {/* ── Top Micro Tagline ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#E2E8F0] mb-8">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#090D16]" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-[#090D16]">
            SWISS MOBILITY ATELIER // EDITION 2026
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-wider text-[#64748B]">
          <span>GENEVA</span>
          <span>•</span>
          <span>ZURICH</span>
          <span>•</span>
          <span>DUBAI</span>
          <span>•</span>
          <span>MUMBAI</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* ─── LEFT COLUMN: Architectural Editorial & Quick-Book Console ─────── */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-bold uppercase tracking-tight text-[#090D16] leading-[1.02] font-editorial">
              Precision.
              <br />
              <span className="text-[#64748B] font-light italic font-serif-luxury lowercase text-4xl sm:text-5xl lg:text-[3.8rem] block -my-1">
                uncompromised
              </span>
              Mobility Fleet.
            </h1>
            <p className="text-sm text-[#475569] leading-relaxed max-w-lg pt-1">
              Curated supercars, high-performance GTs, and bespoke executive SUVs engineered for discerning drivers. White-glove concierge delivery anywhere in the region.
            </p>
          </div>

          {/* ── Minimalist Quick-Book Search Console ───────────────────────── */}
          <form 
            onSubmit={handleSearch}
            className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#090D16] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#090D16]" />
                QUICK-BOOK CONSOLE
              </span>
              <span className="text-[10px] font-mono uppercase text-[#64748B] tracking-wider">
                INSTANT CONFIRMATION
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { playUiClick(); setSelectedCategory(cat); }}
                  className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md border transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#090D16] text-white border-[#090D16]'
                      : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:border-[#090D16]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#090D16]" />
                  Hub
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded px-2.5 py-2 text-xs font-mono text-[#090D16] outline-none focus:border-[#090D16]"
                >
                  <option value="Zurich">Zurich Airport</option>
                  <option value="Geneva">Geneva Atelier</option>
                  <option value="London">London Mayfair</option>
                  <option value="New York">New York Soho</option>
                  <option value="Mumbai">Mumbai BKC</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#090D16]" />
                  Pickup
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded px-2.5 py-2 text-xs font-mono text-[#090D16] outline-none focus:border-[#090D16] cursor-pointer"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#090D16]" />
                  Return
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded px-2.5 py-2 text-xs font-mono text-[#090D16] outline-none focus:border-[#090D16] cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-[#090D16] hover:bg-[#1E293B] text-white rounded text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Search Fleet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/cars')}
                className="py-3 px-4 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#090D16] rounded text-xs font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                All ({cars.length || 16})
              </button>
            </div>
          </form>

          {/* Quick Specs Pillars */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E2E8F0]">
            <div>
              <p className="text-xl font-bold font-mono text-[#090D16]">100%</p>
              <p className="text-[10px] font-mono uppercase text-[#64748B] mt-0.5">Verified Chassis</p>
            </div>
            <div className="border-l border-[#E2E8F0] pl-4">
              <p className="text-xl font-bold font-mono text-[#090D16]">&lt; 2hr</p>
              <p className="text-[10px] font-mono uppercase text-[#64748B] mt-0.5">Concierge Delivery</p>
            </div>
            <div className="border-l border-[#E2E8F0] pl-4">
              <p className="text-xl font-bold font-mono text-[#090D16]">0%</p>
              <p className="text-[10px] font-mono uppercase text-[#64748B] mt-0.5">Security Friction</p>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Studio Interactive Showcase ──────────────────────── */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          
          {/* Main Showcase Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden relative shadow-sm group">
            
            {/* Top Bar */}
            <div className="p-4 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#64748B]">
                  FEATURED CHASSIS // 0{activeShowcaseIndex + 1}
                </span>
                <h3 className="text-lg font-bold text-[#090D16] uppercase font-editorial tracking-tight">
                  {currentVehicle.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-white border border-[#E2E8F0] rounded text-[10px] font-mono uppercase font-bold text-[#090D16]">
                  {currentVehicle.price}/DAY
                </span>
                <button
                  onClick={() => setPreviewModalVehicle(currentVehicle)}
                  title="Quick View Specifications"
                  className="p-1.5 bg-white border border-[#E2E8F0] hover:border-[#090D16] rounded transition-colors text-[#090D16] cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Vehicle Image Viewport */}
            <div className="relative h-64 sm:h-76 w-full bg-[#090D16] overflow-hidden flex items-center justify-center">
              <img
                src={currentVehicle.image}
                alt={currentVehicle.name}
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/80 via-transparent to-transparent pointer-events-none" />

              <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur-xs text-[#090D16] text-[9px] font-mono uppercase font-bold rounded">
                {currentVehicle.tag}
              </span>

              {/* Bottom Specs Strip over Image */}
              <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-md p-2.5 rounded border border-white/10 text-white">
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-neutral-400 uppercase">Power</span>
                  <span className="text-xs font-mono font-bold">{currentVehicle.power}</span>
                </div>
                <div className="flex flex-col border-l border-white/10 pl-2">
                  <span className="text-[8px] font-mono text-neutral-400 uppercase">0-100 KM/H</span>
                  <span className="text-xs font-mono font-bold">{currentVehicle.accel}</span>
                </div>
                <div className="flex flex-col border-l border-white/10 pl-2">
                  <span className="text-[8px] font-mono text-neutral-400 uppercase">Max Velocity</span>
                  <span className="text-xs font-mono font-bold">{currentVehicle.topSpeed}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 bg-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {SHOWCASE_VEHICLES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { playUiClick(); setActiveShowcaseIndex(idx); }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeShowcaseIndex === idx ? 'w-6 bg-[#090D16]' : 'w-2 bg-[#E2E8F0] hover:bg-[#94A3B8]'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewModalVehicle(currentVehicle)}
                  className="px-3 py-1.5 text-[10px] font-mono uppercase border border-[#E2E8F0] hover:border-[#090D16] rounded text-[#090D16] transition-colors cursor-pointer"
                >
                  Inspect Specs
                </button>
                <button
                  onClick={() => navigate('/cars')}
                  className="px-4 py-1.5 text-[10px] font-mono uppercase font-bold bg-[#090D16] hover:bg-[#1E293B] text-white rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Reserve</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Fleet Selection Bar */}
          <div className="grid grid-cols-4 gap-2">
            {SHOWCASE_VEHICLES.map((veh, idx) => (
              <button
                key={veh.id}
                onClick={() => { playUiClick(); setActiveShowcaseIndex(idx); }}
                className={`p-2 rounded border text-left transition-all cursor-pointer ${
                  activeShowcaseIndex === idx 
                    ? 'bg-white border-[#090D16] shadow-xs' 
                    : 'bg-[#F8FAFC] border-[#E2E8F0] opacity-70 hover:opacity-100'
                }`}
              >
                <p className="text-[9px] font-mono uppercase text-[#64748B] truncate">0{idx + 1}</p>
                <p className="text-[10px] font-bold text-[#090D16] uppercase truncate">{veh.name.split(' ')[0]}</p>
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* ── Quick Preview Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {previewModalVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#E2E8F0] rounded-lg max-w-lg w-full overflow-hidden shadow-2xl"
            >
              <div className="relative h-48 w-full bg-[#090D16]">
                <img
                  src={previewModalVehicle.image}
                  alt={previewModalVehicle.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPreviewModalVehicle(null)}
                  className="absolute top-3 right-3 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#64748B] tracking-wider">
                    {previewModalVehicle.category} // SWISS SPEC
                  </span>
                  <h4 className="text-xl font-bold text-[#090D16] uppercase font-editorial">
                    {previewModalVehicle.name}
                  </h4>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#64748B]">BHP Power</span>
                    <p className="text-sm font-mono font-bold text-[#090D16]">{previewModalVehicle.power}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#64748B]">0-100 KM/H</span>
                    <p className="text-sm font-mono font-bold text-[#090D16]">{previewModalVehicle.accel}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#64748B]">Top Speed</span>
                    <p className="text-sm font-mono font-bold text-[#090D16]">{previewModalVehicle.topSpeed}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-[10px] font-mono text-[#64748B] uppercase">Daily Rate</span>
                    <p className="text-base font-bold font-mono text-[#090D16]">{previewModalVehicle.price}</p>
                  </div>

                  <button
                    onClick={() => {
                      setPreviewModalVehicle(null);
                      navigate('/cars');
                    }}
                    className="py-2.5 px-5 bg-[#090D16] hover:bg-[#1E293B] text-white rounded text-xs font-mono uppercase font-bold transition-colors cursor-pointer"
                  >
                    Proceed to Reserve
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Hero;