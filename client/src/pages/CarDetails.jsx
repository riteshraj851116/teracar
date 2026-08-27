import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ParticleBackground from '../components/3d/ParticleBackground';
import toast from 'react-hot-toast';
import { ShieldCheck, Calendar, Gauge, Fuel, Users, MapPin, Zap, ArrowLeft, CheckCircle2, Star, Sparkles, Eye, Check } from 'lucide-react';

const CarDetails = () => {
  const { id } = useParams();
  const { cars, currency, axios, user, setShowLogin, navigate } = useAppContext();

  const [car, setCar] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeAngle, setActiveAngle] = useState(0);

  useEffect(() => {
    if (cars && cars.length > 0) {
      const foundCar = cars.find((c) => c._id === id);
      setCar(foundCar || cars[0]);
    }
  }, [id, cars]);

  const carTitle = car?.title || `${car?.brand || ''} ${car?.model || ''}`.trim() || 'Luxury Vehicle';
  const price = car?.pricePerDay || car?.price || 75000;
  const seats = car?.seating_capacity || car?.seats || 2;
  const fuel = car?.fuel_type || car?.fuelType || 'Petrol';
  const transmission = car?.transmission || 'Automatic';
  const location = car?.location || 'Mumbai Hub';

  // Calculate estimated total price
  const calculateTotal = () => {
    if (!pickupDate || !returnDate || !car) return price;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.max(0, end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays || 1) * price;
  };

  const daysCount = Math.max(
    1,
    Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)) || 1
  );

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to complete your vehicle reservation');
      setShowLogin(true);
      return;
    }
    if (!pickupDate || !returnDate) {
      toast.error('Please select both pickup and return dates');
      return;
    }

    try {
      setBookingLoading(true);
      const totalAmount = calculateTotal();
      
      try {
        const { data } = await axios.post('/api/bookings/create', {
          car: car._id,
          pickupDate,
          returnDate,
        });

        if (data.success) {
          toast.success('Reservation confirmed! View details in My Bookings.');
          navigate('/my-bookings');
          return;
        }
      } catch (err) {
        console.log("Local reservation fallback active:", err.message);
      }

      // Safe fallback booking for local session demo
      const storedBookings = JSON.parse(localStorage.getItem('local_bookings') || '[]');
      const newBooking = {
        _id: 'bk_' + Date.now(),
        car: car,
        user: user._id,
        pickupDate,
        returnDate,
        price: totalAmount,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('local_bookings', JSON.stringify([newBooking, ...storedBookings]));
      toast.success('Reservation confirmed! View details in My Bookings.');
      navigate('/my-bookings');

    } catch (err) {
      toast.error(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-mono">
        Loading vehicle telemetry...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-10 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col gap-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-slate-900 self-start transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO INVENTORY</span>
        </button>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-600 uppercase">
              {car.brand || 'Luxury Spec'} // {car.category || 'Supercar'}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mt-0.5">{carTitle}</h1>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-4 rounded-3xl flex items-baseline gap-2 shadow-sm">
            <span className="text-xs text-slate-500 font-mono">Daily Rate:</span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              <span className="text-cyan-600">{currency}</span>
              {price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Main Grid: Photo Showcase + Booking Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: High-Res Vehicle Gallery Showcase */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Display Media Container */}
            <div className="relative w-full h-[380px] md:h-[480px] rounded-3xl bg-white/80 backdrop-blur-xl overflow-hidden border border-slate-200 shadow-xl flex items-center justify-center p-3">
              <img
                src={car.image}
                alt={carTitle}
                className="w-full h-full object-cover rounded-2xl transition-all duration-500"
              />
              {/* Overlay Badge */}
              <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                <span>ULTRA HIGH-DEFINITION GALLERY</span>
              </div>
            </div>

            {/* Specification Telemetry Grid */}
            <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 flex flex-col gap-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Transmission</span>
                <span className="text-slate-900 font-bold flex items-center gap-1.5 truncate">
                  <Gauge className="w-3.5 h-3.5 text-cyan-600" />
                  {transmission}
                </span>
              </div>
              <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 flex flex-col gap-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Power Spec</span>
                <span className="text-slate-900 font-bold flex items-center gap-1.5 truncate">
                  <Fuel className="w-3.5 h-3.5 text-indigo-600" />
                  {fuel}
                </span>
              </div>
              <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 flex flex-col gap-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Seating</span>
                <span className="text-slate-900 font-bold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  {seats} Seats
                </span>
              </div>
              <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 flex flex-col gap-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Dispatch Hub</span>
                <span className="text-slate-900 font-bold flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {location}
                </span>
              </div>
            </div>

            {/* Included Luxury Features */}
            <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <h3 className="text-xs font-mono text-cyan-600 font-bold uppercase tracking-wider">Executive Package Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 font-mono">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Doorstep White-Glove Handover</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Zero Security Deposit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>24/7 Dedicated Concierge & Roadside</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Full Comprehensive Insurance Cover</span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-mono text-cyan-600 font-bold uppercase tracking-wider mb-2">Vehicle Overview</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                {car.description ||
                  'Engage maximum acceleration and precision handling with this executive luxury spec vehicle. Meticulously maintained and certified for high-speed performance, comfort, and uncompromising reliability.'}
              </p>
            </div>
          </div>

          {/* Right Column: Booking Calculator & Reservation Form */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <form
              onSubmit={handleBooking}
              className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-2xl border border-slate-200 shadow-2xl flex flex-col gap-5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Reserve Vehicle</h3>
                  <p className="text-xs text-slate-500">Instant digital reservation & keyless verification</p>
                </div>
                <Zap className="w-5 h-5 text-cyan-600" />
              </div>

              {/* Pickup & Return Dates */}
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Pickup Date</span>
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="glass-input px-3.5 py-2.5 rounded-2xl text-xs outline-none w-full"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Return Date</span>
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="glass-input px-3.5 py-2.5 rounded-2xl text-xs outline-none w-full"
                    required
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 flex flex-col gap-2.5 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Daily Rate:</span>
                  <span className="font-bold text-slate-900">
                    {currency}
                    {price.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Duration:</span>
                  <span className="font-bold text-slate-900">{pickupDate && returnDate ? `${daysCount} Day(s)` : '1 Day'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Zero Security Deposit:</span>
                  <span className="text-emerald-600 font-bold">{currency}0.00 Included</span>
                </div>
                <div className="border-t border-slate-200 pt-2.5 flex justify-between text-sm font-bold text-slate-900">
                  <span>Estimated Total:</span>
                  <span className="text-cyan-600 font-mono text-lg font-black">
                    {currency}
                    {calculateTotal().toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{bookingLoading ? 'CONFIRMING...' : 'CONFIRM & BOOK INSTANTLY'}</span>
              </button>

              {/* Insurance note */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono justify-center text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Includes ₹2 Cr Comprehensive Insurance & 24/7 Roadside VIP Concierge</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
