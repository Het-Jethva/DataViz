import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, Trash2, Download } from "lucide-react"
import { formatDate, formatFileSize } from "@/utils/lib/utils"
import { useEffect, useState } from "react"
import { fetchUserUploads, deleteUserUpload } from "@/services/api"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

function downloadCSV(data, filename) {
  if (!data || !data.length) return
  const csvRows = []
  const headers = Object.keys(data[0])
  csvRows.push(headers.join(","))
  for (const row of data) {
    csvRows.push(headers.map(h => JSON.stringify(row[h] ?? "")).join(","))
  }
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function downloadExcel(data, filename) {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
  XLSX.writeFile(wb, filename)
}

const UploadHistoryItem = ({ item, index, onView, onDelete, isLast }) => {
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const handleDownload = (type) => {
    if (type === "csv") {
      downloadCSV(item.data, `${item.filename || "upload"}.csv`)
    } else {
      downloadExcel(item.data, `${item.filename || "upload"}.xlsx`)
    }
    setOpen(false)
  }
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete?.(item, index)
      toast.success("Upload deleted successfully!")
      setDeleteDialogOpen(false)
    } catch (err) {
      toast.error("Failed to delete upload.")
    } finally {
      setDeleting(false)
    }
  }
  return (
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Download ${item.filename || item.fileName || `Upload ${index + 1}`}`}> 
                <Download className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-32 p-1">
              <Button variant="ghost" className="w-full justify-start" onClick={() => handleDownload("csv")}>Download CSV</Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => handleDownload("excel")}>Download Excel</Button>
            </PopoverContent>
          </Popover>
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Delete ${item.filename || item.fileName || `Upload ${index + 1}`}`}> 
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Upload?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this upload? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button onClick={handleDelete} disabled={deleting} variant="destructive">
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {!isLast && <Separator className="my-4" />}
    </div>
  )
}

const UploadHistory = ({ history = [], loading = false, error = "", onView, onDelete }) => {
  const handleView = (item, index) => {
    if (onView) onView(item, index)
  }
  const handleDelete = async (item, index) => {
    try {
      await deleteUserUpload(item.id)
      if (onDelete) onDelete()
    } catch (err) {
    }
  }
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">Upload History</CardTitle>
        <CardDescription>View and manage your previously uploaded files</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : history.length === 0 ? (
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
