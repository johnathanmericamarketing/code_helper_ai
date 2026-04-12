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
  async (error) => {
    const originalRequest = error.config || {};
    const shouldRetry =
      originalRequest.method?.toLowerCase() === "get" &&
      !originalRequest.__retried &&
      (error.code === "ECONNABORTED" || !error.response || (error.response.status >= 500 && error.response.status < 600));

    if (shouldRetry) {
      originalRequest.__retried = true;
      await new Promise((resolve) => setTimeout(resolve, 300));
      return apiClient(originalRequest);
    }

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
