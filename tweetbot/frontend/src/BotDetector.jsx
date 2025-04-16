// src/BotDetector.jsx
import React, { useState } from "react";
import InputForm from "./components/InputForm";
import PredictionOutput from "./components/PredictionOutput";
import MetricDisplay from "./components/MetricDisplay";
import VisualizationTabs from "./components/visualizations/VisualizationTabs";

export default function BotDetector() {
  const [result, setResult] = useState(null);
  const [activeView, setActiveView] = useState("basic"); // "basic", "visualization"

  return (
    <div className="flex flex-col items-center mt-12">
      <h1 className="text-3xl font-bold text-center mb-4">Twitter Bot Detector</h1>
      <p className="text-center text-gray-600 mb-8">
        Enter a tweet or post to classify it as human or bot-generated.
      </p>

      <InputForm setResult={setResult} />

      {result && (
        <div className="w-full max-w-4xl mt-8">
          {/* Tab navigation */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveView("basic")}
              className={`px-4 py-2 ${
                activeView === "basic"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Basic Results
            </button>
            <button
              onClick={() => setActiveView("visualization")}
              className={`px-4 py-2 ${
                activeView === "visualization"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Advanced Dashboard
            </button>
          </div>

          {/* Tab content */}
          {activeView === "basic" ? (
            <>
              <PredictionOutput 
                prediction={result.prediction} 
                confidence={result.confidence} 
              />
              <MetricDisplay metrics={result.metrics} />
            </>
          ) : (
            <VisualizationTabs predictionData={result} />
          )}
        </div>
      )}
    </div>
  );
}