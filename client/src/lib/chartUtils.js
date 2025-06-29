// Chart utility functions for data processing and axis selection

export const getColumnTypes = (data) => {
    if (!data || data.length === 0) return { numeric: [], categorical: [] }

    const columns = Object.keys(data[0])
    const columnTypes = { numeric: [], categorical: [] }

    columns.forEach((column) => {
        const sampleValues = data.slice(0, 10).map((row) => row[column])
        const isNumeric = sampleValues.every(
            (value) =>
                !isNaN(value) &&
                value !== null &&
                value !== undefined &&
                value !== ''
        )

        if (isNumeric) {
            columnTypes.numeric.push(column)
        } else {
            columnTypes.categorical.push(column)
        }
    })

    return columnTypes
}

export const processChartData = (data, xAxis, yAxis, chartType = 'line') => {
    // Early return for edge cases
    if (!data || data.length === 0) {
        console.log('processChartData: Empty data provided, returning null')
        return null
    }

    if (!xAxis || !yAxis) {
        console.log('processChartData: Missing axes, returning null')
        return null
    }

    // Check if axes exist in the data
    const columns = Object.keys(data[0] || {})
    if (!columns.includes(xAxis) || !columns.includes(yAxis)) {
        console.log('processChartData: Invalid axes provided, returning null', {
            xAxis,
            yAxis,
            availableColumns: columns,
        })
        return null
    }

    try {
        const processedData = {
            labels: [],
            datasets: [],
        }

        if (chartType === 'pie' || chartType === 'doughnut') {
            // For pie/doughnut charts, we need labels and values
            const aggregatedData = {}

            data.forEach((row) => {
                const label = String(row[xAxis])
                // Improved Y-axis value parsing
                const rawValue = row[yAxis]
                const value =
                    typeof rawValue === 'number'
                        ? rawValue
                        : parseFloat(rawValue)

                if (!isNaN(value) && value !== null && value !== undefined) {
                    if (aggregatedData[label]) {
                        aggregatedData[label] += value
                    } else {
                        aggregatedData[label] = value
                    }
                }
            })

            processedData.labels = Object.keys(aggregatedData)
            processedData.datasets = [
                {
                    data: Object.values(aggregatedData),
                    backgroundColor: generateColors(
                        Object.keys(aggregatedData).length
                    ),
                    borderColor: generateColors(
                        Object.keys(aggregatedData).length
                    ).map((color) => color.replace('0.8', '1')),
                    borderWidth: 1,
                },
            ]
        } else {
            // For other chart types, we need labels and data points
            const labels = data.map((row) => String(row[xAxis]))
            const values = data.map((row) => {
                const rawValue = row[yAxis]
                const value =
                    typeof rawValue === 'number'
                        ? rawValue
                        : parseFloat(rawValue)
                return isNaN(value) ? 0 : value
            })

            processedData.labels = labels
            processedData.datasets = [
                {
                    label: yAxis,
                    data: values,
                    backgroundColor:
                        chartType === 'bar'
                            ? generateColors(1)[0]
                            : 'rgba(59, 130, 246, 0.5)',
                    borderColor:
                        chartType === 'bar'
                            ? generateColors(1)[0]
                            : 'rgba(59, 130, 246, 1)',
                    borderWidth: 2,
                    fill: chartType === 'area',
                    tension: 0.4,
                },
            ]
        }

        console.log('Processed chart data:', {
            chartType,
            xAxis,
            yAxis,
            dataLength: data.length,
            processedLabels: processedData.labels.length,
            processedDataPoints: processedData.datasets[0]?.data?.length || 0,
            sampleYValues: processedData.datasets[0]?.data?.slice(0, 5) || [],
            isCategoricalYAxis: !isNumericColumn(data, yAxis),
        })

        return processedData
    } catch (error) {
        console.error('Error processing chart data:', error)
        return null
    }
}

// Helper function to check if a column is numeric
const isNumericColumn = (data, column) => {
    if (!data || data.length === 0) return false

    const sampleValues = data.slice(0, 10).map((row) => row[column])
    return sampleValues.every((value) => {
        if (typeof value === 'number') return true
        const parsed = parseFloat(value)
        return (
            !isNaN(parsed) &&
            value !== null &&
            value !== undefined &&
            value !== ''
        )
    })
}

// Helper function to check if a single value is numeric
const isNumericValue = (value) => {
    if (typeof value === 'number') return true
    const parsed = parseFloat(value)
    return (
        !isNaN(parsed) && value !== null && value !== undefined && value !== ''
    )
}

