import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api/dashboard"

export const getDashboardData = createAsyncThunk(
  "dashboard/getDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      // No need to get token from localStorage; authentication is via httpOnly cookies
      const response = await axios.get(`${API_BASE_URL}/user`, {
        // No Authorization header needed
        withCredentials: true,
      })

      return response.data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      )
    }
  }
)

const initialState = {
  profile: null,
  uploadHistory: [],
  isLoading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null
    },
    resetDashboard: (state) => {
      state.profile = null
      state.uploadHistory = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload.profile
        state.uploadHistory = action.payload.uploadHistory
        state.error = null
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearDashboardError, resetDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer
