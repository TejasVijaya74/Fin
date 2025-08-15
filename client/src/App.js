import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions'; // Import new pages
import Goals from './pages/Goals';
import Investments from './pages/Investments';
import Settings from './pages/Settings';
import './App.css';

function App() {
  // 1. Use state to keep track of the current page. 'dashboard' is the default.
  const [currentPage, setCurrentPage] = useState('dashboard');

  // 2. A function to render the correct page based on the state.
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'goals':
        return <Goals />;
      case 'investments':
        return <Investments />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* 3. Pass the state and the function to update it down to the Sidebar */}
      <Sidebar onNavigate={setCurrentPage} activePage={currentPage} />
      {/* 4. Call the render function to display the active page */}
      {renderPage()}
    </div>
  );
}

export default App;