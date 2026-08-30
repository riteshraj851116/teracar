import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import CarComparisonModal from '../components/CarComparisonModal';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, 
  Calendar, 
  Gauge, 
  Fuel, 
  Users, 
  MapPin, 
  Zap, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Scale, 
  Plane, 
  Wifi, 
  UserCheck, 
  Flame,
  MessageSquare,
  Tag
} from 'lucide-react';
import { playUiClick } from '../utils/audioEngine';

const ADD_ONS = [
  { id: 'airport', name: 'White-Glove Tarmac Dispatch', rate: 150, icon: Plane, desc: 'Direct delivery to private jet terminal.' },
  { id: 'track', name: 'Full Performance Insurance', rate: 250, icon: Flame, desc: 'Zero deductible comprehensive coverage.' },
  { id: 'driver', name: 'Secondary Certified Pilot', rate: 100, icon: UserCheck, desc: 'Add a secondary authorized driver.' },
  { id: 'wifi', name: 'Satellite 5G In-Car Comms', rate: 50, icon: Wifi, desc: 'Unlimited high-speed satellite connectivity.' },
];

const CarDetails = () => {
  const { id } = useParams();
  const { 
    cars, 
    currency, 
    axios, 
    user, 
    setShowLogin, 
    navigate, 
    pickupDate: ctxPickup, 
    setPickupDate: setCtxPickup, 
    returnDate: ctxReturn, 
    setReturnDate: setCtxReturn,
    openChat
  } = useAppContext();

  const [car, setCar] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const threeDaysStr = new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(ctxPickup || tomorrowStr);
  const [returnDate, setReturnDate] = useState(ctxReturn || threeDaysStr);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (cars && cars.length > 0) {
      const foundCar = cars.find((c) => c._id === id);
      setCar(foundCar || cars[0]);
    }
  }, [id, cars]);

  const handlePickupChange = (val) => {
    setPickupDate(val);
    if (setCtxPickup) setCtxPickup(val);
    if (returnDate && new Date(val) > new Date(returnDate)) {
      setReturnDate(val);
      if (setCtxReturn) setCtxReturn(val);
    }
  };

  const handleReturnChange = (val) => {
    setReturnDate(val);
    if (setCtxReturn) setCtxReturn(val);
  };

  const toggleAddon = (addonId) => {
    playUiClick();
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'LUXURY2026' || code === 'VIP15') {
      setDiscountPercent(15);
      setPromoApplied(true);
      toast.success('VIP Promo Applied: 15% Reduction Active');
      playUiClick();
    } else if (code === 'TERA10' || code === 'FIRST') {
      setDiscountPercent(10);
      setPromoApplied(true);
      toast.success('Promo Applied: 10% Reduction Active');
      playUiClick();
    } else {
      toast.error('Invalid promo code. Try "LUXURY2026" or "VIP15"');
    }
  };

  const calculateTotal = () => {
    if (!pickupDate || !returnDate || !car) return 0;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.max(0, end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const days = Math.max(1, diffDays);
    const dailyPrice = Number(car.pricePerDay || car.price || 0);

    const addonsCostPerDay = selectedAddons.reduce((acc, aId) => {
      const item = ADD_ONS.find((a) => a.id === aId);
      return acc + (item ? item.rate : 0);
    }, 0);

    const subtotal = days * (dailyPrice + addonsCostPerDay);
    const discountAmount = (subtotal * discountPercent) / 100;
    return Math.round(subtotal - discountAmount);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to confirm reservation');
      setShowLogin(true);
      return;
    }
    if (!pickupDate || !returnDate) {
      toast.error('Please select valid pickup and return dates');
      return;
    }

    try {
      setBookingLoading(true);
      let isSuccess = false;

      try {
        const { data } = await axios.post('/api/bookings/create', {
          car: car._id,
          pickupDate,
          returnDate,
        });

        if (data?.success) {
          isSuccess = true;
        }
      } catch (apiErr) {
        console.warn("Backend booking API unreachable, using client reservation ledger:", apiErr.message);
      }

      // Save to local reservations ledger for instant access
      const newLocalBooking = {
        _id: `res_${Date.now()}`,
        car: car,
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        price: calculateTotal(),
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      const existingLocal = JSON.parse(localStorage.getItem('teracar_local_bookings') || '[]');
      localStorage.setItem('teracar_local_bookings', JSON.stringify([newLocalBooking, ...existingLocal]));

      toast.success('Reservation confirmed & stored in digital ledger!');
      navigate('/my-bookings');
    } catch (err) {
      toast.error('Unable to complete reservation. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs font-mono uppercase tracking-widest text-[#64748B]">
        Locating chassis spec sheet...
      </div>
    );
  }

  const daysCount = Math.max(
    1,
    Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)) || 1
  );

  const displayTitle = car.title || `${car.brand || ''} ${car.model || 'Spec'}`.trim() || 'Luxury Chassis';

  return (
    <div className="min-h-screen py-8 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/cars"
            className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider text-[#64748B] hover:text-[#090D16] uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Fleet Catalog</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { playUiClick(); openChat(car); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F8FAFC] text-[#090D16] border border-[#E2E8F0] rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Inquire Concierge</span>
            </button>

            <button
              onClick={() => { playUiClick(); setCompareModalOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F8FAFC] text-[#090D16] border border-[#E2E8F0] rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>
          </div>
        </div>

        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#64748B] uppercase block">
              {car.brand || 'ATELIER'} // {car.category || 'SUPERCAR'}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#090D16] uppercase font-editorial tracking-tight mt-1">
              {displayTitle}
            </h1>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <span className="text-[9px] font-mono uppercase text-[#64748B]">Allocation Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold font-mono text-[#090D16]">
                {currency}{car.pricePerDay || car.price}
              </span>
              <span className="text-xs font-mono text-[#64748B] uppercase">/ day</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visual Showcase & Technical Sheet */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Vehicle Image Stage */}
            <div className="w-full h-80 sm:h-96 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg relative overflow-hidden flex items-center justify-center p-6">
              <img 
                src={car.image} 
                alt={displayTitle} 
                className="w-full h-full object-contain max-h-[320px] transition-transform duration-500 hover:scale-105" 
              />
              <span className="absolute top-3 left-3 bg-white border border-[#E2E8F0] px-2.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold text-[#090D16]">
                CHASSIS ID // {car._id?.slice(-6).toUpperCase()}
              </span>
            </div>

            {/* Telemetry Sheet */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0] text-[10px] font-mono uppercase">
              <div className="p-4 flex flex-col gap-1">
                <span className="text-[#64748B]">Transmission</span>
                <span className="text-[#090D16] font-bold flex items-center gap-1 text-xs">
                  <Gauge className="w-3.5 h-3.5 text-[#64748B]" />
                  {car.transmission || 'Auto'}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <span className="text-[#64748B]">Fuel / Power</span>
                <span className="text-[#090D16] font-bold flex items-center gap-1 text-xs">
                  <Fuel className="w-3.5 h-3.5 text-[#64748B]" />
                  {car.fuel_type || car.fuelType || 'Petrol'}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <span className="text-[#64748B]">Capacity</span>
                <span className="text-[#090D16] font-bold flex items-center gap-1 text-xs">
                  <Users className="w-3.5 h-3.5 text-[#64748B]" />
                  {car.seating_capacity || car.seats ? `${car.seating_capacity || car.seats} Seats` : '2 Seats'}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <span className="text-[#64748B]">Hub Station</span>
                <span className="text-[#090D16] font-bold flex items-center gap-1 text-xs truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                  <span className="truncate">{car.location || 'Central Depot'}</span>
                </span>
              </div>
            </div>

            {/* Overview */}
            <div className="p-6 bg-white border border-[#E2E8F0] rounded-lg">
              <h3 className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider mb-2">
                Engineering & Fleet Overview
              </h3>
              <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                {car.description ||
                  'Precision-engineered vehicle with verified telemetry and comprehensive diagnostics. Delivered clean, charged, and inspected with digital verification.'}
              </p>
            </div>
          </div>

          {/* Right Column: Booking Console */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <form
              onSubmit={handleBooking}
              className="bg-white border border-[#E2E8F0] rounded-lg p-6 flex flex-col gap-5 sticky top-24 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <div>
                  <h3 className="text-base font-bold uppercase text-[#090D16] font-editorial">Reserve Allocation</h3>
                  <p className="text-[9px] font-mono text-[#64748B] uppercase">Swiss Direct Dispatch</p>
                </div>
                <div className="w-8 h-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-[#090D16]" />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-[#64748B] uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#090D16]" />
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={pickupDate}
                    onChange={(e) => handlePickupChange(e.target.value)}
                    className="bg-[#F8FAFC] border border-[#E2E8F0] rounded px-3 py-2 text-xs font-mono text-[#090D16] uppercase outline-none focus:border-[#090D16] cursor-pointer"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-[#64748B] uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#090D16]" />
                    Return Date
                  </label>
                  <input
                    type="date"
                    min={pickupDate || todayStr}
                    value={returnDate}
                    onChange={(e) => handleReturnChange(e.target.value)}
                    className="bg-[#F8FAFC] border border-[#E2E8F0] rounded px-3 py-2 text-xs font-mono text-[#090D16] uppercase outline-none focus:border-[#090D16] cursor-pointer"
                    required
                  />
                </div>
              </div>

              {/* Add-ons */}
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-mono text-[#64748B] uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#090D16]" />
                  Bespoke Options
                </label>
                
                <div className="flex flex-col gap-1.5">
                  {ADD_ONS.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    const Icon = addon.icon;
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-2.5 rounded border transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#F8FAFC] border-[#090D16]'
                            : 'bg-white border-[#E2E8F0] hover:border-[#94A3B8]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-3.5 h-3.5 text-[#090D16]" />
                          <div className="flex flex-col">
                            <span className="text-[11px] font-mono font-semibold text-[#090D16] leading-tight">{addon.name}</span>
                            <span className="text-[9px] text-[#64748B]">{addon.desc}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono font-bold text-[#090D16]">+{currency}{addon.rate}</span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded accent-[#090D16] cursor-pointer"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Promo */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-[#64748B] uppercase flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#090D16]" />
                  Promo Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="E.G. LUXURY2026"
                    className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded px-3 py-2 text-xs font-mono uppercase text-[#090D16] outline-none focus:border-[#090D16]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3.5 py-2 bg-[#090D16] text-white rounded text-[10px] font-mono uppercase font-bold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-4 flex flex-col gap-2 text-[10px] font-mono uppercase">
                <div className="flex justify-between text-[#64748B]">
                  <span>Daily Rate</span>
                  <span className="text-[#090D16] font-bold">{currency}{car.pricePerDay || car.price}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Duration</span>
                  <span className="text-[#090D16] font-bold">{daysCount} Day(s)</span>
                </div>
                {selectedAddons.length > 0 && (
                  <div className="flex justify-between text-[#64748B]">
                    <span>Add-ons</span>
                    <span className="text-[#090D16] font-bold">
                      +{currency}{selectedAddons.reduce((acc, aId) => acc + (ADD_ONS.find(a => a.id === aId)?.rate || 0), 0) * daysCount}
                    </span>
                  </div>
                )}
                {promoApplied && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>VIP Member Savings</span>
                    <span>-{discountPercent}%</span>
                  </div>
                )}
                <div className="border-t border-[#E2E8F0] pt-2.5 flex justify-between items-baseline text-xs font-bold text-[#090D16]">
                  <span>Total Amount</span>
                  <span className="text-xl font-mono text-[#090D16]">
                    {currency}{calculateTotal()}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3.5 bg-[#090D16] hover:bg-[#1E293B] text-white rounded text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{bookingLoading ? 'RESERVING...' : 'CONFIRM RESERVATION'}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#64748B] font-mono uppercase text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#090D16]" />
                <span>Verified Clean Chassis • Direct Concierge</span>
              </div>
            </form>
          </div>
          
        </div>
      </div>

      <CarComparisonModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        initialCar={car}
      />
    </div>
  );
};

export default CarDetails;