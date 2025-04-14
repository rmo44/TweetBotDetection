import React, { useState } from 'react';
import { classifyText } from '../services/api';
import PredictionOutput from './PredictionOutput';
import MetricDisplay from './MetricDisplay';

const InputForm = () => {
  const [text, setText] = useState('');
  const [response, setResponse] = useState({
    prediction: null,
    confidence: null,
    metrics: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await classifyText(text);
      setResponse({
        prediction: result.prediction,
        confidence: result.confidence,
        metrics: result.metrics,
      });
    } catch (error) {
      console.error('Failed to classify text:', error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
          className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="mt-4 text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>

      <div className="mt-10 text-center">
        <PredictionOutput
          prediction={response.prediction}
          confidence={response.confidence}
        />
        <MetricDisplay metrics={response.metrics} />
      </div>
    </div>
  );
};

export default InputForm;
