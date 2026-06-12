import axios from "axios";
import { getToken, clearToken, clearJudgeToken, getJudgeToken, getParticipantToken, clearParticipantToken } from "./auth";

export const api = axios.create({
  baseURL: "",
});

api.interceptors.request.use((config) => {
  // If the request is for the judge portal, use the judge token
  if (config.url?.startsWith("/api/judge")) {
    const token = getJudgeToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else if (config.url?.startsWith("/api/participant")) {
    const token = getParticipantToken();
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
      const isDev = import.meta.env.VITE_DEV_MODE === "true";
      if (isDev && err.config?.url?.startsWith("/api/judge")) {
        // In dev mode, don't clear token or redirect for judge APIs
        return Promise.reject(err);
      }

      if (err.config?.url?.startsWith("/api/judge")) {
        clearJudgeToken();
      } else if (err.config?.url?.startsWith("/api/participant")) {
        clearParticipantToken();
      } else {
        clearToken();
      }
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
