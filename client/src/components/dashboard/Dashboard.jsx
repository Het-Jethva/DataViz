import { useState, useEffect } from "react"
import { AppSidebar } from "../app-sidebar"
import { SiteHeader } from "../site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import UploadSection from "./UploadSection"
import PreviewSection from "./PreviewSection"
import RecentUploads from "./RecentUploads"
import apiClient from "../../services/api"

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
      <div className="min-h-screen flex bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <SiteHeader />
          <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-4rem)] p-6">
            <div className="lg:col-span-2 flex flex-col h-full">
              <UploadSection onUploadSuccess={handleUploadSuccess} />
              <div className="flex-1 flex flex-col">
                <PreviewSection 
                  data={previewData} 
                  loading={loading} 
                  onUploadToDatabase={handleUploadToDatabase}
                />
              </div>
            </div>
            <div className="flex flex-col h-full">
              <RecentUploads uploads={uploads} onPreview={handlePreview} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
