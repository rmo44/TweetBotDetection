import React, { useState } from 'react';
import ConfidenceView from './ConfidenceView';
import ComparisonView from './ComparisonView';
import ModelPerformanceView from './ModelPerformanceView';

const VisualizationTabs = ({ predictionData }) => {
  const [activeTab, setActiveTab] = useState('confidence');

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          className={`py-2 px-4 rounded-lg font-medium ${activeTab === 'confidence' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('confidence')}
        >
          Prediction & Features
        </button>
        <button
          className={`py-2 px-4 rounded-lg font-medium ${activeTab === 'comparison' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('comparison')}
        >
          Bot vs Human Analysis
        </button>
        <button
          className={`py-2 px-4 rounded-lg font-medium ${activeTab === 'model' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('model')}
        >
          Model Performance
        </button>
      </div>

      {activeTab === 'confidence' && (
        <ConfidenceView predictionData={predictionData} />
      )}

      {activeTab === 'comparison' && (
        <ComparisonView predictionData={predictionData} />
      )}

      {activeTab === 'model' && (
        <ModelPerformanceView predictionData={predictionData} />
      )}
    </div>
  );
};

export default VisualizationTabs;