// frontend/src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000";

export const classifyText = async (text) => {
  const response = await axios.post(`${API_BASE_URL}/predict`, { text });
  return response.data;
};

export const classifyRandomTweet = async () => {
  const response = await axios.get(`${API_BASE_URL}/random-predict`);
  return response.data;
};
