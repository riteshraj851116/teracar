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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-white border border-[#E6DFD5] rounded-3xl p-6 md:p-10 shadow-[0_24px_70px_rgba(43,27,20,0.18)] overflow-y-auto scrollbar-none flex flex-col gap-6"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#5C3A2E] uppercase font-bold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#5C3A2E]" />
              <span>Fleet Telemetry Comparison</span>
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#2B1B14]">
              Side-by-Side Vehicle Specs
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {selectedCars.length < 3 && cars.length > selectedCars.length && (
              <button
                onClick={handleAddComparisonSlot}
                className="px-4 py-2 bg-[#F7F3EE] hover:bg-[#EAE3D9] text-[#2B1B14] border border-[#E6DFD5] rounded-xl text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer"
              >
                + Add Vehicle
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#7A5244] hover:text-[#2B1B14] hover:bg-[#F7F3EE] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedCars.map((car, idx) => (
            <div
              key={car._id || idx}
              className="bg-[#FCFAF7] border border-[#E6DFD5] rounded-2xl p-5 flex flex-col justify-between gap-5 relative shadow-xs"
            >
              {selectedCars.length > 1 && (
                <button
                  onClick={() => handleRemoveSlot(idx)}
                  className="absolute top-3 right-3 p-1 text-[#7A5244] hover:text-rose-600 rounded-full hover:bg-rose-50 cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Vehicle Dropdown Selector */}
              <div className="flex flex-col gap-2">
                <select
                  value={car._id}
                  onChange={(e) => handleSelectCar(idx, e.target.value)}
                  className="w-full bg-white border border-[#E6DFD5] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#2B1B14] uppercase outline-none cursor-pointer"
                >
                  {cars.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title || `${c.brand} ${c.model}`}
                    </option>
                  ))}
                </select>

                {/* Car Photo */}
                <div className="w-full h-40 bg-white border border-[#E6DFD5] rounded-xl overflow-hidden flex items-center justify-center p-3">
                  <img src={car.image} alt={car.title} className="w-full h-full object-contain filter drop-shadow-md" />
                </div>
              </div>

              {/* Specs Rows */}
              <div className="flex flex-col divide-y divide-[#E6DFD5] text-[11px] font-mono">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#7A5244] font-semibold">Category</span>
                  <span className="text-[#2B1B14] font-bold uppercase">{car.category || 'Supercar'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#7A5244] font-semibold">Daily Allocation</span>
                  <span className="text-[#5C3A2E] font-black text-sm">{currency}{car.pricePerDay || car.price}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#7A5244] font-semibold">Transmission</span>
                  <span className="text-[#2B1B14] font-bold">{car.transmission || 'Automatic'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#7A5244] font-semibold">Powertrain</span>
                  <span className="text-[#2B1B14] font-bold">{car.fuel_type || car.fuelType || 'Petrol'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#7A5244] font-semibold">Seating</span>
                  <span className="text-[#2B1B14] font-bold">{car.seating_capacity || car.seats || 2} Seats</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#7A5244] font-semibold">Dispatch Hub</span>
                  <span className="text-[#2B1B14] font-bold truncate max-w-[140px]">{car.location || 'Miami / HQ'}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  onClose();
                  navigate(`/car-details/${car._id}`);
                }}
                className="w-full py-3 bg-[#2B1B14] hover:bg-[#5C3A2E] text-white rounded-xl text-[10px] font-mono font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CarComparisonModal;
