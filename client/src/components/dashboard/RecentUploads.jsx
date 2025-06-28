import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function RecentUploads({ uploads, onPreview }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
      </CardHeader>
      <CardContent>
        {uploads.length === 0 && <div className="text-muted-foreground text-sm">No uploads yet.</div>}
        <ul className="space-y-3">
          {uploads.map((upload) => (
            <li key={upload.id} className="flex items-center justify-between gap-2 border-b last:border-b-0 pb-2">
              <div>
                <div className="font-medium">{upload.filename}</div>
                <div className="text-xs text-muted-foreground">{new Date(upload.uploadDate).toLocaleString()} <Badge variant="outline" className="ml-2">{upload.rowCount} rows</Badge></div>
              </div>
              <Button size="sm" variant="outline" onClick={() => onPreview(upload)}>
                Preview
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
} 