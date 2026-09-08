import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
  Heart,
  MapPin,
  Fuel,
  Users,
  Settings2,
  ArrowRight,
  Star,
} from 'lucide-react';

const CarCard = ({ car }) => {
  const { currency, navigate, toggleFavorite, isFavorite } = useAppContext();

  const carId = car._id;
  const title = car.title || `${car.brand} ${car.model}`;
  const image = car.image;
  const brand = car.brand;
  const model = car.model;
  const year = car.year;
  const category = car.category;
  const seats = car.seating_capacity || car.seats || 4;
  const fuel = car.fuel_type || car.fuelType || 'Petrol';
  const transmission = car.transmission || 'Automatic';
  const price = car.pricePerDay || car.price || 0;
  const location = car.location || '';
  const isAvailable = car.isAvaliable !== false;
  const rating = car.rating || 4.5;

  const liked = isFavorite(carId);

  return (
    <div className="premium-card rounded-xl overflow-hidden group">
      {/* Image */}
      <div className="relative h-52 sm:h-56 overflow-hidden bg-bg-secondary">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 badge badge-neutral text-[10px]">
          {category}
        </span>

        {/* Favorite Button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(carId); }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            liked
              ? 'bg-accent text-white'
              : 'bg-white/90 backdrop-blur-sm text-text-secondary hover:text-accent'
          }`}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
        </button>

        {/* Quick Book on Hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={() => navigate(`/car-details/${carId}`)}
            className="btn-primary w-full py-2.5 text-sm rounded-lg"
          >
            Book Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Unavailable Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="badge badge-error text-xs">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="text-base font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors">
              {brand} {model}
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">{year}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span className="text-sm font-semibold text-text-primary">{rating}</span>
          </div>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 mt-3 pb-3 border-b border-border">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Settings2 className="w-3.5 h-3.5" />
            <span className="text-xs">{transmission}</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Fuel className="w-3.5 h-3.5" />
            <span className="text-xs">{fuel.split(' ')[0]}</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">{seats}</span>
          </div>
        </div>

        {/* Price & Location */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-accent">{currency}{price}</span>
            <span className="text-xs text-text-secondary ml-1">/day</span>
          </div>
          {location && (
            <div className="flex items-center gap-1 text-text-muted">
              <MapPin className="w-3 h-3" />
              <span className="text-xs truncate max-w-[100px]">{location}</span>
            </div>
          )}
        </div>

        {/* View Details Link */}
        <Link
          to={`/car-details/${carId}`}
          className="flex items-center justify-center gap-2 mt-4 py-2.5 rounded-lg border border-border text-sm font-medium text-text-primary hover:border-accent hover:text-accent transition-colors"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default CarCard;