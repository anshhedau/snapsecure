import axios from "axios"

const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side (browser): ignore internal Docker "backend" hostname overrides
    if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes("backend")) {
      const url = process.env.NEXT_PUBLIC_API_URL;
      return url.endsWith("/api/v1") ? url : `${url}/api/v1`;
    }
    // Fall back to connecting to the host's port 8000 via browser's active host
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    return `${protocol}//${host}:8000/api/v1`;
  }
  
  // Server-side (SSR/prerendering): use Docker internal host or build time config
  const url = process.env.NEXT_PUBLIC_API_URL || "http://backend:8000";
  return url.endsWith("/api/v1") ? url : `${url}/api/v1`;
}

const API_BASE_URL = getApiBaseUrl()

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add access token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // Clear local storage and redirect to login
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register" && window.location.pathname !== "/") {
          window.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  }
)
