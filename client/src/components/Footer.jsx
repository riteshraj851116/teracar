import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-zinc-200 bg-white pt-16 pb-12 px-4 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#800020] via-[#991B1B] to-black flex items-center justify-center text-white shadow-sm">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-black tracking-tight">VELOCITY</span>
              <span className="text-[9px] font-mono text-[#800020] font-bold block -mt-1 uppercase tracking-widest">LUXURY MOBILITY</span>
            </div>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed font-normal">
            Pioneering luxury and exotic supercar rentals through interactive 3D showcase technology, transparent daily rates, and verified fleet telemetry.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-black mb-4">Platform</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-zinc-600 font-medium">
            <li><Link to="/cars" className="hover:text-[#800020] transition-colors">Explore All Supercars</Link></li>
            <li><Link to="/my-bookings" className="hover:text-[#800020] transition-colors">My Active Rentals</Link></li>
            <li><Link to="/" className="hover:text-[#800020] transition-colors">Flagship 3D Showcase</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-black mb-4">Fleet Categories</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-zinc-600 font-medium">
            <li><Link to="/cars" className="hover:text-[#800020] transition-colors">Exotics & Supercars</Link></li>
            <li><Link to="/cars" className="hover:text-[#800020] transition-colors">Electric Performance</Link></li>
            <li><Link to="/cars" className="hover:text-[#800020] transition-colors">Executive Luxury Sedans</Link></li>
            <li><Link to="/cars" className="hover:text-[#800020] transition-colors">Performance Luxury SUVs</Link></li>
          </ul>
        </div>

        {/* Status Telemetry */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-black mb-4">System Telemetry</h4>
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Fleet Status</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                ONLINE (5002)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">3D Kinetic Canvas</span>
              <span className="text-[#800020] font-bold">THREE.JS v170</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Fleet Cloud</span>
              <span className="text-black font-bold">MongoDB Atlas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 font-mono gap-4">
        <p>© 2026 VELOCITY LUXURY MOBILITY INC. ALL RIGHTS RESERVED.</p>
        <p>POWERED BY THREE.JS // REACT 19 // TAILWIND CSS</p>
      </div>
    </footer>
  );
};

export default Footer;
