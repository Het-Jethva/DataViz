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
import { Upload, File, Paperclip } from "lucide-react"

const UploadSection = () => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

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
      }
    }
  }, [])

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }, [])

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      // TODO: Implement file upload logic
      console.log("Uploading file:", selectedFile.name)
    }
  }, [selectedFile])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Excel File
        </CardTitle>
        <CardDescription>
          Upload your Excel file to create beautiful visualizations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={`p-4 rounded-full ${
                isDragOver ? "bg-primary/10" : "bg-muted"
              }`}
            >
              <Upload
                className={`h-8 w-8 ${
                  isDragOver ? "text-primary" : "text-muted-foreground"
                }`}
              />
            </div>

            {selectedFile ? (
              <div className="space-y-2 text-center">
                <p className="font-medium">Selected file:</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <File className="h-4 w-4" />
                  <span>{selectedFile.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-center">
                <p className="text-lg font-medium">
                  Drag and drop your Excel file here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>
            )}

            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                asChild
              >
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Choose File
                </label>
              </Button>

              {selectedFile && (
                <Button onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Supported formats: .xlsx, .xls (max 10MB)
        </p>
      </CardContent>
    </Card>
  )
}

export default UploadSection
