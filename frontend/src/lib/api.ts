import axios from "axios";
import { getToken, clearToken, clearJudgeToken, getJudgeToken } from "./auth";

export const api = axios.create({
  baseURL: "",
});

api.interceptors.request.use((config) => {
  // If the request is for the judge portal, use the judge token
  if (config.url?.startsWith("/api/judge")) {
    const token = getJudgeToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Otherwise use the committee token
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      if (err.config?.url?.startsWith("/api/judge")) {
        clearJudgeToken();
      } else {
        clearToken();
      }
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
