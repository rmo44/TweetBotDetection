import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip
} from 'recharts';

const ConfidenceView = ({ predictionData }) => {
  // For confidence gauge
  const isBot = predictionData.prediction === "Bot";
  const color = isBot ? '#FF6B6B' : '#4CAF50';
  const pieData = [
    { name: 'Confidence', value: predictionData.confidence },
    { name: 'Remaining', value: 100 - predictionData.confidence }
  ];

  // Format metrics for display
  const metricsToDisplay = [
    { name: 'Characters', value: predictionData.metrics.char_count },
    { name: 'Words', value: predictionData.metrics.word_count },
    { name: 'Exclamations', value: predictionData.metrics.exclamation_count || 0 },
    { name: 'Hashtags', value: predictionData.metrics.hashtag_count || 0 },
    { name: 'Mentions', value: predictionData.metrics.mention_count || 0 },
    { name: 'Links', value: predictionData.metrics.link_count || 0 },
    { name: 'Sentiment', value: (predictionData.metrics.sentiment_polarity || 0).toFixed(2) }
  ];

  return (
    // Changed from grid to single div for just the confidence section
    <div className="mx-auto max-w-xl">
      {/* Confidence Gauge */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-center">Prediction Confidence</h3>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Gauge showing the model's confidence level in its human/bot prediction.
        </p>
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
        
        {/* Text metrics display */}
        <div className="mt-4">
          <h4 className="font-medium text-center mb-2">Key Metrics</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {metricsToDisplay.map((metric) => (
              <div key={metric.name} className="bg-gray-50 p-2 rounded text-center">
                <div className="text-sm text-gray-600">{metric.name}</div>
                <div className="font-semibold">{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceView;