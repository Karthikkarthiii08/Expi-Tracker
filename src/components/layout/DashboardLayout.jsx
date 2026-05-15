import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiList, FiBarChart2, FiSettings, FiLogOut, FiMenu, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';

const navItems = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/transactions', icon: FiList, label: 'Transactions' },
  { to: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  { to: '/settings', icon: FiSettings, label: 'Settings' },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 t-border" style={{ borderBottom: '1px solid var(--border-soft)' }}>
        <div className="flex items-center gap-3">
          <img src={logo} alt="Expi-Tracker Logo" className="w-10 h-10 rounded-xl object-cover shadow-md" />
          <div>
            <div className="font-bold text-sm t-text">Expi-Tracker</div>
            <div className="text-xs t-muted">Finance Manager</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'text-white shadow-md' : 't-muted'}`
            }
            style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' } : {}}>
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-white' : ''} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium t-muted hover:text-red-500 transition w-full"
          style={{ background: 'transparent' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <FiLogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-page)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed h-full z-20 t-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)} />
            <motion.aside className="fixed left-0 top-0 h-full w-64 z-40 lg:hidden t-sidebar"
              initial={{ x: -264 }} animate={{ x: 0 }} exit={{ x: -264 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="sticky top-0 z-10 t-navbar px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden t-muted hover:t-text transition">
              <FiMenu size={22} />
            </button>
            <div>
              <h1 className="font-semibold text-lg t-text">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-xs t-muted">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button onClick={toggle}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: isDark ? 'rgba(14,165,233,0.12)' : 'rgba(14,165,233,0.10)',
                border: '1.5px solid rgba(14,165,233,0.35)',
                color: '#0ea5e9',
              }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <AnimatePresence mode="wait">
                {isDark
                  ? <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><FiSun size={15} /></motion.span>
                  : <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><FiMoon size={15} /></motion.span>
                }
              </AnimatePresence>
              <span className="hidden sm:block">{isDark ? 'Light' : 'Dark'}</span>
            </motion.button>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition t-card2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}>
                  {user?.avatar}
                </div>
                <span className="text-sm hidden sm:block t-text">{user?.name}</span>
                <FiChevronDown size={14} className="t-muted" style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div className="absolute right-0 top-full mt-2 w-52 t-card rounded-xl shadow-xl overflow-hidden z-50"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}>
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                      <div className="text-sm font-semibold t-text">{user?.name}</div>
                      <div className="text-xs t-muted truncate">{user?.email}</div>
                    </div>
                    <button onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                      className="w-full text-left px-4 py-3 text-sm t-text transition flex items-center gap-2 hover:bg-cyan-500/10">
                      <FiSettings size={14} /> Settings
                    </button>
                    <button onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition flex items-center gap-2">
                      <FiLogOut size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
