import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

export const classifyText = async (text) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, { text });
    return response.data;
  } catch (error) {
    console.error('Classification error:', error);
    return null;
  }
};
