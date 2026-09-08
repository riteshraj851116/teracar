import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, ShieldCheck, Car } from 'lucide-react';

const NavbarOwner = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0B] border-b border-white/14 px-6 md:px-10 py-3.5 flex items-center justify-between text-[#F4F2ED]">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-8 h-8 bg-[#1B1B1B] border border-white/14 flex items-center justify-center transition-transform group-hover:scale-105">
          <Car className="w-4 h-4 text-[#C5A880]" />
        </div>
        <div>
          <span className="text-sm font-display font-bold text-[#F4F2ED] tracking-wider block leading-none uppercase">
            CAR RENTAL
          </span>
          <span className="text-[9px] text-[#9B9B9B] block mt-0.5 uppercase tracking-widest font-mono">
            CLUB MANAGEMENT CONSOLE
          </span>
        </div>
      </Link>

      {/* Right */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#9B9B9B] hover:text-[#F4F2ED] transition-colors px-3 py-1.5 border border-white/10 hover:border-white/20"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">BACK TO SITE</span>
        </button>

        <div className="flex items-center gap-2 bg-[#141414] border border-white/14 px-3 py-1.5 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
          <span className="font-bold text-[#F4F2ED] uppercase hidden sm:inline">{user?.name || 'ADMINISTRATOR'}</span>
        </div>
      </div>
    </header>
  );
};

export default NavbarOwner;