import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'motion/react';
import {
  User as UserIcon,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
  Car,
  Heart,
  Bell,
  Search,
  ArrowRight,
  Settings,
  BookOpen,
  Star,
  MapPin
} from 'lucide-react';

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
    navigate: ctxNavigate
  } = useAppContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

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
        toast.success(data.message || 'Owner access activated');
        navigate('/owner');
      } else {
        toast.error(data?.message || 'Unable to update role');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const navLinks = [
    { name: 'Cars', path: '/cars' },
    { name: 'My Bookings', path: '/my-bookings' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'premium-nav-scrolled py-3' : 'premium-nav py-4'
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between section-padding">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="CAR RENTAL Home">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center transition-transform group-hover:scale-105">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="text-[15px] font-bold text-text-primary tracking-[0.08em] uppercase font-editorial">
                CAR RENTAL
              </span>
              <span className="text-[9px] tracking-[0.15em] text-text-secondary uppercase block mt-0.5 font-medium">
                Premium Automotive
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            <Link
              to="/"
              className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-accent bg-accent/5 font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
              }`}
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'text-accent bg-accent/5 font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">

            {/* Wishlist */}
            <button
              onClick={() => navigate('/wishlist')}
              title="Saved Cars"
              className="relative flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:border-accent text-text-secondary hover:text-accent transition-colors"
              aria-label={`Wishlist, ${favorites.length} saved`}
            >
              <Heart className={`w-[18px] h-[18px] ${favorites.length > 0 ? 'fill-accent text-accent' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Dashboard / Host */}
            <button
              onClick={() => (isOwner ? navigate('/owner') : changeRole())}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:border-accent text-text-primary text-[13px] font-medium transition-colors"
            >
              {isOwner ? (
                <>
                  <LayoutDashboard className="w-4 h-4 text-accent" />
                  <span>Dashboard</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Host Vehicle</span>
                </>
              )}
            </button>

            {/* Rent a Car CTA */}
            <Link
              to="/cars"
              className="btn-primary px-5 py-2.5 text-[13px] rounded-lg"
            >
              Rent a Car
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* User Menu */}
            {user ? (
              <div ref={userMenuRef} className="relative ml-1">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 cursor-pointer"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold uppercase">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-60 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 bg-bg-secondary border-b border-border">
                        <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                        <p className="text-xs text-text-secondary truncate mt-0.5">{user.email}</p>
                      </div>

                      <div className="p-1.5">
                        {isOwner && (
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate('/owner'); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary hover:bg-bg-secondary rounded-md transition-colors text-left"
                          >
                            <LayoutDashboard className="w-4 h-4 text-text-secondary" />
                            Owner Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => { setUserMenuOpen(false); navigate('/my-bookings'); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary hover:bg-bg-secondary rounded-md transition-colors text-left"
                        >
                          <BookOpen className="w-4 h-4 text-text-secondary" />
                          My Bookings
                        </button>
                        <button
                          onClick={() => { setUserMenuOpen(false); navigate('/wishlist'); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary hover:bg-bg-secondary rounded-md transition-colors text-left"
                        >
                          <Heart className="w-4 h-4 text-text-secondary" />
                          Saved Cars
                        </button>
                      </div>

                      <div className="p-1.5 border-t border-border">
                        <button
                          onClick={() => { setUserMenuOpen(false); logout(); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-error hover:bg-red-50 rounded-md transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-text-primary hover:text-accent transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-text-primary hover:bg-bg-secondary border border-border rounded-lg transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white z-[70] shadow-2xl flex flex-col lg:hidden"
              aria-label="Mobile navigation"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                    <Car className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-text-primary uppercase tracking-wider">CAR RENTAL</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-text-primary" />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="px-5 py-4 bg-bg-secondary border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold uppercase">
                      {user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                      <p className="text-xs text-text-secondary">{isOwner ? 'Owner' : 'Member'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 flex flex-col gap-1">
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/' ? 'bg-accent/5 text-accent' : 'text-text-primary hover:bg-bg-secondary'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                    Home
                  </Link>

                  <Link
                    to="/cars"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/cars') ? 'bg-accent/5 text-accent' : 'text-text-primary hover:bg-bg-secondary'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    Browse Cars
                  </Link>

                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/my-bookings') ? 'bg-accent/5 text-accent' : 'text-text-primary hover:bg-bg-secondary'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    My Bookings
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/wishlist') ? 'bg-accent/5 text-accent' : 'text-text-primary hover:bg-bg-secondary'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    Saved Cars
                    {favorites.length > 0 && (
                      <span className="ml-auto bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {favorites.length}
                      </span>
                    )}
                  </Link>

                  {user && (
                    <>
                      <div className="divider my-2" />
                      <button
                        onClick={() => { setMobileOpen(false); isOwner ? navigate('/owner') : changeRole(); }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-primary hover:bg-bg-secondary transition-colors text-left w-full"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {isOwner ? 'Owner Dashboard' : 'Become a Host'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-border space-y-2">
                <Link
                  to="/cars"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full py-3 text-sm rounded-lg"
                >
                  Rent a Car
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {user ? (
                  <button
                    onClick={() => { setMobileOpen(false); logout(); }}
                    className="btn-outline w-full py-3 text-sm rounded-lg text-error border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => { setMobileOpen(false); setShowLogin(true); }}
                    className="btn-outline w-full py-3 text-sm rounded-lg"
                  >
                    <UserIcon className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;