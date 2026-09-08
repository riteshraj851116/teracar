import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'motion/react';
import {
  Menu,
  X,
  Search,
  Heart,
  ArrowRight,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';

const Navbar = ({ onOpenSearch }) => {
  const {
    setShowLogin,
    user,
    logout,
    isOwner,
    axios,
    setIsOwner,
    fetchUser,
    favorites
  } = useAppContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const changeRole = async () => {
    if (!user) {
      toast.error('Please sign in first');
      setShowLogin(true);
      return;
    }
    try {
      const { data } = await axios.post('/api/owner/change-role');
      if (data?.success) {
        setIsOwner(true);
        await fetchUser();
        toast.success(data.message || 'Host privileges enabled');
        navigate('/owner');
      } else {
        toast.error(data?.message || 'Unable to update status');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const navItems = [
    { name: 'FLEET', path: '/cars' },
    { name: 'LOCATIONS', path: '/#locations' },
    { name: 'EXPERIENCE', path: '/#experience' },
    { name: 'OFFERS', path: '/#offers' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-[#D8D5CF] ${
          scrolled ? 'bg-[#F3F1EC]/95 backdrop-blur-md py-3.5 shadow-xs' : 'bg-[#F3F1EC] py-4'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between section-padding">
          
          {/* Brand */}
          <Link
            to="/"
            data-cursor="explore"
            data-cursor-text="HOME"
            className="flex items-center gap-2 group"
          >
            <span className="w-2.5 h-2.5 bg-[#651F2A] rounded-none group-hover:rotate-45 transition-transform duration-300" />
            <span className="text-base sm:text-lg font-editorial font-bold tracking-tight uppercase text-[#111111]">
              CAR RENTAL
            </span>
          </Link>

          {/* Desktop Minimal Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navItems.map((item) => {
              const isHash = item.path.includes('#');
              return isHash ? (
                <a
                  key={item.name}
                  href={item.path}
                  className="text-xs font-mono tracking-widest text-[#707070] hover:text-[#111111] transition-colors uppercase"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-xs font-mono tracking-widest transition-colors uppercase ${
                    location.pathname === item.path
                      ? 'text-[#651F2A] font-bold'
                      : 'text-[#707070] hover:text-[#111111]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Utilities & Actions */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#D8D5CF] hover:border-[#111111] text-[11px] font-mono tracking-widest text-[#707070] hover:text-[#111111] transition-all cursor-pointer"
              title="Search Fleet (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span>SEARCH</span>
            </button>

            {/* Saved Wishlist */}
            <button
              onClick={() => navigate('/wishlist')}
              className="relative p-2 text-[#707070] hover:text-[#111111] transition-colors cursor-pointer"
              title={`Saved Vehicles (${favorites.length})`}
            >
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-[#651F2A] text-[#651F2A]' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#651F2A] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* My Bookings */}
            <Link
              to="/my-bookings"
              className="text-xs font-mono tracking-widest text-[#707070] hover:text-[#111111] uppercase transition-colors"
            >
              JOURNEYS
            </Link>

            {/* Host / Owner Dashboard */}
            <button
              onClick={() => (isOwner ? navigate('/owner') : changeRole())}
              className="text-xs font-mono tracking-widest text-[#707070] hover:text-[#111111] uppercase transition-colors cursor-pointer"
            >
              {isOwner ? 'DASHBOARD' : 'HOST VEHICLE'}
            </button>

            {/* User Auth or Profile */}
            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-3 border-l border-[#D8D5CF] cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-none bg-[#111111] text-white flex items-center justify-center text-xs font-mono font-bold uppercase">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <span className="text-xs font-mono uppercase text-[#111111] font-medium hidden xl:inline">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#707070] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 mt-3 w-56 bg-white border border-[#111111] shadow-xl p-3 z-50 flex flex-col gap-1 font-mono text-xs"
                    >
                      <div className="p-2 border-b border-[#D8D5CF] mb-1">
                        <span className="text-[10px] text-[#707070] uppercase block">SIGNED IN AS</span>
                        <span className="font-bold text-[#111111] block truncate">{user.name}</span>
                        <span className="text-[10px] text-[#707070] truncate block">{user.email}</span>
                      </div>

                      {isOwner && (
                        <button
                          onClick={() => navigate('/owner')}
                          className="w-full text-left p-2 hover:bg-[#F3F1EC] transition-colors flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>FLEET DASHBOARD</span>
                        </button>
                      )}

                      <button
                        onClick={() => navigate('/my-bookings')}
                        className="w-full text-left p-2 hover:bg-[#F3F1EC] transition-colors"
                      >
                        MY RESERVATIONS
                      </button>

                      <button
                        onClick={() => navigate('/wishlist')}
                        className="w-full text-left p-2 hover:bg-[#F3F1EC] transition-colors"
                      >
                        SAVED VEHICLES
                      </button>

                      <div className="border-t border-[#D8D5CF] pt-1 mt-1">
                        <button
                          onClick={() => { setUserMenuOpen(false); logout(); }}
                          className="w-full text-left p-2 text-[#651F2A] hover:bg-rose-50 transition-colors flex items-center gap-2 font-bold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>SIGN OUT</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 border border-[#111111] text-xs font-mono tracking-widest text-[#111111] hover:bg-[#111111] hover:text-white uppercase transition-all cursor-pointer"
              >
                SIGN IN
              </button>
            )}

            {/* Quick Book CTA */}
            <Link
              to="/cars"
              data-cursor="book"
              data-cursor-text="FLEET"
              className="px-4 py-2 bg-[#111111] hover:bg-[#651F2A] text-white text-xs font-mono tracking-widest uppercase transition-colors"
            >
              BOOK A CAR
            </Link>
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 border border-[#D8D5CF] text-[#111111]"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 border border-[#D8D5CF] text-[#111111]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Editorial Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-[#F3F1EC] text-[#111111] flex flex-col justify-between p-6 sm:p-10 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D8D5CF] pb-6">
              <span className="text-xs font-mono tracking-widest text-[#707070] uppercase">
                01 / NAVIGATION ARCHIVE
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 border border-[#D8D5CF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Oversized Mobile Links */}
            <nav className="flex flex-col gap-6 py-12">
              {[
                { name: 'SELECTED FLEET', path: '/cars' },
                { name: 'JOURNEYS & BOOKINGS', path: '/my-bookings' },
                { name: 'SAVED ARCHIVE', path: '/wishlist' },
                { name: 'METROPOLITAN HUBS', path: '/#locations' },
              ].map((item, idx) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-baseline gap-4 group"
                >
                  <span className="text-xs font-mono text-[#707070]">0{idx + 1}</span>
                  <span className="text-3xl sm:text-4xl font-editorial font-bold tracking-tight uppercase group-hover:text-[#651F2A] transition-colors">
                    {item.name}
                  </span>
                </Link>
              ))}

              {isOwner ? (
                <Link
                  to="/owner"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-baseline gap-4 group pt-4 border-t border-[#D8D5CF]"
                >
                  <span className="text-xs font-mono text-[#707070]">05</span>
                  <span className="text-2xl font-editorial font-bold uppercase text-[#651F2A]">
                    OWNER DASHBOARD
                  </span>
                </Link>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); changeRole(); }}
                  className="flex items-baseline gap-4 group pt-4 border-t border-[#D8D5CF] text-left cursor-pointer"
                >
                  <span className="text-xs font-mono text-[#707070]">05</span>
                  <span className="text-2xl font-editorial font-bold uppercase text-[#111111] group-hover:text-[#651F2A]">
                    HOST VEHICLE
                  </span>
                </button>
              )}
            </nav>

            {/* Mobile Footer Auth & Actions */}
            <div className="border-t border-[#D8D5CF] pt-6 flex flex-col gap-3">
              {user ? (
                <div className="flex items-center justify-between text-xs font-mono">
                  <span>SIGNED IN: <strong className="uppercase">{user.name}</strong></span>
                  <button
                    onClick={() => { setMobileOpen(false); logout(); }}
                    className="text-[#651F2A] font-bold"
                  >
                    SIGN OUT
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); setShowLogin(true); }}
                  className="w-full py-4 bg-white border border-[#111111] text-xs font-mono tracking-widest uppercase font-bold"
                >
                  SIGN IN TO ACCOUNT
                </button>
              )}

              <Link
                to="/cars"
                onClick={() => setMobileOpen(false)}
                className="w-full py-4 bg-[#111111] text-white text-xs font-mono tracking-widest uppercase font-bold flex items-center justify-center gap-2"
              >
                <span>EXPLORE ENTIRE FLEET</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;