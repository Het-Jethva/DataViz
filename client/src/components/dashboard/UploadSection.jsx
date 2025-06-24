import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import apiClient from "@/services/api"
import { toast } from "sonner"

const UploadSection = ({ onUploadSuccess }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel"
  ]

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    setErrorMsg("")
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMsg("Unsupported file type. Please upload an Excel file (.xlsx, .xls).")
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setErrorMsg("File size exceeds 10MB limit.")
        return
      }
      setSelectedFile(file)
      setUploadStatus(null)
      setUploadProgress(0)
    }
  }, [])

  const handleFileSelect = useCallback((e) => {
    setErrorMsg("")
    const file = e.target.files[0]
    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMsg("Unsupported file type. Please upload an Excel file (.xlsx, .xls).")
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setErrorMsg("File size exceeds 10MB limit.")
        return
      }
      setSelectedFile(file)
      setUploadStatus(null)
      setUploadProgress(0)
    }
  }, [])

  const handleUpload = useCallback(async () => {
    if (selectedFile) {
      setUploadStatus("uploading")
      setUploadProgress(0)
      setErrorMsg("")
      try {
        const formData = new FormData()
        formData.append("file", selectedFile)
        await apiClient.post("/dashboard/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              setUploadProgress(percent)
            }
          },
          withCredentials: true,
        })
        setUploadProgress(100)
        setUploadStatus("success")
        toast.success("File uploaded successfully!")
        if (onUploadSuccess) onUploadSuccess()
      } catch (err) {
        setUploadStatus("error")
        setErrorMsg(err?.response?.data?.error || "Upload failed. Please try again.")
        toast.error(err?.response?.data?.error || "Upload failed. Please try again.")
      }
    }
  }, [selectedFile, onUploadSuccess])

  const resetUpload = () => {
    setSelectedFile(null)
    setUploadStatus(null)
    setUploadProgress(0)
    setErrorMsg("")
  }

  const FileInfo = ({ file }) => (
    <div className="space-y-2">
      <p className="font-semibold text-foreground">Selected file:</p>
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-background rounded-lg p-3 border">
        <File className="size-4 text-primary" />
        <span className="truncate">{file.name}</span>
      </div>
      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
    </div>
  )

  const UploadStatus = ({ progress }) => (
    <div className="space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-primary">Uploading... {progress}%</p>
    </div>
  )

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">Upload Excel File</CardTitle>
        <CardDescription>Upload your Excel file to create beautiful visualizations</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragOver
              ? "border-primary bg-primary/10 scale-[1.02]"
              : uploadStatus === "success"
              ? "border-green-300 bg-green-50"
              : "border-muted hover:border-foreground hover:bg-muted/50"
          }`}
        >
          <div className="flex flex-col items-center gap-6">
            <div className={`p-6 rounded-xl transition-all ${
              isDragOver
                ? "bg-primary/10 scale-110"
                : uploadStatus === "success"
                ? "bg-green-100"
                : uploadStatus === "uploading"
                ? "bg-primary/10"
                : "bg-muted"
            }`}>
              {uploadStatus === "success" ? (
                <CheckCircle className="size-12 text-green-600" />
              ) : uploadStatus === "error" ? (
                <AlertCircle className="size-12 text-red-600" />
              ) : (
                <Upload className={`size-12 ${isDragOver ? "text-primary" : "text-muted-foreground"}`} />
              )}
            </div>
            {uploadStatus === "success" ? (
              <div className="space-y-3 text-center">
                <h3 className="text-lg font-semibold text-green-700">Upload Successful!</h3>
                <p className="text-sm text-green-600">Your file has been processed and is ready for visualization</p>
                <Button onClick={resetUpload} variant="outline" className="mt-4">Upload Another File</Button>
              </div>
            ) : selectedFile ? (
              <div className="space-y-4 text-center w-full max-w-sm">
                <FileInfo file={selectedFile} />
                {uploadStatus === "uploading" && <UploadStatus progress={uploadProgress} />}
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  {isDragOver ? "Drop your file here" : "Drag and drop your Excel file"}
                </h3>
                <p className="text-sm text-muted-foreground">or click to browse your files</p>
              </div>
            )}
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={uploadStatus === "uploading"}
            />
            {uploadStatus !== "success" && (
              <div className="flex gap-3">
                <Button variant="outline" asChild disabled={uploadStatus === "uploading"}>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <File className="size-4 mr-2" />Choose File
                  </label>
                </Button>
                {selectedFile && uploadStatus !== "uploading" && (
                  <Button onClick={handleUpload}>
                    <Upload className="size-4 mr-2" />Upload File
                  </Button>
                )}
              </div>
            )}
            {errorMsg && (
              <div className="text-red-600 text-sm text-center mb-4">{errorMsg}</div>
            )}
          </div>
        </div>
        <div className="text-center mt-6 p-4 bg-muted rounded-xl">
          <p className="text-xs text-muted-foreground">
            <strong>Supported formats:</strong> .xlsx, .xls • <strong>Max size:</strong> 10MB
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default UploadSection
