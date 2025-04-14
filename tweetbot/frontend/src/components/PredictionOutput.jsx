import React from 'react';

const PredictionOutput = ({ prediction, confidence }) => {
  if (!prediction) return null;

  return (
    <div className="mt-6">
      <p className="text-xl font-semibold">
        <span className="text-gray-700">Prediction:</span>{' '}
        <span className="text-black">{prediction}</span>
      </p>
      <p className="text-md font-medium mt-2 text-gray-700">
        <span className="font-semibold">Confidence:</span> {confidence}%
      </p>
    </div>
  );
};

export default PredictionOutput;
