import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css';

const SignupPage = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    axios.post('http://127.0.0.1:5000/api/signup', { email, password })
      .then(response => {
        onSignupSuccess(response.data.user_id);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Signup failed. Please try again.');
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Your Account</h2>
        <p>Get started with Finwiz today.</p>
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
          <button type="submit" className="auth-button">Create Account</button>
        </form>
        <p className="switch-form-text">
          Already have an account?{' '}
          <span onClick={onSwitchToLogin} className="switch-form-link">Login</span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;