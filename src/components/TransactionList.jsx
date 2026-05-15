import React, { useState } from 'react';

export default function TransactionList({ transactions, onDeleteTransaction }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Income', 'Other'];
  
  const filteredTransactions = selectedCategory === 'All' 
    ? transactions 
    : transactions.filter((t) => t.category === selectedCategory);

  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <h2>Transactions</h2>
        <p className="no-transactions">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="transaction-list-header">
        <h2>Transactions</h2>
        <div className="filter-section">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="transactions">
        {filteredTransactions.length === 0 ? (
          <p className="no-transactions">No transactions in this category</p>
        ) : (
        filteredTransactions.map((transaction) => (
          <div key={transaction.id} className={`transaction-item ${transaction.amount >= 0 ? 'income' : 'expense'}`}>
            <div className="transaction-info">
              <div className="transaction-header">
                <span className="description">{transaction.text}</span>
                <span className="category">{transaction.category}</span>
              </div>
            </div>
            <div className="transaction-amount">
              <span className={`amount ${transaction.amount >= 0 ? 'income' : 'expense'}`}>
                {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
              </span>
              <button
                className="btn-delete"
                onClick={() => onDeleteTransaction(transaction.id)}
                title="Delete transaction"
              >
                ✕
              </button>
            </div>
          </div>
        )))
        }
      </div>
    </div>
  );
}
