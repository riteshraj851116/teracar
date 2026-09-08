import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import {
  ArrowLeft, ArrowRight, Heart, Star, MapPin, Calendar, Clock,
  Fuel, Settings2, Users, Car, Shield, ChevronRight, Check,
  Info, Tag, CreditCard, AlertCircle, Gauge, Maximize2
} from 'lucide-react';

const CarDetails = () => {
  const { id } = useParams();
  const {
    cars, currency, navigate, axios, token, user,
    setShowLogin, toggleFavorite, isFavorite,
    pickupDate, setPickupDate, returnDate, setReturnDate
  } = useAppContext();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Find car from local state or fetch
  useEffect(() => {
    const found = cars.find((c) => c._id === id);
    if (found) {
      setCar(found);
      setLoading(false);
    } else {
      // Try fetching from API
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

  // Calculate rental
  const rentalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;
    const diff = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }, [pickupDate, returnDate]);

  const dailyRate = car ? Number(car.pricePerDay || car.price || 0) : 0;
  const subtotal = dailyRate * rentalDays;
  const insuranceFee = rentalDays > 0 ? Math.round(subtotal * 0.08) : 0;
  const taxAmount = rentalDays > 0 ? Math.round(subtotal * 0.1) : 0;
  const totalPrice = subtotal + insuranceFee + taxAmount;

  const handleBooking = async () => {
    if (!token || !user) {
      toast.error('Please sign in to book');
      setShowLogin(true);
      return;
    }
    if (!pickupDate || !returnDate) {
      toast.error('Please select pickup and return dates');
      return;
    }
    if (new Date(pickupDate) >= new Date(returnDate)) {
      toast.error('Return date must be after pickup date');
      return;
    }
    if (new Date(pickupDate) < new Date(new Date().toDateString())) {
      toast.error('Pickup date cannot be in the past');
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
        toast.success('Booking created successfully!');
        navigate('/my-bookings');
      } else {
        toast.error(data?.message || 'Failed to create booking');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen py-10 max-w-[1400px] mx-auto section-padding">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 skeleton" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[400px] skeleton rounded-xl" />
            <div className="h-[400px] skeleton rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!car) {
    return (
      <div className="min-h-screen py-20 flex flex-col items-center justify-center text-center section-padding">
        <AlertCircle className="w-12 h-12 text-text-muted mb-4" />
        <h2 className="text-xl font-semibold text-text-primary mb-2">Vehicle Not Found</h2>
        <p className="text-text-secondary mb-6">The vehicle you're looking for doesn't exist or has been removed.</p>
        <Link to="/cars" className="btn-primary px-6 py-3 rounded-lg text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Cars
        </Link>
      </div>
    );
  }

  const title = car.title || `${car.brand} ${car.model}`;
  const images = car.images && car.images.length > 0 ? car.images : [car.image];
  const liked = isFavorite(car._id);

  const specs = [
    { icon: Settings2, label: 'Transmission', value: car.transmission || 'Automatic' },
    { icon: Fuel, label: 'Fuel Type', value: car.fuel_type || car.fuelType || 'Petrol' },
    { icon: Users, label: 'Seats', value: car.seating_capacity || car.seats || 4 },
    { icon: Calendar, label: 'Year', value: car.year || 2024 },
    { icon: Car, label: 'Category', value: car.category || 'Sedan' },
    { icon: MapPin, label: 'Location', value: car.location || 'N/A' },
  ];

  return (
    <div className="min-h-screen py-8 max-w-[1400px] mx-auto section-padding">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
        <Link to="/" className="hover:text-accent transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/cars" className="hover:text-accent transition-colors">Cars</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary font-medium">{title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left — Gallery + Details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Main Image */}
          <div className="relative rounded-xl overflow-hidden bg-bg-secondary aspect-[16/10]">
            <img
              src={images[activeImageIndex]}
              alt={title}
              className="w-full h-full object-cover"
            />

            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(car._id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                liked ? 'bg-accent text-white' : 'bg-white/90 backdrop-blur-sm text-text-secondary hover:text-accent'
              }`}
              aria-label={liked ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
            </button>

            {/* Category Badge */}
            <span className="absolute top-4 left-4 badge badge-neutral">
              {car.category}
            </span>

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Previous image"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Next image"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${
                    idx === activeImageIndex ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${title} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title + Rating */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-editorial tracking-tight">
                {car.brand} {car.model}
              </h1>
              <p className="text-text-secondary mt-1">{car.year} · {car.category}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 bg-accent/5 px-3 py-1.5 rounded-lg">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm font-bold text-accent">{car.rating || '4.5'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Description</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{car.description}</p>
            </div>
          )}

          {/* Specifications */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {specs.map((spec, idx) => {
                const Icon = spec.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg">
                    <Icon className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-text-muted uppercase tracking-wider">{spec.label}</p>
                      <p className="text-sm font-semibold text-text-primary">{spec.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Air Conditioning', 'Bluetooth', 'GPS Navigation', 'USB Charging', 'Cruise Control', 'Parking Sensors'].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-text-secondary py-1.5">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Booking Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Price Card */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-accent">{currency}{dailyRate}</span>
                <span className="text-text-secondary text-sm">/day</span>
              </div>

              {/* Date Selection */}
              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="premium-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    className="premium-input"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              {rentalDays > 0 && (
                <div className="border-t border-border pt-4 mb-6 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{currency}{dailyRate} × {rentalDays} day{rentalDays > 1 ? 's' : ''}</span>
                    <span className="text-text-primary font-medium">{currency}{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Insurance (8%)</span>
                    <span className="text-text-primary font-medium">{currency}{insuranceFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Tax (10%)</span>
                    <span className="text-text-primary font-medium">{currency}{taxAmount}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                    <span className="text-text-primary">Total</span>
                    <span className="text-accent">{currency}{totalPrice}</span>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={bookingLoading || !pickupDate || !returnDate}
                className="btn-primary w-full py-3.5 rounded-lg text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Book Now
                  </>
                )}
              </button>

              {/* Info Note */}
              <div className="flex items-start gap-2 mt-4 p-3 bg-accent/5 rounded-lg">
                <Info className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <p className="text-xs text-text-secondary">
                  Free cancellation up to 24 hours before pickup. No hidden fees.
                </p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Fully Insured</p>
                  <p className="text-xs text-text-secondary">Comprehensive coverage included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;