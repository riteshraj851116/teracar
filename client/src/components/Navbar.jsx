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
  ChevronDown,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { playUiClick } from '../utils/audioEngine';

const Navbar = ({ onOpenSearch }) => {
  const {
    setShowLogin,
    user,
    logout,
    isOwner,
    axios,
    setIsOwner,
    fetchUser,
    favorites = []
  } = useAppContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Track scroll position for subtle blur / border change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Handle Host / Dashboard transition
  const handleHostAction = async () => {
    playUiClick(650);
    setUserMenuOpen(false);
    setMobileOpen(false);

    if (!user) {
      toast.error('Please sign in first');
      setShowLogin(true);
      return;
    }

    if (isOwner) {
      navigate('/owner');
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

  // Nav link click handler (with smooth in-page hash scrolling)
  const handleNavClick = (e, item) => {
    playUiClick(600);
    setMobileOpen(false);

    if (item.path.startsWith('/#')) {
      const hash = item.path.substring(2);
      if (location.pathname === '/') {
        e.preventDefault();
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.pushState(null, '', `/#${hash}`);
        }
      }
    }
  };

  const navItems = [
    { name: 'FLEET', path: '/cars' },
    { name: 'EXPERIENCE', path: '/#experience' },
    { name: 'LOCATIONS', path: '/#locations' },
    { name: 'OFFERS', path: '/#offers' },
  ];

  const isItemActive = (item) => {
    if (item.path === '/cars') return location.pathname === '/cars';
    if (item.path.startsWith('/#')) {
      const hash = item.path.substring(1);
      return location.pathname === '/' && location.hash === hash;
    }
    return location.pathname === item.path;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b select-none ${
          scrolled
            ? 'bg-[#0B0B0B]/95 backdrop-blur-md py-3.5 border-white/14 shadow-xl shadow-black/60'
            : 'bg-[#0B0B0B] py-4 border-white/10'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between section-padding">
          
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => {
              playUiClick(700);
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            data-cursor="explore"
            data-cursor-text="HOME"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#C5A880] transition-transform group-hover:scale-125" />
            <span className="text-sm sm:text-base font-display font-extrabold tracking-widest uppercase text-[#F4F2ED]">
              CAR RENTAL
            </span>
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => {
              const active = isItemActive(item);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`text-xs font-mono tracking-widest uppercase font-medium relative group transition-colors cursor-pointer ${
                    active ? 'text-[#F4F2ED] font-bold' : 'text-[#9B9B9B] hover:text-[#F4F2ED]'
                  }`}
                >
                  <span>{item.name}</span>
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-[#C5A880] transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions: Search + Wishlist + Book Now + Profile */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Search Overlay Trigger */}
            {onOpenSearch && (
              <button
                onClick={() => {
                  playUiClick(500);
                  onOpenSearch();
                }}
                data-cursor="explore"
                data-cursor-text="SEARCH"
                className="flex items-center gap-2 text-xs font-mono text-[#9B9B9B] hover:text-[#F4F2ED] tracking-wider uppercase transition-colors cursor-pointer"
                title="Search fleet (⌘K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[10px] text-[#6E6E6E] border border-white/14 px-1.5 py-0.5">
                  ⌘K
                </span>
              </button>
            )}

            {/* Saved Vehicles / Wishlist */}
            <Link
              to="/wishlist"
              onClick={() => playUiClick(600)}
              className={`relative transition-colors p-1 cursor-pointer ${
                location.pathname === '/wishlist'
                  ? 'text-[#C5A880]'
                  : 'text-[#9B9B9B] hover:text-[#F4F2ED]'
              }`}
              title="Saved Vehicles"
            >
              <Heart className="w-4 h-4" />
              {favorites && favorites.length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#C5A880] text-[#0B0B0B] text-[8px] font-mono font-bold flex items-center justify-center animate-scale-up">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Book Now Primary Button */}
            <Link
              to="/cars"
              onClick={() => playUiClick(650)}
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
                  onClick={() => {
                    playUiClick(550);
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="flex items-center gap-2 py-1.5 px-3 border border-white/14 hover:border-white/30 text-xs font-mono tracking-wider text-[#F4F2ED] bg-[#141414] transition-colors cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span className="max-w-[100px] truncate uppercase font-semibold">
                    {user.name?.split(' ')[0] || 'MEMBER'}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-[#9B9B9B] transition-transform duration-200 ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.18 }}
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
                        onClick={() => {
                          playUiClick(600);
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center gap-2.5 px-3 py-2 text-[#9B9B9B] hover:text-[#F4F2ED] hover:bg-[#1B1B1B] transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>MY JOURNEYS</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => {
                          playUiClick(600);
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center justify-between px-3 py-2 text-[#9B9B9B] hover:text-[#F4F2ED] hover:bg-[#1B1B1B] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Heart className="w-3.5 h-3.5" />
                          <span>SAVED VEHICLES</span>
                        </div>
                        {favorites && favorites.length > 0 && (
                          <span className="text-[10px] text-[#C5A880] font-bold">
                            ({favorites.length})
                          </span>
                        )}
                      </Link>

                      <button
                        onClick={handleHostAction}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-[#9B9B9B] hover:text-[#F4F2ED] hover:bg-[#1B1B1B] transition-colors cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                        <span>{isOwner ? 'HOST DASHBOARD' : 'BECOME A HOST'}</span>
                      </button>

                      <div className="border-t border-white/10 my-1" />

                      <button
                        onClick={() => {
                          playUiClick(500);
                          logout();
                          setUserMenuOpen(false);
                          toast.success('Signed out successfully');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-[#9B9B9B] hover:text-red-400 hover:bg-[#1B1B1B] transition-colors cursor-pointer"
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
                onClick={() => {
                  playUiClick(600);
                  setShowLogin(true);
                }}
                className="text-xs font-mono tracking-widest text-[#F4F2ED] hover:text-[#C5A880] uppercase font-bold transition-colors cursor-pointer py-1 px-2 border border-transparent hover:border-white/14"
              >
                PROFILE
              </button>
            )}
          </div>

          {/* Mobile Right Controls: Search + Wishlist + Book + Hamburger */}
          <div className="flex md:hidden items-center gap-2.5">
            {/* Quick Search on Mobile */}
            {onOpenSearch && (
              <button
                onClick={() => {
                  playUiClick(500);
                  onOpenSearch();
                }}
                className="p-1.5 text-[#9B9B9B] hover:text-[#F4F2ED]"
                aria-label="Search fleet"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Quick Wishlist on Mobile */}
            <Link
              to="/wishlist"
              onClick={() => playUiClick(600)}
              className="relative p-1.5 text-[#9B9B9B] hover:text-[#F4F2ED]"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {favorites && favorites.length > 0 && (
                <span className="absolute 0 right-0 w-3 h-3 rounded-full bg-[#C5A880] text-[#0B0B0B] text-[7px] font-mono font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Book Now Button on Mobile */}
            <Link
              to="/cars"
              onClick={() => playUiClick(650)}
              className="px-3 py-1.5 bg-[#F4F2ED] text-[#0B0B0B] text-[10px] font-mono tracking-widest uppercase font-bold"
            >
              BOOK
            </Link>

            {/* Hamburger Toggle */}
            <button
              onClick={() => {
                playUiClick(550);
                setMobileOpen(!mobileOpen);
              }}
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
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 top-[61px] z-40 bg-[#0B0B0B] border-t border-white/14 flex flex-col justify-between p-6 sm:p-8 md:hidden overflow-y-auto"
          >
            <div className="space-y-6 pt-2">
              <span className="text-[10px] font-mono tracking-widest text-[#9B9B9B] uppercase block">
                NAVIGATION // 2026
              </span>

              {/* Mobile Nav Links */}
              <div className="flex flex-col space-y-2">
                {navItems.map((item, index) => {
                  const active = isItemActive(item);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={(e) => handleNavClick(e, item)}
                      className={`flex items-center justify-between py-3 border-b border-white/10 text-2xl font-display font-bold uppercase ${
                        active ? 'text-[#C5A880]' : 'text-[#F4F2ED]'
                      }`}
                    >
                      <span>{item.name}</span>
                      <span className="text-xs font-mono text-[#9B9B9B]">0{index + 1}</span>
                    </Link>
                  );
                })}

                {/* Mobile Saved Vehicles Link */}
                <Link
                  to="/wishlist"
                  onClick={() => {
                    playUiClick(600);
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-between py-3 border-b border-white/10 text-2xl font-display font-bold uppercase text-[#F4F2ED]"
                >
                  <div className="flex items-center gap-3">
                    <span>SAVED VEHICLES</span>
                    {favorites && favorites.length > 0 && (
                      <span className="text-xs font-mono bg-[#C5A880] text-[#0B0B0B] px-2 py-0.5 rounded-full font-bold">
                        {favorites.length}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-[#9B9B9B]">05</span>
                </Link>
              </div>

              {/* Mobile Search Button */}
              {onOpenSearch && (
                <button
                  onClick={() => {
                    playUiClick(500);
                    setMobileOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full py-3.5 border border-white/14 flex items-center justify-center gap-3 text-xs font-mono tracking-widest uppercase text-[#F4F2ED] bg-[#141414] hover:bg-[#1B1B1B] transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>SEARCH ARCHIVE (⌘K)</span>
                </button>
              )}
            </div>

            {/* Mobile Account / Auth Section */}
            <div className="pt-8 border-t border-white/14 space-y-3">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-[#141414] border border-white/10 mb-2">
                    <span className="text-[9px] font-mono text-[#9B9B9B] uppercase block">
                      AUTHENTICATED AS
                    </span>
                    <span className="text-xs font-mono text-[#F4F2ED] font-bold truncate block">
                      {user.email}
                    </span>
                  </div>

                  <Link
                    to="/my-bookings"
                    onClick={() => {
                      playUiClick(600);
                      setMobileOpen(false);
                    }}
                    className="w-full py-3 bg-[#1B1B1B] text-[#F4F2ED] text-xs font-mono tracking-widest uppercase font-bold flex items-center justify-center gap-2 border border-white/14"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>MY JOURNEYS</span>
                  </Link>

                  <button
                    onClick={handleHostAction}
                    className="w-full py-3 bg-[#141414] text-[#C5A880] text-xs font-mono tracking-widest uppercase font-bold flex items-center justify-center gap-2 border border-[#C5A880]/30"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                    <span>{isOwner ? 'HOST DASHBOARD' : 'BECOME A HOST'}</span>
                  </button>

                  <button
                    onClick={() => {
                      playUiClick(500);
                      logout();
                      setMobileOpen(false);
                      toast.success('Signed out successfully');
                    }}
                    className="w-full py-2.5 text-xs font-mono text-red-400 hover:text-red-300 tracking-widest uppercase text-center"
                  >
                    SIGN OUT
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    playUiClick(600);
                    setMobileOpen(false);
                    setShowLogin(true);
                  }}
                  className="w-full py-3.5 bg-[#F4F2ED] text-[#0B0B0B] text-xs font-mono tracking-widest uppercase font-bold hover:bg-[#E5E0D8] transition-colors"
                >
                  PROFILE / SIGN IN
                </button>
              )}

              <div className="text-[10px] font-mono text-[#6E6E6E] uppercase text-center pt-2">
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