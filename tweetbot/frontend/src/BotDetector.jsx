import React, { useState } from "react";
import InputForm from "./components/InputForm";
import PredictionOutput from "./components/PredictionOutput";
import MetricDisplay from "./components/MetricDisplay";
import ConfidenceView from "./components/visualizations/ConfidenceView";
import ComparisonView from "./components/visualizations/ComparisonView";
import ModelPerformanceView from "./components/visualizations/ModelPerformanceView";

export default function BotDetector() {
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="flex flex-col items-center mt-12">
      <h1 className="text-3xl font-bold text-center mb-4">Twitter Bot Detector</h1>
      <p className="text-center text-gray-600 mb-8">
        Enter a tweet or post to classify it as human or bot-generated.
      </p>

      <InputForm setResult={setResult} />

      {result && (
        <div className="w-full max-w-4xl mt-8">
          {/* Tab navigation - CENTERED */}
          <div className="flex justify-center border-b mb-4 w-full">
            <div className="inline-flex">
              <button
                onClick={() => setActiveTab("basic")}
                className={`px-4 py-2 text-white ${
                  activeTab === "basic"
                    ? "border-b-2 border-blue-500 bg-blue-600"
                    : "bg-blue-500"
                }`}
              >
                Basic Results
              </button>
              <button
                onClick={() => setActiveTab("confidence")}
                className={`px-4 py-2 text-white ${
                  activeTab === "confidence"
                    ? "border-b-2 border-blue-500 bg-blue-600"
                    : "bg-blue-500"
                }`}
              >
                Prediction Details
              </button>
              <button
                onClick={() => setActiveTab("comparison")}
                className={`px-4 py-2 text-white ${
                  activeTab === "comparison"
                    ? "border-b-2 border-blue-500 bg-blue-600"
                    : "bg-blue-500"
                }`}
              >
                Bot vs Human
              </button>
              <button
                onClick={() => setActiveTab("model")}
                className={`px-4 py-2 text-white ${
                  activeTab === "model"
                    ? "border-b-2 border-blue-500 bg-blue-600"
                    : "bg-blue-500"
                }`}
              >
                Model Performance
              </button>
            </div>
          </div>

          {/* Tab content */}
          {activeTab === "basic" && (
            <>
              <PredictionOutput 
                prediction={result.prediction} 
                confidence={result.confidence} 
              />
              <MetricDisplay metrics={result.metrics} />
            </>
          )}
          
          {activeTab === "confidence" && (
            <ConfidenceView predictionData={result} />
          )}
          
          {activeTab === "comparison" && (
            <ComparisonView predictionData={result} />
          )}
          
          {activeTab === "model" && (
            <ModelPerformanceView predictionData={result} />
          )}
        </div>
      )}
    </div>
  );
}