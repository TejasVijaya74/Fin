import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddTransactionModal.css';

const AddTransactionModal = ({ userId, onClose, onTransactionAdded, initialData }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Shopping');
  const [transactionType, setTransactionType] = useState('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || '');
      setAmount(initialData.amount || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      description,
      amount: transactionType === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount)),
      category,
      date: date,
      userId: userId
    };
    axios.post('http://127.0.0.1:5000/api/transactions', newTransaction)
      .then(() => {
        onTransactionAdded();
        onClose();
      })
      .catch(error => console.error("Error adding transaction:", error));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h2>Add New Transaction</h2>
          <div className="type-switcher">
            <button type="button" className={transactionType === 'expense' ? 'active' : ''} onClick={() => setTransactionType('expense')}>Expense</button>
            <button type="button" className={transactionType === 'income' ? 'active' : ''} onClick={() => setTransactionType('income')}>Income</button>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Coffee with friends"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Income">Income</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;