import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function PreviewSection({ data, loading, onUploadToDatabase }) {
  const [uploading, setUploading] = useState(false)

  const handleUploadToDatabase = async () => {
    if (!data || data.length === 0) return
    
    setUploading(true)
    try {
      await onUploadToDatabase(data)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <Card className="flex items-center justify-center min-h-[200px]">
        <CardContent>Loading...</CardContent>
      </Card>
    )
  }
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card className="min-h-[200px]">
        <CardContent className="text-muted-foreground">No preview available.</CardContent>
      </Card>
    )
  }

  // Get column headers from the first row (excluding 'id')
  const columns = Object.keys(data[0]).filter(key => key !== 'id')

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Preview</CardTitle>
          <Button 
            onClick={handleUploadToDatabase}
            disabled={uploading}
            className="ml-auto"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload to Database'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0 h-full">
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="font-semibold">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 50).map((row, index) => (
                <TableRow key={row.id || index}>
                  {columns.map((column) => (
                    <TableCell key={column} className="max-w-[200px] truncate">
                      {row[column] !== null && row[column] !== undefined ? String(row[column]) : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {data.length > 50 && (
          <div className="text-xs text-muted-foreground mt-2 px-4">
            Showing first 50 of {data.length} rows
          </div>
        )}
      </CardContent>
    </Card>
  )
} 