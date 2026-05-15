import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = login(email, password);
    setLoading(false);
    if (result.error) { toast.error(result.error); return; }
    toast.success('Welcome back!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-page)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{
                width: `${140 + i * 70}px`, height: `${140 + i * 70}px`,
                background: 'rgba(255,255,255,0.06)',
                left: `${8 + i * 14}%`, top: `${4 + i * 13}%`,
              }}
              animate={{ y: [0, -18, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 7 + i, repeat: Infinity, ease: 'easeInOut' }} />
          ))}
        </div>
        <div className="relative z-10 text-center px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <img src={logo} alt="Expi-Tracker" className="w-20 h-20 rounded-2xl object-cover mx-auto mb-5 shadow-xl" />
            <h1 className="text-4xl font-bold text-white mb-3">Expi-Tracker</h1>
            <p className="text-sky-100 text-lg mb-8">Your intelligent finance companion. Track, analyze, and grow your wealth.</p>
            <div className="grid grid-cols-3 gap-3">
              {[['₹2.4Cr', 'Tracked'], ['50K+', 'Users'], ['99.9%', 'Uptime']].map(([val, label]) => (
                <div key={label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
                  <div className="text-2xl font-bold text-white">{val}</div>
                  <div className="text-sky-200 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div className="w-full max-w-md"
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="auth-card">
            <div className="text-center mb-8">
              <img src={logo} alt="Expi-Tracker" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-3 shadow-lg" />
              <h2 className="text-2xl font-bold t-text">Welcome back</h2>
              <p className="t-muted mt-1 text-sm">Sign in to your Expi-Tracker account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium t-muted mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 t-faint" size={16} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="you@example.com" className="t-input" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium t-muted mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 t-faint" size={16} />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••" className="t-input" style={{ paddingRight: '3rem' }} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 t-muted hover:t-text transition">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-500" />
                  <span className="text-sm t-muted">Remember me</span>
                </label>
                <button type="button" className="text-sm font-medium" style={{ color: '#0ea5e9' }}>Forgot password?</button>
              </div>

              <button type="submit" disabled={loading} className="t-btn-primary w-full">
                {loading
                  ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</span>
                  : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm t-muted mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold" style={{ color: '#0ea5e9' }}>Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
