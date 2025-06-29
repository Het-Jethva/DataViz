import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect, useCallback } from "react"
import { setSelectedData } from "../../redux/slices/chartSlice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart3, Box, Settings, Eye, Database } from "lucide-react"
import ChartConfig from "./ChartConfig"
import Chart2D from "./Chart2D"
import Chart3D from "./Chart3D"
import { fetchUserUploads } from "@/services/api"

const ChartDashboard = () => {
  const dispatch = useDispatch()
  const { selectedData, chartType } = useSelector((state) => state.chart)
  const [uploadHistory, setUploadHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState("")

  const refreshHistory = useCallback(async () => {
    setHistoryLoading(true)
    setHistoryError("")
    try {
      const res = await fetchUserUploads()
      setUploadHistory(
        res.data.uploads.map((item) => ({
          id: item._id,
          fileName: item.fileName || "Excel Upload",
          uploadDate: item.uploadDate,
          rowCount: item.data?.length || 0,
          data: item.data || [],
        }))
      )
    } catch (err) {
      setHistoryError("Failed to load upload history.")
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshHistory()
  }, [refreshHistory])

  const handleDataSelect = (data) => {
    dispatch(setSelectedData(data))
  }

  if (historyLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chart Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4" />
            <p>Loading upload history...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (historyError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chart Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{historyError}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (uploadHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chart Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Upload Excel files to start creating visualizations</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Data Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Data for Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadHistory.map((upload, index) => (
              <div
                key={upload.id || index}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedData === upload.data
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleDataSelect(upload.data)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm truncate">
                    {upload.fileName || `Upload ${index + 1}`}
                  </h4>
                  <div className="flex items-center gap-1">
                    {selectedData === upload.data && (
                      <Badge variant="default" className="text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{upload.rowCount || upload.data?.length || 0} rows</p>
                  <p>{Object.keys(upload.data?.[0] || {}).length} columns</p>
                  <p className="truncate">
                    {upload.uploadDate ? new Date(upload.uploadDate).toLocaleDateString() : "Recently uploaded"}
                  </p>
                </div>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDataSelect(upload.data)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Use This Data
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Configuration and Visualization */}
      {selectedData && (
        <Tabs defaultValue="config" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="2d" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              2D Chart
            </TabsTrigger>
            <TabsTrigger value="3d" className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              3D Chart
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Data Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4">
            <ChartConfig />
          </TabsContent>

          <TabsContent value="2d" className="space-y-4">
            <Chart2D />
          </TabsContent>

          <TabsContent value="3d" className="space-y-4">
            <Chart3D />
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-96">
                  <table className="min-w-full text-xs border bg-background rounded">
                    <thead>
                      <tr>
                        {Object.keys(selectedData[0] || {}).map((col) => (
                          <th key={col} className="px-2 py-1 border-b bg-muted text-left font-semibold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedData.slice(0, 20).map((row, i) => (
                        <tr key={i} className="even:bg-muted/50">
                          {Object.keys(row).map((col) => (
                            <td key={col} className="px-2 py-1 border-b">
                              {row[col]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {selectedData.length > 20 && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Showing first 20 of {selectedData.length} rows
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Instructions */}
      {!selectedData && (
        <Alert>
          <AlertDescription>
            <strong>Getting Started:</strong> Select a dataset from your uploads above to begin creating charts. 
            You can choose from line charts, bar charts, scatter plots, pie charts, and 3D visualizations.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default ChartDashboard 