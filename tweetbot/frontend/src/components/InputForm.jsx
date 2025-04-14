import React, { useState } from 'react';
import { classifyText } from '../services/api';

const InputForm = ({ setResult }) => {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const data = await classifyText(text);
    if (data) {
      setResult({ ...data, inputText: text });  // preserve the input for display if needed
    }
    // Do not clear the text field so it stays visible
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-xl">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter tweet or post..."
        className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default InputForm;
