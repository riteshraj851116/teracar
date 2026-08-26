import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Sparkles, Shield, Cpu, Terminal } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-cyan-500/10 bg-slate-950/80 backdrop-blur-xl pt-16 pb-12 px-4 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-wider">VELOCITY</span>
              <span className="text-[9px] font-mono text-cyan-400 block -mt-1 uppercase tracking-widest">3D MOBILITY PLATFORM</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pioneering next-generation luxury vehicle rentals through interactive 3D studio inspection and automated fleet telemetry.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-4">Platform</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-medium">
            <li><Link to="/cars" className="hover:text-cyan-300 transition-colors">Explore All Supercars</Link></li>
            <li><Link to="/my-bookings" className="hover:text-cyan-300 transition-colors">My Active Rentals</Link></li>
            <li><Link to="/" className="hover:text-cyan-300 transition-colors">Interactive 3D Studio</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400 mb-4">Fleet Categories</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-medium">
            <li><Link to="/cars" className="hover:text-purple-300 transition-colors">Hypercars & Supercars</Link></li>
            <li><Link to="/cars" className="hover:text-purple-300 transition-colors">Electric Performance</Link></li>
            <li><Link to="/cars" className="hover:text-purple-300 transition-colors">Executive Luxury Sedans</Link></li>
          </ul>
        </div>

        {/* Status Telemetry */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 mb-4">System Status</h4>
          <div className="flex flex-col gap-3 glass-card p-4 rounded-xl border border-white/10 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Server Node</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE (5002)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">3D Render Engine</span>
              <span className="text-cyan-400">THREE.JS v170</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Database</span>
              <span className="text-purple-400">MongoDB Atlas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
        <p>© 2026 VELOCITY 3D MOBILITY INC. ALL RIGHTS RESERVED.</p>
        <p>POWERED BY THREE.JS // REACT 19 // TAILWIND 4</p>
      </div>
    </footer>
  );
};

export default Footer;
