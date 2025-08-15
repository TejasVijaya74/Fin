import React, { useState, useEffect } from 'react';
import './RecentTransactions.css';

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/transactions')
      .then(response => response.json())
      .then(data => {
        setTransactions(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching transactions:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div className="transactions-list">
      {transactions.map((transaction) => (
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