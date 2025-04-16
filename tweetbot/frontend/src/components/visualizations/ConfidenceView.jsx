import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const ConfidenceView = ({ predictionData }) => {
  // For confidence gauge
  const isBot = predictionData.prediction === "Bot";
  const color = isBot ? '#FF6B6B' : '#4CAF50';
  const pieData = [
    { name: 'Confidence', value: predictionData.confidence },
    { name: 'Remaining', value: 100 - predictionData.confidence }
  ];

  // Sample feature importance data
  const featureImportanceData = [
    { name: 'Hashtag Count', importance: 0.85 },
    { name: 'Link Count', importance: 0.78 },
    { name: 'Word Count', importance: 0.65 },
    { name: 'Exclamation Count', importance: 0.62 },
    { name: 'Sentiment Polarity', importance: 0.58 }
  ].sort((a, b) => b.importance - a.importance);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Confidence Gauge */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-center">Prediction Confidence</h3>
        <div className="text-center mb-4">
          <span className="text-3xl font-bold" style={{ color }}>
            {predictionData.prediction}
          </span>
          <span className="text-xl ml-2">
            {predictionData.confidence.toFixed(2)}% Confidence
          </span>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill="#f0f0f0" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Feature Importance */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-center">Feature Importance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={featureImportanceData}
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 1]} />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip formatter={(value) => [(value * 100).toFixed(1) + '%', 'Importance']} />
            <Bar dataKey="importance" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConfidenceView;