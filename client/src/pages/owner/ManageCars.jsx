import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Trash2, ToggleLeft, ToggleRight, Car, Plus } from 'lucide-react';

const ManageCars = () => {
  const { axios, currency, navigate } = useAppContext();
  const [ownerCars, setOwnerCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerCars = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/owner/cars');
      if (data.success) {
        setOwnerCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-car', { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from your fleet?')) return;
    try {
      const { data } = await axios.post('/api/owner/delete-car', { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchOwnerCars();
  }, []);

  return (
    <div className="p-6 md:p-10 w-full max-w-6xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">FLEET INVENTORY</span>
          <h1 className="text-3xl font-black text-white">Manage Vehicles ({ownerCars.length})</h1>
        </div>

        <button
          onClick={() => navigate('/owner/add-car')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Supercar</span>
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-slate-400 font-mono">Fetching fleet telemetry...</div>
      ) : ownerCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownerCars.map((car) => (
            <div
              key={car._id}
              className="rounded-2xl glass-card border border-white/10 p-4 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-3">
                <div className="w-full h-40 bg-slate-950 rounded-xl overflow-hidden">
                  <img src={car.image} alt={car.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">{car.brand}</span>
                  <h3 className="text-base font-bold text-white truncate">{car.title}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    {currency}
                    {car.pricePerDay || car.price} / day
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono">
                <button
                  onClick={() => toggleAvailability(car._id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    car.isAvaliable
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {car.isAvaliable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{car.isAvaliable ? 'Available' : 'Disabled'}</span>
                </button>

                <button
                  onClick={() => deleteCar(car._id)}
                  className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                  title="Remove Car"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center glass-card rounded-3xl border border-white/10 my-4">
          <Car className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 font-bold">No vehicles currently hosted</p>
          <button
            onClick={() => navigate('/owner/add-car')}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Add Your First Vehicle
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageCars;
