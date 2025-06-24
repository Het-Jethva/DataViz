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
      // Token expired or invalid - redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    } else if (error.response?.status === 403) {
      window.alert("You do not have permission to perform this action.")
    } else if (error.response?.status === 500) {
      window.alert("A server error occurred. Please try again later.")
    }
    return Promise.reject(error)
  }
)

export default apiClient

export const fetchUserUploads = () => apiClient.get("/dashboard/uploads", { withCredentials: true })

export const deleteUserUpload = (id) => apiClient.delete(`/dashboard/uploads/${id}`, { withCredentials: true })
