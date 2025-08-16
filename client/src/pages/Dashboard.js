import React from 'react';
import './Dashboard.css';
import ExpenseChart from '../components/ExpenseChart';
import RecentTransactions from '../components/RecentTransactions';
import GoalsProgress from '../components/GoalsProgress';
import ExpensePrediction from '../components/ExpensePrediction';

const Dashboard = ({ userId }) => {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome Back!</h1>
        <p>Here's your financial overview for today.</p>
      </header>
      <div className="dashboard-content">
        <div className="widget">
          <h3>Monthly Expenses</h3>
          <ExpenseChart userId={userId} />
        </div>
        <div className="widget">
          <h3>Recent Transactions</h3>
          <RecentTransactions userId={userId} />
        </div>
        <div className="widget">
           <h3>Your Goals</h3>
           <GoalsProgress userId={userId} />
        </div>
        <div className="widget">
           <h3>Next Month's Predicted Spending</h3>
           <ExpensePrediction userId={userId} />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;