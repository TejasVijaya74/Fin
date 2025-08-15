import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Finwiz</h2>
      </div>
      <ul className="sidebar-menu">
        <li className="menu-item active">Dashboard</li>
        <li className="menu-item">Transactions</li>
        <li className="menu-item">Goals</li>
        <li className="menu-item">Investments</li>
        <li className="menu-item">Settings</li>
      </ul>
      <div className="sidebar-footer">
        <p>Logout</p>
      </div>
    </div>
  );
};

export default Sidebar;
```javascript
// client/src/pages/Dashboard.js
import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome Back!</h1>
        <p>Here's your financial overview for today.</p>
      </header>
      <div className="dashboard-content">
        {/* Placeholder for charts and other widgets */}
        <div className="widget">
          <h3>Chart Placeholder</h3>
        </div>
        <div className="widget">
          <h3>Recent Transactions Placeholder</h3>
        </div>
        <div className="widget">
           <h3>Goals Placeholder</h3>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
```javascript
// client/src/App.js
import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default App;
```css
/* client/src/App.css */
body {
  margin: 0;
  font-family: 'Inter', sans-serif; /* A modern, clean font */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8f9fa;
  color: #343a40;
}

.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
```css
/* client/src/components/Sidebar.css */
.sidebar {
  width: 250px;
  background-color: #ffffff;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-sizing: border-box;
}

.sidebar-header {
  margin-bottom: 32px;
  padding-left: 12px;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #212529;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.menu-item {
  padding: 14px 20px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #495057;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.menu-item:hover {
  background-color: #f1f3f5;
}

.menu-item.active {
  background-color: #007bff;
  color: #ffffff;
}

.sidebar-footer {
  padding: 14px 20px;
  cursor: pointer;
  font-weight: 500;
  color: #495057;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.sidebar-footer:hover {
  background-color: #f1f3f5;
}
```css
/* client/src/pages/Dashboard.css */
.dashboard {
  flex-grow: 1;
  padding: 32px;
  overflow-y: auto; /* Allow scrolling for content */
  box-sizing: border-box;
}

.dashboard-header {
  margin-bottom: 32px;
}

.dashboard-header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
}

.dashboard-header p {
  margin: 0;
  font-size: 16px;
  color: #6c757d;
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.widget {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  min-height: 200px;
}

.widget h3 {
  margin-top: 0;
  font-size: 18px;
  color: #495057;
}
