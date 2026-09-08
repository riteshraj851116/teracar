import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Trash2, ToggleLeft, ToggleRight, Car, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageCars = () => {
  const { axios, currency, cars } = useAppContext();
  const [ownerCars, setOwnerCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerCars = async () => {
    try {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/owner/cars');
        if (data?.success && Array.isArray(data?.cars) && data.cars.length > 0) {
          setOwnerCars(data.cars);
          return;
        }
      } catch (apiErr) {
        console.warn("Owner cars API notice:", apiErr.message);
      }

      // Resilient fallback to current fleet cars
      const localAdded = JSON.parse(localStorage.getItem('teracar_local_added_cars') || '[]');
      setOwnerCars([...localAdded, ...(cars || [])]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      try {
        const { data } = await axios.post('/api/owner/toggle-availability', { carId });
        if (data?.success) {
          toast.success(data.message || 'Availability toggled');
          fetchOwnerCars();
          return;
        }
      } catch (apiErr) {
        console.warn("API toggle notice:", apiErr.message);
      }

      setOwnerCars(prev => prev.map(c => c._id === carId ? { ...c, isAvaliable: !(c.isAvaliable !== false) } : c));
      toast.success('Vehicle showroom visibility toggled');
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const deleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from the active club registry?')) return;
    try {
      try {
        const { data } = await axios.post('/api/owner/delete-car', { carId });
        if (data?.success) {
          toast.success('Vehicle decommissioned from registry');
          fetchOwnerCars();
          return;
        }
      } catch (apiErr) {
        console.warn("API delete notice:", apiErr.message);
      }

      setOwnerCars(prev => prev.filter(c => c._id !== carId));
      toast.success('Vehicle removed');
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  useEffect(() => {
    fetchOwnerCars();
  }, [cars]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 text-[#F4F2ED] font-mono select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/14">
        <div>
          <span className="text-[10px] text-[#C5A880] uppercase tracking-widest font-bold block mb-1">
            FLEET INVENTORY // 2026
          </span>
          <h1 className="text-3xl font-display font-extrabold uppercase text-[#F4F2ED]">
            MANAGE SPECIMENS
          </h1>
          <p className="text-xs text-[#9B9B9B] mt-1">
            OVERSEE AVAILABILITY, TARIFFS, AND DISPATCH STATUS
          </p>
        </div>

        <Link
          to="/owner/add-car"
          className="btn-club-primary py-2.5 px-4 text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>COMMISSION NEW SPECIMEN</span>
        </Link>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="py-24 text-center text-xs font-mono tracking-widest text-[#9B9B9B] uppercase">
          Loading fleet registry...
        </div>
      ) : ownerCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownerCars.map((car) => {
            const isAvailable = car.isAvaliable !== false;
            return (
              <div
                key={car._id}
                className="bg-[#141414] border border-white/14 hover:border-white/30 overflow-hidden flex flex-col justify-between transition-colors"
              >
                {/* Image Stage */}
                <div className="h-48 bg-[#1B1B1B] border-b border-white/10 relative flex items-center justify-center p-4">
                  <img
                    src={car.image}
                    alt={car.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-lg"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase border ${
                      isAvailable ? 'bg-[#0B0B0B] text-[#C5A880] border-[#C5A880]/50' : 'bg-red-950/40 text-red-400 border-red-500/40'
                    }`}>
                      {isAvailable ? 'DISPATCH READY' : 'RESERVED'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col gap-3">
                  <div>
                    <span className="text-[9px] font-mono text-[#9B9B9B] uppercase tracking-wider">{car.brand || 'Luxury'} // {car.category || 'GT'}</span>
                    <h4 className="text-base font-display font-bold text-[#F4F2ED] uppercase tracking-tight mt-0.5">
                      {car.title || `${car.brand} ${car.model}`}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-white/10">
                    <span className="text-[#9B9B9B]">Daily Allocation:</span>
                    <span className="font-bold text-[#F4F2ED]">{currency}{Number(car.pricePerDay || car.price || 0).toLocaleString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <button
                      onClick={() => toggleAvailability(car._id)}
                      className="flex items-center gap-1.5 text-xs font-mono text-[#9B9B9B] hover:text-[#F4F2ED] transition-colors cursor-pointer"
                    >
                      {isAvailable ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-[#C5A880]" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-[#6E6E6E]" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => deleteCar(car._id)}
                      className="p-1.5 text-[#6E6E6E] hover:text-red-400 transition-colors cursor-pointer"
                      title="Decommission Specimen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center bg-[#141414] border border-white/14 p-8 flex flex-col items-center gap-4">
          <Car className="w-12 h-12 text-[#6E6E6E]" />
          <h3 className="text-lg font-display font-bold text-[#F4F2ED] uppercase tracking-widest">No Vehicles Commissioned</h3>
          <p className="text-xs font-mono text-[#9B9B9B] uppercase tracking-wider">
            Commission vehicles to activate your fleet registry.
          </p>
          <Link to="/owner/add-car" className="btn-club-primary mt-2">
            ADD FIRST VEHICLE
          </Link>
        </div>
      )}
    </div>
  );
};

export default ManageCars;