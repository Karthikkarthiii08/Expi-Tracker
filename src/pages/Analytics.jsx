import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#0ea5e9', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#ef4444', '#f97316'];

export default function Analytics() {
  const { transactions, totalIncome, totalExpense, balance } = useTransactions();
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
  const axisColor = isDark ? '#475569' : '#94a3b8';
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';

  const categoryData = transactions.filter(t => t.amount < 0).reduce((acc, t) => {
    const ex = acc.find(i => i.name === t.category);
    if (ex) ex.value += Math.abs(t.amount);
    else acc.push({ name: t.category, value: Math.abs(t.amount) });
    return acc;
  }, []);

  const monthlyData = (() => {
    const months = {};
    transactions.forEach(t => {
      const m = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!months[m]) months[m] = { month: m, income: 0, expense: 0, net: 0 };
      if (t.amount > 0) months[m].income += t.amount;
      else months[m].expense += Math.abs(t.amount);
      months[m].net = months[m].income - months[m].expense;
    });
    return Object.values(months);
  })();

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold t-text mb-2">No data to analyze</h3>
        <p className="text-sm t-muted">Add some transactions to see your analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold t-text">Analytics</h2>
        <p className="text-sm t-muted">Deep dive into your financial data</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Income', value: `₹${totalIncome.toFixed(2)}`, color: '#10b981' },
          { label: 'Total Expenses', value: `₹${totalExpense.toFixed(2)}`, color: '#ef4444' },
          { label: 'Net Balance', value: `₹${balance.toFixed(2)}`, color: balance >= 0 ? '#10b981' : '#ef4444' },
          { label: 'Savings Rate', value: `${savingsRate}%`, color: '#0ea5e9' },
        ].map((item, i) => (
          <motion.div key={item.label} className="stat-card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="text-sm t-muted mb-2">{item.label}</div>
            <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      <motion.div className="t-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="font-semibold text-lg t-text mb-6">Monthly Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} formatter={v => [`₹${v.toFixed(2)}`, '']} />
            <Legend wrapperStyle={{ color: axisColor }} />
            <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie */}
        <motion.div className="t-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="font-semibold text-lg t-text mb-6">Expense by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: axisColor }}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={v => [`₹${v.toFixed(2)}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="t-muted text-center py-10">No expense data</p>}
        </motion.div>

        {/* Net Trend */}
        <motion.div className="t-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h3 className="font-semibold text-lg t-text mb-6">Net Balance Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="netG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={v => [`₹${v.toFixed(2)}`, 'Net']} />
              <Area type="monotone" dataKey="net" stroke="#0ea5e9" fill="url(#netG)" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category Bars */}
      {categoryData.length > 0 && (
        <motion.div className="t-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h3 className="font-semibold text-lg t-text mb-5">Category Breakdown</h3>
          <div className="space-y-4">
            {categoryData.sort((a, b) => b.value - a.value).map((item, i) => {
              const pct = totalExpense > 0 ? (item.value / totalExpense * 100) : 0;
              return (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="t-muted font-medium">{item.name}</span>
                    <span className="t-text font-semibold">₹{item.value.toFixed(2)} <span className="t-faint font-normal">({pct.toFixed(1)}%)</span></span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-card2)' }}>
                    <motion.div className="h-full rounded-full" style={{ background: COLORS[i % COLORS.length] }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.06 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}


