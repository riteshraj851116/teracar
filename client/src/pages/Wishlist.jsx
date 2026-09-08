import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Trash2, ArrowUpRight, Heart } from 'lucide-react';

const Wishlist = () => {
  const { cars, favorites, toggleFavorite, currency } = useAppContext();
  const [hoveredCar, setHoveredCar] = useState(null);

  const savedCars = cars.filter((car) => favorites.includes(car._id));

  return (
    <div className="min-h-screen py-16 bg-[#0B0B0B] text-[#F4F2ED] select-none">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        {/* 23 — Heading: YOUR SELECTION */}
        <div className="pb-12 border-b border-white/14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
              <span className="text-xs font-mono tracking-widest text-[#C5A880] uppercase font-bold">
                CURATED SELECTION // 2026
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight uppercase leading-none text-[#F4F2ED]">
              YOUR SELECTION
            </h1>
          </div>
          <span className="text-xs font-mono text-[#9B9B9B] uppercase">
            01 — {String(savedCars.length).padStart(2, '0')} SPECIMENS SAVED
          </span>
        </div>

        {/* 23 — Saved Vehicles as Large Editorial Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 items-start">
          
          {/* Left Column: Numbered List */}
          <div className="lg:col-span-7">
            {savedCars.length > 0 ? (
              <div className="divide-y divide-white/14 border-t border-b border-white/14">
                {savedCars.map((car, idx) => {
                  const num = String(idx + 1).padStart(2, '0');
                  const price = Number(car.pricePerDay || car.price || 15000);

                  return (
                    <div
                      key={car._id}
                      onMouseEnter={() => setHoveredCar(car)}
                      className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-[#141414] px-3 transition-colors"
                    >
                      <div className="flex items-baseline gap-6">
                        <span className="text-xs font-mono text-[#6E6E6E]">{num}</span>
                        <div>
                          <Link
                            to={`/car/${car._id}`}
                            className="text-2xl sm:text-3xl font-display font-bold uppercase text-[#F4F2ED] group-hover:text-[#C5A880] transition-colors block"
                          >
                            {car.brand} {car.model}
                          </Link>
                          <div className="flex items-center gap-3 text-xs font-mono text-[#9B9B9B] uppercase mt-1">
                            <span>{car.category || 'Performance'}</span>
                            <span>//</span>
                            <span>{car.transmission || 'Automatic'}</span>
                            <span>//</span>
                            <span className="text-[#F4F2ED] font-bold">{currency}{price.toLocaleString()} / DAY</span>
                          </div>
                        </div>
                      </div>

                      {/* 23 — Actions: REMOVE, VIEW, BOOK */}
                      <div className="flex items-center gap-4 text-xs font-mono">
                        <button
                          onClick={() => toggleFavorite(car._id)}
                          className="text-[#9B9B9B] hover:text-red-400 uppercase transition-colors cursor-pointer"
                        >
                          REMOVE
                        </button>
                        <span className="text-white/20">|</span>
                        <Link
                          to={`/car/${car._id}`}
                          className="text-[#9B9B9B] hover:text-[#F4F2ED] uppercase transition-colors"
                        >
                          VIEW
                        </Link>
                        <span className="text-white/20">|</span>
                        <Link
                          to={`/car/${car._id}`}
                          className="btn-club-primary py-1.5 px-3 text-[10px] font-bold"
                        >
                          BOOK →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 text-center border border-white/14 bg-[#141414] p-8">
                <Heart className="w-8 h-8 text-[#6E6E6E] mx-auto mb-4" />
                <p className="text-sm font-mono uppercase text-[#9B9B9B] mb-6">
                  YOUR COLLECTION IS CURRENTLY EMPTY.
                </p>
                <Link to="/cars" className="btn-club-primary">
                  EXPLORE FLEET
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: 23 — Vehicle image appears on hover */}
          <div className="lg:col-span-5 hidden lg:block sticky top-24">
            <div className="bg-[#141414] border border-white/14 p-6 shadow-2xl">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] block mb-3 font-bold">
                SPECIMEN INSPECTION STAGE
              </span>

              {hoveredCar || savedCars[0] ? (
                <div>
                  <div className="aspect-16/10 bg-[#1B1B1B] border border-white/10 flex items-center justify-center p-4 mb-4">
                    <img
                      src={(hoveredCar || savedCars[0]).image}
                      alt=""
                      className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                    />
                  </div>
                  <div className="font-mono text-xs space-y-1">
                    <span className="text-lg font-bold text-[#F4F2ED] block uppercase">
                      {(hoveredCar || savedCars[0]).brand} {(hoveredCar || savedCars[0]).model}
                    </span>
                    <span className="text-[#9B9B9B] block">
                      LOCATION: {(hoveredCar || savedCars[0]).location || 'DELHI NCR'}
                    </span>
                    <span className="text-[#C5A880] font-bold block pt-2">
                      DISPATCH READY WITHIN 45 MINUTES
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-16/10 bg-[#1B1B1B] border border-white/10 flex items-center justify-center text-xs font-mono text-[#6E6E6E]">
                  HOVER A SPECIMEN TO PREVIEW
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
