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
    { name: 'EXPERIENCE', path: '/#experience' },
    { name: 'LOCATIONS', path: '/#locations' },
    { name: 'OFFERS', path: '/#offers' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
          scrolled
            ? 'bg-[#0B0B0B]/92 backdrop-blur-md py-3.5 border-white/14 shadow-lg shadow-black/40'
            : 'bg-[#0B0B0B] py-4 border-white/10'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between section-padding">
          
          {/* Brand */}
          <Link
            to="/"
            data-cursor="explore"
            data-cursor-text="HOME"
            className="flex items-center gap-2.5 group select-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#C5A880] transition-transform group-hover:scale-125" />
            <span className="text-sm sm:text-base font-display font-extrabold tracking-widest uppercase text-[#F4F2ED]">
              CAR RENTAL
            </span>
          </Link>

          {/* Desktop Center/Right Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-xs font-mono tracking-widest text-[#9B9B9B] hover:text-[#F4F2ED] transition-colors uppercase font-medium relative group"
              >
                <span>{item.name}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C5A880] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Actions: Search + Wishlist + Book Now + Profile */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Search Overlay Trigger */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                data-cursor="explore"
                data-cursor-text="SEARCH"
                className="flex items-center gap-2 text-xs font-mono text-[#9B9B9B] hover:text-[#F4F2ED] tracking-wider uppercase transition-colors"
                title="Search fleet (⌘K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[10px] text-[#6E6E6E] border border-white/14 px-1.5 py-0.5">
                  ⌘K
                </span>
              </button>
            )}

            {/* Saved Wishlist */}
            <Link
              to="/wishlist"
              className="relative text-[#9B9B9B] hover:text-[#F4F2ED] transition-colors p-1"
              title="Saved Vehicles"
            >
              <Heart className="w-4 h-4" />
              {favorites && favorites.length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#C5A880] text-[#0B0B0B] text-[8px] font-mono font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Book Now Primary Button */}
            <Link
              to="/cars"
              data-cursor="book"
              data-cursor-text="FLEET"
              className="btn-club-primary py-2 px-4.5 text-[11px]"
            >
              <span>BOOK NOW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Profile / Auth Dropdown */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 border border-white/14 hover:border-white/30 text-xs font-mono tracking-wider text-[#F4F2ED] bg-[#141414] transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span className="max-w-[100px] truncate uppercase font-semibold">
                    {user.name?.split(' ')[0] || 'PROFILE'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#9B9B9B]" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-[#141414] border border-white/14 shadow-2xl p-2 z-50 text-xs font-mono"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <span className="text-[10px] text-[#9B9B9B] uppercase block">
                          AUTHENTICATED AS
                        </span>
                        <span className="text-white font-bold truncate block">
                          {user.email}
                        </span>
                      </div>

                      <Link
                        to="/my-bookings"
                        className="flex items-center gap-2.5 px-3 py-2 text-[#9B9B9B] hover:text-[#F4F2ED] hover:bg-[#1B1B1B] transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>MY JOURNEYS</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        className="flex items-center gap-2.5 px-3 py-2 text-[#9B9B9B] hover:text-[#F4F2ED] hover:bg-[#1B1B1B] transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>SAVED VEHICLES</span>
                      </Link>

                      <button
                        onClick={changeRole}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-[#9B9B9B] hover:text-[#F4F2ED] hover:bg-[#1B1B1B] transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                        <span>{isOwner ? 'HOST DASHBOARD' : 'BECOME A HOST'}</span>
                      </button>

                      <div className="border-t border-white/10 my-1" />

                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                          toast.success('Signed out successfully');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-[#9B9B9B] hover:text-red-400 hover:bg-[#1B1B1B] transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>SIGN OUT</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-xs font-mono tracking-widest text-[#F4F2ED] hover:text-[#C5A880] uppercase font-bold transition-colors cursor-pointer"
              >
                PROFILE
              </button>
            )}
          </div>

          {/* Mobile Right Controls: Book + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              to="/cars"
              className="px-3 py-1.5 bg-[#F4F2ED] text-[#0B0B0B] text-[10px] font-mono tracking-widest uppercase font-bold"
            >
              BOOK
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 text-[#F4F2ED] border border-white/14"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[61px] z-40 bg-[#0B0B0B] border-t border-white/14 flex flex-col justify-between p-6 sm:p-8 md:hidden overflow-y-auto"
          >
            <div className="space-y-6 pt-4">
              <span className="text-[10px] font-mono tracking-widest text-[#9B9B9B] uppercase block">
                NAVIGATION // 2026
              </span>

              <div className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-3 border-b border-white/10 text-2xl font-display font-bold uppercase text-[#F4F2ED]"
                  >
                    <span>{item.name}</span>
                    <span className="text-xs font-mono text-[#9B9B9B]">0{index + 1}</span>
                  </Link>
                ))}
              </div>

              {onOpenSearch && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full py-3.5 border border-white/14 flex items-center justify-center gap-3 text-xs font-mono tracking-widest uppercase text-[#F4F2ED] bg-[#141414]"
                >
                  <Search className="w-4 h-4" />
                  <span>SEARCH ARCHIVE (⌘K)</span>
                </button>
              )}
            </div>

            <div className="pt-8 border-t border-white/14 space-y-3">
              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-3 bg-[#1B1B1B] text-[#F4F2ED] text-xs font-mono tracking-widest uppercase font-bold flex items-center justify-center gap-2 border border-white/14"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>MY JOURNEYS</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full py-2.5 text-xs font-mono text-red-400 tracking-widest uppercase"
                  >
                    SIGN OUT
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowLogin(true);
                  }}
                  className="w-full py-3.5 bg-[#F4F2ED] text-[#0B0B0B] text-xs font-mono tracking-widest uppercase font-bold"
                >
                  PROFILE / SIGN IN
                </button>
              )}

              <div className="text-[10px] font-mono text-[#9B9B9B] uppercase text-center pt-2">
                CAR RENTAL — ALL RIGHTS RESERVED © 2026
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;