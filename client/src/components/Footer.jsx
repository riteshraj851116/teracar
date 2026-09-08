import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0B0B0B] text-[#F4F2ED] pt-24 pb-12 border-t border-white/14 select-none" aria-label="Site footer">
      <div className="max-w-[1440px] mx-auto section-padding">
        
        {/* 29 — Main Large Text & CTA */}
        <div className="pb-20 border-b border-white/14 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#C5A880] uppercase block mb-4 font-bold">
              06 // INITIATE JOURNEY
            </span>
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-display font-extrabold tracking-tight uppercase leading-[0.88] text-[#F4F2ED]">
              READY<br />
              <span className="text-[#C5A880]">TO MOVE?</span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-5">
            <p className="text-xs font-mono text-[#9B9B9B] uppercase tracking-widest max-w-xs leading-relaxed">
              Available 24/7 across primary metropolitan hubs. Direct airport concierge and zero administrative waiting.
            </p>
            <Link
              to="/cars"
              data-cursor="book"
              data-cursor-text="BOOK"
              className="btn-club-primary py-4 px-8 text-xs font-bold"
            >
              <span>BOOK YOUR CAR</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 29 — Links: FLEET, LOCATIONS, OFFERS, ABOUT, CONTACT */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-16 border-b border-white/14 text-xs font-mono">
          <div>
            <span className="text-[#6E6E6E] uppercase tracking-widest block mb-4">
              FLEET
            </span>
            <ul className="space-y-3 uppercase tracking-wider">
              {['Supercars', 'Luxury Saloons', 'Flagship SUVs', 'Grand Tourers', 'Electric Performance'].map((item) => (
                <li key={item}>
                  <Link to="/cars" className="text-[#9B9B9B] hover:text-[#F4F2ED] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-[#6E6E6E] uppercase tracking-widest block mb-4">
              LOCATIONS
            </span>
            <ul className="space-y-3 uppercase tracking-wider">
              {['Delhi NCR', 'Mumbai', 'Bangalore', 'Goa', 'Hyderabad', 'Jaipur'].map((city) => (
                <li key={city}>
                  <Link to={`/cars?location=${encodeURIComponent(city)}`} className="text-[#9B9B9B] hover:text-[#F4F2ED] transition-colors">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-[#6E6E6E] uppercase tracking-widest block mb-4">
              OFFERS
            </span>
            <ul className="space-y-3 uppercase tracking-wider">
              {['Weekend Privileges', 'Corporate Concierge', 'Long-Distance GT', 'Airport Valet'].map((offer) => (
                <li key={offer}>
                  <Link to="/#offers" className="text-[#9B9B9B] hover:text-[#F4F2ED] transition-colors">
                    {offer}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-[#6E6E6E] uppercase tracking-widest block mb-4">
              ABOUT
            </span>
            <ul className="space-y-3 uppercase tracking-wider">
              {['Automotive Club', 'Concierge Standards', 'Insurance Integrity', 'Privacy Policy'].map((about) => (
                <li key={about}>
                  <Link to="/#experience" className="text-[#9B9B9B] hover:text-[#F4F2ED] transition-colors">
                    {about}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-[#6E6E6E] uppercase tracking-widest block mb-4">
              CONTACT
            </span>
            <ul className="space-y-3 text-[#9B9B9B]">
              <li>DISPATCH: +91 11 4982 0000</li>
              <li>CONCIERGE@CARRENTAL.COM</li>
              <li>DELHI // MUMBAI // BANGALORE</li>
              <li className="pt-2">
                <span className="text-[#C5A880] text-[10px] tracking-widest uppercase block">
                  CHASE LIAISON ON CALL 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 29 — Bottom: CAR RENTAL © 2026 */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6E6E6E]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
            <span className="text-[#F4F2ED] font-bold uppercase tracking-widest">
              CAR RENTAL © 2026
            </span>
          </div>

          <div className="flex items-center gap-6 uppercase tracking-wider text-[11px]">
            <span>ALL RIGHTS RESERVED</span>
            <span>•</span>
            <span>PREMIUM AUTOMOTIVE MOBILITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;