import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiTrash2, FiFilter } from 'react-icons/fi';
import { useTransactions } from '../context/TransactionContext';
import AddTransactionModal from '../components/ui/AddTransactionModal';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Salary', 'Freelance', 'Investment', 'Other'];
const CATEGORY_ICONS = { Food: '🍔', Travel: '✈️', Shopping: '🛍️', Bills: '📄', Entertainment: '🎬', Health: '💊', Education: '📚', Salary: '💼', Freelance: '💻', Investment: '📈', Other: '📦' };

export default function Transactions() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const { transactions, deleteTransaction } = useTransactions();

  const filtered = transactions.filter(t => {
    const matchSearch = t.text.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || t.category === category;
    const matchType = typeFilter === 'all' || (typeFilter === 'income' ? t.amount > 0 : t.amount < 0);
    return matchSearch && matchCat && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold t-text">Transactions</h2>
          <p className="text-sm t-muted">{filtered.length} of {transactions.length} transactions</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="t-btn-primary flex items-center gap-2 text-sm self-start sm:self-auto">
          <FiPlus size={16} /> Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="t-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 t-faint" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="t-input" style={{ paddingLeft: '2.5rem' }} />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 t-faint" size={14} />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="t-select" style={{ minWidth: '140px', paddingLeft: '2.5rem',
              background: 'var(--bg-input)', color: 'var(--text-primary)' }}>
            {CATEGORIES.map(c => <option key={c} value={c} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>{c}</option>)}
          </select>
        </div>
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-soft)' }}>
          {['all', 'income', 'expense'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition ${
                typeFilter === t
                  ? 'text-white'
                  : 't-muted'
              }`}
              style={typeFilter === t ? { background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' } : { background: 'var(--bg-input)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="t-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-semibold t-text mb-1">No transactions found</p>
            <p className="text-sm t-muted">Try adjusting your filters</p>
          </div>
        ) : (
          <div>
            {filtered.map((t, i) => (
              <motion.div key={t.id}
                className="flex items-center justify-between px-6 py-4 transition group"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-soft)' : 'none' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(14,165,233,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: t.amount >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.10)' }}>
                    {CATEGORY_ICONS[t.category] || '📦'}
                  </div>
                  <div>
                    <div className="font-medium text-sm t-text">{t.text}</div>
                    <div className="text-xs t-muted mt-0.5">{t.category} · {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-bold text-sm ${t.amount >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {t.amount >= 0 ? '+' : ''}₹{Math.abs(t.amount).toFixed(2)}
                  </span>
                  <span className={`hidden sm:block text-xs px-2.5 py-1 rounded-full font-medium ${t.amount >= 0 ? 'bg-emerald-500/15 text-emerald-600' : 'bg-red-500/12 text-red-500'}`}>
                    {t.amount >= 0 ? 'Income' : 'Expense'}
                  </span>
                  <button onClick={() => { deleteTransaction(t.id); toast.success('Deleted'); }}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}


