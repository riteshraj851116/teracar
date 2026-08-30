import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const NavbarOwner = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] px-6 md:px-10 py-4 flex items-center justify-between transition-all shadow-[0_2px_12px_rgba(9,13,22,0.03)]">
      
      {/* Brand Logo & Title */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-[#090d16] rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-md shadow-[#090d16]/15">
          <span className="font-black text-sm tracking-tight text-white" style={{ fontFamily: "'Cinzel', serif" }}>TC</span>
        </div>
        
        <div>
          <span className="text-lg font-black text-[#090d16] tracking-widest block leading-none uppercase">
            TERACAR
          </span>
          <span className="text-[9px] font-mono text-[#64748b] block mt-1 uppercase tracking-[0.2em] font-semibold">
            Owner Command Center
          </span>
        </div>
      </Link>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        
        {/* Exit to Main Site */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-wider text-[#64748b] hover:text-[#090d16] transition-colors cursor-pointer px-4 py-2 rounded-xl hover:bg-[#f1f5f9]"
        >
          <ArrowLeft className="w-4 h-4 text-[#2563eb]" />
          <span>RETURN TO SHOWROOM</span>
        </button>

        {/* User Identity Badge */}
        <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] px-4 py-2 rounded-xl text-[11px] font-mono tracking-wider text-[#090d16] shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="uppercase font-black">{user?.name || 'VERIFIED HOST'}</span>
        </div>
        
      </div>
    </header>
  );
};

export default NavbarOwner;