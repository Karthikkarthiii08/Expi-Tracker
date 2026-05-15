import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon, color, delay = 0 }) {
  return (
    <motion.div className="stat-card"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: color + '18', border: `1.5px solid ${color}30` }}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold t-text mb-1">{value}</div>
      <div className="text-sm t-muted">{title}</div>
    </motion.div>
  );
}
