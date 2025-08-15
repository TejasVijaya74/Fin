import React from 'react';
import './Dashboard.css';
import ExpenseChart from '../components/ExpenseChart';
import RecentTransactions from '../components/RecentTransactions';
import GoalsProgress from '../components/GoalsProgress';

const Dashboard = () => {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome Back!</h1>
        <p>Here's your financial overview for today.</p>
      </header>
      <div className="dashboard-content">
        <div className="widget">
          <h3>Monthly Expenses</h3>
          <ExpenseChart />
        </div>
        <div className="widget">
          <h3>Recent Transactions</h3>
          <RecentTransactions />
        </div>
        <div className="widget">
           <h3>Your Goals</h3>
           <GoalsProgress />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;