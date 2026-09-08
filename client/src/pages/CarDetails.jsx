import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Calendar,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
  Sparkles,
  ChevronDown
} from 'lucide-react';

const EXTRAS_OPTIONS = [
  { id: 'driver', name: 'Additional Driver', price: 1500, desc: 'Authorized secondary pilot on telemetry insurance' },
  { id: 'gps', name: 'Dedicated GPS Telematics', price: 800, desc: 'High-precision satellite mapping & radar alerts' },
  { id: 'childSeat', name: 'Child Safety Seat', price: 600, desc: 'ISOFIX certified premium leather child seat' },
  { id: 'insurance', name: 'Zero-Liability Premium Insurance', price: 2500, desc: 'Zero excess comprehensive collision waiver' },
  { id: 'roadside', name: 'Priority Roadside Support', price: 1200, desc: 'Instant chase support vehicle dispatch 24/7' },
  { id: 'wifi', name: 'Onboard 5G Wi-Fi Hotspot', price: 700, desc: 'Unlimited high-speed in-cabin satellite data' },
  { id: 'fuel', name: 'Prepaid Fuel Package', price: 3500, desc: 'Return at any fuel level with zero penalty' },
];

const CarDetails = () => {
  const { id } = useParams();
  const {
    cars,
    currency,
    navigate,
    axios,
    token,
    user,
    setShowLogin,
    toggleFavorite,
    favorites,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate
  } = useAppContext();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [pickupLocation, setPickupLocation] = useState('Airport FBO Terminal');
  const [dropLocation, setDropLocation] = useState('Same Location');
  const [selectedExtras, setSelectedExtras] = useState(['insurance']);
  const [activeStep, setActiveStep] = useState(1); // 1: Journey, 2: Vehicle, 3: Extras, 4: Details, 5: Payment

  useEffect(() => {
    const found = cars.find((c) => c._id === id);
    if (found) {
      setCar(found);
      setLoading(false);
    } else {
      const fetchCar = async () => {
        try {
          const { data } = await axios.get('/api/user/cars');
          if (data?.success && data?.cars) {
            const c = data.cars.find((c) => c._id === id);
            if (c) setCar(c);
          }
        } catch (err) {
          console.error('Error fetching car:', err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCar();
    }
  }, [id, cars, axios]);

  const isFav = favorites?.includes(id);

  const rentalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 1;
    const diff = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }, [pickupDate, returnDate]);

  const dailyRate = car ? Number(car.pricePerDay || car.price || 15000) : 15000;
  const rentalTotal = dailyRate * rentalDays;

  // Calculate extras
  const extrasTotal = useMemo(() => {
    return selectedExtras.reduce((acc, extraId) => {
      const item = EXTRAS_OPTIONS.find((e) => e.id === extraId);
      return acc + (item ? item.price : 0);
    }, 0);
  }, [selectedExtras]);

  const taxesTotal = Math.round((rentalTotal + extrasTotal) * 0.12);
  const discountTotal = rentalDays >= 3 ? 1500 : 0;
  const finalTotal = rentalTotal + extrasTotal + taxesTotal - discountTotal;

  const toggleExtra = (extraId) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter((id) => id !== extraId));
    } else {
      setSelectedExtras([...selectedExtras, extraId]);
    }
  };

  const handleBooking = async () => {
    if (!token || !user) {
      toast.error('Please sign in to confirm allocation');
      setShowLogin(true);
      return;
    }
    if (!pickupDate || !returnDate) {
      toast.error('Please select journey pickup and return dates');
      return;
    }
    if (new Date(pickupDate) >= new Date(returnDate)) {
      toast.error('Return date must be after pickup date');
      return;
    }

    setBookingLoading(true);
    try {
      const { data } = await axios.post('/api/bookings/create', {
        car: car._id,
        pickupDate,
        returnDate,
        pickupLocation,
        dropLocation,
        extras: selectedExtras,
      });

      if (data?.success) {
        toast.success('Vehicle allocation reserved successfully');
        navigate('/my-bookings');
      } else {
        toast.error(data?.message || 'Unable to reserve vehicle');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete reservation');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-xs font-mono tracking-widest text-[#9B9B9B] uppercase">
        RETRIEVING VEHICLE TELEMETRY...
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#F4F2ED] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-display font-bold uppercase mb-4">SPECIMEN NOT FOUND</h2>
        <Link to="/cars" className="btn-club-primary">
          RETURN TO FLEET
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F4F2ED] pb-24 select-none">
      
      {/* Top Breadcrumb Strip */}
      <div className="border-b border-white/14 bg-[#0B0B0B] py-4">
        <div className="max-w-[1440px] mx-auto section-padding flex items-center justify-between text-xs font-mono text-[#9B9B9B]">
          <Link to="/cars" className="flex items-center gap-2 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>FLEET DIRECTORY</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-[#6E6E6E] hidden sm:inline">{car.location || 'DELHI NCR'}</span>
            <button
              onClick={() => toggleFavorite(car._id)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                isFav ? 'text-[#C5A880]' : 'hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#C5A880]' : ''}`} />
              <span className="hidden sm:inline">{isFav ? 'SAVED' : 'SAVE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 13 — VEHICLE DETAILS HERO (Large vehicle image, small label, large title) */}
      <div className="border-b border-white/14 bg-[#0B0B0B] relative py-12 lg:py-16 overflow-hidden">
        <div className="max-w-[1440px] mx-auto section-padding relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Title Strip */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                <span className="text-xs font-mono tracking-widest text-[#C5A880] uppercase font-bold">
                  {car.brand} // {car.category || 'PERFORMANCE'}
                </span>
              </div>

              {/* 13 — Large Title: e.g. M4 COMPETITION / 911 GT3 */}
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-tight uppercase leading-[0.92] text-[#F4F2ED]">
                {car.model}
              </h1>

              <p className="text-sm sm:text-base font-body text-[#9B9B9B] max-w-lg leading-relaxed pt-2">
                Factory concours specification. Engineered for unrestricted mechanical engagement, uncompromising poise, and seamless concierge delivery.
              </p>

              <div className="pt-4 flex items-center gap-6 text-xs font-mono text-[#9B9B9B]">
                <span>TARIFF: <strong className="text-[#F4F2ED]">{currency}{dailyRate.toLocaleString()}</strong> / DAY</span>
                <span>•</span>
                <span>DISPATCH READY IN {car.location || 'DELHI NCR'}</span>
              </div>
            </div>

            {/* Right: Large Vehicle Image */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full aspect-16/10 flex items-center justify-center p-4">
                <img
                  src={car.image}
                  alt={car.title}
                  className="max-h-full max-w-full object-contain filter brightness-[0.9] drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 18 — Minimal Horizontal Booking Flow Steps Indicator */}
      <div className="border-b border-white/14 bg-[#141414] py-3 text-xs font-mono">
        <div className="max-w-[1440px] mx-auto section-padding flex items-center justify-between overflow-x-auto gap-4">
          <div className="flex items-center gap-6 sm:gap-10">
            <span className={`flex items-center gap-2 ${activeStep >= 1 ? 'text-[#C5A880] font-bold' : 'text-[#6E6E6E]'}`}>
              <span>01</span>
              <span>JOURNEY</span>
            </span>
            <span className="text-white/20">/</span>
            <span className={`flex items-center gap-2 ${activeStep >= 2 ? 'text-[#C5A880] font-bold' : 'text-[#6E6E6E]'}`}>
              <span>02</span>
              <span>VEHICLE</span>
            </span>
            <span className="text-white/20">/</span>
            <span className={`flex items-center gap-2 ${activeStep >= 3 ? 'text-[#C5A880] font-bold' : 'text-[#6E6E6E]'}`}>
              <span>03</span>
              <span>EXTRAS</span>
            </span>
            <span className="text-white/20">/</span>
            <span className={`flex items-center gap-2 ${activeStep >= 4 ? 'text-[#C5A880] font-bold' : 'text-[#6E6E6E]'}`}>
              <span>04</span>
              <span>DETAILS</span>
            </span>
            <span className="text-white/20">/</span>
            <span className={`flex items-center gap-2 ${activeStep >= 5 ? 'text-[#C5A880] font-bold' : 'text-[#6E6E6E]'}`}>
              <span>05</span>
              <span>PAYMENT</span>
            </span>
          </div>

          <span className="text-[10px] text-[#9B9B9B] hidden md:inline">
            RESERVATION ARCHITECTURE // 2026
          </span>
        </div>
      </div>

      {/* Main Split Content: Left Specifications & Extras, Right Sticky Booking Panel */}
      <div className="max-w-[1440px] mx-auto section-padding pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: 14 Specifications & 19 Extras */}
          <div className="lg:col-span-7 space-y-14">
            
            {/* 14 — Minimal Specification Table (Thin horizontal separators, no bulky cards) */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#C5A880] font-bold">
                  TECHNICAL SPECIFICATIONS
                </h3>
              </div>

              <div className="divide-y divide-white/14 border-t border-b border-white/14 font-mono text-xs">
                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[#9B9B9B] uppercase">YEAR</span>
                  <span className="text-[#F4F2ED] font-bold">{car.year || '2026'}</span>
                </div>
                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[#9B9B9B] uppercase">TRANSMISSION</span>
                  <span className="text-[#F4F2ED] font-bold">{car.transmission || 'AUTOMATIC'}</span>
                </div>
                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[#9B9B9B] uppercase">FUEL</span>
                  <span className="text-[#F4F2ED] font-bold">{car.fuel_type || car.fuel || 'PETROL'}</span>
                </div>
                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[#9B9B9B] uppercase">SEATS</span>
                  <span className="text-[#F4F2ED] font-bold">{car.seating_capacity || car.seats || 4}</span>
                </div>
                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[#9B9B9B] uppercase">POWER</span>
                  <span className="text-[#F4F2ED] font-bold">503 HP</span>
                </div>
                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[#9B9B9B] uppercase">ENGINE</span>
                  <span className="text-[#F4F2ED] font-bold">3.0L TWIN-TURBOCHARGED</span>
                </div>
              </div>
            </div>

            {/* 19 — EXTRAS SELECTION */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#C5A880] font-bold">
                    SELECT EXTRAS // Bespoke Additions
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#9B9B9B]">
                  UPDATES TOTAL ESTIMATE INSTANTLY
                </span>
              </div>

              <div className="divide-y divide-white/14 border-t border-b border-white/14 font-mono text-xs">
                {EXTRAS_OPTIONS.map((extra) => {
                  const isChecked = selectedExtras.includes(extra.id);
                  return (
                    <div
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className="py-4 flex items-center justify-between group cursor-pointer hover:bg-[#141414] px-2 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-[#C5A880] border-[#C5A880] text-[#0B0B0B]' : 'border-white/20'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className={`text-sm font-bold block ${isChecked ? 'text-[#F4F2ED]' : 'text-[#9B9B9B]'}`}>
                            {extra.name}
                          </span>
                          <span className="text-[10px] text-[#6E6E6E] block mt-0.5">
                            {extra.desc}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-[#F4F2ED] block">
                          +{currency}{extra.price.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-[#6E6E6E] uppercase">
                          PER TRIP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Club Concierge Standards */}
            <div className="p-6 bg-[#141414] border border-white/14 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-[#C5A880] font-bold uppercase">
                <Shield className="w-4 h-4" />
                <span>AUTOMOTIVE CLUB CHARTER // CONCOURS PROMISE</span>
              </div>
              <p className="text-[#9B9B9B] leading-relaxed">
                All vehicles undergo a 120-point mechanical inspection before dispatch. Curbside handover at airport FBO terminals with zero paperwork delays and full fuel reserve.
              </p>
            </div>
          </div>

          {/* Right Column: 15 BOOKING PANEL & 20 PRICE SUMMARY */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-[#141414] border border-white/14 p-6 sm:p-8 shadow-2xl space-y-8">
              
              {/* 15 — Heading: MAKE IT YOURS. */}
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] block mb-1">
                  RESERVATION DESK
                </span>
                <h2 className="text-3xl font-display font-extrabold uppercase text-[#F4F2ED]">
                  MAKE IT YOURS.
                </h2>
              </div>

              {/* 15 — Fields: PICKUP, DROP-OFF, START DATE, RETURN DATE, TIME */}
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">
                    PICKUP
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="club-input text-xs"
                    placeholder="e.g. Aerocity FBO or Private Residence"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">
                    DROP-OFF
                  </label>
                  <input
                    type="text"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    className="club-input text-xs"
                    placeholder="Same as pickup or Alternate Airport"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">
                      START DATE
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="club-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">
                      RETURN DATE
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="club-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">
                    TIME
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="club-input text-xs"
                  >
                    <option value="09:00 AM">09:00 AM (MORNING DISPATCH)</option>
                    <option value="10:00 AM">10:00 AM (STANDARD)</option>
                    <option value="02:00 PM">02:00 PM (AFTERNOON)</option>
                    <option value="06:00 PM">06:00 PM (EVENING)</option>
                    <option value="11:00 PM">11:00 PM (RED-EYE AIRPORT FBO)</option>
                  </select>
                </div>
              </div>

              {/* 20 — PRICE SUMMARY (RENTAL, EXTRAS, TAXES, DISCOUNT, TOTAL) */}
              <div className="pt-6 border-t border-white/14 space-y-3 font-mono text-xs">
                <span className="text-[10px] uppercase text-[#C5A880] font-bold block mb-2">
                  TRANSPARENT TARIFF BREAKDOWN
                </span>

                <div className="flex items-center justify-between text-[#9B9B9B]">
                  <span>RENTAL ({rentalDays} {rentalDays === 1 ? 'DAY' : 'DAYS'} @ {currency}{dailyRate.toLocaleString()})</span>
                  <span className="text-[#F4F2ED] font-semibold">{currency}{rentalTotal.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-[#9B9B9B]">
                  <span>EXTRAS ({selectedExtras.length} SELECTED)</span>
                  <span className="text-[#F4F2ED] font-semibold">+{currency}{extrasTotal.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-[#9B9B9B]">
                  <span>TAXES & AIRPORT SURCHARGES</span>
                  <span className="text-[#F4F2ED] font-semibold">+{currency}{taxesTotal.toLocaleString()}</span>
                </div>

                {discountTotal > 0 && (
                  <div className="flex items-center justify-between text-[#C5A880]">
                    <span>MULTI-DAY CLUB PRIVILEGE</span>
                    <span className="font-bold">−{currency}{discountTotal.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-white/14 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-[#F4F2ED] uppercase">TOTAL ESTIMATE</span>
                  <span className="text-2xl font-bold text-[#C5A880]">
                    {currency}{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 15 — CTA: BOOK NOW → */}
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="btn-club-primary w-full py-4 text-xs font-bold"
              >
                <span>{bookingLoading ? 'RESERVING ALLOCATION...' : 'BOOK NOW →'}</span>
              </button>

              <div className="text-[10px] font-mono text-[#6E6E6E] text-center uppercase tracking-wider">
                COMPREHENSIVE ZERO-LIABILITY INSURANCE INCLUDED // NO SURCHARGE AT RETURN
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;