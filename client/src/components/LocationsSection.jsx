import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';

const LOCATIONS = [
  {
    id: 'delhi',
    name: 'DELHI NCR',
    code: 'DEL',
    vehicles: 24,
    description: 'Chauffeured diplomacy fleet & high-output grand tourers for the capital expressways.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'mumbai',
    name: 'MUMBAI',
    code: 'BOM',
    vehicles: 18,
    description: 'Coastal convertibles & executive flagship sedans tailored for Marine Drive & Bandra.',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'bangalore',
    name: 'BENGALURU',
    code: 'BLR',
    vehicles: 16,
    description: 'High-torque electric performance & luxury SUVs for modern tech corridors.',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'goa',
    name: 'GOA',
    code: 'GOI',
    vehicles: 12,
    description: 'Open-air roadsters and coastal performance cruisers for sun-drenched coastal highways.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'jaipur',
    name: 'JAIPUR',
    code: 'JAI',
    vehicles: 10,
    description: 'Royal grand tourers and rugged luxury cruisers crafted for heritage journeys.',
    image: 'https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'hyderabad',
    name: 'HYDERABAD',
    code: 'HYD',
    vehicles: 14,
    description: 'Executive saloons and performance hyper-sedans for the Cyberabad arterial roads.',
    image: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?q=80&w=1200&auto=format&fit=crop',
  },
];

const LocationsSection = () => {
  const navigate = useNavigate();
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0]);

  const handleSelectLocation = (loc) => {
    navigate(`/cars?location=${encodeURIComponent(loc.name)}`);
  };

  return (
    <section id="locations" className="py-24 bg-[#F3F1EC] border-b border-[#D8D5CF]">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#D8D5CF]">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono tracking-widest text-[#707070] uppercase">
                04 / LOCATIONS
              </span>
              <span className="w-8 h-px bg-[#D8D5CF]" />
              <span className="text-[10px] font-mono tracking-widest text-[#651F2A] uppercase font-bold">
                METROPOLITAN HUBS
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-editorial font-bold tracking-tight uppercase text-[#111111]">
              TACTILE HUBS.
            </h2>
          </div>
          <p className="text-xs font-mono text-[#707070] uppercase tracking-widest max-w-xs">
            Direct airport concierges & private showroom dispatches across six marquee destinations.
          </p>
        </div>

        {/* Split Editorial Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 items-center">
          
          {/* Left Column: Interactive Location List */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-[#D8D5CF]">
            {LOCATIONS.map((loc, idx) => {
              const isSelected = activeLocation.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onMouseEnter={() => setActiveLocation(loc)}
                  onClick={() => handleSelectLocation(loc)}
                  data-cursor="explore"
                  data-cursor-text="VIEW"
                  className={`py-6 flex items-center justify-between group cursor-pointer transition-all ${
                    isSelected ? 'bg-white/40 pl-4 pr-4' : 'hover:pl-2'
                  }`}
                >
                  <div className="flex items-baseline gap-6">
                    <span className="text-xs font-mono text-[#707070]">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className={`text-2xl sm:text-4xl font-editorial font-bold tracking-tight uppercase transition-colors ${
                        isSelected ? 'text-[#651F2A]' : 'text-[#111111] group-hover:text-[#651F2A]'
                      }`}>
                        {loc.name}
                      </h3>
                      <p className="text-xs font-body text-[#707070] mt-1 max-w-md hidden sm:block">
                        {loc.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right font-mono">
                      <span className="text-sm font-bold text-[#111111] block">
                        {loc.vehicles}
                      </span>
                      <span className="text-[9px] text-[#707070] uppercase tracking-wider block">
                        AVAILABLE
                      </span>
                    </div>

                    <div className={`w-8 h-8 rounded-full border border-[#D8D5CF] flex items-center justify-center transition-all ${
                      isSelected ? 'bg-[#111111] text-white border-[#111111]' : 'group-hover:border-[#111111]'
                    }`}>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Location Stage Image Preview */}
          <div className="lg:col-span-5 h-[420px] sm:h-[500px] border border-[#D8D5CF] relative overflow-hidden bg-[#EAE7E0] group">
            <img
              src={activeLocation.image}
              alt={activeLocation.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter saturate-[0.95]"
            />
            
            {/* Gradient Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
              <span className="text-xs font-mono tracking-widest uppercase text-white/70">
                HUB CODE: {activeLocation.code} // AIRPORT CONCIERGE
              </span>
              <h4 className="text-3xl font-editorial font-bold tracking-tight uppercase mt-1">
                {activeLocation.name}
              </h4>
              <p className="text-xs text-white/80 font-body mt-2 leading-relaxed">
                {activeLocation.description}
              </p>
              <div className="pt-4 mt-4 border-t border-white/20 flex items-center justify-between text-[10px] font-mono tracking-widest uppercase">
                <span>{activeLocation.vehicles} VEHICLES READY</span>
                <span className="text-white underline cursor-pointer" onClick={() => handleSelectLocation(activeLocation)}>
                  EXPLORE INVENTORY →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
