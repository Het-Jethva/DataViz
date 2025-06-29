import { useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Sphere } from '@react-three/drei'
import { process3DData, validate3DAxisSelection } from '../../lib/chartUtils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, Box } from 'lucide-react'

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

// Component to handle screenshot capture
const ScreenshotCapture = ({ onScreenshotReady }) => {
    const { gl, scene, camera } = useThree()

    // Store the renderer reference for screenshot
    useMemo(() => {
        if (gl && onScreenshotReady) {
            onScreenshotReady(gl, scene, camera)
        }
    }, [gl, scene, camera, onScreenshotReady])

    return null
}

const Chart3D = () => {
    const { selectedData, xAxis, yAxis, zAxis } = useSelector(
        (state) => state.chart
    )
    const canvasRef = useRef()
    const rendererRef = useRef()
    const sceneRef = useRef()
    const cameraRef = useRef()

    // Memoize validation and data processing for better performance
    const validation = useMemo(() => {
        if (!selectedData || !xAxis || !yAxis || !zAxis) {
            return { isValid: false, error: 'Please select X, Y, and Z axes' }
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

        const xValues = data3D.map((point) => point.x)
        const yValues = data3D.map((point) => point.y)
        const zValues = data3D.map((point) => point.z)

        const xMax = Math.max(...xValues)
        const yMax = Math.max(...yValues)
        const zMax = Math.max(...zValues)

        // Handle edge cases where all values might be zero or negative
        const maxValue = Math.max(xMax, yMax, zMax, 0.1) // Ensure minimum scale
        const scale = 10 / maxValue

        return {
            xMax: Math.max(xMax * scale, 0.1), // Ensure minimum axis size
            yMax: Math.max(yMax * scale, 0.1),
            zMax: Math.max(zMax * scale, 0.1),
            scale,
            originalMax: maxValue,
        }
    }, [data3D])

    const handleScreenshotReady = (gl, scene, camera) => {
        rendererRef.current = gl
        sceneRef.current = scene
        cameraRef.current = camera
    }

    const downloadScreenshot = () => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            try {
                const renderer = rendererRef.current
                const scene = sceneRef.current
                const camera = cameraRef.current

                // Force multiple renders to ensure the scene is fully updated
                renderer.render(scene, camera)

                // Add a small delay to ensure everything is rendered
                setTimeout(() => {
                    renderer.render(scene, camera)

                    // Get the canvas from the renderer
                    const canvas = renderer.domElement

                    // Try to capture using a different approach
                    try {
                        // Method 1: Direct toBlob with higher quality
                        canvas.toBlob(
                            (blob) => {
                                if (blob && blob.size > 1000) {
                                    const url = URL.createObjectURL(blob)
                                    const link = document.createElement('a')
                                    link.download = `3d-chart-${xAxis}-${yAxis}-${zAxis}.png`
                                    link.href = url
                                    link.click()

                                    // Clean up
                                    setTimeout(
                                        () => URL.revokeObjectURL(url),
                                        100
                                    )
                                } else {
                                    // Method 2: Try with different settings
                                    canvas.toBlob(
                                        (blob2) => {
                                            if (blob2 && blob2.size > 1000) {
                                                const url =
                                                    URL.createObjectURL(blob2)
                                                const link =
                                                    document.createElement('a')
                                                link.download = `3d-chart-${xAxis}-${yAxis}-${zAxis}.png`
                                                link.href = url
                                                link.click()

                                                // Clean up
                                                setTimeout(
                                                    () =>
                                                        URL.revokeObjectURL(
                                                            url
                                                        ),
                                                    100
                                                )
                                            } else {
                                                // Method 3: Try data URL
                                                try {
                                                    const dataURL =
                                                        canvas.toDataURL(
                                                            'image/png',
                                                            1.0
                                                        )
                                                    if (
                                                        dataURL &&
                                                        dataURL.length > 100
                                                    ) {
                                                        const link =
                                                            document.createElement(
                                                                'a'
                                                            )
                                                        link.download = `3d-chart-${xAxis}-${yAxis}-${zAxis}.png`
                                                        link.href = dataURL
                                                        link.click()
                                                    } else {
                                                        throw new Error(
                                                            'Data URL is empty'
                                                        )
                                                    }
                                                } catch (dataURLError) {
                                                    console.error(
                                                        'All capture methods failed:',
                                                        dataURLError
                                                    )
                                                    // Last resort: Create a simple fallback
                                                    createFallbackImage()
                                                }
                                            }
                                        },
                                        'image/png',
                                        0.8
                                    )
                                }
                            },
                            'image/png',
                            1.0
                        )
                    } catch (error) {
                        console.error('Error in capture methods:', error)
                        createFallbackImage()
                    }
                }, 200) // Longer delay to ensure rendering is complete
            } catch (error) {
                console.error('Error capturing screenshot:', error)
                createFallbackImage()
            }
        } else {
            console.error('Three.js references not available')
            alert(
                'Chart not ready for screenshot. Please wait a moment and try again.'
            )
        }
    }

    const createFallbackImage = () => {
        // Create a simple fallback image with chart information
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = 800
        canvas.height = 600

        // Set background
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add text
        ctx.fillStyle = '#ffffff'
        ctx.font = '24px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('3D Chart - Bubble Plot', canvas.width / 2, 100)

        ctx.font = '16px Arial'
        ctx.fillText(`X Axis: ${xAxis}`, canvas.width / 2, 150)
        ctx.fillText(`Y Axis: ${yAxis}`, canvas.width / 2, 180)
        ctx.fillText(`Z Axis: ${zAxis}`, canvas.width / 2, 210)
        ctx.fillText(
            `Data Points: ${data3D?.length || 0}`,
            canvas.width / 2,
            240
        )

        ctx.font = '14px Arial'
        ctx.fillText(
            'Note: WebGL capture not available in this browser',
            canvas.width / 2,
            300
        )
        ctx.fillText(
            'Please use browser screenshot tools instead',
            canvas.width / 2,
            330
        )

        // Download the fallback image
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.download = `3d-chart-info-${xAxis}-${yAxis}-${zAxis}.png`
                    link.href = url
                    link.click()

                    // Clean up
                    setTimeout(() => URL.revokeObjectURL(url), 100)
                }
            },
            'image/png',
            1.0
        )
    }

    if (!selectedData || !xAxis || !yAxis || !zAxis) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>3D Chart</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <Box className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>
                            Select X, Y, and Z axes to see the 3D visualization
                        </p>
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
                            Error processing 3D data. Please check your axis
                            selection.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>3D Chart - Bubble Plot</CardTitle>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadScreenshot}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div
                    ref={canvasRef}
                    className="h-96 w-full border rounded-lg overflow-hidden"
                >
                    <Canvas
                        camera={{ position: [15, 15, 15], fov: 60 }}
                        style={{
                            background:
                                'linear-gradient(to bottom right, #1e293b, #334155)',
                        }}
                    >
                        <ScreenshotCapture
                            onScreenshotReady={handleScreenshotReady}
                        />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <pointLight
                            position={[-10, -10, -10]}
                            intensity={0.5}
                        />

                        {/* Render data points */}
                        {data3D.map((point, index) => (
                            <DataPoint
                                key={index}
                                position={[
                                    point.x * chartBounds.scale,
                                    point.y * chartBounds.scale,
                                    point.z * chartBounds.scale,
                                ]}
                                size={Math.max(
                                    0.1,
                                    (point.z / chartBounds.originalMax) * 0.5
                                )}
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
                    <p>
                        <strong>X Axis:</strong> {xAxis}
                    </p>
                    <p>
                        <strong>Y Axis:</strong> {yAxis}
                    </p>
                    <p>
                        <strong>Z Axis (Bubble Size):</strong> {zAxis}
                    </p>
                    <p>
                        <strong>Data Points:</strong> {data3D.length}
                    </p>
                    <p className="text-xs mt-2">
                        💡 Use mouse to rotate, scroll to zoom, and drag to pan
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default Chart3D
