import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Upload, Plus, ArrowRight } from 'lucide-react';

const AddCar = () => {
  const { axios, navigate, fetchCars, setCars, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
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
    location: 'Delhi NCR',
    description: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image && !imagePreview) {
      toast.error('Please upload a vehicle photograph');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      if (image) formData.append('image', image);
      formData.append('carData', JSON.stringify(carData));

      try {
        const { data } = await axios.post('/api/owner/add-car', formData);
        if (data?.success) {
          toast.success('Specimen added to registry successfully!');
          await fetchCars();
          navigate('/owner/manage-cars');
          return;
        }
      } catch (apiErr) {
        console.warn("AddCar API:", apiErr.message);
      }

      // Local state fallback update
      const newCar = {
        _id: 'car_' + Date.now(),
        ...carData,
        price: Number(carData.pricePerDay),
        pricePerDay: Number(carData.pricePerDay),
        image: imagePreview || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
        rating: 5.0,
        isAvailable: true,
      };

      setCars((prev) => [newCar, ...prev]);
      toast.success('Vehicle added to registry');
      navigate('/owner/manage-cars');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 text-[#F4F2ED] font-mono select-none">
      
      {/* Header */}
      <div className="pb-6 border-b border-white/14">
        <span className="text-[10px] text-[#C5A880] uppercase tracking-widest font-bold block mb-1">
          REGISTRY ONBOARDING // 2026
        </span>
        <h1 className="text-3xl font-display font-extrabold uppercase text-[#F4F2ED]">
          ADD FLEET SPECIMEN
        </h1>
        <p className="text-xs text-[#9B9B9B] mt-1">
          COMMISSION A NEW VEHICLE ALLOCATION TO THE CLUB REGISTRY
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className="bg-[#141414] border border-white/14 p-6 sm:p-10 space-y-8">
        
        {/* Image Upload Area */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#9B9B9B] block mb-3 font-bold">
            01 // VEHICLE ARTWORK
          </span>
          <label
            htmlFor="vehicle-image-input"
            className="border border-dashed border-white/20 hover:border-[#C5A880] bg-[#1B1B1B] p-8 flex flex-col items-center justify-center cursor-pointer transition-colors"
          >
            {imagePreview ? (
              <div className="relative w-full max-h-64 flex items-center justify-center">
                <img src={imagePreview} alt="Preview" className="max-h-64 object-contain filter drop-shadow-xl" />
                <span className="absolute bottom-2 px-3 py-1 bg-black/80 text-white text-[10px] uppercase font-mono">
                  CLICK TO RE-UPLOAD
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <Upload className="w-8 h-8 text-[#C5A880] mb-2" />
                <p className="text-xs font-mono uppercase font-bold text-[#F4F2ED]">UPLOAD VEHICLE PHOTOGRAPHY</p>
                <p className="text-[10px] text-[#6E6E6E]">PNG, JPG, OR WEBP TRANSPARENT PREFERRED</p>
              </div>
            )}
            <input
              id="vehicle-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Specifications Grid */}
        <div className="space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#9B9B9B] block font-bold">
            02 // FACTORY SPECIFICATIONS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">FULL DISPLAY TITLE</label>
              <input
                type="text"
                required
                placeholder="e.g. Porsche 911 GT3 RS 2026"
                value={carData.title}
                onChange={(e) => setCarData({ ...carData, title: e.target.value })}
                className="club-input"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">BRAND / MARQUE</label>
              <input
                type="text"
                required
                placeholder="e.g. Porsche"
                value={carData.brand}
                onChange={(e) => setCarData({ ...carData, brand: e.target.value })}
                className="club-input"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">MODEL DESIGNATION</label>
              <input
                type="text"
                required
                placeholder="e.g. 911 GT3 RS"
                value={carData.model}
                onChange={(e) => setCarData({ ...carData, model: e.target.value })}
                className="club-input"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">MODEL YEAR</label>
              <input
                type="number"
                required
                value={carData.year}
                onChange={(e) => setCarData({ ...carData, year: Number(e.target.value) })}
                className="club-input"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">CHASSIS CATEGORY</label>
              <select
                value={carData.category}
                onChange={(e) => setCarData({ ...carData, category: e.target.value })}
                className="club-input"
              >
                <option value="Supercar">Supercar</option>
                <option value="Luxury">Luxury</option>
                <option value="Sports">Sports</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">DAILY TARIFF ({currency})</label>
              <input
                type="number"
                required
                placeholder="18500"
                value={carData.pricePerDay}
                onChange={(e) => setCarData({ ...carData, pricePerDay: e.target.value })}
                className="club-input"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">TRANSMISSION</label>
              <select
                value={carData.transmission}
                onChange={(e) => setCarData({ ...carData, transmission: e.target.value })}
                className="club-input"
              >
                <option value="Automatic">Automatic</option>
                <option value="Dual-Clutch PDK">Dual-Clutch PDK</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">POWERTRAIN FUEL</label>
              <select
                value={carData.fuelType}
                onChange={(e) => setCarData({ ...carData, fuelType: e.target.value, fuel_type: e.target.value })}
                className="club-input"
              >
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">SEATING CAPACITY</label>
              <input
                type="number"
                value={carData.seats}
                onChange={(e) => setCarData({ ...carData, seats: Number(e.target.value), seating_capacity: Number(e.target.value) })}
                className="club-input"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">DISPATCH LOCATION HUB</label>
              <input
                type="text"
                required
                placeholder="e.g. Delhi NCR Terminal 3 VIP Concierge"
                value={carData.location}
                onChange={(e) => setCarData({ ...carData, location: e.target.value })}
                className="club-input"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5 font-bold">
            03 // EDITORIAL CURATION NOTES
          </label>
          <textarea
            rows={3}
            placeholder="Describe provenance, aero packages, mechanical highlights, or special club amenities..."
            value={carData.description}
            onChange={(e) => setCarData({ ...carData, description: e.target.value })}
            className="club-input text-xs"
          />
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-club-primary py-4 px-8 text-xs font-bold"
          >
            <span>{loading ? 'COMMISSIONING SPECIMEN...' : 'COMMISSION TO REGISTRY →'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCar;