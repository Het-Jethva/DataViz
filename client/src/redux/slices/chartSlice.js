import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { saveAnalysisHistory, fetchAnalysisHistory, fetchGeminiSummary } from '@/services/api'

const initialState = {
    selectedData: null,
    chartType: 'line', // line, bar, scatter, pie, doughnut, area, bubble
    xAxis: null,
    yAxis: null,
    zAxis: null, // for 3D charts
    chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Data Visualization',
            },
        },
    },
    isLoading: false,
    error: null,
    analysisHistory: [],
    analysisLoading: false,
    analysisError: null,
    geminiSummary: null,
    geminiLoading: false,
    geminiError: null,
}

// Async thunks
export const saveAnalysisHistoryThunk = createAsyncThunk(
    'chart/saveAnalysisHistory',
    async ({ uploadId, data }, { rejectWithValue }) => {
        try {
            const res = await saveAnalysisHistory(uploadId, data)
            return res.data.history
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message)
        }
    }
)

export const fetchAnalysisHistoryThunk = createAsyncThunk(
    'chart/fetchAnalysisHistory',
    async (uploadId, { rejectWithValue }) => {
        try {
            const res = await fetchAnalysisHistory(uploadId)
            return res.data.history
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message)
        }
    }
)

export const fetchGeminiSummaryThunk = createAsyncThunk(
    'chart/fetchGeminiSummary',
    async ({ uploadId, chartConfig, dataSample }, { rejectWithValue }) => {
        try {
            const res = await fetchGeminiSummary(uploadId, chartConfig, dataSample)
            return res.data.summary
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message)
        }
    }
)

const chartSlice = createSlice({
    name: 'chart',
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
            if (newChartType !== 'bubble') {
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
                dataLength: state.selectedData?.length || 0,
            })
        },
        setZAxis: (state, action) => {
            // Only allow Z-axis for 3D charts
            if (state.chartType === 'bubble') {
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
        setGeminiSummary: (state, action) => {
            state.geminiSummary = action.payload
        },
        clearGeminiSummary: (state) => {
            state.geminiSummary = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveAnalysisHistoryThunk.pending, (state) => {
                state.analysisLoading = true
                state.analysisError = null
            })
            .addCase(saveAnalysisHistoryThunk.fulfilled, (state, action) => {
                state.analysisLoading = false
                state.analysisHistory = action.payload
            })
            .addCase(saveAnalysisHistoryThunk.rejected, (state, action) => {
                state.analysisLoading = false
                state.analysisError = action.payload
            })
            .addCase(fetchAnalysisHistoryThunk.pending, (state) => {
                state.analysisLoading = true
                state.analysisError = null
            })
            .addCase(fetchAnalysisHistoryThunk.fulfilled, (state, action) => {
                state.analysisLoading = false
                state.analysisHistory = action.payload
            })
            .addCase(fetchAnalysisHistoryThunk.rejected, (state, action) => {
                state.analysisLoading = false
                state.analysisError = action.payload
            })
            .addCase(fetchGeminiSummaryThunk.pending, (state) => {
                state.geminiLoading = true
                state.geminiError = null
            })
            .addCase(fetchGeminiSummaryThunk.fulfilled, (state, action) => {
                state.geminiLoading = false
                state.geminiSummary = action.payload
            })
            .addCase(fetchGeminiSummaryThunk.rejected, (state, action) => {
                state.geminiLoading = false
                state.geminiError = action.payload
            })
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
    setGeminiSummary,
    clearGeminiSummary,
} = chartSlice.actions

export default chartSlice.reducer
