import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

export const API_BASE = `${BACKEND_URL}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: API_KEY ? { "X-API-Key": API_KEY } : {},
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.userMessage = "Request timed out. Please try again.";
    } else if (!error.response) {
      error.userMessage = "Network error. Check your connection and backend URL.";
    } else {
      error.userMessage = error.response?.data?.detail || error.message;
    }
    return Promise.reject(error);
  }
);
