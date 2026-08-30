import React from 'react';
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import Banner from '../components/Banner';
import Testimonial from '../components/Testimonial';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#090D16] overflow-hidden">
      {/* Main Content Sections */}
      <div className="relative z-10 flex flex-col gap-10 md:gap-14 pb-16">
        <Hero />
        <FeaturedSection />
        <Banner />
        <Testimonial />
        <Newsletter />
      </div>
    </div>
  );
};

export default Home;