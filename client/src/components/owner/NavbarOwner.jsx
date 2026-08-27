import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Car, Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';

const NavbarOwner = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-slate-200 px-6 md:px-10 py-3.5 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
          <Car className="w-5 h-5" />
        </div>
        <div>
          <span className="text-lg font-black text-slate-900 tracking-tight">VELOCITY</span>
          <span className="text-[9px] font-mono text-cyan-600 font-bold block -mt-1 uppercase tracking-widest">OWNER TELEMETRY PORTAL</span>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 font-mono transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Main Site</span>
        </button>

        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-xs font-mono text-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          <span className="font-bold">{user?.name || 'Verified Host'}</span>
        </div>
      </div>
    </header>
  );
};

export default NavbarOwner;
