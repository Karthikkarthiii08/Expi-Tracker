import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiActivity } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import StatCard from '../components/ui/StatCard';
import AddTransactionModal from '../components/ui/AddTransactionModal';

const COLORS = ['#0ea5e9', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#ef4444'];
const CATEGORY_ICONS = { Food: '🍔', Travel: '✈️', Shopping: '🛍️', Bills: '📄', Entertainment: '🎬', Health: '💊', Education: '📚', Salary: '💼', Freelance: '💻', Investment: '📈', Other: '📦' };

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const { transactions, totalIncome, totalExpense, balance, deleteTransaction } = useTransactions();
  const { isDark } = useTheme();

  const tooltipStyle = {
    contentStyle: {
      background: isDark ? '#131929' : '#ffffff',
      border: '1px solid rgba(14,165,233,0.2)',
      borderRadius: '12px',
      color: isDark ? '#f1f5f9' : '#0f172a',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    }
  };

  const categoryData = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const ex = acc.find(i => i.name === t.category);
      if (ex) ex.value += Math.abs(t.amount);
      else acc.push({ name: t.category, value: Math.abs(t.amount) });
      return acc;
    }, []);

  const monthlyData = (() => {
    const months = {};
    transactions.forEach(t => {
      const m = new Date(t.date).toLocaleDateString('en-US', { month: 'short' });
      if (!months[m]) months[m] = { month: m, income: 0, expense: 0 };
      if (t.amount > 0) months[m].income += t.amount;
      else months[m].expense += Math.abs(t.amount);
    });
    return Object.values(months).slice(-6);
  })();

  const axisColor = isDark ? '#475569' : '#94a3b8';
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Balance" value={`₹${balance.toFixed(2)}`} icon="💰" color="#0ea5e9" delay={0} />
        <StatCard title="Total Income" value={`₹${totalIncome.toFixed(2)}`} icon="📈" color="#10b981" delay={0.08} />
        <StatCard title="Total Expenses" value={`₹${totalExpense.toFixed(2)}`} icon="📉" color="#ef4444" delay={0.16} />
        <StatCard title="Transactions" value={transactions.length} icon="🔄" color="#f59e0b" delay={0.24} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Area Chart */}
        <motion.div className="xl:col-span-2 t-card p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg t-text">Income vs Expenses</h3>
              <p className="text-sm t-muted">Monthly overview</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(14,165,233,0.1)' }}>
              <FiActivity size={18} style={{ color: '#0ea5e9' }} />
            </div>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} formatter={v => [`₹${v.toFixed(2)}`, '']} />
                <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incG)" strokeWidth={2.5} name="Income" dot={false} />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expG)" strokeWidth={2.5} name="Expense" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex flex-col items-center justify-center t-muted">
              <div className="text-5xl mb-3">📊</div>
              <p className="text-sm">No data yet. Add transactions to see trends.</p>
            </div>
          )}
        </motion.div>

        {/* Pie Chart */}
        <motion.div className="t-card p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="mb-5">
            <h3 className="font-semibold text-lg t-text">Expense Breakdown</h3>
            <p className="text-sm t-muted">By category</p>
          </div>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} dataKey="value" paddingAngle={3}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} formatter={v => [`₹${v.toFixed(2)}`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {categoryData.slice(0, 4).map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="t-muted">{item.name}</span>
                    </div>
                    <span className="t-text font-semibold">₹{item.value.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center t-muted">
              <div className="text-4xl mb-3">🥧</div>
              <p className="text-sm text-center">Add expenses to see breakdown</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div className="t-card p-6"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-lg t-text">Recent Transactions</h3>
            <p className="text-sm t-muted">Your latest activity</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="t-btn-primary flex items-center gap-2 text-sm px-4 py-2">
            <FiPlus size={16} /> Add New
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-14">
            <div className="text-5xl mb-4">💸</div>
            <p className="text-lg font-semibold t-text mb-1">No transactions yet</p>
            <p className="text-sm t-muted">Click "Add New" to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 6).map((t, i) => (
              <motion.div key={t.id}
                className="flex items-center justify-between p-4 rounded-xl transition group"
                style={{ background: 'var(--bg-card2)' }}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(14,165,233,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card2)'}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: t.amount >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.10)' }}>
                    {CATEGORY_ICONS[t.category] || '📦'}
                  </div>
                  <div>
                    <div className="font-medium text-sm t-text">{t.text}</div>
                    <div className="text-xs t-muted">{t.category} · {new Date(t.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-sm ${t.amount >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {t.amount >= 0 ? '+' : ''}₹{Math.abs(t.amount).toFixed(2)}
                  </span>
                  <button onClick={() => deleteTransaction(t.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition text-xs">✕</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* FAB */}
      <motion.button onClick={() => setModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white z-20 t-btn-primary"
        style={{ padding: 0 }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <FiPlus size={24} />
      </motion.button>
    </div>
  );
}


