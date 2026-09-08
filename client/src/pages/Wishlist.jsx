import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Trash2, ArrowUpRight } from 'lucide-react';

const Wishlist = () => {
  const { cars, favorites, toggleFavorite, currency } = useAppContext();
  const [hoveredCar, setHoveredCar] = useState(null);

  const savedCars = cars.filter((car) => favorites.includes(car._id));

  return (
    <div className="min-h-screen py-12 bg-[#F3F1EC] text-[#111111]">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        {/* Header */}
        <div className="pb-10 border-b border-[#D8D5CF] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#707070] uppercase block mb-2">
              CURATED SELECTION
            </span>
            <h1 className="text-4xl sm:text-6xl font-editorial font-bold tracking-tight uppercase leading-none text-[#111111]">
              SAVED VEHICLES.
            </h1>
          </div>
          <span className="text-xs font-mono text-[#707070] uppercase">
            01 — {String(savedCars.length).padStart(2, '0')} VEHICLES IN YOUR COLLECTION
          </span>
        </div>

        {/* Saved Vehicles List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 items-start">
          
          {/* Left Column: Numbered List */}
          <div className="lg:col-span-7">
            {savedCars.length > 0 ? (
              <div className="divide-y divide-[#D8D5CF] border-t border-b border-[#D8D5CF]">
                {savedCars.map((car, idx) => {
                  const num = String(idx + 1).padStart(2, '0');
                  const price = Number(car.pricePerDay || car.price || 12000);

                  return (
                    <div
                      key={car._id}
                      onMouseEnter={() => setHoveredCar(car)}
                      className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-white/40 px-2 transition-colors"
                    >
                      <div className="flex items-baseline gap-6">
                        <span className="text-xs font-mono text-[#707070]">{num}</span>
                        <div>
                          <Link
                            to={`/car/${car._id}`}
                            className="text-2xl sm:text-3xl font-editorial font-bold uppercase text-[#111111] group-hover:text-[#651F2A] transition-colors block"
                          >
                            {car.brand} {car.model}
                          </Link>
                          <div className="flex items-center gap-3 text-xs font-mono text-[#707070] uppercase mt-1">
                            <span>{car.category || 'Luxury'}</span>
                            <span>•</span>
                            <span>{car.transmission || 'Automatic'}</span>
                            <span>•</span>
                            <span className="text-[#111111] font-bold">{currency}{price.toLocaleString()} / DAY</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Link
                          to={`/car/${car._id}`}
                          className="px-4 py-2 bg-[#111111] hover:bg-[#651F2A] text-white text-xs font-mono uppercase font-bold flex items-center gap-2"
                        >
                          <span>RESERVE</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => toggleFavorite(car._id)}
                          className="p-2 text-[#707070] hover:text-rose-700 border border-[#D8D5CF] hover:border-rose-300 transition-colors cursor-pointer"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 text-center border border-[#D8D5CF] bg-white p-8">
                <span className="text-xs font-mono uppercase tracking-widest text-[#707070] block mb-2">
                  SAVED COLLECTION IS EMPTY
                </span>
                <p className="text-sm font-body text-[#707070] mb-6">
                  Save vehicles from the fleet catalog to review and compare before reserving.
                </p>
                <Link
                  to="/cars"
                  className="px-6 py-3 bg-[#111111] text-white text-xs font-mono uppercase font-bold inline-block"
                >
                  BROWSE ALL VEHICLES
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Preview Stage */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28 border border-[#D8D5CF] bg-white p-8">
            <span className="text-xs font-mono text-[#707070] uppercase tracking-widest block mb-4">
              ARCHIVE IMAGE PREVIEW
            </span>
            <div className="h-64 bg-[#F3F1EC] border border-[#D8D5CF] p-4 flex items-center justify-center">
              <img
                src={
                  hoveredCar?.image ||
                  savedCars[0]?.image ||
                  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop'
                }
                alt=""
                className="max-h-full max-w-full object-contain filter drop-shadow-md"
              />
            </div>
            <div className="pt-4 mt-4 border-t border-[#D8D5CF] text-xs font-mono text-[#707070] uppercase flex justify-between">
              <span>{hoveredCar ? `${hoveredCar.brand} ${hoveredCar.model}` : 'SELECT TO INSPECT'}</span>
              <span>VERIFIED CHASSIS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
