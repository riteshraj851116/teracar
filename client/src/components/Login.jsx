import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const { setShowLogin, axios, setToken, fetchUser } = useAppContext();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isSignUp ? '/api/user/register' : '/api/user/login';
      const payload = isSignUp
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const { data } = await axios.post(endpoint, payload);

      if (data?.success) {
        setToken(data.token);
        await fetchUser(data.token);
        toast.success(isSignUp ? 'Account initialized' : 'Welcome back');
        setShowLogin(false);
      } else {
        toast.error(data?.message || 'Authentication failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-xs"
        onClick={() => setShowLogin(false)}
      />

      {/* Dark Automotive Club Modal */}
      <div className="relative bg-[#141414] border border-white/14 shadow-2xl w-full max-w-md overflow-hidden p-8 sm:p-10 animate-fade-in text-[#F4F2ED]">
        {/* Close Button */}
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-6 right-6 p-1.5 border border-white/14 hover:border-white text-[#9B9B9B] hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
            <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase font-bold">
              CLUB ACCESS // 2026
            </span>
          </div>

          <h2 className="text-3xl font-display font-extrabold uppercase text-[#F4F2ED]">
            {isSignUp ? 'BECOME A MEMBER' : 'MEMBER SIGN IN'}
          </h2>

          <p className="text-xs font-mono text-[#9B9B9B] mt-1.5 leading-relaxed">
            {isSignUp
              ? 'Initialize your exclusive driver profile for direct airfield dispatches.'
              : 'Enter credentials to manage active allocations and telematics.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {isSignUp && (
            <div>
              <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">
                FULL NAME
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Julian Sterling"
                  className="club-input"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">
              EMAIL IDENTIFIER
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="pilot@domain.com"
                className="club-input"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase text-[#9B9B9B] block mb-1.5">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••••••"
                className="club-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-club-primary w-full py-3.5 text-xs font-bold"
            >
              <span>{loading ? 'VERIFYING...' : isSignUp ? 'CREATE MEMBER ACCOUNT' : 'ENTER CLUB'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Toggle between Sign In / Sign Up */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs font-mono">
          <span className="text-[#9B9B9B]">
            {isSignUp ? 'Already registered with CAR RENTAL?' : 'Seeking first-time allocation?'}
          </span>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-[#C5A880] hover:underline uppercase font-bold cursor-pointer"
          >
            {isSignUp ? 'SIGN IN' : 'JOIN THE CLUB'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;