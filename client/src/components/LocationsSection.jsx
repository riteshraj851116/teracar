import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, MapPin, Radio, CheckCircle2 } from 'lucide-react';

const LOCATIONS = [
  {
    id: 'delhi',
    name: 'DELHI',
    code: 'DEL',
    vehicles: 24,
    address: 'Terminal 3 VIP Concierge / Aerocity Clubhouse, New Delhi',
    availability: 'IMMEDIATE DISPATCH READY',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'mumbai',
    name: 'MUMBAI',
    code: 'BOM',
    vehicles: 18,
    address: 'Bandra-Kurla Complex / Chhatrapati Shivaji FBO Terminal, Mumbai',
    availability: 'IMMEDIATE DISPATCH READY',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'bangalore',
    name: 'BANGALORE',
    code: 'BLR',
    vehicles: 16,
    address: 'UB City Private Lounge / Kempegowda FBO Dispatch, Bengaluru',
    availability: 'IMMEDIATE DISPATCH READY',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'goa',
    name: 'GOA',
    code: 'GOI',
    vehicles: 12,
    address: 'MOPA International Executive Tarmac / Candolim Coast Pavillion, Goa',
    availability: 'SEASONAL FLEET ACTIVE',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'hyderabad',
    name: 'HYDERABAD',
    code: 'HYD',
    vehicles: 14,
    address: 'Jubilee Hills Concierge / Shamshabad Airport VIP Hangar, Hyderabad',
    availability: 'IMMEDIATE DISPATCH READY',
    image: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'jaipur',
    name: 'JAIPUR',
    code: 'JAI',
    vehicles: 10,
    address: 'Civil Lines Heritage Enclave / Jaipur Airport Private Lounge, Jaipur',
    availability: 'IMMEDIATE DISPATCH READY',
    image: 'https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?q=80&w=1200&auto=format&fit=crop',
  },
];

const LocationsSection = () => {
  const navigate = useNavigate();
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0]);

  const handleSelectLocation = (loc) => {
    navigate(`/cars?location=${encodeURIComponent(loc.name)}`);
  };

  return (
    <section id="locations" className="py-28 bg-[#0B0B0B] border-b border-white/14 select-none">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        {/* 24 — Header: OUR LOCATIONS */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-white/14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
              <span className="text-xs font-mono tracking-widest text-[#C5A880] uppercase font-bold">
                05 // NETWORK
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight uppercase text-[#F4F2ED]">
              OUR LOCATIONS
            </h2>
          </div>
          <p className="text-xs font-mono text-[#9B9B9B] uppercase tracking-widest max-w-sm leading-relaxed">
            Private showroom dispatches and curbside airport delivery available across premier metropolitan hubs.
          </p>
        </div>

        {/* 24 — Large Typography Location List + Live Visual Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 items-center">
          
          {/* Left Column: Large Typography Cities */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-white/14">
            {LOCATIONS.map((loc, idx) => {
              const isSelected = activeLocation.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onMouseEnter={() => setActiveLocation(loc)}
                  onClick={() => handleSelectLocation(loc)}
                  data-cursor="explore"
                  data-cursor-text={loc.code}
                  className={`py-6 sm:py-8 flex items-center justify-between group cursor-pointer transition-all duration-300 ${
                    isSelected ? 'bg-[#141414] -mx-4 px-4 sm:-mx-6 sm:px-6' : 'hover:bg-[#141414]/40'
                  }`}
                >
                  <div className="flex items-baseline gap-6 sm:gap-10">
                    <span className="text-xs font-mono text-[#6E6E6E] select-none">
                      0{idx + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className={`text-3xl sm:text-5xl font-display font-bold tracking-tight uppercase transition-colors ${
                          isSelected ? 'text-[#C5A880]' : 'text-[#F4F2ED] group-hover:text-[#C5A880]'
                        }`}>
                          {loc.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 border border-white/20 text-[#9B9B9B] uppercase">
                          {loc.code}
                        </span>
                      </div>

                      <p className="text-xs font-mono text-[#9B9B9B] mt-2 max-w-md hidden sm:block">
                        {loc.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right font-mono hidden sm:block">
                      <span className="text-xs font-bold text-[#F4F2ED] block">
                        {loc.vehicles} VEHICLES
                      </span>
                      <span className="text-[9px] text-[#C5A880] uppercase tracking-widest block">
                        {loc.availability}
                      </span>
                    </div>

                    <div className={`w-9 h-9 border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#C5A880] bg-[#C5A880] text-[#0B0B0B]'
                        : 'border-white/20 group-hover:border-[#F4F2ED] text-[#F4F2ED]'
                    }`}>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Stage (Image, Address, Available Vehicles, Availability) */}
          <div className="lg:col-span-5">
            <div className="bg-[#141414] border border-white/14 p-5 shadow-2xl relative">
              
              {/* Telemetry Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[10px] font-mono uppercase">
                <div className="flex items-center gap-2 text-[#C5A880] font-bold">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>CLUB DISPATCH // {activeLocation.code}</span>
                </div>
                <span className="text-[#9B9B9B]">{activeLocation.availability}</span>
              </div>

              {/* Visual Frame */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-black border border-white/10">
                <img
                  src={activeLocation.image}
                  alt={activeLocation.name}
                  className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0B0B0B] via-transparent to-transparent opacity-85" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] block">
                    LOCATION SPOTLIGHT
                  </span>
                  <div className="text-2xl font-display font-bold uppercase mt-1">
                    {activeLocation.name} HUB
                  </div>
                </div>
              </div>

              {/* Location Details: Address & Vehicles */}
              <div className="pt-4 space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#1B1B1B] border border-white/10 flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-[#6E6E6E] uppercase block">HUB ADDRESS</span>
                    <span className="text-[#F4F2ED] text-[11px] leading-relaxed block">
                      {activeLocation.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[#9B9B9B] uppercase block text-[10px]">ACTIVE INVENTORY</span>
                    <span className="font-bold text-[#F4F2ED]">{activeLocation.vehicles} SPECIMENS READY</span>
                  </div>

                  <button
                    onClick={() => handleSelectLocation(activeLocation)}
                    data-cursor="explore"
                    data-cursor-text="VIEW"
                    className="btn-club-primary py-2 px-4 text-[10px]"
                  >
                    DISCOVER FLEET →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