export const process3DData = (data, xAxis, yAxis, zAxis) => {
    // Early return for edge cases
    if (!data || data.length === 0) {
        console.log('process3DData: Empty data provided, returning null')
        return null
    }

    if (!xAxis || !yAxis || !zAxis) {
        console.log('process3DData: Missing axes, returning null')
        return null
    }

    // Check if axes exist in the data
    const columns = Object.keys(data[0] || {})
    if (
        !columns.includes(xAxis) ||
        !columns.includes(yAxis) ||
        !columns.includes(zAxis)
    ) {
        console.log('process3DData: Invalid axes provided, returning null', {
            xAxis,
            yAxis,
            zAxis,
            availableColumns: columns,
        })
        return null
    }

    try {
        const processedData = data
            .map((row, index) => {
                const x =
                    typeof row[xAxis] === 'number'
                        ? row[xAxis]
                        : parseFloat(row[xAxis]) || 0
                const y =
                    typeof row[yAxis] === 'number'
                        ? row[yAxis]
                        : parseFloat(row[yAxis]) || 0
                const z =
                    typeof row[zAxis] === 'number'
                        ? row[zAxis]
                        : parseFloat(row[zAxis]) || 0

                return {
                    x,
                    y,
                    z,
                    label: `${xAxis}: ${x}, ${yAxis}: ${y}, ${zAxis}: ${z}`,
                    index,
                }
            })
            .filter(
                (point) => !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.z)
            )

        console.log('Processed 3D data:', {
            xAxis,
            yAxis,
            zAxis,
            originalDataLength: data.length,
            processedDataLength: processedData.length,
            samplePoints: processedData.slice(0, 3),
        })

        return processedData
    } catch (error) {
        console.error('Error processing 3D data:', error)
        return null
    }
}

export const generateColors = (count) => {
    const colors = [
        'rgba(59, 130, 246, 0.8)', // Blue
        'rgba(16, 185, 129, 0.8)', // Green
        'rgba(245, 101, 101, 0.8)', // Red
        'rgba(251, 191, 36, 0.8)', // Yellow
        'rgba(139, 92, 246, 0.8)', // Purple
        'rgba(236, 72, 153, 0.8)', // Pink
        'rgba(14, 165, 233, 0.8)', // Sky
        'rgba(34, 197, 94, 0.8)', // Emerald
        'rgba(249, 115, 22, 0.8)', // Orange
        'rgba(168, 85, 247, 0.8)', // Violet
    ]

    const result = []
    for (let i = 0; i < count; i++) {
        result.push(colors[i % colors.length])
    }
    return result
}

export const getChartOptions = (
    chartType,
    title = 'Data Visualization',
    xAxisLabel = 'X Axis',
    yAxisLabel = 'Y Axis'
) => {
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: xAxisLabel,
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: yAxisLabel,
                },
            },
        },
    }

    switch (chartType) {
        case 'line':
            return {
                ...baseOptions,
                scales: {
                    ...baseOptions.scales,
                    y: {
                        ...baseOptions.scales.y,
                        beginAtZero: true,
                    },
                },
            }

        case 'bar':
            return {
                ...baseOptions,
                scales: {
                    ...baseOptions.scales,
                    y: {
                        ...baseOptions.scales.y,
                        beginAtZero: true,
                    },
                },
            }

        case 'scatter':
            return {
                ...baseOptions,
                scales: {
                    ...baseOptions.scales,
                    y: {
                        ...baseOptions.scales.y,
                        beginAtZero: true,
                    },
                },
            }

        case 'area':
            return {
                ...baseOptions,
                scales: {
                    ...baseOptions.scales,
                    y: {
                        ...baseOptions.scales.y,
                        beginAtZero: true,
                    },
                },
            }

        case 'pie':
        case 'doughnut':
            return {
                ...baseOptions,
                scales: {
                    x: { display: false },
                    y: { display: false },
                },
                plugins: {
                    ...baseOptions.plugins,
                    legend: {
                        display: true,
                        position: 'bottom',
                    },
                    tooltip: {
                        ...baseOptions.plugins.tooltip,
                        callbacks: {
                            label: function (context) {
                                const label = context.label || ''
                                const value = context.parsed
                                const total = context.dataset.data.reduce(
                                    (a, b) => a + b,
                                    0
                                )
                                const percentage =
                                    total > 0
                                        ? ((value / total) * 100).toFixed(1)
                                        : '0.0'
                                return `${label}: ${value} (${percentage}%)`
                            },
                        },
                    },
                },
            }

        default:
            return baseOptions
    }
}

