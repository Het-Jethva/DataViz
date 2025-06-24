import { useState, useCallback } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Upload, File, Paperclip, CheckCircle, AlertCircle } from "lucide-react"

const UploadSection = () => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState(null) // 'uploading', 'success', 'error'

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

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        setSelectedFile(file)
        setUploadStatus(null)
        setUploadProgress(0)
      }
    }
  }, [])

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setUploadStatus(null)
      setUploadProgress(0)
    }
  }, [])

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      setUploadStatus("uploading")
      setUploadProgress(0) // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setUploadStatus("success")
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }, [selectedFile])

  const resetUpload = () => {
    setSelectedFile(null)
    setUploadStatus(null)
    setUploadProgress(0)
  }

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
            <Upload className="size-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Upload Excel File
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Upload your Excel file to create beautiful visualizations
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
            isDragOver
              ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30 scale-[1.02]"
              : uploadStatus === "success"
              ? "border-green-300 bg-green-50 dark:bg-green-950/30"
              : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          }`}
        >
          <div className="flex flex-col items-center gap-6">
            <div
              className={`p-6 rounded-2xl transition-all duration-200 ${
                isDragOver
                  ? "bg-blue-100 dark:bg-blue-900/30 scale-110"
                  : uploadStatus === "success"
                  ? "bg-green-100 dark:bg-green-900/30"
                  : uploadStatus === "uploading"
                  ? "bg-blue-100 dark:bg-blue-900/30"
                  : "bg-slate-100 dark:bg-slate-800"
              }`}
            >
              {uploadStatus === "success" ? (
                <CheckCircle className="size-12 text-green-600 dark:text-green-400" />
              ) : uploadStatus === "error" ? (
                <AlertCircle className="size-12 text-red-600 dark:text-red-400" />
              ) : (
                <Upload
                  className={`size-12 transition-colors ${
                    isDragOver
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
              )}
            </div>

            {uploadStatus === "success" ? (
              <div className="space-y-3 text-center">
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                  Upload Successful!
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Your file has been processed and is ready for visualization
                </p>
                <Button
                  onClick={resetUpload}
                  variant="outline"
                  className="mt-4"
                >
                  Upload Another File
                </Button>
              </div>
            ) : selectedFile ? (
              <div className="space-y-4 text-center w-full max-w-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Selected file:
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                    <File className="size-4 text-blue-500" />
                    <span className="truncate">{selectedFile.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {uploadStatus === "uploading" && (
                  <div className="space-y-2">
                    <Progress
                      value={uploadProgress}
                      className="h-2"
                    />
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {isDragOver
                    ? "Drop your file here"
                    : "Drag and drop your Excel file"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  or click to browse your files
                </p>
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
                <Button
                  variant="outline"
                  asChild
                  disabled={uploadStatus === "uploading"}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                  >
                    <Paperclip className="size-4 mr-2" />
                    Choose File
                  </label>
                </Button>

                {selectedFile && uploadStatus !== "uploading" && (
                  <Button
                    onClick={handleUpload}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
                  >
                    <Upload className="size-4 mr-2" />
                    Upload File
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <strong>Supported formats:</strong> .xlsx, .xls •{" "}
            <strong>Max size:</strong> 10MB
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default UploadSection
