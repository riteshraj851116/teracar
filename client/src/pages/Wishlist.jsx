import React from 'react';
import { useAppContext } from '../context/AppContext';
import CarCard from '../components/CarCard';
import { Heart, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { cars, favorites } = useAppContext();

  const savedCars = cars.filter((car) => favorites.includes(car._id));

  return (
    <div className="min-h-screen py-10 max-w-[1400px] mx-auto section-padding">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-[2px] bg-accent" />
            <span className="text-xs font-medium tracking-[0.15em] text-accent uppercase">
              My Collection
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary font-editorial tracking-tight">
            Saved Cars
          </h1>
          <p className="text-text-secondary mt-1">
            {savedCars.length} vehicle{savedCars.length !== 1 ? 's' : ''} in your wishlist
          </p>
        </div>

        <Link
          to="/cars"
          className="btn-outline px-5 py-2.5 text-sm rounded-lg self-start md:self-auto"
        >
          <Search className="w-4 h-4" />
          Browse More Cars
        </Link>
      </div>

      {/* Cars Grid or Empty State */}
      {savedCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No saved cars yet</h3>
          <p className="text-text-secondary max-w-md mb-6">
            Browse our premium fleet and tap the heart icon on any car to save it here for later.
          </p>
          <Link to="/cars" className="btn-primary px-6 py-3 rounded-lg text-sm">
            Explore Cars
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
