import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Corrected the URL to be a plain string
    fetch('[http://127.0.0.1:5000/api/expense-chart-data](http://127.0.0.1:5000/api/expense-chart-data)')
      .then(res => res.json())
      .then(chartData => {
        setData(chartData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching chart data:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Loading chart data...</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip wrapperStyle={{ backgroundColor: '#ffffff', border: '1px solid #cccccc', borderRadius: '8px' }}/>
        <Legend />
        <Bar dataKey="expenses" fill="#007bff" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;