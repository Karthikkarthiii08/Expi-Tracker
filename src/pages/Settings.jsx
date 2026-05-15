import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiTrash2, FiDownload } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuth();
  const { transactions } = useTransactions();

  const exportData = () => {
    const data = { user, transactions, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `expi-tracker-backup-${Date.now()}.json`; a.click();
    toast.success('Data exported!');
  };

  const clearData = () => {
    if (confirm('Delete all transactions? This cannot be undone.')) {
      localStorage.removeItem(`ft_transactions_${user.id}`);
      toast.success('All transactions cleared');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold t-text">Settings</h2>
        <p className="text-sm t-muted">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <motion.div className="t-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="font-semibold text-lg t-text mb-6">Profile Information</h3>
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}>
              {user?.avatar}
            </div>
            <div>
              <div className="font-semibold t-text">{user?.name}</div>
              <div className="text-sm t-muted">{user?.email}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              { label: 'Full Name', icon: FiUser, value: user?.name },
              { label: 'Email', icon: FiMail, value: user?.email },
            ].map(({ label, icon: Icon, value }) => (
              <div key={label}>
                <label className="block text-sm font-medium t-muted mb-2">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 t-faint" size={15} />
                  <input type="text" value={value || ''} disabled
                    className="t-input cursor-not-allowed opacity-70" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div className="t-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="font-semibold text-lg t-text mb-5">Data Management</h3>
        <div className="space-y-3">
          <button onClick={exportData}
            className="w-full flex items-center justify-between p-4 rounded-xl transition group"
            style={{ background: 'var(--bg-card2)', border: '1px solid var(--border-soft)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(14,165,233,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-soft)'}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(14,165,233,0.12)' }}>
                <FiDownload size={18} style={{ color: '#0ea5e9' }} />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm t-text">Export Data</div>
                <div className="text-xs t-muted">Download all transactions as JSON</div>
              </div>
            </div>
            <span className="t-muted text-lg">→</span>
          </button>

          <button onClick={clearData}
            className="w-full flex items-center justify-between p-4 rounded-xl transition"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/15">
                <FiTrash2 size={18} className="text-red-500" />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm text-red-500">Clear All Data</div>
                <div className="text-xs" style={{ color: 'rgba(239,68,68,0.6)' }}>Permanently delete all transactions</div>
              </div>
            </div>
            <span className="text-red-400 text-lg">→</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div className="t-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="font-semibold text-lg t-text mb-4">Account Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card2)' }}>
            <div className="text-2xl font-bold t-text">{transactions.length}</div>
            <div className="text-xs t-muted mt-1">Total Transactions</div>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card2)' }}>
            <div className="text-2xl font-bold t-text">{new Date(user?.id).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
            <div className="text-xs t-muted mt-1">Member Since</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


