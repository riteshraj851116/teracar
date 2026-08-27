import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { X, Lock, Mail, User as UserIcon, Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
  const { setShowLogin, axios, setToken, navigate } = useAppContext();

  const [state, setState] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      const { data } = await axios.post(`/api/user/${state}`, { name, email, password });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setShowLogin(false);
        toast.success(state === 'login' ? 'Successfully authenticated!' : 'Account created!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md p-8 rounded-3xl glass-card border border-cyan-500/30 shadow-2xl overflow-hidden"
      >
        {/* Top Glow Ambient */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-white">
            {state === 'login' ? 'Welcome Back' : 'Create Executive Pass'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {state === 'login' ? 'Sign in to access your 3D bookings & fleet' : 'Join VELOCITY to unlock 3D supercar rentals'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          {state === 'register' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-cyan-400">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="e.g. Alex Wright"
                  className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs w-full outline-none"
                  type="text"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-cyan-400">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="executive@domain.com"
                className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs w-full outline-none"
                type="email"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-cyan-400">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="••••••••"
                className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs w-full outline-none"
                type="password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-600 text-slate-950 font-bold text-xs tracking-wider uppercase hover:brightness-110 transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : state === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          {state === 'register' ? (
            <p>
              Already registered?{' '}
              <button onClick={() => setState('login')} className="text-cyan-400 font-bold hover:underline cursor-pointer">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to VELOCITY?{' '}
              <button onClick={() => setState('register')} className="text-cyan-400 font-bold hover:underline cursor-pointer">
                Create an Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
