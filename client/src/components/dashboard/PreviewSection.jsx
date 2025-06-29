
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Database, Eye, FileText } from "lucide-react"

export default function PreviewSection({ data, loading, onUploadToDatabase }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Data Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-4 gap-4 mt-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data to Preview</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Upload an Excel file to see a preview of your data here.
          </p>
        </CardContent>
      </Card>
    )
  }

  const headers = Object.keys(data[0]).filter(key => key !== 'id')
  const displayData = data.slice(0, 100) // Show first 100 rows

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <CardTitle>Data Preview</CardTitle>
          <Badge variant="secondary" className="ml-2">
            {data.length} rows
          </Badge>
        </div>
        <Button 
          onClick={() => onUploadToDatabase(data)}
          className="flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          Upload to Database
        </Button>
      </CardHeader>
      <CardContent>
        {data.length > 100 && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Showing first 100 rows of {data.length} total rows
            </p>
          </div>
        )}
        
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                {headers.map((header) => (
                  <TableHead key={header} className="min-w-[120px]">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((row, index) => (
                <TableRow key={row.id || index}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  {headers.map((header) => (
                    <TableCell key={header} className="max-w-[200px] truncate">
                      {row[header] || '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
