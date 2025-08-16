// client/src/components/GoalsProgress.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GoalsProgress.css';

const ProgressBar = ({ current, target }) => {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const GoalsProgress = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is the corrected line. The URL is now a simple string.
    axios.get('http://127.0.0.1:5000/api/goals')
      .then(response => {
        setGoals(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching goals:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Loading goals...</p>;
  }

  return (
    <div className="goals-list">
      {goals.map((goal) => (
        <div key={goal.id} className="goal-item">
          <div className="goal-info">
            <p className="goal-name">{goal.name}</p>
            <p className="goal-amount">${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</p>
          </div>
          <ProgressBar current={goal.current} target={goal.target} />
        </div>
      ))}
    </div>
  );
};

export default GoalsProgress;