export const validateAxisSelection = (data, xAxis, yAxis, chartType) => {
    if (!data || data.length === 0) {
        return { isValid: false, error: 'No data available' }
    }

    if (!xAxis || !yAxis) {
        return { isValid: false, error: 'Please select both X and Y axes' }
    }

    if (xAxis === yAxis) {
        return { isValid: false, error: 'X and Y axes must be different' }
    }

    const columns = Object.keys(data[0])
    if (!columns.includes(xAxis) || !columns.includes(yAxis)) {
        return { isValid: false, error: 'Selected axes not found in data' }
    }

    // Check data types and provide specific guidance
    const columnTypes = getColumnTypes(data)
    const isXNumeric = columnTypes.numeric.includes(xAxis)
    const isYNumeric = columnTypes.numeric.includes(yAxis)

    // For scatter plots, both axes should be numeric
    if (chartType === 'scatter') {
        if (!isXNumeric) {
            return {
                isValid: false,
                error: 'X-axis must be numeric for scatter plots',
            }
        }
        if (!isYNumeric) {
            return {
                isValid: false,
                error: 'Y-axis must be numeric for scatter plots',
            }
        }
    }

    // For line and area charts, Y-axis should be numeric
    if (['line', 'area'].includes(chartType)) {
        if (!isYNumeric) {
            return {
                isValid: false,
                error: 'Y-axis must be numeric for line/area charts',
            }
        }
    }

    // For pie/doughnut charts, Y axis should be numeric
    if (chartType === 'pie' || chartType === 'doughnut') {
        if (!isYNumeric) {
            return {
                isValid: false,
                error: 'Y axis must be numeric for pie/doughnut charts',
            }
        }
    }

    // For bar charts, we allow both numeric and categorical Y-axis
    if (chartType === 'bar') {
        if (!isYNumeric && !isXNumeric) {
            return {
                isValid: false,
                error: 'For bar charts, at least one axis should be numeric',
            }
        }
    }

    return { isValid: true, error: null }
}

// New function to validate 3D axis selection
export const validate3DAxisSelection = (data, xAxis, yAxis, zAxis) => {
    if (!data || data.length === 0) {
        return { isValid: false, error: 'No data available' }
    }

    if (!xAxis || !yAxis || !zAxis) {
        return { isValid: false, error: 'Please select X, Y, and Z axes' }
    }

    if (xAxis === yAxis || xAxis === zAxis || yAxis === zAxis) {
        return { isValid: false, error: 'All axes must be different' }
    }

    const columns = Object.keys(data[0])
    if (
        !columns.includes(xAxis) ||
        !columns.includes(yAxis) ||
        !columns.includes(zAxis)
    ) {
        return { isValid: false, error: 'Selected axes not found in data' }
    }

    // All axes should be numeric for 3D charts
    const sampleValuesX = data.slice(0, 10).map((row) => row[xAxis])
    const sampleValuesY = data.slice(0, 10).map((row) => row[yAxis])
    const sampleValuesZ = data.slice(0, 10).map((row) => row[zAxis])

    const isNumericX = sampleValuesX.every(
        (value) =>
            !isNaN(value) &&
            value !== null &&
            value !== undefined &&
            value !== ''
    )
    const isNumericY = sampleValuesY.every(
        (value) =>
            !isNaN(value) &&
            value !== null &&
            value !== undefined &&
            value !== ''
    )
    const isNumericZ = sampleValuesZ.every(
        (value) =>
            !isNaN(value) &&
            value !== null &&
            value !== undefined &&
            value !== ''
    )

    if (!isNumericX || !isNumericY || !isNumericZ) {
        return {
            isValid: false,
            error: 'All axes must be numeric for 3D charts',
        }
    }

    return { isValid: true, error: null }
}

// Utility function to handle chart responsiveness
export const handleChartResize = (chartInstance) => {
    if (chartInstance && chartInstance.resize) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
            chartInstance.resize()
        }, 100)
    }
}

// Utility function to validate chart data before rendering
export const validateChartData = (data, chartType) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return { isValid: false, error: 'No data available' }
    }

    // Check for required properties
    const firstRow = data[0]
    if (!firstRow || typeof firstRow !== 'object') {
        return { isValid: false, error: 'Invalid data format' }
    }

    // For pie/doughnut charts, check if we have at least 2 data points
    if ((chartType === 'pie' || chartType === 'doughnut') && data.length < 2) {
        return {
            isValid: false,
            error: 'Pie/doughnut charts require at least 2 data points',
        }
    }

    return { isValid: true, error: null }
}

export const validateYAxisData = (data, yAxis, chartType = 'line') => {
    if (!data || data.length === 0) {
        return {
            isValid: false,
            error: 'No data available',
            numericValues: 0,
            totalValues: 0,
        }
    }

    if (!yAxis) {
        return {
            isValid: false,
            error: 'Y-axis not selected',
            numericValues: 0,
            totalValues: 0,
        }
    }

    const yValues = data.map((row) => row[yAxis])
    const numericValuesArray = yValues.filter(isNumericValue)

    const totalValues = yValues.length
    const minValue =
        numericValuesArray.length > 0 ? Math.min(...numericValuesArray) : 0
    const maxValue =
        numericValuesArray.length > 0 ? Math.max(...numericValuesArray) : 0

    // For line, scatter, and area charts, we need numeric Y-axis
    if (['line', 'scatter', 'area'].includes(chartType)) {
        if (numericValuesArray.length === 0) {
            return {
                isValid: false,
                error: 'Y-axis must contain numeric values for this chart type',
                numericValues: 0,
                totalValues,
                minValue: 0,
                maxValue: 0,
            }
        }
    }

    return {
        isValid: true,
        error: null,
        numericValues: numericValuesArray.length,
        totalValues,
        minValue: isFinite(minValue) ? minValue : 0,
        maxValue: isFinite(maxValue) ? maxValue : 0,
    }
}
