import React from 'react';
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import AutomotiveMachine3D from '../components/AutomotiveMachine3D';
import LocationsSection from '../components/LocationsSection';
import StorytellingSection from '../components/StorytellingSection';
import Banner from '../components/Banner';
import { ArrowRight, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = ({ onOpenSearch }) => {
  return (
    <div className="relative min-h-screen bg-[#F3F1EC] text-[#111111]">
      
      {/* 01 — Editorial Hero */}
      <Hero onOpenSearch={onOpenSearch} />

      {/* 02 — Asymmetric Introduction Section */}
      <section className="py-24 sm:py-32 border-b border-[#D8D5CF] bg-[#F3F1EC]">
        <div className="max-w-[1440px] mx-auto section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Oversized Number */}
            <div className="lg:col-span-3">
              <span className="text-7xl sm:text-9xl font-editorial font-bold text-[#111111]/15 leading-none block select-none">
                01
              </span>
              <span className="text-xs font-mono tracking-widest text-[#707070] uppercase block mt-2">
                THE MANIFESTO // 2026
              </span>
            </div>

            {/* Right: Asymmetric Editorial Typography */}
            <div className="lg:col-span-9 max-w-3xl">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-bold tracking-tight uppercase leading-[1.02] text-[#111111] mb-8">
                NOT JUST A RENTAL.<br />
                <span className="text-[#651F2A]">A BETTER WAY TO MOVE.</span>
              </h2>

              <p className="text-base sm:text-xl font-body text-[#707070] leading-relaxed mb-8">
                We believe the journey should be as remarkable as the destination. From track-bred supercars tuned for pure mechanical emotion to whisper-quiet grand tourers crafted for continent-crossing luxury — CAR RENTAL delivers friction-free access to the world’s most coveted machines.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#D8D5CF] text-xs font-mono">
                <div>
                  <span className="font-bold text-[#111111] block mb-1 uppercase">01 / IMMACULATE</span>
                  <p className="text-[#707070]">Concours-prepared, low-mileage factory specification vehicles.</p>
                </div>
                <div>
                  <span className="font-bold text-[#111111] block mb-1 uppercase">02 / UNRESTRICTED</span>
                  <p className="text-[#707070]">Transparent daily allocations with zero hidden refueling penalties.</p>
                </div>
                <div>
                  <span className="font-bold text-[#111111] block mb-1 uppercase">03 / CONCIERGE</span>
                  <p className="text-[#707070]">Curbside handover at private FBOs, 5-star hotels, or your driveway.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Selected Fleet Showcase */}
      <FeaturedSection />

      {/* 04 — Automotive 3D Section */}
      <AutomotiveMachine3D />

      {/* 05 — Scroll Narrative / Chronicle */}
      <StorytellingSection />

      {/* 06 — Metropolitan Locations */}
      <LocationsSection />

      {/* 07 — Privilege & Offers */}
      <Banner />
    </div>
  );
};

export default Home;