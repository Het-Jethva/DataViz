import { useSelector } from "react-redux"
import { useRef, useMemo, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from "chart.js"
import { Line, Bar, Scatter, Pie, Doughnut } from "react-chartjs-2"
import { processChartData, getChartOptions, validateChartData, validateYAxisData } from "../../lib/chartUtils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Chart2D = () => {
  const { selectedData, chartType, xAxis, yAxis, chartOptions } = useSelector((state) => state.chart)
  const chartRef = useRef(null)

  // Memoize chart data and options to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    if (!selectedData || !xAxis || !yAxis) {
      console.log('Chart2D: Missing required data for chart rendering', { selectedData: !!selectedData, xAxis, yAxis })
      return null
    }
    
    // Validate Y-axis data specifically
    const yAxisValidation = validateYAxisData(selectedData, yAxis, chartType)
    if (!yAxisValidation.isValid) {
      console.error("Y-axis data validation failed:", yAxisValidation)
      return null
    }
    
    // Validate chart data before processing
    const validation = validateChartData(selectedData, chartType)
    if (!validation.isValid) {
      console.error("Chart data validation failed:", validation.error)
      return null
    }
    
    console.log('Chart2D: Processing chart data with:', { chartType, xAxis, yAxis, dataLength: selectedData.length })
    const processedData = processChartData(selectedData, xAxis, yAxis, chartType)
    
    if (processedData) {
      console.log('Chart2D: Successfully processed chart data:', {
        labelsCount: processedData.labels.length,
        dataPointsCount: processedData.datasets[0]?.data?.length || 0,
        sampleYValues: processedData.datasets[0]?.data?.slice(0, 3) || []
      })
    }
    
    return processedData
  }, [selectedData, xAxis, yAxis, chartType])

  const options = useMemo(() => {
    const generatedOptions = getChartOptions(
      chartType, 
      chartOptions.plugins.title.text, 
      xAxis, 
      yAxis
    )
    
    console.log('Chart2D: Generated chart options:', {
      chartType,
      xAxis,
      yAxis,
      title: chartOptions.plugins.title.text
    })
    
    return generatedOptions
  }, [chartType, chartOptions.plugins.title.text, xAxis, yAxis])

  // Force chart update when data changes
  useEffect(() => {
    if (chartRef.current && chartData) {
      console.log('Chart2D: Chart data updated, forcing re-render')
      // Small delay to ensure DOM is ready
      const timeout1 = setTimeout(() => {
        const canvas = chartRef.current.querySelector('canvas')
        if (canvas) {
          canvas.style.display = 'none'
          const timeout2 = setTimeout(() => {
            canvas.style.display = 'block'
          }, 10)
          // Store timeout2 for cleanup
          return () => clearTimeout(timeout2)
        }
      }, 100)
      
      // Cleanup function to clear timeout1
      return () => clearTimeout(timeout1)
    }
  }, [chartData])

  if (!selectedData || !xAxis || !yAxis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>2D Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Configure your chart axes to see the visualization</p>
            <p className="text-xs mt-2">Current state: X={xAxis || 'Not set'}, Y={yAxis || 'Not set'}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!chartData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>2D Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              {yAxis && selectedData && selectedData.length > 0 ? (
                <div>
                  <p>Error processing chart data. Please check your axis selection.</p>
                  <p className="text-xs mt-2">
                    <strong>Current selection:</strong> X={xAxis}, Y={yAxis}, Type={chartType}
                  </p>
                  <p className="text-xs">
                    <strong>Y-axis data type:</strong> {validateYAxisData(selectedData, yAxis, chartType).numericValues > 0 ? 'Numeric' : 'Categorical'}
                  </p>
                  <p className="text-xs">
                    <strong>Recommendation:</strong> {
                      ["line", "scatter", "area"].includes(chartType) 
                        ? "Choose a numeric column for Y-axis" 
                        : chartType === "bar" 
                        ? "Bar charts work with both numeric and categorical data" 
                        : "Choose a numeric column for Y-axis"
                    }
                  </p>
                </div>
              ) : (
                "Error processing chart data. Please check your axis selection."
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.querySelector('canvas')
      if (canvas) {
        const link = document.createElement("a")
        link.download = `${chartType}-chart.png`
        link.href = canvas.toDataURL()
        link.click()
      }
    }
  }

  const renderChart = () => {
    try {
      const commonProps = {
        data: chartData,
        options: options,
        redraw: true,
        key: `${chartType}-${xAxis}-${yAxis}-${chartData?.datasets?.[0]?.data?.length || 0}` // Use data length for stable key
      }

      switch (chartType) {
        case "line":
          return <Line {...commonProps} />
        case "bar":
          return <Bar {...commonProps} />
        case "scatter":
          return <Scatter {...commonProps} />
        case "pie":
          return <Pie {...commonProps} />
        case "doughnut":
          return <Doughnut {...commonProps} />
        case "area":
          // Area chart uses Line component with fill enabled
          return <Line {...commonProps} />
        default:
          return <Line {...commonProps} />
      }
    } catch (error) {
      console.error('Error rendering chart:', error)
      return (
        <div className="flex items-center justify-center h-full text-red-500">
          <p>Error rendering chart. Please try again.</p>
        </div>
      )
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>2D Chart - {chartType.charAt(0).toUpperCase() + chartType.slice(1)}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadChart}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="h-96 w-full">
          {renderChart()}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p><strong>X Axis:</strong> {xAxis}</p>
          <p><strong>Y Axis:</strong> {yAxis}</p>
          <p><strong>Data Points:</strong> {selectedData.length}</p>
          <p><strong>Chart Type:</strong> {chartType}</p>
          <p><strong>Processed Data Points:</strong> {chartData?.datasets[0]?.data?.length || 0}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default Chart2D 