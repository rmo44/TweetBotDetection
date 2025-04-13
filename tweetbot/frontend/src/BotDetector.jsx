// BotDetector.jsx
import React, { useState } from "react";

export default function BotDetector() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText }),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-2">Twitter Bot Detector</h1>
      <p className="mb-4 text-gray-700">Enter a tweet or post to classify it as human or bot-generated.</p>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border px-3 py-2 rounded w-80"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text here..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      {result && (
        <div className="mt-4 text-center">
          <p className="text-xl">
            <strong>Prediction:</strong> {result.prediction}
          </p>
          <p className="text-gray-700">
            <strong>Confidence:</strong> {result.confidence}%
          </p>
        </div>
      )}
    </div>
  );
}
