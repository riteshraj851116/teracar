import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Gauge, Fuel, Users, MapPin, Zap, Scale } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const CarComparisonModal = ({ isOpen, onClose, initialCar }) => {
  const { cars, currency, navigate } = useAppContext();
  const [selectedCars, setSelectedCars] = useState(
    initialCar ? [initialCar, cars.find(c => c._id !== initialCar._id) || cars[0]].filter(Boolean) : [cars[0], cars[1]].filter(Boolean)
  );

  if (!isOpen) return null;

  const handleSelectCar = (index, carId) => {
    const found = cars.find(c => c._id === carId);
    if (!found) return;
    const updated = [...selectedCars];
    updated[index] = found;
    setSelectedCars(updated);
  };

  const handleAddComparisonSlot = () => {
    if (selectedCars.length >= 3) return;
    const remaining = cars.find(c => !selectedCars.some(sc => sc._id === c._id));
    if (remaining) {
      setSelectedCars([...selectedCars, remaining]);
    }
  };

  const handleRemoveSlot = (index) => {
    if (selectedCars.length <= 1) return;
    setSelectedCars(selectedCars.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-fade-in select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-[#141414] border border-white/14 p-6 md:p-10 shadow-2xl overflow-y-auto flex flex-col gap-6 text-[#F4F2ED] font-mono"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/14 pb-5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] tracking-widest text-[#C5A880] uppercase font-bold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>FLEET COMPARISON MATRIX // 2026</span>
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-tight text-[#F4F2ED]">
              SIDE-BY-SIDE SPECIFICATIONS
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {selectedCars.length < 3 && cars.length > selectedCars.length && (
              <button
                onClick={handleAddComparisonSlot}
                className="px-3 py-1.5 bg-[#1B1B1B] hover:bg-[#242424] text-[#F4F2ED] border border-white/14 text-[10px] uppercase transition-colors cursor-pointer"
              >
                + ADD SPECIMEN
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 border border-white/14 hover:border-white text-[#9B9B9B] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comparison Columns Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-${selectedCars.length} gap-6`}>
          {selectedCars.map((car, idx) => (
            <div key={car._id || idx} className="bg-[#1B1B1B] border border-white/10 p-5 flex flex-col justify-between">
              
              {/* Select Switcher */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] text-[#C5A880] uppercase">SLOT 0{idx + 1}</span>
                  {selectedCars.length > 1 && (
                    <button
                      onClick={() => handleRemoveSlot(idx)}
                      className="text-[10px] text-[#6E6E6E] hover:text-red-400 uppercase cursor-pointer"
                    >
                      REMOVE
                    </button>
                  )}
                </div>

                <select
                  value={car._id}
                  onChange={(e) => handleSelectCar(idx, e.target.value)}
                  className="club-input text-xs mb-4"
                >
                  {cars.map((c) => (
                    <option key={c._id} value={c._id} className="bg-[#141414] text-[#F4F2ED]">
                      {c.brand} {c.model}
                    </option>
                  ))}
                </select>

                {/* Vehicle Image Stage */}
                <div className="h-36 bg-[#141414] border border-white/10 flex items-center justify-center p-3 mb-4">
                  <img
                    src={car.image}
                    alt={car.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  />
                </div>

                {/* Specs Table */}
                <div className="divide-y divide-white/10 text-xs text-[#9B9B9B] space-y-2 pt-2">
                  <div className="flex justify-between py-1.5">
                    <span>MARQUE</span>
                    <span className="text-[#F4F2ED] font-bold">{car.brand}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>CATEGORY</span>
                    <span className="text-[#F4F2ED] font-bold">{car.category || 'GT'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>TRANSMISSION</span>
                    <span className="text-[#F4F2ED] font-bold">{car.transmission || 'Automatic'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>FUEL SYSTEM</span>
                    <span className="text-[#F4F2ED] font-bold">{car.fuel_type || car.fuel || 'Petrol'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>CAPACITY</span>
                    <span className="text-[#F4F2ED] font-bold">{car.seating_capacity || car.seats || 2} SEATS</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>LOCATION HUB</span>
                    <span className="text-[#C5A880] font-bold">{car.location || 'DELHI NCR'}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#6E6E6E] uppercase block">DAILY TARIFF</span>
                  <span className="text-lg font-bold text-[#F4F2ED]">
                    {currency}{Number(car.pricePerDay || car.price || 12000).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    navigate(`/car/${car._id}`);
                  }}
                  className="btn-club-primary py-2 px-3.5 text-[10px] font-bold"
                >
                  <span>SELECT</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CarComparisonModal;
