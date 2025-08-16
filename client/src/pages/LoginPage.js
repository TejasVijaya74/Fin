import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css';

const LoginPage = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    axios.post('http://127.0.0.1:5000/api/login', { email, password })
      .then(response => {
        console.log("Login successful:", response.data);
        onLoginSuccess(response.data.user_id);
      })
      .catch(err => {
        if (err.response && err.response.data) {
          setError(err.response.data.error);
        } else {
          setError('Login failed. Please try again.');
        }
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Welcome Back!</h2>
        <p>Login to continue to Finwiz.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">Login</button>
        </form>
        <p className="switch-form-text">
          Don't have an account?{' '}
          <span onClick={onSwitchToSignup} className="switch-form-link">Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;