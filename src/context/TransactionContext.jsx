import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  const storageKey = user ? `ft_transactions_${user.id}` : null;

  useEffect(() => {
    if (!storageKey) return;
    const stored = localStorage.getItem(storageKey);
    setTransactions(stored ? JSON.parse(stored) : []);
  }, [storageKey]);

  const save = (data) => {
    setTransactions(data);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const addTransaction = (t) => save([{ ...t, id: Date.now() }, ...transactions]);
  const deleteTransaction = (id) => save(transactions.filter(t => t.id !== id));

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const balance = totalIncome - totalExpense;

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction, totalIncome, totalExpense, balance }}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);
