import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

export default function ExpenseChart({ transactions }) {
  // Prepare data for bar chart (expenses by category)
  const expenseByCategory = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) {
        existing.amount += Math.abs(t.amount);
      } else {
        acc.push({ name: t.category, amount: Math.abs(t.amount) });
      }
      return acc;
    }, []);

  // Prepare data for pie chart (income vs expense ratio)
  const totalIncome = transactions
    .filter((t) => t.amount >= 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const incomeExpenseData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expense', value: totalExpense }
  ].filter(item => item.value > 0);

  return (
    <div className="expense-chart">
      <h2>Charts</h2>
      <div className="charts-container">
        {expenseByCategory.length > 0 && (
          <div className="chart">
            <h3>Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="amount" fill="#FF6B6B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {incomeExpenseData.length > 0 && (
          <div className="chart">
            <h3>Income vs Expense</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeExpenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {expenseByCategory.length === 0 && incomeExpenseData.length === 0 && (
        <p className="no-data">No data to display</p>
      )}
    </div>
  );
}
