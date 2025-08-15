import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onNavigate, activePage }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Finwiz</h2>
      </div>
      <ul className="sidebar-menu">
        <li className={`menu-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => onNavigate('dashboard')}>Dashboard</li>
        <li className={`menu-item ${activePage === 'transactions' ? 'active' : ''}`} onClick={() => onNavigate('transactions')}>Transactions</li>
        <li className={`menu-item ${activePage === 'goals' ? 'active' : ''}`} onClick={() => onNavigate('goals')}>Goals</li>
        <li className={`menu-item ${activePage === 'investments' ? 'active' : ''}`} onClick={() => onNavigate('investments')}>Investments</li>
        <li className={`menu-item ${activePage === 'settings' ? 'active' : ''}`} onClick={() => onNavigate('settings')}>Settings</li>
      </ul>
      <div className="sidebar-footer">
        <p>Logout</p>
      </div>
    </div>
  );
};

export default Sidebar;