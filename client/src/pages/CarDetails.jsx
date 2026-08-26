import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ParticleBackground from '../components/3d/ParticleBackground';
import Hero3DCanvas from '../components/3d/Hero3DCanvas';
import toast from 'react-hot-toast';
import { ShieldCheck, Calendar, Gauge, Fuel, Users, MapPin, Zap, ArrowLeft, CheckCircle2, Star } from 'lucide-react';

const CarDetails = () => {
  const { id } = useParams();
  const { cars, currency, axios, user, setShowLogin, navigate } = useAppContext();

  const [car, setCar] = useState(null);
  const [activeTab, setActiveTab] = useState('3d'); // '3d' or 'photo'
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (cars && cars.length > 0) {
      const foundCar = cars.find((c) => c._id === id);
      setCar(foundCar || cars[0]);
    }
  }, [id, cars]);

  // Calculate estimated total price
  const calculateTotal = () => {
    if (!pickupDate || !returnDate || !car) return 0;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.max(0, end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays || 1) * (car.pricePerDay || car.price);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to proceed with booking');
      setShowLogin(true);
      return;
    }
    if (!pickupDate || !returnDate) {
      toast.error('Please select both pickup and return dates');
      return;
    }

    try {
      setBookingLoading(true);
      const { data } = await axios.post('/api/bookings/create', {
        car: car._id,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        toast.success('Reservation confirmed! View details in My Bookings.');
        navigate('/my-bookings');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 font-mono">
        Loading vehicle telemetry...
      </div>
    );
  }

  const daysCount = Math.max(
    1,
    Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)) || 1
  );

  return (
    <div className="relative min-h-screen py-10 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col gap-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 self-start transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO INVENTORY</span>
        </button>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
              {car.brand || 'Luxury Spec'} // {car.category || 'Supercar'}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white">{car.title}</h1>
          </div>

          <div className="bg-slate-900/80 border border-cyan-500/30 p-3 rounded-2xl flex items-baseline gap-2">
            <span className="text-xs text-slate-400 font-mono">Daily Rate:</span>
            <span className="text-2xl font-black text-cyan-400 font-mono">
              {currency}
              {car.pricePerDay || car.price}
            </span>
          </div>
        </div>

        {/* Main Grid: 3D/Photo Viewer + Booking Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Media Tabs */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* View Switcher Tabs */}
            <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10 self-start">
              <button
                onClick={() => setActiveTab('3d')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                  activeTab === '3d'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3D Interactive Studio
              </button>
              <button
                onClick={() => setActiveTab('photo')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                  activeTab === 'photo'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                High-Res Photo Gallery
              </button>
            </div>

            {/* Display Media Container */}
            <div className="w-full h-[400px] md:h-[480px]">
              {activeTab === '3d' ? (
                <Hero3DCanvas />
              ) : (
                <div className="w-full h-full rounded-2xl glass-card overflow-hidden border border-white/10 flex items-center justify-center p-4">
                  <img src={car.image} alt={car.title} className="w-full h-full object-cover rounded-xl" />
                </div>
              )}
            </div>

            {/* Specification Telemetry Grid */}
            <div className="p-6 rounded-2xl glass-card border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
                <span className="text-slate-500 text-[10px]">Transmission</span>
                <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5" />
                  {car.transmission || 'Dual-Clutch'}
                </span>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
                <span className="text-slate-500 text-[10px]">Fuel Spec</span>
                <span className="text-purple-300 font-bold flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5" />
                  {car.fuelType || 'V8 Petrol'}
                </span>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
                <span className="text-slate-500 text-[10px]">Seating</span>
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {car.seats ? `${car.seats} Executive` : '2 Sport'}
                </span>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
                <span className="text-slate-500 text-[10px]">Dispatch City</span>
                <span className="text-emerald-300 font-bold flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5" />
                  {car.location || 'Miami Hub'}
                </span>
              </div>
            </div>

            {/* Description Card */}
            <div className="p-6 rounded-2xl glass-card border border-white/10">
              <h3 className="text-sm font-mono text-cyan-400 font-bold uppercase mb-2">Vehicle Overview</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                {car.description ||
                  'Engage maximum acceleration and precision handling with this executive luxury spec vehicle. Meticulously maintained and certified for high-speed performance and comfort.'}
              </p>
            </div>
          </div>

          {/* Right Column: Booking Calculator & Reservation Form */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <form
              onSubmit={handleBooking}
              className="p-6 rounded-3xl glass-card border border-cyan-500/30 shadow-2xl flex flex-col gap-5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Reserve Vehicle</h3>
                  <p className="text-xs text-slate-400">Instant digital contract & key dispatch</p>
                </div>
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>

              {/* Pickup & Return Dates */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Pickup Date</span>
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="glass-input px-3.5 py-2.5 rounded-xl text-xs outline-none w-full"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-purple-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Return Date</span>
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="glass-input px-3.5 py-2.5 rounded-xl text-xs outline-none w-full"
                    required
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Rate per day:</span>
                  <span>
                    {currency}
                    {car.pricePerDay || car.price}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Duration:</span>
                  <span>{pickupDate && returnDate ? `${daysCount} Day(s)` : 'Select dates'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Zero Security Deposit:</span>
                  <span className="text-emerald-400">$0.00</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold text-white">
                  <span>Estimated Total:</span>
                  <span className="text-cyan-400 font-mono text-base">
                    {currency}
                    {calculateTotal()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-600 text-slate-950 font-black text-xs tracking-wider uppercase hover:brightness-110 transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{bookingLoading ? 'CREATING RESERVATION...' : 'CONFIRM & BOOK INSTANTLY'}</span>
              </button>

              {/* Insurance note */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Includes $2M Comprehensive Insurance & 24/7 Roadside</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
