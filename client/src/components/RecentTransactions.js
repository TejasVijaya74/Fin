import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecentTransactions.css';

const RecentTransactions = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://127.0.0.1:5000/api/transactions?userId=${userId}`)
      .then(response => {
        setTransactions(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching transactions:", error);
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="transactions-list">
      {transactions.slice(0, 5).map((transaction) => (
        <div key={transaction.id} className="transaction-item">
          <div className="transaction-details">
            <p className="transaction-description">{transaction.description}</p>
            <p className="transaction-category">{transaction.category}</p>
          </div>
          <p className={`transaction-amount ${transaction.amount > 0 ? 'income' : 'expense'}`}>
            {transaction.amount > 0 ? `+$${transaction.amount.toFixed(2)}` : `-$${Math.abs(transaction.amount).toFixed(2)}`}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RecentTransactions;