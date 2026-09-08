import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import {
  Calendar,
  ArrowRight,
  MapPin,
  Clock,
  ChevronRight,
  Play,
  Shield,
  Sparkles,
  Star
} from 'lucide-react';

const HERO_VEHICLES = [
  {
    name: "Mercedes-AMG GT",
    tagline: "Performance Redefined",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Porsche 911 GT3",
    tagline: "Track Heritage",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "BMW M8 Competition",
    tagline: "Grand Touring",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1400&auto=format&fit=crop",
  },
];

const Hero = () => {
  const { navigate, pickupDate, setPickupDate, returnDate, setReturnDate, cars } = useAppContext();
  const [activeSlide, setActiveSlide] = useState(0);
  const [location, setLocation] = useState('');
  const timerRef = useRef(null);

  // Auto-rotate hero slides
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_VEHICLES.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/cars');
  };

  const currentVehicle = HERO_VEHICLES[activeSlide];

  return (
    <section className="relative" aria-label="Hero section">

      {/* Hero Image + Overlay */}
      <div className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden">
        {/* Background Image */}
        {HERO_VEHICLES.map((vehicle, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover"
              loading={idx === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1400px] mx-auto w-full section-padding">
            <div className="max-w-2xl">

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-8 h-[2px] bg-white/60" />
                <span className="text-xs font-medium tracking-[0.2em] text-white/70 uppercase">
                  Premium Automotive Experience
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-[3.8rem] xl:text-[4.2rem] font-bold text-white leading-[1.08] tracking-tight font-editorial"
              >
                Drive Something
                <br />
                <span className="text-white/90">Worth Remembering.</span>
              </motion.h1>

              {/* Supporting Text */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-base sm:text-lg text-white/70 mt-5 max-w-lg leading-relaxed"
              >
                Premium cars. Flexible rentals. Effortless journeys.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap items-center gap-3 mt-8"
              >
                <button
                  onClick={() => navigate('/cars')}
                  className="btn-primary px-7 py-3.5 text-[15px] rounded-lg"
                >
                  Explore Cars
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const searchEl = document.getElementById('hero-search');
                    if (searchEl) searchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 rounded-lg text-[15px] font-medium transition-all"
                >
                  Find Your Car
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex items-center gap-6 mt-10"
              >
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Shield className="w-4 h-4 text-white/50" />
                  <span>Fully Insured</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Star className="w-4 h-4 text-white/50" />
                  <span>4.9 Rating</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Sparkles className="w-4 h-4 text-white/50" />
                  <span>Premium Fleet</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-[1400px] mx-auto section-padding">
            <div className="flex items-center gap-3">
              {HERO_VEHICLES.map((vehicle, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveSlide(idx);
                    clearInterval(timerRef.current);
                    timerRef.current = setInterval(() => {
                      setActiveSlide((prev) => (prev + 1) % HERO_VEHICLES.length);
                    }, 6000);
                  }}
                  className={`transition-all ${
                    idx === activeSlide
                      ? 'w-12 h-1 bg-white rounded-full'
                      : 'w-6 h-1 bg-white/30 rounded-full hover:bg-white/50'
                  }`}
                  aria-label={`Show ${vehicle.name}`}
                />
              ))}
              <span className="ml-4 text-xs text-white/50 font-medium">
                {String(activeSlide + 1).padStart(2, '0')} / {String(HERO_VEHICLES.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div id="hero-search" className="relative -mt-16 z-10 max-w-[1400px] mx-auto section-padding">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl border border-border shadow-lg p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Find Your Perfect Car</h2>
              <p className="text-sm text-text-secondary mt-0.5">Search from {cars.length || 'our'} premium vehicles</p>
            </div>
            <span className="badge badge-accent hidden sm:flex">
              <Sparkles className="w-3 h-3" />
              Instant Booking
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Pickup Location */}
            <div className="lg:col-span-1">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                Pickup Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="premium-input"
              >
                <option value="">Any Location</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Houston">Houston</option>
                <option value="Miami">Miami</option>
                <option value="San Francisco">San Francisco</option>
              </select>
            </div>

            {/* Pickup Date */}
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

            {/* Pickup Time */}
            <div>
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                Pickup Time
              </label>
              <select className="premium-input">
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">01:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
                <option value="18:00">06:00 PM</option>
              </select>
            </div>

            {/* Return Date */}
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

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="btn-primary w-full py-3 rounded-lg text-sm"
              >
                Find Available Cars
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Stats Strip */}
      <div className="max-w-[1400px] mx-auto section-padding mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-text-primary font-editorial">500+</p>
            <p className="text-sm text-text-secondary mt-1">Premium Vehicles</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-text-primary font-editorial">50+</p>
            <p className="text-sm text-text-secondary mt-1">Cities Covered</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-text-primary font-editorial">10K+</p>
            <p className="text-sm text-text-secondary mt-1">Happy Customers</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-text-primary font-editorial">4.9</p>
            <p className="text-sm text-text-secondary mt-1">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;