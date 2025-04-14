import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const classifyText = async (text) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/classify`, { text });
    return response.data;
  } catch (error) {
    console.error('Classification error:', error);
    return null;
  }
};

const api = {
  classifyText,
};

export default api;