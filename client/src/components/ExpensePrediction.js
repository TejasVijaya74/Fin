import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpensePrediction.css';

const ExpensePrediction = ({ userId }) => {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://127.0.0.1:5000/api/predict-expenses?userId=${userId}`)
      .then(response => {
        setPredictions(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching predictions:", error);
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading) {
    return <p>Loading predictions...</p>;
  }

  if (predictions.length === 0) {
    return <p>Not enough data to make predictions. Add more transactions!</p>;
  }

  return (
    <div className="prediction-list">
      {predictions.map((p, index) => (
        <div key={index} className="prediction-item">
          <span className="prediction-category">{p.category}</span>
          <span className="prediction-amount">~${p.predicted_amount.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};

export default ExpensePrediction;