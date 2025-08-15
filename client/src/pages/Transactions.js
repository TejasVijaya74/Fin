import React from 'react';
import './Dashboard.css'; // We can reuse the dashboard styles for now

const Transactions = () => {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Transactions</h1>
        <p>View and manage all your transactions.</p>
      </header>
    </main>
  );
};

export default Transactions;