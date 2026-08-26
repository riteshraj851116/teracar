import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Upload, Car, Plus, Sparkles } from 'lucide-react';

const AddCar = () => {
  const { axios, navigate, fetchCars } = useAppContext();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState({
    title: '',
    brand: '',
    category: 'Supercar',
    pricePerDay: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 2,
    location: '',
    description: '',
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please upload a high-resolution vehicle image');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', image);
      formData.append('carData', JSON.stringify(carData));

      const { data } = await axios.post('/api/owner/add-car', formData);

      if (data.success) {
        toast.success('Supercar listed successfully!');
        fetchCars();
        navigate('/owner/manage-cars');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 w-full max-w-4xl flex flex-col gap-6">
      <div>
        <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">NEW FLEET LISTING</span>
        <h1 className="text-3xl font-black text-white">Host A Supercar</h1>
      </div>

      <form onSubmit={onSubmitHandler} className="p-8 rounded-3xl glass-card border border-white/10 flex flex-col gap-6">
        {/* Image Upload Box */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-cyan-400">Vehicle Cover Image</label>
          <label
            htmlFor="car-cover"
            className="w-full h-52 rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 bg-slate-950/60 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative"
          >
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Upload className="w-8 h-8 text-cyan-400" />
                <span className="text-xs font-mono">Upload High-Res Vehicle Photo (WebP/PNG/JPG)</span>
              </div>
            )}
            <input type="file" id="car-cover" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
          </label>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="flex flex-col gap-1">
            <label className="text-slate-400">Vehicle Title / Model Name</label>
            <input
              type="text"
              placeholder="e.g. Porsche 911 GT3 RS"
              value={carData.title}
              onChange={(e) => setCarData({ ...carData, title: e.target.value })}
              className="glass-input p-3 rounded-xl outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-400">Brand / Manufacturer</label>
            <input
              type="text"
              placeholder="e.g. Porsche, Ferrari, Lamborghini"
              value={carData.brand}
              onChange={(e) => setCarData({ ...carData, brand: e.target.value })}
              className="glass-input p-3 rounded-xl outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-400">Category</label>
            <select
              value={carData.category}
              onChange={(e) => setCarData({ ...carData, category: e.target.value })}
              className="glass-input p-3 rounded-xl outline-none bg-slate-900 text-slate-200"
            >
              <option value="Supercar">Supercar</option>
              <option value="Luxury">Luxury</option>
              <option value="Electric">Electric</option>
              <option value="SUV">SUV</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-400">Daily Rate ($)</label>
            <input
              type="number"
              placeholder="e.g. 850"
              value={carData.pricePerDay}
              onChange={(e) => setCarData({ ...carData, pricePerDay: e.target.value })}
              className="glass-input p-3 rounded-xl outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-400">Transmission</label>
            <input
              type="text"
              placeholder="Automatic / PDK"
              value={carData.transmission}
              onChange={(e) => setCarData({ ...carData, transmission: e.target.value })}
              className="glass-input p-3 rounded-xl outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-400">Fuel Type / Battery</label>
            <input
              type="text"
              placeholder="V8 Twin-Turbo Petrol / Dual EV Motor"
              value={carData.fuelType}
              onChange={(e) => setCarData({ ...carData, fuelType: e.target.value })}
              className="glass-input p-3 rounded-xl outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-400">Seating Capacity</label>
            <input
              type="number"
              placeholder="2"
              value={carData.seats}
              onChange={(e) => setCarData({ ...carData, seats: e.target.value })}
              className="glass-input p-3 rounded-xl outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-400">Dispatch Location</label>
            <input
              type="text"
              placeholder="e.g. Miami, Los Angeles, New York"
              value={carData.location}
              onChange={(e) => setCarData({ ...carData, location: e.target.value })}
              className="glass-input p-3 rounded-xl outline-none"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 text-xs font-mono">
          <label className="text-slate-400">Detailed Telemetry Overview</label>
          <textarea
            rows="3"
            placeholder="Highlight key features, horsepower, zero-to-sixty times..."
            value={carData.description}
            onChange={(e) => setCarData({ ...carData, description: e.target.value })}
            className="glass-input p-3 rounded-xl outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-bold text-xs tracking-wider uppercase hover:brightness-110 transition-all cursor-pointer shadow-xl shadow-cyan-500/20"
        >
          {loading ? 'UPLOADING TO FLEET...' : 'PUBLISH SUPERCAR LISTING'}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
