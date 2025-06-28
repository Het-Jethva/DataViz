import { useRef, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import * as XLSX from 'xlsx'

export default function UploadSection({ onUploadSuccess }) {
  const fileInput = useRef()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsProcessing(true)
    
    try {
      const data = await readExcelFile(file)
      const upload = {
        id: Date.now(),
        filename: file.name,
        uploadDate: new Date().toISOString(),
        rowCount: data.length,
      }
      onUploadSuccess(data, upload)
    } catch (error) {
      console.error('Error reading Excel file:', error)
      alert('Error reading Excel file. Please make sure it\'s a valid Excel file.')
    } finally {
      setIsProcessing(false)
    }
  }

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
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
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Upload Excel File</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <input
            ref={fileInput}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            disabled={isProcessing}
            className="block file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:font-semibold file:cursor-pointer disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">
            {isProcessing ? 'Processing Excel file...' : 'Only .xlsx or .xls files are supported.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
