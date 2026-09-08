import React from 'react';
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import AerodynamicFlow3D from '../components/AerodynamicFlow3D';
import LocationsSection from '../components/LocationsSection';
import StorytellingSection from '../components/StorytellingSection';
import Banner from '../components/Banner';
import { ArrowRight, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = ({ onOpenSearch }) => {
  return (
    <div className="relative min-h-screen bg-[#0B0B0B] text-[#F4F2ED]">
      
      {/* 01 — Full-Screen Automotive Hero */}
      <Hero onOpenSearch={onOpenSearch} />

      {/* 09 — Asymmetric Introduction Section */}
      <section className="py-28 sm:py-36 border-b border-white/14 bg-[#0B0B0B]">
        <div className="max-w-[1440px] mx-auto section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: 09 Large Typography Headline */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                <span className="text-xs font-mono tracking-widest text-[#C5A880] uppercase font-bold">
                  01 // STATEMENT
                </span>
              </div>

              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight uppercase leading-[0.95] text-[#F4F2ED]">
                MORE THAN<br />
                A RENTAL.<br />
                <span className="text-[#C5A880]">IT'S YOUR</span><br />
                NEXT JOURNEY.
              </h2>
            </div>

            {/* Right: Small Paragraph & Core Tenets */}
            <div className="lg:col-span-5 pt-4 lg:pt-12">
              <p className="text-lg sm:text-xl font-body text-[#9B9B9B] leading-relaxed mb-8">
                Choose from a curated fleet of premium vehicles and experience a simpler way to move.
              </p>

              <p className="text-sm font-body text-[#6E6E6E] leading-relaxed mb-10">
                From track-bred supercars tuned for pure mechanical emotion to whisper-quiet grand tourers crafted for continent-crossing luxury — CAR RENTAL delivers friction-free access to the world’s most coveted machines.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/14 text-xs font-mono">
                <div>
                  <span className="font-bold text-[#F4F2ED] block mb-1 uppercase">01 // IMMACULATE</span>
                  <p className="text-[#9B9B9B]">Concours-prepared, low-mileage factory specification vehicles.</p>
                </div>
                <div>
                  <span className="font-bold text-[#F4F2ED] block mb-1 uppercase">02 // UNRESTRICTED</span>
                  <p className="text-[#9B9B9B]">Transparent daily allocations with zero hidden refueling penalties.</p>
                </div>
                <div>
                  <span className="font-bold text-[#F4F2ED] block mb-1 uppercase">03 // CONCIERGE</span>
                  <p className="text-[#9B9B9B]">Curbside handover at private FBOs, 5-star hotels, or your driveway.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 — Selected Fleet Showcase */}
      <FeaturedSection />

      {/* 25 — Experience Section */}
      <StorytellingSection />

      {/* 26 — Premium 3D Section (The Machine) */}
      <AerodynamicFlow3D />

      {/* 24 — Our Locations */}
      <LocationsSection />

      {/* 27 — Privilege & Offers Banner */}
      <Banner />
    </div>
  );
};

export default Home;