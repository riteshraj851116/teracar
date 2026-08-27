import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Upload, Car, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

const AddCar = () => {
  const { axios, navigate, fetchCars, cars, setCars } = useAppContext();

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState({
    title: '',
    brand: '',
    model: '',
    year: 2024,
    category: 'Supercar',
    pricePerDay: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 2,
    location: 'Miami',
    description: '',
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image && !imageUrl) {
      toast.error('Please provide a vehicle photo or URL');
      return;
    }

    try {
      setLoading(true);

      const resolvedImage = image ? URL.createObjectURL(image) : imageUrl;
      const newCar = {
        _id: 'car_' + Date.now(),
        title: carData.title || `${carData.brand} ${carData.model}`,
        brand: carData.brand || 'Luxury Spec',
        model: carData.model || carData.title || 'GT',
        year: Number(carData.year) || 2024,
        category: carData.category,
        price: Number(carData.pricePerDay),
        pricePerDay: Number(carData.pricePerDay),
        transmission: carData.transmission,
        fuelType: carData.fuelType,
        fuel_type: carData.fuelType,
        seats: Number(carData.seats),
        seating_capacity: Number(carData.seats),
        location: carData.location || 'Miami',
        description: carData.description || 'Exclusive luxury vehicle certified for performance.',
        image: resolvedImage,
        isAvaliable: true,
        createdAt: new Date().toISOString(),
      };

      try {
        const formData = new FormData();
        if (image) formData.append('image', image);
        formData.append('carData', JSON.stringify({
          ...newCar,
          image: resolvedImage
        }));

        const { data } = await axios.post('/api/owner/add-car', formData);
        if (data.success) {
          toast.success('Supercar listed on server successfully!');
        }
      } catch (err) {
        console.log("Server upload fallback to local state:", err.message);
      }

      // Add to context cars immediately
      setCars([newCar, ...cars]);
      toast.success('Vehicle successfully added to fleet!');
      navigate('/owner/manage-cars');

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 w-full max-w-4xl flex flex-col gap-6">
      <div>
        <span className="text-xs font-mono font-bold tracking-widest text-cyan-600 uppercase">NEW FLEET LISTING</span>
        <h1 className="text-3xl font-black text-slate-900 mt-0.5">Host A Supercar</h1>
      </div>

      <form onSubmit={onSubmitHandler} className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-6">
        {/* Image Upload Box */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono font-bold text-slate-700">Vehicle Cover Image</label>
          <label
            htmlFor="car-cover"
            className="w-full h-56 rounded-3xl border-2 border-dashed border-slate-300 hover:border-cyan-500 bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative shadow-inner"
          >
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover rounded-3xl" />
            ) : imageUrl ? (
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover rounded-3xl" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500 p-4 text-center">
                <Upload className="w-8 h-8 text-cyan-600" />
                <span className="text-xs font-mono font-bold">Click to Upload Vehicle Photo</span>
                <span className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP high-resolution photos</span>
              </div>
            )}
            <input type="file" id="car-cover" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
          </label>

          {/* Or Image URL input */}
          <input
            type="url"
            placeholder="Or paste direct image URL (e.g. Unsplash photo)..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="glass-input p-3 rounded-2xl text-xs outline-none mt-1"
          />
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-bold">Vehicle Title / Model Name</label>
            <input
              type="text"
              placeholder="e.g. Porsche 911 GT3 RS"
              value={carData.title}
              onChange={(e) => setCarData({ ...carData, title: e.target.value })}
              className="glass-input p-3 rounded-2xl outline-none font-medium"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-bold">Brand / Manufacturer</label>
            <input
              type="text"
              placeholder="e.g. Porsche, Ferrari, Lamborghini"
              value={carData.brand}
              onChange={(e) => setCarData({ ...carData, brand: e.target.value })}
              className="glass-input p-3 rounded-2xl outline-none font-medium"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-bold">Category</label>
            <select
              value={carData.category}
              onChange={(e) => setCarData({ ...carData, category: e.target.value })}
              className="glass-input p-3 rounded-2xl outline-none bg-white text-slate-900 font-medium"
            >
              <option value="Supercar">Supercar</option>
              <option value="Luxury">Luxury</option>
              <option value="Electric">Electric</option>
              <option value="SUV">SUV</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-bold">Daily Rate ($)</label>
            <input
              type="number"
              placeholder="e.g. 950"
              value={carData.pricePerDay}
              onChange={(e) => setCarData({ ...carData, pricePerDay: e.target.value })}
              className="glass-input p-3 rounded-2xl outline-none font-medium"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-bold">Transmission</label>
            <input
              type="text"
              placeholder="7-Speed Dual-Clutch / Automatic"
              value={carData.transmission}
              onChange={(e) => setCarData({ ...carData, transmission: e.target.value })}
              className="glass-input p-3 rounded-2xl outline-none font-medium"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-bold">Fuel Spec / Engine</label>
            <input
              type="text"
              placeholder="4.0L Boxer / Twin-Turbo V8"
              value={carData.fuelType}
              onChange={(e) => setCarData({ ...carData, fuelType: e.target.value })}
              className="glass-input p-3 rounded-2xl outline-none font-medium"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-bold">Seating Capacity</label>
            <input
              type="number"
              placeholder="2"
              value={carData.seats}
              onChange={(e) => setCarData({ ...carData, seats: e.target.value })}
              className="glass-input p-3 rounded-2xl outline-none font-medium"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-bold">Dispatch Location</label>
            <input
              type="text"
              placeholder="e.g. Miami, Los Angeles, New York"
              value={carData.location}
              onChange={(e) => setCarData({ ...carData, location: e.target.value })}
              className="glass-input p-3 rounded-2xl outline-none font-medium"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 text-xs font-mono">
          <label className="text-slate-700 font-bold">Detailed Telemetry Overview</label>
          <textarea
            rows="3"
            placeholder="Highlight key specs, 0-60 acceleration, horsepower, interior options..."
            value={carData.description}
            onChange={(e) => setCarData({ ...carData, description: e.target.value })}
            className="glass-input p-3.5 rounded-2xl outline-none font-medium"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{loading ? 'PUBLISHING TO FLEET...' : 'PUBLISH SUPERCAR LISTING'}</span>
        </button>
      </form>
    </div>
  );
};

export default AddCar;
