import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, FileText, Eye, Trash2 } from "lucide-react"

const UploadHistory = ({ history = [], onView, onDelete }) => {
  const handleView = (item, index) => {
    if (onView) {
      onView(item, index)
    }
  }

  const handleDelete = (item, index) => {
    if (onDelete) {
      onDelete(item, index)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Recently uploaded"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Recently uploaded"
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return ""
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Upload History
        </CardTitle>
        <CardDescription>
          View and manage your previously uploaded files
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-muted">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">No uploads yet</h3>
            <p className="text-muted-foreground">
              Upload your first Excel file to get started with data
              visualization
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/20">
                      <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      {item.filename || `Upload ${index + 1}`}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(item.uploadDate)}</span>
                      {item.fileSize && (
                        <>
                          <span>•</span>
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {formatFileSize(item.fileSize)}
                          </Badge>
                        </>
                      )}
                      {item.rowCount && (
                        <>
                          <span>•</span>
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {item.rowCount} rows
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(item, index)}
                    aria-label={`View ${
                      item.filename || `Upload ${index + 1}`
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item, index)}
                    className="text-destructive hover:text-destructive"
                    aria-label={`Delete ${
                      item.filename || `Upload ${index + 1}`
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UploadHistory
