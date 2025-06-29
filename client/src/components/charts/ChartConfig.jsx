import { useSelector, useDispatch } from 'react-redux'
import {
    setChartType,
    setXAxis,
    setYAxis,
    setZAxis,
    setChartTitle,
} from '../../redux/slices/chartSlice'
import {
    getColumnTypes,
    validateAxisSelection,
    validate3DAxisSelection,
} from '../../lib/chartUtils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { BarChart3, LineChart, PieChart, ScatterChart, Box } from 'lucide-react'

const ChartConfig = () => {
    const dispatch = useDispatch()
    const {
        selectedData,
        chartType,
        xAxis,
        yAxis,
        zAxis,
        chartOptions,
        error,
    } = useSelector((state) => state.chart)

    if (!selectedData || selectedData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Chart Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>Select data from your uploads to configure charts</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const columnTypes = getColumnTypes(selectedData)
    const columns = Object.keys(selectedData[0])

    // Use appropriate validation based on chart type
    const is3DChart = chartType === 'bubble'
    const validation = is3DChart
        ? validate3DAxisSelection(selectedData, xAxis, yAxis, zAxis)
        : validateAxisSelection(selectedData, xAxis, yAxis, chartType)

    const chartTypes = [
        {
            value: 'line',
            label: 'Line Chart',
            icon: LineChart,
            description: 'Shows trends over time',
        },
        {
            value: 'bar',
            label: 'Bar Chart',
            icon: BarChart3,
            description: 'Compares categories',
        },
        {
            value: 'scatter',
            label: 'Scatter Plot',
            icon: ScatterChart,
            description: 'Shows correlation',
        },
        {
            value: 'pie',
            label: 'Pie Chart',
            icon: PieChart,
            description: 'Shows proportions',
        },
        {
            value: 'doughnut',
            label: 'Doughnut Chart',
            icon: PieChart,
            description: 'Shows proportions',
        },
        {
            value: 'area',
            label: 'Area Chart',
            icon: LineChart,
            description: 'Shows volume over time',
        },
        {
            value: 'bubble',
            label: 'Bubble Chart',
            icon: Box,
            description: '3D scatter plot',
        },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chart Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Data Info */}
                <div className="space-y-2">
                    <Label>Data Preview</Label>
                    <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">
                            {selectedData.length} rows
                        </Badge>
                        <Badge variant="outline">
                            {columns.length} columns
                        </Badge>
                        <Badge variant="secondary">
                            {columnTypes.numeric.length} numeric
                        </Badge>
                        <Badge variant="secondary">
                            {columnTypes.categorical.length} categorical
                        </Badge>
                    </div>
                </div>

                {/* Chart Type Selection */}
                <div className="space-y-3">
                    <Label>Chart Type</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {chartTypes.map((type) => {
                            const Icon = type.icon
                            return (
                                <Button
                                    key={type.value}
                                    variant={
                                        chartType === type.value
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="h-auto p-3 flex flex-col gap-2"
                                    onClick={() =>
                                        dispatch(setChartType(type.value))
                                    }
                                >
                                    <Icon className="h-5 w-5" />
                                    <div className="text-xs font-medium">
                                        {type.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {type.description}
                                    </div>
                                </Button>
                            )
                        })}
                    </div>
                </div>

                {/* Axis Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <Label>X Axis</Label>
                        <Select
                            value={xAxis || ''}
                            onValueChange={(value) => dispatch(setXAxis(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select X axis" />
                            </SelectTrigger>
                            <SelectContent>
                                {columns.map((column) => (
                                    <SelectItem key={column} value={column}>
                                        <div className="flex items-center gap-2">
                                            <span>{column}</span>
                                            {columnTypes.numeric.includes(
                                                column
                                            ) && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    Numeric
                                                </Badge>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {chartType === 'scatter'
                                ? 'Choose a numeric column for X-axis'
                                : 'Any column type works'}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Label>Y Axis</Label>
                        <Select
                            value={yAxis || ''}
                            onValueChange={(value) => {
                                console.log(
                                    'ChartConfig: Y-axis selection changed to:',
                                    value
                                )
                                dispatch(setYAxis(value))
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Y axis" />
                            </SelectTrigger>
                            <SelectContent>
                                {columns.map((column) => (
                                    <SelectItem key={column} value={column}>
                                        <div className="flex items-center gap-2">
                                            <span>{column}</span>
                                            {columnTypes.numeric.includes(
                                                column
                                            ) && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    Numeric
                                                </Badge>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {['line', 'scatter', 'area'].includes(chartType)
                                ? 'Choose a numeric column for Y-axis'
                                : chartType === 'bar'
                                  ? 'Any column type works (categorical creates frequency counts)'
                                  : 'Choose a numeric column for Y-axis'}
                        </p>
                    </div>
                </div>

                {/* Z Axis for 3D Charts */}
                {is3DChart && (
                    <div className="space-y-3">
                        <Label>Z Axis (Bubble Size)</Label>
                        <Select
                            value={zAxis || ''}
                            onValueChange={(value) => dispatch(setZAxis(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Z axis" />
                            </SelectTrigger>
                            <SelectContent>
                                {columnTypes.numeric.map((column) => (
                                    <SelectItem key={column} value={column}>
                                        <div className="flex items-center gap-2">
                                            <span>{column}</span>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                Numeric
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Chart Title */}
                <div className="space-y-3">
                    <Label>Chart Title</Label>
                    <Input
                        placeholder="Enter chart title"
                        value={
                            chartOptions?.plugins?.title?.text ||
                            'Data Visualization'
                        }
                        onChange={(e) =>
                            dispatch(setChartTitle(e.target.value))
                        }
                    />
                </div>

                {/* Validation Error */}
                {!validation.isValid && (
                    <Alert variant="destructive">
                        <AlertDescription>{validation.error}</AlertDescription>
                    </Alert>
                )}

                {/* Success Message */}
                {validation.isValid && (
                    <Alert>
                        <AlertDescription>
                            Chart configuration is valid! Your chart is ready to
                            render.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}

export default ChartConfig
