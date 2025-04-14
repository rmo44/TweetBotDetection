import React from 'react';

const MetricDisplay = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Text Metrics</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="bg-gray-100 p-2 rounded shadow">
            <span className="block font-medium">{key.replace(/_/g, ' ')}:</span>
            <span className="text-gray-900">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricDisplay;
