import React, { useState } from 'react';
import axios from 'axios';
import './Investments.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Investments = () => {
  // State for form inputs
  const [initialAmount, setInitialAmount] = useState('1000');
  const [monthlyContribution, setMonthlyContribution] = useState('100');
  const [annualRate, setAnnualRate] = useState('7');
  const [years, setYears] = useState('10');
  
  // State for the chart data
  const [projectionData, setProjectionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const params = { initialAmount, monthlyContribution, annualRate, years };
    
    axios.post('http://127.0.0.1:5000/api/predict-investment', params)
      .then(response => {
        setProjectionData(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error calculating investment:", error);
        setIsLoading(false);
      });
  };

  return (
    <main className="investments-page">
      <header className="investments-header">
        <h1>Investment Growth Predictor</h1>
      </header>

      <div className="investments-content">
        <div className="calculator-form-container">
          <form onSubmit={handleCalculate}>
            <div className="form-group">
              <label>Initial Investment ($)</label>
              <input type="number" value={initialAmount} onChange={(e) => setInitialAmount(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Monthly Contribution ($)</label>
              <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Estimated Annual Interest Rate (%)</label>
              <input type="number" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Number of Years</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)} />
            </div>
            <button type="submit" className="calculate-btn" disabled={isLoading}>
              {isLoading ? 'Calculating...' : 'Calculate Growth'}
            </button>
          </form>
        </div>

        <div className="chart-container">
          {projectionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                <YAxis tickFormatter={(tick) => `$${tick.toLocaleString()}`} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#007bff" strokeWidth={2} name="Investment Value" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="placeholder-text">
              <p>Enter your investment details and click "Calculate Growth" to see your projection.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Investments;