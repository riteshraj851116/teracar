import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, ShieldCheck, Car } from 'lucide-react';

const NavbarOwner = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-border px-6 md:px-10 py-3.5 flex items-center justify-between">

      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
          <Car className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-text-primary tracking-wider block leading-none uppercase">
            CAR RENTAL
          </span>
          <span className="text-[9px] text-text-secondary block mt-0.5 uppercase tracking-widest font-medium">
            Owner Dashboard
          </span>
        </div>
      </Link>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-3 py-2 rounded-lg hover:bg-bg-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Site</span>
        </button>

        <div className="flex items-center gap-2 bg-bg-secondary border border-border px-3 py-2 rounded-lg text-sm">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span className="font-semibold text-text-primary hidden sm:inline">{user?.name || 'Owner'}</span>
        </div>
      </div>
    </header>
  );
};

export default NavbarOwner;