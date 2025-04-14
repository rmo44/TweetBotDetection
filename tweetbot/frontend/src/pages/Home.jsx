import React, { useState } from "react";
import InputForm from "../components/InputForm";
import PredictionOutput from "../components/PredictionOutput";
import MetricDisplay from "../components/MetricDisplay";
import { classifyText } from "../services/api";

const Home = () => {
  const [result, setResult] = useState(null);

  const handleSubmit = async (text) => {
    try {
      const data = await classifyText(text);
      setResult(data);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
        <InputForm onSubmit={handleSubmit} />
        <PredictionOutput prediction={result?.prediction} confidence={result?.confidence} />
        <MetricDisplay metrics={result?.metrics} />
      </div>
    </div>
  );
};

export default Home;
