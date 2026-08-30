import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/owner/Title';
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
      if (data?.success && Array.isArray(data?.cars)) {
        setOwnerCars(data.cars);
      } else {
        toast.error(data?.message || 'Failed to fetch vehicles');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-car', { carId });
      if (data?.success) {
        toast.success(data.message || 'Availability toggled');
        fetchOwnerCars();
      } else {
        toast.error(data?.message || 'Action failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const deleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from your active fleet?')) return;
    try {
      const { data } = await axios.post('/api/owner/delete-car', { carId });
      if (data?.success) {
        toast.success(data.message || 'Vehicle removed from fleet');
        fetchOwnerCars();
      } else {
        toast.error(data?.message || 'Removal failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchOwnerCars();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#e2e8f0] pb-5">
        <Title 
          title={`Manage Fleet Vehicles (${ownerCars.length})`}
          subTitle="Control vehicle availability in showroom, adjust pricing, or remove vehicles."
        />

        <button
          onClick={() => navigate('/owner/add-car')}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#090d16] hover:bg-[#1e293b] text-white rounded-xl text-[10px] font-bold font-mono tracking-[0.18em] uppercase cursor-pointer shadow-md transition-all shrink-0 self-start sm:self-auto mb-6"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="py-24 text-center text-xs font-mono tracking-widest text-[#64748b] uppercase">
          Fetching fleet vehicles...
        </div>
      ) : ownerCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownerCars.map((car) => (
            <div
              key={car._id}
              className="bg-white border border-[#e2e8f0] hover:border-[#090d16] rounded-2xl flex flex-col justify-between shadow-[0_4px_24px_rgba(9,13,22,0.03)] hover:shadow-[0_12px_36px_rgba(9,13,22,0.08)] transition-all duration-300 group overflow-hidden"
            >
              <div className="flex flex-col">
                {/* Image Container */}
                <div className="w-full h-56 bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] overflow-hidden relative p-4 flex items-center justify-center">
                  <img 
                    src={car.image} 
                    alt={car.title} 
                    className="w-full h-full object-contain group-hover:scale-106 transition-transform duration-500 filter drop-shadow-md" 
                  />
                  {/* Status Overlay */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className={`px-3 py-1 text-[9px] font-mono font-bold tracking-wider uppercase border rounded-full ${
                      car.isAvaliable 
                        ? 'text-emerald-800 border-emerald-300 bg-emerald-50' 
                        : 'text-[#64748b] border-[#e2e8f0] bg-white'
                    }`}>
                      {car.isAvaliable ? 'Available' : 'Offline'}
                    </span>
                  </div>
                </div>

                {/* Car Details */}
                <div className="p-6 pb-2">
                  <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-[0.2em] font-bold">
                    {car.brand || 'Luxury Spec'}
                  </span>
                  <h3 className="text-lg font-black text-[#090d16] uppercase tracking-tight truncate mt-1">
                    {car.title}
                  </h3>
                  <div className="flex items-baseline gap-0.5 mt-2">
                    <span className="text-xs font-bold text-[#2563eb] font-mono">{currency}</span>
                    <span className="text-2xl font-black text-[#090d16] font-mono leading-none">
                      {car.pricePerDay || car.price}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider ml-1">/ Day</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-[#e2e8f0] mt-auto">
                <button
                  onClick={() => toggleAvailability(car._id)}
                  className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold font-mono tracking-wider uppercase border rounded-xl transition-all cursor-pointer ${
                    car.isAvaliable
                      ? 'bg-[#090d16] text-white border-[#090d16]'
                      : 'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0] hover:border-[#090d16]'
                  }`}
                >
                  {car.isAvaliable ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{car.isAvaliable ? 'Active' : 'Offline'}</span>
                </button>

                <button
                  onClick={() => deleteCar(car._id)}
                  className="p-2.5 text-[#64748b] hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-200 rounded-xl"
                  title="Remove Vehicle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white border border-[#e2e8f0] rounded-3xl flex flex-col items-center gap-4 shadow-sm">
          <Car className="w-12 h-12 text-[#64748b]/40" />
          <h3 className="text-xl font-black text-[#090d16] uppercase tracking-widest">No Vehicles Hosted</h3>
          <p className="text-xs font-mono text-[#64748b] uppercase tracking-wider">
            Start listing your luxury fleet to receive instant bookings.
          </p>
          <button
            onClick={() => navigate('/owner/add-car')}
            className="mt-2 px-8 py-4 bg-[#090d16] hover:bg-[#1e293b] text-white rounded-xl text-[10px] font-bold font-mono uppercase tracking-[0.18em] flex items-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Your First Vehicle</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageCars;