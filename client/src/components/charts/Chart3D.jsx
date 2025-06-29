import { useSelector } from "react-redux"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Sphere } from "@react-three/drei"
import { process3DData, validate3DAxisSelection } from "../../lib/chartUtils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useMemo } from "react"

const DataPoint = ({ position, size, color, label }) => {
  return (
    <group position={position}>
      <Sphere args={[size, 16, 16]}>
        <meshStandardMaterial color={color} />
      </Sphere>
      {label && (
        <Text
          position={[0, size + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  )
}

const Axes = ({ bounds }) => {
  const { xMax, yMax, zMax } = bounds
  
  return (
    <group>
      {/* X Axis */}
      <mesh position={[xMax / 2, 0, 0]}>
        <boxGeometry args={[xMax, 0.1, 0.1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      
      {/* Y Axis */}
      <mesh position={[0, yMax / 2, 0]}>
        <boxGeometry args={[0.1, yMax, 0.1]} />
        <meshStandardMaterial color="green" />
      </mesh>
      
      {/* Z Axis */}
      <mesh position={[0, 0, zMax / 2]}>
        <boxGeometry args={[0.1, 0.1, zMax]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      
      {/* Axis Labels */}
      <Text position={[xMax + 1, 0, 0]} fontSize={0.5} color="red">
        X
      </Text>
      <Text position={[0, yMax + 1, 0]} fontSize={0.5} color="green">
        Y
      </Text>
      <Text position={[0, 0, zMax + 1]} fontSize={0.5} color="blue">
        Z
      </Text>
    </group>
  )
}

const Chart3D = () => {
  const { selectedData, xAxis, yAxis, zAxis } = useSelector((state) => state.chart)
  const canvasRef = useRef()

  // Memoize validation and data processing for better performance
  const validation = useMemo(() => {
    if (!selectedData || !xAxis || !yAxis || !zAxis) {
      return { isValid: false, error: "Please select X, Y, and Z axes" }
    }
    return validate3DAxisSelection(selectedData, xAxis, yAxis, zAxis)
  }, [selectedData, xAxis, yAxis, zAxis])

  const data3D = useMemo(() => {
    if (!validation.isValid) return null
    return process3DData(selectedData, xAxis, yAxis, zAxis)
  }, [selectedData, xAxis, yAxis, zAxis, validation.isValid])

  // Calculate bounds and scaling
  const chartBounds = useMemo(() => {
    if (!data3D || data3D.length === 0) return null
    
    const xValues = data3D.map(point => point.x)
    const yValues = data3D.map(point => point.y)
    const zValues = data3D.map(point => point.z)
    
    const xMax = Math.max(...xValues)
    const yMax = Math.max(...yValues)
    const zMax = Math.max(...zValues)
    
    // Prevent division by zero and ensure minimum scale
    const maxValue = Math.max(xMax, yMax, zMax, 1)
    const scale = 10 / maxValue
    
    return {
      xMax: xMax * scale,
      yMax: yMax * scale,
      zMax: zMax * scale,
      scale,
      originalMax: maxValue
    }
  }, [data3D])

  if (!selectedData || !xAxis || !yAxis || !zAxis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>3D Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Box className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Select X, Y, and Z axes to see the 3D visualization</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show validation error if any
  if (!validation.isValid) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>3D Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{validation.error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!data3D || data3D.length === 0 || !chartBounds) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>3D Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Error processing 3D data. Please check your axis selection.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const downloadScreenshot = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current.querySelector('canvas')
      if (canvas) {
        const link = document.createElement("a")
        link.download = "3d-chart.png"
        link.href = canvas.toDataURL()
        link.click()
      }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>3D Chart - Bubble Plot</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadScreenshot}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={canvasRef} className="h-96 w-full border rounded-lg overflow-hidden">
          <Canvas
            camera={{ position: [15, 15, 15], fov: 60 }}
            style={{ background: 'linear-gradient(to bottom right, #1e293b, #334155)' }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            {/* Render data points */}
            {data3D.map((point, index) => (
              <DataPoint
                key={index}
                position={[point.x * chartBounds.scale, point.y * chartBounds.scale, point.z * chartBounds.scale]}
                size={Math.max(0.1, (point.z / chartBounds.originalMax) * 0.5)}
                color={`hsl(${(index * 137.5) % 360}, 70%, 60%)`}
                label={point.label}
              />
            ))}
            
            {/* Render axes */}
            <Axes bounds={chartBounds} />
            
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={false}
              autoRotateSpeed={0.5}
            />
          </Canvas>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p><strong>X Axis:</strong> {xAxis}</p>
          <p><strong>Y Axis:</strong> {yAxis}</p>
          <p><strong>Z Axis (Bubble Size):</strong> {zAxis}</p>
          <p><strong>Data Points:</strong> {data3D.length}</p>
          <p className="text-xs mt-2">
            💡 Use mouse to rotate, scroll to zoom, and drag to pan
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default Chart3D 