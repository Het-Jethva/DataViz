import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import dashboardReducer from "./slices/dashboardSlice"
import chartReducer from "./slices/chartSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    chart: chartReducer,
  },
})
