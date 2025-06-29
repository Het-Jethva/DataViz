import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  selectedData: null,
  chartType: "line", // line, bar, scatter, pie, doughnut, area, bubble
  xAxis: null,
  yAxis: null,
  zAxis: null, // for 3D charts
  chartOptions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Data Visualization",
      },
    },
  },
  isLoading: false,
  error: null,
}

const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    setSelectedData: (state, action) => {
      state.selectedData = action.payload
      // Clear axes when new data is selected
      state.xAxis = null
      state.yAxis = null
      state.zAxis = null
      state.error = null
    },
    setChartType: (state, action) => {
      const newChartType = action.payload
      state.chartType = newChartType
      
      // Clear Z-axis when switching to non-3D chart types
      if (newChartType !== "bubble") {
        state.zAxis = null
      }
      
      // Clear error when changing chart type
      state.error = null
    },
    setXAxis: (state, action) => {
      state.xAxis = action.payload
      state.error = null
    },
    setYAxis: (state, action) => {
      const newYAxis = action.payload
      console.log('ChartSlice: Setting Y-axis to:', newYAxis)
      state.yAxis = newYAxis
      state.error = null
      
      // Log the current state for debugging
      console.log('ChartSlice: Current state after Y-axis update:', {
        xAxis: state.xAxis,
        yAxis: state.yAxis,
        chartType: state.chartType,
        hasData: !!state.selectedData,
        dataLength: state.selectedData?.length || 0
      })
    },
    setZAxis: (state, action) => {
      // Only allow Z-axis for 3D charts
      if (state.chartType === "bubble") {
        state.zAxis = action.payload
        state.error = null
      }
    },
    setChartOptions: (state, action) => {
      state.chartOptions = { ...state.chartOptions, ...action.payload }
    },
    setChartTitle: (state, action) => {
      state.chartOptions.plugins.title.text = action.payload
    },
    clearChartData: (state) => {
      state.selectedData = null
      state.xAxis = null
      state.yAxis = null
      state.zAxis = null
      state.error = null
    },
    setChartError: (state, action) => {
      state.error = action.payload
    },
    clearChartError: (state) => {
      state.error = null
    },
    // New action to reset axes when data changes
    resetAxes: (state) => {
      state.xAxis = null
      state.yAxis = null
      state.zAxis = null
      state.error = null
    },
  },
})

export const {
  setSelectedData,
  setChartType,
  setXAxis,
  setYAxis,
  setZAxis,
  setChartOptions,
  setChartTitle,
  clearChartData,
  setChartError,
  clearChartError,
  resetAxes,
} = chartSlice.actions

export default chartSlice.reducer 