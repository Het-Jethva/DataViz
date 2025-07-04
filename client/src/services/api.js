import axios from 'axios'
import { toast } from 'sonner'

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    withCredentials: true, // Include cookies in requests
    headers: {
        'Content-Type': 'application/json',
    },
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - redirect to login if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
        } else if (error.response?.status === 403) {
            toast.error('You do not have permission to perform this action.')
        } else if (error.response?.status === 500) {
            toast.error('A server error occurred. Please try again later.')
        }
        return Promise.reject(error)
    }
)

export default apiClient

export const fetchUserUploads = () => apiClient.get('/dashboard/uploads', { withCredentials: true })

export const deleteUserUpload = (id) => apiClient.delete(`/dashboard/uploads/${id}`, { withCredentials: true })

export const saveAnalysisHistory = (uploadId, data) =>
    apiClient.post(`/dashboard/analysis/${uploadId}`, data, {
        withCredentials: true,
    })

export const fetchAnalysisHistory = (uploadId) =>
    apiClient.get(`/dashboard/analysis/${uploadId}`, { withCredentials: true })

export const fetchGeminiSummary = (uploadId, chartConfig, dataSample) =>
    apiClient.post(`/dashboard/summary/${uploadId}`, { chartConfig, dataSample }, { withCredentials: true })

// Admin API
export const fetchAdminUsers = (params = {}) => apiClient.get('/admin/users', { params })
export const fetchAdminUserById = (id) => apiClient.get(`/admin/users/${id}`)
export const updateAdminUser = (id, data) => apiClient.put(`/admin/users/${id}`, data)
export const deleteAdminUser = (id) => apiClient.delete(`/admin/users/${id}`)
export const fetchAdminStats = () => apiClient.get('/admin/stats')
