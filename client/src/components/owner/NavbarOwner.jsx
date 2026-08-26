import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Car, Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';

const NavbarOwner = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-cyan-500/20 px-6 md:px-10 py-3.5 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white">
          <Car className="w-5 h-5" />
        </div>
        <div>
          <span className="text-lg font-black text-white tracking-wider">VELOCITY</span>
          <span className="text-[9px] font-mono text-purple-400 block -mt-1 uppercase tracking-widest">OWNER TELEMETRY PORTAL</span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 hover:text-cyan-400 font-mono transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Main Site</span>
        </button>

        <div className="flex items-center gap-2 bg-slate-900/80 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-mono text-purple-300">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>{user?.name || 'Verified Owner'}</span>
        </div>
      </div>
    </header>
  );
};

export default NavbarOwner;
