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
  ArrowUpRight,
  Shield,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

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
    isFavorite,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate
  } = useAppContext();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  const rentalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 1;
    const diff = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }, [pickupDate, returnDate]);

  const dailyRate = car ? Number(car.pricePerDay || car.price || 12000) : 12000;
  const subtotal = dailyRate * rentalDays;
  const insuranceFee = Math.round(subtotal * 0.08);
  const taxAmount = Math.round(subtotal * 0.1);
  const totalPrice = subtotal + insuranceFee + taxAmount;

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
      });

      if (data?.success) {
        toast.success('Vehicle allocation reserved successfully');
        navigate('/my-bookings');
      } else {
        toast.error(data?.message || 'Failed to reserve vehicle');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reservation failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 max-w-[1440px] mx-auto section-padding text-center font-mono text-xs uppercase tracking-widest text-[#707070]">
        Loading vehicle specifications...
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen py-24 flex flex-col items-center justify-center text-center section-padding bg-[#F3F1EC]">
        <h2 className="text-3xl font-editorial font-bold uppercase mb-2">VEHICLE ARCHIVE NOT FOUND</h2>
        <p className="text-xs font-mono text-[#707070] mb-6">This chassis may have been relocated or decommissioned.</p>
        <Link to="/cars" className="px-6 py-3 bg-[#111111] text-white text-xs font-mono uppercase font-bold">
          RETURN TO FLEET
        </Link>
      </div>
    );
  }

  const images = car.images && car.images.length > 0 ? car.images : [car.image];
  const isSaved = isFavorite(car._id);

  const specSheet = [
    { label: 'POWERTRAIN', value: car.fuel_type || '4.0L Naturally Aspirated' },
    { label: 'TRANSMISSION', value: car.transmission || 'Dual-Clutch PDK' },
    { label: 'CAPACITY', value: `${car.seating_capacity || 2} COCKPIT SEATS` },
    { label: 'CATEGORY', value: (car.category || 'Supercar').toUpperCase() },
    { label: 'LOCATION HUB', value: (car.location || 'DELHI NCR').toUpperCase() },
    { label: 'MODEL YEAR', value: String(car.year || '2024') },
  ];

  return (
    <div className="min-h-screen py-10 bg-[#F3F1EC] text-[#111111]">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        {/* Editorial Breadcrumb */}
        <div className="flex items-center justify-between pb-6 border-b border-[#D8D5CF] text-xs font-mono mb-8">
          <div className="flex items-center gap-2 text-[#707070] uppercase">
            <Link to="/" className="hover:text-[#111111]">CAR RENTAL</Link>
            <span>/</span>
            <Link to="/cars" className="hover:text-[#111111]">FLEET</Link>
            <span>/</span>
            <span className="text-[#111111] font-bold">{car.brand} {car.model}</span>
          </div>

          <button
            onClick={() => toggleFavorite(car._id)}
            className="flex items-center gap-2 hover:text-[#651F2A] transition-colors cursor-pointer"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#651F2A] text-[#651F2A]' : ''}`} />
            <span>{isSaved ? 'SAVED TO ARCHIVE' : 'SAVE VEHICLE'}</span>
          </button>
        </div>

        {/* Massive Vehicle Visual Stage */}
        <div className="relative border border-[#D8D5CF] bg-white p-6 sm:p-12 mb-12 overflow-hidden">
          <div className="w-full h-[360px] sm:h-[500px] lg:h-[600px] flex items-center justify-center relative">
            <img
              src={images[activeImageIndex]}
              alt={`${car.brand} ${car.model}`}
              className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-all duration-700 hover:scale-105"
            />
          </div>

          {/* Thumbnail Controls */}
          {images.length > 1 && (
            <div className="flex gap-2 pt-6 border-t border-[#D8D5CF]">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 border p-1 transition-all ${
                    idx === activeImageIndex ? 'border-[#111111] bg-white' : 'border-[#D8D5CF] opacity-50'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Metadata Overlay Badge */}
          <div className="absolute top-6 left-6 text-[10px] font-mono tracking-widest text-[#707070] uppercase bg-[#F3F1EC] border border-[#D8D5CF] px-3 py-1.5">
            CHASSIS STATUS: VERIFIED CONCOURS SPEC
          </div>
        </div>

        {/* Split Section: Editorial Content + Sticky Booking Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Headline & Specifications (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Small Monospace Metadata */}
            <div className="flex items-center gap-3 text-xs font-mono text-[#707070] uppercase tracking-widest">
              <span>{car.brand}</span>
              <span>//</span>
              <span>{car.model}</span>
              <span>//</span>
              <span>{car.year || '2024'}</span>
              <span>//</span>
              <span>{car.transmission || 'AUTOMATIC'}</span>
            </div>

            {/* Oversized Headline */}
            <div>
              <h1 className="text-4xl sm:text-6xl font-editorial font-bold tracking-tight uppercase leading-[0.96] text-[#111111]">
                BUILT FOR THE<br />
                <span className="text-[#651F2A]">ROAD AHEAD.</span>
              </h1>
              <p className="text-base sm:text-lg font-body text-[#707070] mt-6 leading-relaxed">
                {car.description ||
                  'Engineered for driver engagement and aerodynamic composure. Features factory sport exhaust, active carbon aerodynamics, and tailored interior appointments.'}
              </p>
            </div>

            {/* Editorial Specifications List */}
            <div className="border-t border-b border-[#D8D5CF] py-6">
              <span className="text-xs font-mono tracking-widest text-[#707070] uppercase block mb-6 font-bold">
                FACTORY SPECIFICATION SHEET
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs font-mono">
                {specSheet.map((item) => (
                  <div key={item.label} className="flex items-center justify-between pb-3 border-b border-[#D8D5CF]/60">
                    <span className="text-[#707070]">{item.label}</span>
                    <span className="font-bold text-[#111111]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Concierge Inclusions */}
            <div className="flex flex-col gap-3 text-xs font-mono text-[#707070] uppercase">
              <span className="font-bold text-[#111111]">INCLUDED CONCIERGE PRIVILEGES:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <span>• COMPREHENSIVE VEHICLE INSURANCE</span>
                <span>• TARMAC OR RESIDENCE HANDOVER</span>
                <span>• 24/7 ROADSIDE TELEMATICS CONCIERGE</span>
                <span>• UNRESTRICTED METROPOLITAN PASS</span>
              </div>
            </div>
          </div>

          {/* Right: Sticky Booking Interface (Cols 8-12) */}
          <div className="lg:col-span-5 sticky top-24 border border-[#111111] bg-white p-8">
            <div className="flex items-baseline justify-between pb-6 border-b border-[#D8D5CF] mb-6 font-mono">
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-[#111111]">
                  {currency}{dailyRate.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#707070] uppercase tracking-widest block">
                  PER 24-HOUR ALLOCATION
                </span>
              </div>
              <span className="text-[10px] text-[#651F2A] font-bold uppercase tracking-wider">
                READY FOR DISPATCH
              </span>
            </div>

            {/* Date Pickers */}
            <div className="flex flex-col gap-4 mb-6 text-xs font-mono">
              <div>
                <label className="text-[10px] text-[#707070] uppercase tracking-wider block mb-1">
                  PICKUP DATE
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 bg-[#F3F1EC] border border-[#D8D5CF] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#707070] uppercase tracking-wider block mb-1">
                  RETURN DATE
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={pickupDate || new Date().toISOString().split('T')[0]}
                  className="w-full p-3 bg-[#F3F1EC] border border-[#D8D5CF] focus:border-[#111111] focus:outline-none"
                />
              </div>
            </div>

            {/* Price Calculation */}
            <div className="border-t border-b border-[#D8D5CF] py-4 mb-6 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#707070]">DAILY RATE × {rentalDays} DAY(S)</span>
                <span className="font-bold">{currency}{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707070]">INSURANCE & DISPATCH (8%)</span>
                <span>{currency}{insuranceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707070]">STATUTORY TAX (10%)</span>
                <span>{currency}{taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#D8D5CF] text-sm font-bold">
                <span>TOTAL ESTIMATED</span>
                <span className="text-[#651F2A]">{currency}{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              data-cursor="book"
              data-cursor-text="CONFIRM"
              className="w-full py-4 bg-[#111111] hover:bg-[#651F2A] text-white text-xs font-mono tracking-widest uppercase font-bold flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-md disabled:opacity-50"
            >
              {bookingLoading ? (
                <span>SECURING ALLOCATION...</span>
              ) : (
                <>
                  <span>RESERVE VEHICLE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] font-mono text-[#707070] text-center mt-4 uppercase">
              ZERO CANCELLATION PENALTY UP TO 24H PRIOR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;