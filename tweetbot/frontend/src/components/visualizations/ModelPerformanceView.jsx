import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const ModelPerformanceView = ({ predictionData }) => {
  // Historical model performance
  const performanceData = [
    { date: '2025-01', accuracy: 0.78, precision: 0.75, recall: 0.77 },
    { date: '2025-02', accuracy: 0.82, precision: 0.79, recall: 0.80 },
    { date: '2025-03', accuracy: 0.86, precision: 0.84, recall: 0.83 },
    { date: '2025-04', accuracy: 0.89, precision: 0.87, recall: 0.88 },
    { date: '2025-05', accuracy: 0.91, precision: 0.90, recall: 0.89 },
    { date: '2025-06', accuracy: 0.93, precision: 0.92, recall: 0.91 },
  ];

  // Confusion matrix data
  const confusionMatrixData = [
    { name: 'True Positive', value: 845, color: '#4CAF50' },
    { name: 'False Negative', value: 80, color: '#FFC107' },
    { name: 'False Positive', value: 95, color: '#F44336' },
    { name: 'True Negative', value: 780, color: '#2196F3' },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Model Performance Line Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-center">Model Performance Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={performanceData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0.7, 1]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="accuracy" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="precision" stroke="#82ca9d" />
            <Line type="monotone" dataKey="recall" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Confusion Matrix */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-center">Confusion Matrix</h3>
        <div className="text-center text-sm text-gray-500 mb-2">
          Total Predictions: 1800
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={confusionMatrixData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {confusionMatrixData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="bg-green-100 p-2 rounded">
            <div className="font-semibold">True Positive</div>
            <div>Correctly identified as Bot</div>
          </div>
          <div className="bg-blue-100 p-2 rounded">
            <div className="font-semibold">True Negative</div>
            <div>Correctly identified as Human</div>
          </div>
          <div className="bg-yellow-100 p-2 rounded">
            <div className="font-semibold">False Negative</div>
            <div>Bot classified as Human</div>
          </div>
          <div className="bg-red-100 p-2 rounded">
            <div className="font-semibold">False Positive</div>
            <div>Human classified as Bot</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformanceView;