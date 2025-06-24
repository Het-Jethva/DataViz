import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api/auth"

// Configure axios for credentials
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
})

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.post("/login", {
        email,
        password,
      })

      return response.data.data
    } catch (error) {
      let message = "Login failed"
      if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.message) {
        message = error.message
      }
      return rejectWithValue(message)
    }
  }
)

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.post("/register", {
        name,
        email,
        password,
      })

      return response.data.data
    } catch (error) {
      let message = "Registration failed"
      if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.message) {
        message = error.message
      }
      return rejectWithValue(message)
    }
  }
)

export const logoutUser = createAsyncThunk(
  "auth/logoutUser", 
  async () => {
    try {
      await authAPI.post("/logout")
      return null
    } catch {
      // Even if logout fails on server, clear client state
      return null
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.get("/profile")
      return response.data.data
    } catch (error) {
      let message = "Authentication failed"
      if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.message) {
        message = error.message
      }
      return rejectWithValue(message)
    }
  }
)

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false, // Will be determined by successful API calls
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {    clearError: (state) => {
      state.error = null
    },
    resetAuth: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      // Logout case
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearError, resetAuth } = authSlice.actions
export default authSlice.reducer
