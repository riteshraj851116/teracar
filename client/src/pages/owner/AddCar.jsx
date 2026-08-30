import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/owner/Title';
import toast from 'react-hot-toast';
import { Upload, Plus, Car } from 'lucide-react';

const AddCar = () => {
  const { axios, navigate, fetchCars } = useAppContext();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Supercar',
    pricePerDay: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    fuel_type: 'Petrol',
    seats: 2,
    seating_capacity: 2,
    location: '',
    description: '',
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please upload a high-resolution vehicle photo');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', image);
      formData.append('carData', JSON.stringify(carData));

      const { data } = await axios.post('/api/owner/add-car', formData);

      if (data?.success) {
        toast.success('Vehicle successfully listed in fleet!');
        await fetchCars();
        navigate('/owner/manage-cars');
      } else {
        toast.error(data?.message || 'Failed to list vehicle');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3.5 text-xs font-mono text-[#090d16] placeholder:text-[#64748b]/50 outline-none focus:border-[#090d16] focus:bg-white transition-all";
  const labelStyle = "text-[10px] font-bold font-mono text-[#090d16] uppercase tracking-[0.15em] mb-1.5 block";

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      
      {/* Header Section */}
      <Title 
        title="List a New Vehicle" 
        subTitle="Publish a new supercar, grand tourer, or luxury SUV into the verified fleet showroom." 
      />

      <form onSubmit={onSubmitHandler} className="bg-white border border-[#e2e8f0] rounded-3xl p-6 md:p-10 flex flex-col gap-6 shadow-[0_4px_24px_rgba(9,13,22,0.03)]">
        
        {/* Image Upload Box */}
        <div className="flex flex-col">
          <label className={labelStyle}>Vehicle Cover Image</label>
          <label
            htmlFor="car-cover"
            className="w-full h-64 border border-dashed border-[#e2e8f0] hover:border-[#090d16] bg-[#f8fafc] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative group"
          >
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-contain p-4" />
            ) : (
              <div className="flex flex-col items-center gap-2.5 text-[#64748b] group-hover:text-[#090d16] transition-colors">
                <Upload className="w-8 h-8 text-[#2563eb]" />
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Upload High-Res Photo (WebP / PNG / JPG)</span>
              </div>
            )}
            <input type="file" id="car-cover" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
          </label>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelStyle}>Model / Title</label>
            <input
              type="text"
              placeholder="e.g. Porsche 911 GT3 RS"
              value={carData.title}
              onChange={(e) => setCarData({ ...carData, title: e.target.value })}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>Brand / Manufacturer</label>
            <input
              type="text"
              placeholder="e.g. Porsche, Ferrari, McLaren"
              value={carData.brand}
              onChange={(e) => setCarData({ ...carData, brand: e.target.value })}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>Fleet Category</label>
            <select
              value={carData.category}
              onChange={(e) => setCarData({ ...carData, category: e.target.value })}
              className={`${inputStyle} cursor-pointer`}
            >
              <option value="Supercar">Supercar</option>
              <option value="Luxury">Luxury</option>
              <option value="Electric">Electric</option>
              <option value="SUV">SUV</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Daily Rate (USD)</label>
            <input
              type="number"
              placeholder="e.g. 850"
              value={carData.pricePerDay}
              onChange={(e) => setCarData({ ...carData, pricePerDay: e.target.value })}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>Transmission</label>
            <input
              type="text"
              placeholder="Automatic / PDK / Dual-Clutch"
              value={carData.transmission}
              onChange={(e) => setCarData({ ...carData, transmission: e.target.value })}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>Fuel / Powertrain</label>
            <input
              type="text"
              placeholder="4.0L Naturally Aspirated / EV"
              value={carData.fuelType}
              onChange={(e) => setCarData({ ...carData, fuelType: e.target.value, fuel_type: e.target.value })}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>Seating Capacity</label>
            <input
              type="number"
              placeholder="2"
              value={carData.seats}
              onChange={(e) => setCarData({ ...carData, seats: e.target.value, seating_capacity: e.target.value })}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>Dispatch Location / Hub</label>
            <input
              type="text"
              placeholder="e.g. Miami Beach, Los Angeles"
              value={carData.location}
              onChange={(e) => setCarData({ ...carData, location: e.target.value })}
              className={inputStyle}
              required
            />
          </div>
        </div>

        {/* Overview Textarea */}
        <div>
          <label className={labelStyle}>Vehicle Overview & Description</label>
          <textarea
            rows="4"
            placeholder="Highlight vehicle performance, 0-60 acceleration, carbon-ceramic brakes, bespoke features..."
            value={carData.description}
            onChange={(e) => setCarData({ ...carData, description: e.target.value })}
            className={`${inputStyle} resize-y`}
          />
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4.5 bg-[#090d16] hover:bg-[#1e293b] text-white rounded-2xl text-[11px] font-bold font-mono tracking-[0.18em] uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 shadow-lg shadow-[#090d16]/20 transition-all"
        >
          {loading ? (
            'UPLOADING TO FLEET...'
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>PUBLISH VEHICLE LISTING</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddCar;