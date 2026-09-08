import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff, Car, ArrowRight } from 'lucide-react';

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
        toast.success(isSignUp ? 'Account created successfully!' : 'Welcome back!');
        setShowLogin(false);
      } else {
        toast.error(data?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowLogin(false)}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-bg-secondary hover:bg-border flex items-center justify-center transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-text-primary" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
            <Car className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary font-editorial">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            {isSignUp
              ? 'Join CAR RENTAL for premium automotive access'
              : 'Sign in to your CAR RENTAL account'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          {/* Name (Sign Up only) */}
          {isSignUp && (
            <div>
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="premium-input pl-10"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="premium-input pl-10"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className="premium-input pl-10 pr-10"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-lg text-[15px] mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </span>
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Toggle */}
          <p className="text-center text-sm text-text-secondary pt-2">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-accent font-semibold hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;