// frontend/src/components/PredictionOutput.jsx
export default function PredictionOutput({ result }) {
    if (!result) return null;
  
    return (
      <div className="mt-4 text-center">
        <p className="text-xl font-semibold">
          Prediction: <span className="text-indigo-600">{result.prediction}</span>
        </p>
        <p className="text-md font-medium">
          Confidence: <span className="text-gray-800">{result.confidence}%</span>
        </p>
        {result.actual_origin && (
          <p className="text-sm mt-1">
            Actual: <span className="font-bold">{result.actual_origin}</span>
          </p>
        )}
      </div>
    );
  }
  