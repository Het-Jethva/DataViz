import axios from "axios"

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true, // Include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default apiClient
