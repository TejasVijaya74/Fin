import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Goals.css';
import GoalModal from '../components/GoalModal';

const Goals = ({ userId }) => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGoals = () => {
    if (!userId) return;
    setIsLoading(true);
    axios.get(`http://127.0.0.1:5000/api/goals?userId=${userId}`)
      .then(response => {
        setGoals(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching goals:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchGoals();
  }, [userId]);

  const handleDelete = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      axios.delete(`http://127.0.0.1:5000/api/goals/${goalId}`)
        .then(() => {
          fetchGoals();
        })
        .catch(error => console.error("Error deleting goal:", error));
    }
  };

  return (
    <main className="goals-page">
      {isModalOpen && <GoalModal 
        userId={userId}
        onClose={() => setIsModalOpen(false)}
        onGoalAdded={fetchGoals}
      />}
      <header className="goals-header">
        <h1>Your Financial Goals</h1>
        <button className="add-goal-btn" onClick={() => setIsModalOpen(true)}>Add New Goal</button>
      </header>
      {isLoading ? (
        <p>Loading goals...</p>
      ) : (
        <div className="goals-grid">
          {goals.map(goal => (
            <div key={goal.id} className="goal-card">
              <h3>{goal.name}</h3>
              <p className="goal-amounts">
                ${goal.current_amount.toLocaleString()} / <span>${goal.target_amount.toLocaleString()}</span>
              </p>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${(goal.current_amount / goal.target_amount) * 100}%` }}
                ></div>
              </div>
              <div className="goal-actions">
                <button className="btn-delete" onClick={() => handleDelete(goal.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Goals;