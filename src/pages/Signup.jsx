import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = signup(form.name, form.email, form.password);
    setLoading(false);
    if (result.error) { toast.error(result.error); return; }
    toast.success('Account created! Please sign in to continue.');
    navigate('/login');
  };

  const fields = [
    { key: 'name', label: 'Full Name', icon: FiUser, type: 'text', placeholder: 'John Doe' },
    { key: 'email', label: 'Email', icon: FiMail, type: 'email', placeholder: 'you@example.com' },
    { key: 'password', label: 'Password', icon: FiLock, type: showPass ? 'text' : 'password', placeholder: '••••••••', toggle: true },
    { key: 'confirm', label: 'Confirm Password', icon: FiLock, type: showPass ? 'text' : 'password', placeholder: '••••••••' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-page)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #164e63 0%, #0e7490 50%, #06b6d4 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{
                width: `${110 + i * 75}px`, height: `${110 + i * 75}px`,
                background: 'rgba(255,255,255,0.07)',
                right: `${4 + i * 11}%`, bottom: `${4 + i * 14}%`,
              }}
              animate={{ y: [0, 18, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }} />
          ))}
        </div>
        <div className="relative z-10 text-center px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <img src={logo} alt="Expi-Tracker" className="w-20 h-20 rounded-2xl object-cover mx-auto mb-5 shadow-xl" />
            <h1 className="text-4xl font-bold text-white mb-3">Start Tracking Today</h1>
            <p className="text-cyan-100 text-lg mb-8">Join thousands managing their finances smarter with Expi-Tracker.</p>
            <div className="space-y-3">
              {['✅ Real-time expense tracking', '📈 Beautiful analytics & charts', '🔒 Secure & private data', '📱 Works on all devices'].map(f => (
                <div key={f} className="rounded-xl px-5 py-3 text-left text-cyan-50 text-sm"
                  style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(10px)' }}>{f}</div>
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
            <div className="text-center mb-7">
              <img src={logo} alt="Expi-Tracker" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-3 shadow-lg" />
              <h2 className="text-2xl font-bold t-text">Create account</h2>
              <p className="t-muted mt-1 text-sm">Start your financial journey with Expi-Tracker</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map(({ key, label, icon: Icon, type, placeholder, toggle }) => (
                <div key={key}>
                  <label className="block text-sm font-medium t-muted mb-2">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 t-faint" size={16} />
                    <input type={type} value={form[key]} onChange={set(key)} required
                      placeholder={placeholder} className="t-input"
                      style={{ paddingRight: toggle ? '3rem' : undefined }} />
                    {toggle && (
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 t-muted hover:t-text transition">
                        {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button type="submit" disabled={loading} className="t-btn-primary w-full mt-2">
                {loading
                  ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</span>
                  : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm t-muted mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold" style={{ color: '#0ea5e9' }}>Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
