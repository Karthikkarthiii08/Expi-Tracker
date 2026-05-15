import React from 'react';

export default function Summary({ transactions }) {
  const totalIncome = transactions
    .filter((t) => t.amount >= 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpense;

  const expenseByCategory = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  return (
    <div className="summary">
      <h2>Summary</h2>
      <div className="summary-cards">
        <div className="summary-card income">
          <h3>Total Income</h3>
          <p className="amount">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-card expense">
          <h3>Total Expense</h3>
          <p className="amount">${totalExpense.toFixed(2)}</p>
        </div>
        <div className="summary-card balance">
          <h3>Balance</h3>
          <p className={`amount ${balance >= 0 ? 'positive' : 'negative'}`}>
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>

      {Object.keys(expenseByCategory).length > 0 && (
        <div className="category-breakdown">
          <h3>Expense by Category</h3>
          <div className="category-list">
            {Object.entries(expenseByCategory).map(([category, amount]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-amount">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
