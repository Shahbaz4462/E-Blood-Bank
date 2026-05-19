import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const parsedInfo = JSON.parse(userInfo);
        if (parsedInfo.token) {
          config.headers.Authorization = `Bearer ${parsedInfo.token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
