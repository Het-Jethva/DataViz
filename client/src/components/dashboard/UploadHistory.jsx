import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  History,
  FileText,
  Eye,
  Trash2,
  Download,
  Calendar,
} from "lucide-react"

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
        hour: "2-digit",
        minute: "2-digit",
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
    <Card className="border-0 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
            <History className="size-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Upload History
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              View and manage your previously uploaded files
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                <FileText className="size-12 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                No uploads yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Upload your first Excel file to get started with data
                visualization and see your history here
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={item.id || index}>
                <div className="flex items-center justify-between p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 group">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 group-hover:from-green-200 group-hover:to-emerald-200 dark:group-hover:from-green-900/50 dark:group-hover:to-emerald-900/50 transition-colors">
                        <FileText className="size-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {item.filename || `Upload ${index + 1}`}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>{formatDate(item.uploadDate)}</span>
                        </div>
                        {item.fileSize && (
                          <Badge
                            variant="outline"
                            className="text-xs font-medium"
                          >
                            {formatFileSize(item.fileSize)}
                          </Badge>
                        )}
                        {item.rowCount && (
                          <Badge
                            variant="outline"
                            className="text-xs font-medium"
                          >
                            {item.rowCount} rows
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(item, index)}
                      className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                      aria-label={`View ${
                        item.filename || `Upload ${index + 1}`
                      }`}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                      aria-label={`Download ${
                        item.filename || `Upload ${index + 1}`
                      }`}
                    >
                      <Download className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item, index)}
                      className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      aria-label={`Delete ${
                        item.filename || `Upload ${index + 1}`
                      }`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                {index < history.length - 1 && (
                  <Separator className="my-4 bg-slate-200 dark:bg-slate-700" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UploadHistory
