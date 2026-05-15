import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTag, FiFileText, FiChevronDown, FiCheck } from 'react-icons/fi';
import { MdCurrencyRupee } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useTransactions } from '../../context/TransactionContext';

const CATEGORIES = [
  { label: 'Food', icon: '🍔' },
  { label: 'Travel', icon: '✈️' },
  { label: 'Shopping', icon: '🛍️' },
  { label: 'Bills', icon: '📄' },
  { label: 'Entertainment', icon: '🎬' },
  { label: 'Health', icon: '💊' },
  { label: 'Education', icon: '📚' },
  { label: 'Salary', icon: '💼' },
  { label: 'Freelance', icon: '💻' },
  { label: 'Investment', icon: '📈' },
  { label: 'Other', icon: '📦' },
];

function CategoryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = CATEGORIES.find(c => c.label === value) || CATEGORIES[0];

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition"
        style={{
          background: 'var(--bg-input)',
          border: open ? '1px solid #0ea5e9' : '1px solid var(--border-soft)',
          color: 'var(--text-primary)',
          boxShadow: open ? '0 0 0 3px rgba(14,165,233,0.15)' : 'none',
        }}>
        <div className="flex items-center gap-2">
          <FiTag size={15} style={{ color: 'var(--text-faint)' }} />
          <span>{selected.icon} {selected.label}</span>
        </div>
        <FiChevronDown size={15} style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 right-0 top-full mt-1 rounded-xl overflow-hidden z-50 shadow-2xl"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-soft)',
              maxHeight: '220px',
              overflowY: 'auto',
            }}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.label} type="button"
                onClick={() => { onChange(cat.label); setOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition"
                style={{
                  color: value === cat.label ? '#0ea5e9' : 'var(--text-primary)',
                  background: value === cat.label ? 'rgba(14,165,233,0.08)' : 'transparent',
                }}
                onMouseEnter={e => { if (value !== cat.label) e.currentTarget.style.background = 'var(--bg-card2)'; }}
                onMouseLeave={e => { if (value !== cat.label) e.currentTarget.style.background = 'transparent'; }}>
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </span>
                {value === cat.label && <FiCheck size={14} style={{ color: '#0ea5e9' }} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AddTransactionModal({ open, onClose }) {
  const [form, setForm] = useState({ text: '', amount: '', category: 'Food', type: 'expense' });
  const { addTransaction } = useTransactions();
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.text.trim() || !form.amount) { toast.error('Please fill all fields'); return; }
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) { toast.error('Enter a valid amount'); return; }
    addTransaction({ text: form.text, amount: form.type === 'expense' ? -amount : amount, category: form.category, date: new Date().toISOString() });
    toast.success(`${form.type === 'expense' ? 'Expense' : 'Income'} added!`);
    setForm({ text: '', amount: '', category: 'Food', type: 'expense' });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="relative w-full max-w-md t-card p-6 z-10"
            initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold t-text">Add Transaction</h2>
              <button onClick={onClose} className="p-2 rounded-xl t-muted hover:text-red-500 transition"
                style={{ background: 'var(--bg-card2)' }}>
                <FiX size={18} />
              </button>
            </div>

            {/* Type Toggle */}
            <div className="flex rounded-xl overflow-hidden mb-5"
              style={{ border: '1px solid var(--border-soft)', background: 'var(--bg-card2)' }}>
              {['expense', 'income'].map(t => (
                <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-all ${
                    form.type === t
                      ? t === 'expense' ? 'bg-red-500 text-white shadow' : 'bg-emerald-500 text-white shadow'
                      : 't-muted'
                  }`}>
                  {t === 'expense' ? '📉' : '📈'} {t}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium t-muted mb-2">Description</label>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 t-faint" size={15} />
                  <input type="text" value={form.text} onChange={set('text')} required
                    placeholder="e.g. Grocery shopping" className="t-input" />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium t-muted mb-2">Amount</label>
                <div className="relative">
                  <MdCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 t-faint" size={16} />
                  <input type="number" value={form.amount} onChange={set('amount')} required
                    placeholder="0.00" min="0.01" step="0.01" className="t-input" />
                </div>
              </div>

              {/* Category — custom dropdown */}
              <div>
                <label className="block text-sm font-medium t-muted mb-2">Category</label>
                <CategoryDropdown value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} />
              </div>

              <button type="submit" className="t-btn-primary w-full mt-2">Add Transaction</button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
