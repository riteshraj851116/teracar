import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-[#E2E8F0] bg-white pt-12 pb-8 px-4 md:px-12 lg:px-20 text-[#090D16]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#090D16] rounded-md flex items-center justify-center text-white font-bold text-xs">
              TC
            </div>
            <span className="text-base font-bold tracking-widest uppercase font-editorial">
              TERACAR
            </span>
          </Link>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Swiss precision automotive curation. Verified chassis, white-glove delivery, and bespoke executive fleet rentals.
          </p>
        </div>

        {/* Directory */}
        <div>
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748B] mb-3">
            Atelier Directory
          </h4>
          <ul className="flex flex-col gap-2 text-xs font-mono uppercase text-[#334155]">
            <li><Link to="/cars" className="hover:text-[#090D16] transition-colors">Showroom Fleet</Link></li>
            <li><Link to="/my-bookings" className="hover:text-[#090D16] transition-colors">Client Reservations</Link></li>
            <li><Link to="/" className="hover:text-[#090D16] transition-colors">Quick-Book Console</Link></li>
          </ul>
        </div>

        {/* Fleet Categories */}
        <div>
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748B] mb-3">
            Fleet Series
          </h4>
          <ul className="flex flex-col gap-2 text-xs font-mono uppercase text-[#334155]">
            <li><Link to="/cars" className="hover:text-[#090D16] transition-colors">Hypercars & GT</Link></li>
            <li><Link to="/cars" className="hover:text-[#090D16] transition-colors">Electric Performance</Link></li>
            <li><Link to="/cars" className="hover:text-[#090D16] transition-colors">Executive SUVs</Link></li>
          </ul>
        </div>

        {/* Hubs & Status */}
        <div>
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748B] mb-3">
            Operational Hubs
          </h4>
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[10px] font-mono space-y-1.5 uppercase">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Central Dispatch</span>
              <span className="font-bold text-[#090D16] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ACTIVE
              </span>
            </div>
            <div className="flex justify-between border-t border-[#E2E8F0] pt-1 text-[#64748B]">
              <span>Coverage</span>
              <span className="font-bold text-[#090D16]">ZRH // GVA // LHR // BOM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto mt-10 pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-[9px] font-mono text-[#64748B] uppercase tracking-wider gap-2">
        <p>© 2026 TERACAR SWISS ATELIER. ALL RIGHTS RESERVED.</p>
        <p>ARCHITECTURAL EDITION</p>
      </div>
    </footer>
  );
};

export default Footer;