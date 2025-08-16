import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Import axios
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2. Use axios to get data
    axios.get('http://127.0.0.1:5000/api/transactions')
      .then(response => {
        // 3. The data is in response.data
        const dataWithDates = response.data.map(t => ({ ...t, date: '2025-08-16' }));
        setTransactions(dataWithDates);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching transactions:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="transactions-page">
      <header className="transactions-header">
        <h1>All Transactions</h1>
        <button className="add-transaction-btn">Add New Transaction</button>
      </header>
      
      {isLoading ? (
        <p>Loading transactions...</p>
      ) : (
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td>
                    <span className={transaction.amount > 0 ? 'income' : 'expense'}>
                      {transaction.amount > 0 ? `+$${transaction.amount.toFixed(2)}` : `-$${Math.abs(transaction.amount).toFixed(2)}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default Transactions;
