import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { ArrowRight, X, Lock, Mail, User } from "lucide-react";
import { motion } from "motion/react";
import { playUiClick } from "../utils/audioEngine";

const Login = () => {
  const { setShowLogin, axios, setToken, fetchUser } = useAppContext();
  
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const switchMode = () => {
    playUiClick();
    setState((prev) => (prev === "login" ? "register" : "login"));
    resetForm();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (loading) return;
    playUiClick();

    try {
      setLoading(true);

      const payload =
        state === "register"
          ? {
              name: name.trim(),
              email: email.trim().toLowerCase(),
              password,
            }
          : {
              email: email.trim().toLowerCase(),
              password,
            };

      const { data } = await axios.post(`/api/user/${state}`, payload);

      if (!data?.success) {
        toast.error(data?.message || "Authentication failed");
        return;
      }

      if (!data?.token) {
        toast.error("Authentication token was not received");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;

      const userFetched = await fetchUser(data.token);

      if (!userFetched) {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common.Authorization;
        setToken("");
        toast.error("Unable to authenticate session");
        return;
      }

      toast.success(
        state === "login"
          ? "Welcome back to TERACAR Atelier."
          : "Account created successfully."
      );

      resetForm();
      setShowLogin(false);
      
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded px-3.5 py-3 text-xs font-mono text-[#090D16] placeholder:text-[#94A3B8] outline-none focus:border-[#090D16] transition-colors mt-1";
  const labelStyle = "text-[10px] font-mono text-[#64748B] uppercase tracking-wider block";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      onClick={() => {
        if (!loading) setShowLogin(false);
      }}
    >
      <motion.section
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md bg-white border border-[#E2E8F0] rounded-lg p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          className="absolute top-5 right-5 text-[#64748B] hover:text-[#090D16] cursor-pointer"
          onClick={() => setShowLogin(false)}
          disabled={loading}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1 mb-6">
          <span className="text-[9px] font-mono tracking-[0.2em] text-[#64748B] uppercase">
            MEMBER AUTHENTICATION // 01
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase text-[#090D16] font-editorial">
            {state === "login" ? "Client Access" : "Create Account"}
          </h2>
          <p className="text-xs text-[#64748B]">
            {state === "login"
              ? "Sign in to manage reservations and concierge requests."
              : "Register for bespoke vehicle reservations."}
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-3.5" onSubmit={onSubmitHandler}>
          {state === "register" && (
            <label className={labelStyle}>
              <span>Full Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="RITESH RAJ"
                autoComplete="name"
                className={inputStyle}
                required
              />
            </label>
          )}

          <label className={labelStyle}>
            <span>Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="CLIENT@DOMAIN.COM"
              autoComplete="email"
              className={inputStyle}
              required
            />
          </label>

          <label className={labelStyle}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={state === "login" ? "current-password" : "new-password"}
              minLength={6}
              className={inputStyle}
              required
            />
          </label>

          <button 
            type="submit" 
            className="mt-2 w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#090D16] hover:bg-[#1E293B] text-white rounded text-xs font-mono uppercase font-bold tracking-wider cursor-pointer disabled:opacity-50 transition-colors" 
            disabled={loading}
          >
            <span>
              {loading
                ? "AUTHENTICATING..."
                : state === "login"
                ? "ENTER ATELIER"
                : "REGISTER"}
            </span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-mono">
          <span className="text-[#64748B]">
            {state === "login" ? "New client?" : "Existing account?"}
          </span>
          <button 
            type="button" 
            onClick={switchMode} 
            disabled={loading}
            className="font-bold text-[#090D16] uppercase hover:underline cursor-pointer"
          >
            {state === "login" ? "Create Profile" : "Sign In"}
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default Login;