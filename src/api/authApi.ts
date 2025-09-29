import axios, { AxiosInstance } from "axios";
import type { LoginCredentials } from "../types/auth";

const API_URL = process.env.REACT_APP_API_URL || "https://reqres.in/api/";
const API_KEY = process.env.REACT_APP_API_KEY || "reqres-free-v1";

// Create a reusable Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  },
});

// Login function
export const loginApi = async ({ email, password }: LoginCredentials) => {
  try {
    const response = await apiClient.post("login", { email, password });
    return response.data; // { token: string }
  } catch (error: any) {
    // Safely extract API error message
    const message =
      error?.response?.data?.error || error.message || "Login failed";
    throw new Error(message);
  }
};

// Logout function
export const logoutApi = () => {
  ["token"].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

// Optional: helper to set token for future authenticated requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};
