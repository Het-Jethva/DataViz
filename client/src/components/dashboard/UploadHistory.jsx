import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, Trash2, Download } from "lucide-react"
import { formatDate, formatFileSize } from "@/lib/utils"

const UploadHistoryItem = ({ item, index, onView, onDelete, isLast }) => (
  <div>
    <div className="flex items-center justify-between p-4 rounded-lg border hover:shadow transition-all">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground truncate">
          {item.filename || item.fileName || `Upload ${index + 1}`}
        </h4>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          <span>{formatDate(item.uploadDate, { month: "short", includeTime: true, fallback: "Recently uploaded" })}</span>
          {item.fileSize && (
            <Badge variant="outline" className="text-xs font-medium">
              {formatFileSize(item.fileSize)}
            </Badge>
          )}
          {item.rowCount && (
            <Badge variant="outline" className="text-xs font-medium">
              {item.rowCount} rows
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button variant="ghost" size="icon" onClick={() => onView?.(item, index)} aria-label={`View ${item.filename || item.fileName || `Upload ${index + 1}`}`}>
          <Eye className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label={`Download ${item.filename || item.fileName || `Upload ${index + 1}`}`}> 
          <Download className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete?.(item, index)} aria-label={`Delete ${item.filename || item.fileName || `Upload ${index + 1}`}`}> 
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
    {!isLast && <Separator className="my-4" />}
  </div>
)

const UploadHistory = ({ history = [], onView, onDelete }) => {
  const handleView = (item, index) => {
    if (onView) onView(item, index)
  }
  const handleDelete = (item, index) => {
    if (onDelete) onDelete(item, index)
  }
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">Upload History</CardTitle>
        <CardDescription>View and manage your previously uploaded files</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <span className="inline-block rounded-full bg-muted p-4">
                <span className="text-muted-foreground text-2xl">📄</span>
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No uploads yet</h3>
            <p className="text-muted-foreground">Upload your first Excel file to get started with data visualization and see your history here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <UploadHistoryItem
                key={item.id || index}
                item={item}
                index={index}
                onView={handleView}
                onDelete={handleDelete}
                isLast={index === history.length - 1}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UploadHistory
