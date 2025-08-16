import React, { useState } from 'react';
import axios from 'axios';
import './GoalModal.css';

const GoalModal = ({ userId, onClose, onGoalAdded }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGoal = {
      name,
      target_amount: parseFloat(targetAmount),
      current_amount: 0,
      userId: userId
    };
    axios.post('http://127.0.0.1:5000/api/goals', newGoal)
      .then(() => {
        onGoalAdded();
        onClose();
      })
      .catch(error => console.error("Error adding goal:", error));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h2>Add a New Goal</h2>
          <div className="form-group">
            <label>Goal Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Target Amount</label>
            <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save Goal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;