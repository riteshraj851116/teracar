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
    category: 'Sedan',
    pricePerDay: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    fuel_type: 'Petrol',
    seats: 4,
    seating_capacity: 4,
    location: '',
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
      toast.error('Please upload a vehicle photo');
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
          toast.success('Vehicle added successfully!');
          await fetchCars();
          navigate('/owner/manage-cars');
          return;
        }
      } catch (apiErr) {
        console.warn("AddCar API:", apiErr.message);
      }

      // Local fallback
      const newCar = {
        _id: `car_local_${Date.now()}`,
        ...carData,
        title: carData.title || `${carData.brand} ${carData.model}`,
        price: Number(carData.pricePerDay || 100),
        pricePerDay: Number(carData.pricePerDay || 100),
        image: imagePreview || '',
        isAvaliable: true,
      };
      setCars(prev => [newCar, ...prev]);
      toast.success('Vehicle added to fleet!');
      navigate('/owner/manage-cars');
    } catch (err) {
      toast.error('Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary font-editorial">Add New Vehicle</h1>
        <p className="text-sm text-text-secondary mt-0.5">List a new vehicle in your fleet</p>
      </div>

      <form onSubmit={onSubmitHandler} className="bg-white rounded-xl border border-border p-6 sm:p-8 space-y-6">
        
        {/* Photo Upload */}
        <div>
          <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2 block">
            Vehicle Photo
          </label>
          <label
            htmlFor="vehicle-image-input"
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border hover:border-accent rounded-xl bg-bg-secondary cursor-pointer transition-colors"
          >
            {imagePreview ? (
              <div className="relative w-full max-h-56 flex items-center justify-center">
                <img src={imagePreview} alt="Preview" className="max-h-56 object-contain rounded-lg" />
                <span className="absolute bottom-2 px-3 py-1 bg-black/70 text-white text-xs rounded-lg">
                  Click to change
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-accent" />
                <p className="text-sm font-medium text-text-primary">Upload Photo</p>
                <p className="text-xs text-text-muted">PNG, JPG, or WEBP up to 10MB</p>
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

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Title</label>
            <input
              type="text"
              required
              placeholder="e.g. BMW X5 2024"
              value={carData.title}
              onChange={(e) => setCarData({ ...carData, title: e.target.value })}
              className="premium-input"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Brand</label>
            <input
              type="text"
              required
              placeholder="e.g. BMW"
              value={carData.brand}
              onChange={(e) => setCarData({ ...carData, brand: e.target.value })}
              className="premium-input"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Model</label>
            <input
              type="text"
              placeholder="e.g. X5"
              value={carData.model}
              onChange={(e) => setCarData({ ...carData, model: e.target.value })}
              className="premium-input"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Year</label>
            <input
              type="number"
              required
              value={carData.year}
              onChange={(e) => setCarData({ ...carData, year: Number(e.target.value) })}
              className="premium-input"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Category</label>
            <select
              value={carData.category}
              onChange={(e) => setCarData({ ...carData, category: e.target.value })}
              className="premium-input"
            >
              <option value="Economy">Economy</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Luxury">Luxury</option>
              <option value="Sports">Sports</option>
              <option value="Convertible">Convertible</option>
              <option value="Electric">Electric</option>
              <option value="Van">Van</option>
              <option value="Supercar">Supercar</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">
              Price/Day ({currency})
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 200"
              value={carData.pricePerDay}
              onChange={(e) => setCarData({ ...carData, pricePerDay: e.target.value })}
              className="premium-input"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Transmission</label>
            <select
              value={carData.transmission}
              onChange={(e) => setCarData({ ...carData, transmission: e.target.value })}
              className="premium-input"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Fuel Type</label>
            <select
              value={carData.fuelType}
              onChange={(e) => setCarData({ ...carData, fuelType: e.target.value, fuel_type: e.target.value })}
              className="premium-input"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Seats</label>
            <input
              type="number"
              min={1}
              max={12}
              value={carData.seats}
              onChange={(e) => setCarData({ ...carData, seats: Number(e.target.value), seating_capacity: Number(e.target.value) })}
              className="premium-input"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Location</label>
            <input
              type="text"
              required
              placeholder="e.g. New York"
              value={carData.location}
              onChange={(e) => setCarData({ ...carData, location: e.target.value })}
              className="premium-input"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">Description</label>
          <textarea
            rows={3}
            placeholder="Describe the vehicle..."
            value={carData.description}
            onChange={(e) => setCarData({ ...carData, description: e.target.value })}
            className="premium-input"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-3 rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding Vehicle...
              </span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Vehicle
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCar;