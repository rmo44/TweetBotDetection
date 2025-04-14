// frontend/src/components/InputForm.jsx
import { useState } from "react";
import { classifyText, classifyRandomTweet } from "../services/api";

export default function InputForm({ setResult }) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    const data = await classifyText(inputText);
    setResult(data);
  };

  const handleRandom = async () => {
    const data = await classifyRandomTweet();
    setInputText(data.text);
    setResult(data);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter tweet or post..."
        className="w-[90%] md:w-[500px] h-24 p-2 rounded-lg shadow border resize-none"
      />
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
        <button
          onClick={handleRandom}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Random Tweet
        </button>
      </div>
    </div>
  );
}
