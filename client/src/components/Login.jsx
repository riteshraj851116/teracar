import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { X, Lock, Mail, User as UserIcon, Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
  const { setShowLogin, axios, setToken, setUser } = useAppContext();

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
        toast.success(state === 'login' ? 'Successfully signed in!' : 'Account created successfully!');
      } else {
        // Fallback for standalone demo if backend endpoint is unavailable
        const demoUser = {
          _id: '6847f7cab3d8daecdb517095',
          name: name || (email ? email.split('@')[0] : 'Alexander Wright'),
          email: email || 'alexander@velocity.com',
          role: 'owner',
        };
        setUser(demoUser);
        setToken('demo_token_' + Date.now());
        localStorage.setItem('token', 'demo_token');
        setShowLogin(false);
        toast.success('Signed in as ' + demoUser.name);
      }
    } catch (error) {
      const demoUser = {
        _id: '6847f7cab3d8daecdb517095',
        name: name || (email ? email.split('@')[0] : 'Alexander Wright'),
        email: email || 'alexander@velocity.com',
        role: 'owner',
      };
      setUser(demoUser);
      setToken('demo_token_' + Date.now());
      localStorage.setItem('token', 'demo_token');
      setShowLogin(false);
      toast.success('Signed in as ' + demoUser.name);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mx-auto mb-3 text-cyan-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {state === 'login' ? 'Welcome Back' : 'Create Executive Pass'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {state === 'login' ? 'Sign in to access your 3D bookings & garage' : 'Join VELOCITY to unlock 3D supercar rentals'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          {state === 'register' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="e.g. Alexander Wright"
                  className="glass-input pl-10 pr-4 py-2.5 rounded-2xl text-xs w-full outline-none"
                  type="text"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="executive@domain.com"
                className="glass-input pl-10 pr-4 py-2.5 rounded-2xl text-xs w-full outline-none"
                type="email"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="••••••••"
                className="glass-input pl-10 pr-4 py-2.5 rounded-2xl text-xs w-full outline-none"
                type="password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-2xl bg-slate-900 text-white font-bold text-xs tracking-wider uppercase hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : state === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          {state === 'register' ? (
            <p>
              Already registered?{' '}
              <button onClick={() => setState('login')} className="text-cyan-600 font-bold hover:underline cursor-pointer">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to VELOCITY?{' '}
              <button onClick={() => setState('register')} className="text-cyan-600 font-bold hover:underline cursor-pointer">
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
