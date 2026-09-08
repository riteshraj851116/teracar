import React from 'react';
import { useAppContext } from '../context/AppContext';
import CarCard from '../components/CarCard';
import { ArrowRight, Sparkles, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedSection = () => {
  const { cars, navigate } = useAppContext();

  // Show first 6 cars as featured
  const featuredCars = cars.slice(0, 6);

  return (
    <section className="max-w-[1400px] mx-auto section-padding py-16" aria-label="Featured vehicles">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-[2px] bg-accent" />
            <span className="text-xs font-medium tracking-[0.15em] text-accent uppercase">
              Featured Collection
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary font-editorial tracking-tight">
            Handpicked for You
          </h2>
          <p className="text-text-secondary mt-2 max-w-lg">
            Our most popular vehicles, curated for exceptional driving experiences.
          </p>
        </div>

        <Link
          to="/cars"
          className="btn-outline px-5 py-2.5 text-sm rounded-lg self-start md:self-auto"
        >
          View All Cars
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Car Grid */}
      {featuredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-bg-secondary rounded-xl border border-border">
          <Sparkles className="w-8 h-8 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">Loading featured vehicles...</p>
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;