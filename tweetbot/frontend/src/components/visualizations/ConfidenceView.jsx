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

  // Generate feature importance based on the actual metrics
  const generateFeatureImportance = (metrics) => {
    // Prevent division by zero
    metrics.word_count = metrics.word_count || 1;
    metrics.char_count = metrics.char_count || 1;

    const features = [
      { 
        name: 'Hashtag Count', 
        importance: normalizeValue(metrics.hashtag_count || 0, 0, 5, 0.4, 0.85) 
      },
      { 
        name: 'Word/Char Ratio', 
        importance: normalizeValue(
          metrics.word_count / metrics.char_count, 
          0.1, 0.25, 0.3, 0.65
        ) 
      },
      { 
        name: 'Link Count', 
        importance: normalizeValue(metrics.link_count || 0, 0, 3, 0.5, 0.9) 
      },
      { 
        name: 'Sentiment', 
        importance: normalizeValue(
          Math.abs(metrics.sentiment_polarity || 0), 
          0, 1, 0.2, 0.6
        ) 
      },
      { 
        name: 'Exclamation Count', 
        importance: normalizeValue(metrics.exclamation_count || 0, 0, 4, 0.3, 0.7) 
      }
    ];
    
    return features;
  };

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

  const featureImportanceData = generateFeatureImportance(predictionData.metrics);
  console.log("📊 Feature Importance Data:", featureImportanceData);

  return (
    <div className="grid md:grid-cols-2 gap-6">
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

{/* Feature Importance Chart */}
<div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
  <h3 className="text-lg font-semibold mb-2 text-center">Feature Importance</h3>
  <p className="text-sm text-gray-600 mb-4 text-center">
    This chart shows how important each feature is in determining whether the text was written by a human or bot.
  </p>

  {/* Replace ResponsiveContainer with fixed size for now */}
  <div style={{ width: 500, height: 300, background: '#f9fafb' }}>
    <BarChart
      data={[
        { name: 'Hashtag Count', importance: 0.8 },
        { name: 'Word/Char Ratio', importance: 0.5 },
        { name: 'Link Count', importance: 0.3 },
        { name: 'Sentiment', importance: 0.6 },
        { name: 'Exclamation Count', importance: 0.4 }
      ]}
      layout="horizontal"
      margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" domain={[0, 1]} />
      <YAxis dataKey="name" type="category" width={120} />
      <Tooltip formatter={(value) => [(value * 100).toFixed(1) + '%', 'Importance']} />
      <Bar
        dataKey="importance"
        fill="#6366F1"
        barSize={30}
        radius={[0, 4, 4, 0]}
      />
    </BarChart>
  </div>
</div>
    </div>
  );
};

// Helper function to normalize values
const normalizeValue = (value, minInput, maxInput, minOutput, maxOutput) => {
  const clampedValue = Math.max(minInput, Math.min(maxInput, value));
  return minOutput + (clampedValue - minInput) * (maxOutput - minOutput) / (maxInput - minInput);
};

export default ConfidenceView;
