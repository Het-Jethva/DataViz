
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Clock, FileSpreadsheet, Eye, Calendar, Hash } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function RecentUploads({ uploads, onPreview }) {
  if (uploads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Uploads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No uploads yet</h3>
            <p className="text-sm text-muted-foreground">
              Your recent uploads will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Uploads
          <Badge variant="secondary" className="ml-auto">
            {uploads.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="p-6 space-y-4">
            {uploads.map((upload, index) => (
              <div key={upload.id}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileSpreadsheet className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h4 className="font-medium text-sm truncate" title={upload.filename}>
                          {upload.filename}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(upload.uploadDate), { addSuffix: true })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {upload.rowCount} rows
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPreview(upload)}
                        className="w-full h-8"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
                {index < uploads.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
