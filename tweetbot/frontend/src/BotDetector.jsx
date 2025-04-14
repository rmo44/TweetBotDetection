import React, { useState } from "react";
import InputForm from "./components/InputForm";
import PredictionOutput from "./components/PredictionOutput";
import MetricDisplay from "./components/MetricDisplay";

export default function BotDetector() {
  const [result, setResult] = useState(null);

  return (
    <div className="flex flex-col items-center mt-12">
      <h1 className="text-3xl font-bold text-center mb-4">Twitter Bot Detector</h1>
      <p className="text-center text-gray-600 mb-8">
        Enter a tweet or post to classify it as human or bot-generated.
      </p>

      <InputForm setResult={setResult} />

      {result && (
        <>
          <PredictionOutput prediction={result.prediction} confidence={result.confidence} />
          <MetricDisplay metrics={result.metrics} />
        </>
      )}
    </div>
  );
}
