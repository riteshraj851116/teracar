import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Plus, 
  ChevronDown, 
  Car, 
  Heart,
  Scale,
  MessageSquare
} from 'lucide-react';
import { playUiClick } from '../utils/audioEngine';

const Navbar = () => {
  const { 
    setShowLogin, 
    user, 
    logout, 
    isOwner, 
    axios, 
    setIsOwner, 
    fetchUser, 
    favorites, 
    setShowCompareModal, 
    compareCars,
    openChat
  } = useAppContext();
  
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const changeRole = async () => {
    if (!user) {
      toast.error('Please sign in to host a vehicle');
      setShowLogin(true);
      return;
    }
    try {
      const { data } = await axios.post('/api/owner/change-role');
      if (data?.success) {
        setIsOwner(true);
        await fetchUser();
        toast.success(data.message || 'Owner privileges activated');
        navigate('/owner');
      } else {
        toast.error(data?.message || 'Unable to update role');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const navLinks = [
    { name: 'Fleet', path: '/cars' },
    { name: 'Reservations', path: '/my-bookings' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 px-4 md:px-12 lg:px-20 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm py-3'
          : 'bg-[#F8FAFC]/90 backdrop-blur-xs border-b border-[#E2E8F0] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* ── Brand Logo ─────────────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-[#090D16] flex items-center justify-center text-white font-black text-xs tracking-wider transition-transform group-hover:scale-105">
            TC
          </div>

          <div className="leading-none">
            <span className="text-base font-bold text-[#090D16] tracking-[0.14em] uppercase font-editorial">
              TERACAR
            </span>
            <span className="text-[8px] font-mono tracking-[0.2em] text-[#64748B] uppercase block mt-0.5">
              Swiss Mobility Atelier
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav Links ──────────────────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
              location.pathname === '/' ? 'text-[#090D16] font-bold border-b-2 border-[#090D16] pb-1' : 'text-[#64748B] hover:text-[#090D16]'
            }`}
          >
            Showroom
          </Link>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive ? 'text-[#090D16] font-bold border-b-2 border-[#090D16] pb-1' : 'text-[#64748B] hover:text-[#090D16]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop Actions ────────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-2.5">
          {compareCars.length > 0 && (
            <button
              onClick={() => { playUiClick(); setShowCompareModal(true); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#090D16] text-[#090D16] rounded-md text-[11px] font-mono font-bold uppercase tracking-wider cursor-pointer shadow-xs"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare ({compareCars.length})</span>
            </button>
          )}

          <button
            onClick={() => { playUiClick(); openChat(); }}
            title="Concierge Chat"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E2E8F0] hover:border-[#090D16] text-[#090D16] rounded-md text-[11px] font-mono tracking-wider transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#334155]" />
            <span className="font-semibold hidden lg:inline">Concierge</span>
          </button>

          <button
            onClick={() => navigate('/cars')}
            title="Saved Vehicles"
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E2E8F0] hover:border-[#090D16] text-[#090D16] rounded-md text-[11px] font-mono tracking-wider transition-colors cursor-pointer"
          >
            <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-rose-600 text-rose-600' : 'text-[#64748B]'}`} />
            <span className="font-semibold">{favorites.length}</span>
          </button>

          <button
            onClick={() => (isOwner ? navigate('/owner') : changeRole())}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] hover:border-[#090D16] text-[#090D16] rounded-md text-[11px] font-mono tracking-wider uppercase transition-colors cursor-pointer font-semibold"
          >
            {isOwner ? (
              <>
                <LayoutDashboard className="w-3.5 h-3.5 text-[#334155]" />
                <span>Dashboard</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-[#334155]" />
                <span>Host Vehicle</span>
              </>
            )}
          </button>

          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-md bg-[#090D16] text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <p className="text-[11px] font-bold text-[#090D16] uppercase truncate max-w-[100px]">
                    {user.name}
                  </p>
                  <span className="text-[8px] text-[#64748B] font-mono uppercase tracking-wider">
                    {isOwner ? 'Owner' : 'Client'}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#E2E8F0] shadow-lg rounded-md overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <p className="text-xs font-bold text-[#090D16] uppercase truncate">{user.name}</p>
                      <p className="text-[10px] text-[#64748B] font-mono truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5 flex flex-col gap-0.5">
                      {isOwner && (
                        <button
                          onClick={() => { setUserMenuOpen(false); navigate('/owner'); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-[#090D16] hover:bg-[#F1F5F9] rounded transition-colors text-left"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-[#64748B]" />
                          <span>Owner Dashboard</span>
                        </button>
                      )}
                      <button
                        onClick={() => { setUserMenuOpen(false); navigate('/my-bookings'); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-[#090D16] hover:bg-[#F1F5F9] rounded transition-colors text-left"
                      >
                        <Car className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>My Reservations</span>
                      </button>
                      <button
                        onClick={() => { setUserMenuOpen(false); openChat(); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-[#090D16] hover:bg-[#F1F5F9] rounded transition-colors text-left"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>Concierge Chat</span>
                      </button>
                    </div>
                    <div className="p-1.5 border-t border-[#E2E8F0]">
                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-2 px-5 py-2 bg-[#090D16] hover:bg-[#1E293B] text-white rounded-md text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* ── Mobile Hamburger ───────────────────────────────────────────────── */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[#090D16] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-3 overflow-hidden"
          >
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-lg flex flex-col gap-2 shadow-md">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#090D16] hover:bg-[#F8FAFC] rounded"
              >
                Showroom
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#090D16] hover:bg-[#F8FAFC] rounded"
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-px bg-[#E2E8F0] my-1" />

              <button
                onClick={() => { setOpen(false); isOwner ? navigate('/owner') : changeRole(); }}
                className="w-full py-2.5 text-[11px] font-bold font-mono uppercase bg-[#F1F5F9] text-[#090D16] rounded border border-[#E2E8F0]"
              >
                {isOwner ? 'Owner Dashboard' : 'Host Vehicle'}
              </button>

              {user ? (
                <button
                  onClick={() => { setOpen(false); logout(); }}
                  className="w-full py-2 text-[11px] font-bold font-mono uppercase text-rose-600 bg-rose-50 rounded"
                >
                  Sign Out ({user.name})
                </button>
              ) : (
                <button
                  onClick={() => { setOpen(false); setShowLogin(true); }}
                  className="w-full py-2.5 text-[11px] font-bold uppercase tracking-wider bg-[#090D16] text-white rounded"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;