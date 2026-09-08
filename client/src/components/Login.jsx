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
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        onClick={() => setShowLogin(false)}
      />

      {/* Editorial Modal */}
      <div className="relative bg-[#F3F1EC] border border-[#111111] shadow-2xl w-full max-w-md overflow-hidden p-8 sm:p-10 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-6 right-6 p-2 border border-[#D8D5CF] hover:border-[#111111] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-[#111111]" />
        </button>

        {/* Header */}
        <div className="pb-6 border-b border-[#D8D5CF] mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-[#651F2A]" />
            <span className="text-[10px] font-mono tracking-widest text-[#707070] uppercase">
              01 // DRIVER CREDENTIALS
            </span>
          </div>
          <h2 className="text-3xl font-editorial font-bold uppercase tracking-tight text-[#111111]">
            {isSignUp ? 'REGISTER PROFILE' : 'DRIVER SIGN IN'}
          </h2>
          <p className="text-xs font-mono text-[#707070] mt-1 uppercase">
            {isSignUp
              ? 'Access tier-one automotive allocations'
              : 'Sign in to access your reserved chassis'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
          {isSignUp && (
            <div>
              <label className="text-[#707070] uppercase tracking-wider block mb-1">
                FULL NAME
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Lord Julian Sterling"
                className="w-full p-3.5 bg-white border border-[#D8D5CF] text-[#111111] focus:border-[#111111] focus:outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="text-[#707070] uppercase tracking-wider block mb-1">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="driver@carrental.com"
              className="w-full p-3.5 bg-white border border-[#D8D5CF] text-[#111111] focus:border-[#111111] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[#707070] uppercase tracking-wider block mb-1">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-3.5 bg-white border border-[#D8D5CF] text-[#111111] focus:border-[#111111] focus:outline-none pr-10"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#707070] hover:text-[#111111] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#111111] hover:bg-[#651F2A] text-white text-xs font-mono uppercase font-bold tracking-widest flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-md disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span>AUTHENTICATING...</span>
            ) : (
              <>
                <span>{isSignUp ? 'INITIALIZE ACCOUNT' : 'ENTER COCKPIT'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-mono text-[#707070] hover:text-[#111111] uppercase tracking-wider cursor-pointer"
            >
              {isSignUp
                ? 'ALREADY REGISTERED? SIGN IN →'
                : "NEED AN ACCOUNT? REGISTER →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;