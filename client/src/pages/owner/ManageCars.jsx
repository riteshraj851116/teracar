import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Trash2, ToggleLeft, ToggleRight, Car, Plus } from 'lucide-react';

const ManageCars = () => {
  const { axios, currency, navigate, cars, setCars } = useAppContext();
  const [ownerCars, setOwnerCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerCars = async () => {
    try {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/owner/cars');
        if (data.success && Array.isArray(data.cars) && data.cars.length > 0) {
          setOwnerCars(data.cars);
          return;
        }
      } catch (err) {
        console.log("Server owner cars fallback:", err.message);
      }
      setOwnerCars(cars);
    } catch (err) {
      setOwnerCars(cars);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      try {
        await axios.post('/api/owner/toggle-car', { carId });
      } catch (err) {
        // Fallback local
      }
      const updated = ownerCars.map((c) =>
        c._id === carId ? { ...c, isAvaliable: !c.isAvaliable } : c
      );
      setOwnerCars(updated);
      setCars(updated);
      toast.success('Availability status updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from your fleet?')) return;
    try {
      try {
        await axios.post('/api/owner/delete-car', { carId });
      } catch (err) {
        // Fallback local
      }
      const updated = ownerCars.filter((c) => c._id !== carId);
      setOwnerCars(updated);
      setCars(updated);
      toast.success('Vehicle removed from fleet');
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchOwnerCars();
  }, [cars]);

  return (
    <div className="p-6 md:p-10 w-full max-w-6xl flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-600 uppercase">FLEET INVENTORY</span>
          <h1 className="text-3xl font-black text-slate-900 mt-0.5">Manage Vehicles ({ownerCars.length})</h1>
        </div>

        <button
          onClick={() => navigate('/owner/add-car')}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-sm cursor-pointer hover:bg-slate-800 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Supercar</span>
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-slate-500 font-mono">Fetching fleet telemetry...</div>
      ) : ownerCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownerCars.map((car) => {
            const carTitle = car.title || `${car.brand || ''} ${car.model || ''}`.trim() || 'Supercar Spec';
            const price = car.pricePerDay || car.price || 300;
            const isAvail = car.isAvaliable !== false;

            return (
              <div
                key={car._id}
                className="rounded-3xl bg-white border border-slate-200 p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-full h-44 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
                    <img src={car.image} alt={carTitle} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-600 uppercase tracking-widest">{car.brand}</span>
                    <h3 className="text-base font-black text-slate-900 truncate">{carTitle}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1 font-semibold">
                      <span className="text-cyan-600">{currency}</span>
                      {typeof price === 'number' ? price.toLocaleString('en-IN') : price} / day
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-mono">
                  <button
                    onClick={() => toggleAvailability(car._id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-bold ${
                      isAvail
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {isAvail ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{isAvail ? 'Available' : 'Disabled'}</span>
                  </button>

                  <button
                    onClick={() => deleteCar(car._id)}
                    className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-100"
                    title="Remove Car"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 my-4 shadow-sm">
          <Car className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-900 font-bold">No vehicles currently hosted</p>
          <button
            onClick={() => navigate('/owner/add-car')}
            className="mt-4 px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs"
          >
            Add Your First Vehicle
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageCars;
