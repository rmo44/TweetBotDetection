import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const ModelPerformanceView = ({ predictionData }) => {
  const [testResults, setTestResults] = useState([]);
  
  // In a real implementation, you might fetch this from an API endpoint
  // Here we'll use placeholder data based on the test results CSV
  useEffect(() => {
    // This would normally be fetched from an API
    const results = [
      { date: '2025-01', accuracy: 0.86, precision: 0.85, recall: 0.83 },
      { date: '2025-02', accuracy: 0.89, precision: 0.88, recall: 0.87 },
      { date: '2025-03', accuracy: 0.92, precision: 0.91, recall: 0.90 },
      { date: '2025-04', accuracy: 0.94, precision: 0.93, recall: 0.92 },
      { date: '2025-05', accuracy: 0.95, precision: 0.94, recall: 0.93 },
      { date: '2025-06', accuracy: 0.96, precision: 0.95, recall: 0.94 },
    ];
    
    setTestResults(results);
  }, []);

  // Updated confusion matrix data to match the percentages in the screenshot
  const confusionMatrixData = [
    { name: 'True Positive', value: 845, percent: 47, color: '#4CAF50' },
    { name: 'False Negative', value: 80, percent: 4, color: '#FFC107' },
    { name: 'False Positive', value: 95, percent: 5, color: '#F44336' },
    { name: 'True Negative', value: 780, percent: 43, color: '#2196F3' },
  ];

  const totalPredictions = confusionMatrixData.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate model metrics
  const calculateMetrics = () => {
    const tp = confusionMatrixData[0].value;
    const fn = confusionMatrixData[1].value;
    const fp = confusionMatrixData[2].value;
    const tn = confusionMatrixData[3].value;
    
    const accuracy = ((tp + tn) / totalPredictions) * 100;
    const precision = (tp / (tp + fp)) * 100;
    const recall = (tp / (tp + fn)) * 100;
    const f1 = 2 * (precision * recall) / (precision + recall);
    
    return { accuracy, precision, recall, f1 };
  };
  
  const metrics = calculateMetrics();

  return (
    <div>
      {/* Model metrics overview */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Model Performance Summary</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded text-center">
            <div className="text-sm font-medium text-gray-600">Accuracy</div>
            <div className="text-xl font-bold text-blue-700">{metrics.accuracy.toFixed(1)}%</div>
          </div>
          <div className="bg-green-50 p-3 rounded text-center">
            <div className="text-sm font-medium text-gray-600">Precision</div>
            <div className="text-xl font-bold text-green-700">{metrics.precision.toFixed(1)}%</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded text-center">
            <div className="text-sm font-medium text-gray-600">Recall</div>
            <div className="text-xl font-bold text-yellow-700">{metrics.recall.toFixed(1)}%</div>
          </div>
          <div className="bg-purple-50 p-3 rounded text-center">
            <div className="text-sm font-medium text-gray-600">F1 Score</div>
            <div className="text-xl font-bold text-purple-700">{metrics.f1.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    
      <div className="grid md:grid-cols-2 gap-6">
        {/* Model Performance Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-center">Model Performance Over Time</h3>
          <p className="text-sm text-gray-600 mb-4 text-center">
            How the model's accuracy, precision, and recall have improved over time.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={testResults}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0.8, 1]} />
              <Tooltip 
                formatter={(value) => `${(value * 100).toFixed(1)}%`}
              />
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
          <p className="text-sm text-gray-600 mb-4 text-center">
            Breakdown of correct and incorrect bot/human classifications made by the model.
          </p>
          <div className="text-center text-sm text-gray-500 mb-2">
            Total Predictions: {totalPredictions}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={confusionMatrixData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${percent}%`}
              >
                {confusionMatrixData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
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
    </div>
  );
};

export default ModelPerformanceView;