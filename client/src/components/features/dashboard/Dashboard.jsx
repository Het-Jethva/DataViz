import { useState, useEffect } from "react"
import { AppSidebar } from "../app-sidebar"
import { SiteHeader } from "../site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import UploadSection from "./UploadSection"
import PreviewSection from "./PreviewSection"
import RecentUploads from "./RecentUploads"
import apiClient from "../../services/api"
import { ThemeSelector } from "../theme-selector"
import { Separator } from "@/components/ui/separator"

export default function Dashboard() {
  const [previewData, setPreviewData] = useState(null)
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch uploads on mount
  useEffect(() => {
    fetchUploads()
  }, [])

  const fetchUploads = async () => {
    try {
      const response = await apiClient.get('/dashboard/uploads')
      setUploads(response.data.uploads || [])
    } catch (error) {
      console.error('Failed to fetch uploads:', error)
    }
  }

  // Handle upload success: update preview and uploads list
  const handleUploadSuccess = (parsedData, newUpload) => {
    // Ensure each row has an id
    const dataWithId = parsedData.map((row, i) => ({ id: i + 1, ...row }))
    setPreviewData(dataWithId)
    setUploads((prev) => [newUpload, ...prev])
  }

  // Handle preview from recent uploads
  const handlePreview = async (upload) => {
    setLoading(true)
    try {
      const response = await apiClient.get(`/dashboard/uploads/${upload.id}`)
      const dataWithId = response.data.data.map((row, i) => ({ id: i + 1, ...row }))
      setPreviewData(dataWithId)
    } catch (error) {
      console.error('Failed to fetch upload data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle upload to database
  const handleUploadToDatabase = async (data) => {
    try {
      // Remove the id field before sending to backend
      const dataForUpload = data.map(({ id, ...rest }) => rest)
      
      const response = await apiClient.post('/dashboard/upload-data', {
        data: dataForUpload,
        filename: uploads[0]?.filename || 'uploaded_file.xlsx',
        rowCount: data.length
      })

      console.log('Upload successful:', response.data)
      
      // Clear preview after successful upload
      setPreviewData(null)
      
      // Refresh uploads list
      await fetchUploads()
      
      // You could also show a success toast here
      alert('Data uploaded to database successfully!')
      
    } catch (error) {
      console.error('Upload to database failed:', error)
      alert('Failed to upload to database. Please try again.')
      throw error
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Fixed Header with Theme Selector */}
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="flex h-16 items-center justify-between px-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your Excel uploads and data processing</p>
              </div>
              <ThemeSelector />
            </div>
          </div>

          <main className="flex-1 p-6 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Upload and Preview Section */}
              <div className="xl:col-span-3 space-y-6">
                <UploadSection onUploadSuccess={handleUploadSuccess} />
                <PreviewSection 
                  data={previewData} 
                  loading={loading} 
                  onUploadToDatabase={handleUploadToDatabase}
                />
              </div>

              {/* Sidebar Content */}
              <div className="xl:col-span-1">
                <RecentUploads uploads={uploads} onPreview={handlePreview} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
