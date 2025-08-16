import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import Investments from './pages/Investments';
import Settings from './pages/Settings';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
  };

  const handleLoginSuccess = (loggedInUserId) => {
    setUserId(loggedInUserId);
    setIsAuthenticated(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard userId={userId} />;
      case 'transactions': return <Transactions userId={userId} />;
      case 'goals': return <Goals userId={userId} />;
      case 'investments': return <Investments />;
      case 'settings': return <Settings />;
      default: return <Dashboard userId={userId} />;
    }
  };

  if (!isAuthenticated) {
    if (showLogin) {
      return <LoginPage onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => setShowLogin(false)} />;
    } else {
      return <SignupPage onSignupSuccess={handleLoginSuccess} onSwitchToLogin={() => setShowLogin(true)} />;
    }
  }

  return (
    <div className="app-container">
      <Sidebar onNavigate={setCurrentPage} activePage={currentPage} onLogout={handleLogout} />
      {renderPage()}
    </div>
  );
}

export default App;