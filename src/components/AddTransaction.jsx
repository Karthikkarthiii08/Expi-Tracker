import React, { useState } from 'react';

export default function AddTransaction({ onAddTransaction }) {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!text.trim() || !amount.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const transaction = {
      id: Date.now(),
      text,
      amount: type === 'expense' ? -parseFloat(amount) : parseFloat(amount),
      category
    };

    onAddTransaction(transaction);
    setText('');
    setAmount('');
    setCategory('Food');
    setType('expense');
  };

  return (
    <div className="add-transaction">
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="text">Description:</label>
          <input
            id="text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Income">Income</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button type="submit" className="btn-add">Add Transaction</button>
      </form>
    </div>
  );
}
