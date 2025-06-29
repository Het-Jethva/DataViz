
import { useRef, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import * as XLSX from 'xlsx'

export default function UploadSection({ onUploadSuccess }) {
  const fileInput = useRef(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const excelFile = files.find((file) => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    )
    
    if (excelFile) {
      await processFile(excelFile)
    }
  }

  const processFile = async (file) => {
    setIsProcessing(true)
    
    try {
      const data = await readExcelFile(file)
      const upload = {
        id: Date.now(),
        filename: file.name,
        uploadDate: new Date().toISOString(),
        rowCount: Array.isArray(data) ? data.length : 0,
      }
      onUploadSuccess(data, upload)
    } catch (error) {
      console.error('Error reading Excel file:', error)
      alert('Error reading Excel file. Please make sure it\'s a valid Excel file.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const result = e.target?.result
          if (!result) {
            reject(new Error('Failed to read file'))
            return
          }
          
          const data = new Uint8Array(result)
          const workbook = XLSX.read(data, { type: 'array' })
          
          // Get the first sheet
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          
          // Convert to JSON with headers
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          
          if (jsonData.length === 0) {
            reject(new Error('Excel file is empty'))
            return
          }
          
          // Get headers from first row
          const headers = jsonData[0]
          
          // Convert remaining rows to objects
          const rows = jsonData.slice(1).map((row, index) => {
            const obj = { id: index + 1 }
            headers.forEach((header, i) => {
              obj[header] = row[i] || ''
            })
            return obj
          })
          
          resolve(rows)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  return (
    <Card className="border-2 border-dashed transition-all duration-200 hover:border-primary/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          Upload Excel File
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "relative rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200",
            isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            isProcessing && "opacity-50 pointer-events-none"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInput}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            disabled={isProcessing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          
          <div className="flex flex-col items-center gap-4">
            {isProcessing ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            ) : (
              <Upload className="h-12 w-12 text-muted-foreground" />
            )}
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isProcessing ? 'Processing Excel file...' : 'Drop your Excel file here'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isProcessing 
                  ? 'Please wait while we process your file' 
                  : 'or click to browse files'
                }
              </p>
            </div>
            
            {!isProcessing && (
              <Button
                variant="outline"
                onClick={() => fileInput.current?.click()}
                className="mt-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Supports .xlsx and .xls files up to 10MB
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
