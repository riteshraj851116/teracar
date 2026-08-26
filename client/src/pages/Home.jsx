import React from 'react';
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import Banner from '../components/Banner';
import Testimonial from '../components/Testimonial';
import Newsletter from '../components/Newsletter';
import ParticleBackground from '../components/3d/ParticleBackground';

const Home = () => {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
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
