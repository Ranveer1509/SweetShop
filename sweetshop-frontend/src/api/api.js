import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network error. Backend may be down.");
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {
      console.warn("Session expired. Redirecting to login.");
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      console.warn("Access denied.");
    }

    if (status >= 500) {
      console.error("Server error occurred.");
    }

    return Promise.reject(error);
  }
);

export default API;
