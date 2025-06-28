import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { AppSidebar } from "../app-sidebar"
import { SiteHeader } from "../site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  IconDownload, 
  IconEye, 
  IconTrash, 
  IconDotsVertical,
  IconSearch,
  IconFilter,
  IconPlus
} from "@tabler/icons-react"
import apiClient from "../../services/api"

export default function DataPage() {
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [fileTypeFilter, setFileTypeFilter] = useState("all")
  const [selectedUpload, setSelectedUpload] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)

  // Fetch uploads on component mount
  useEffect(() => {
    fetchUploads()
  }, [])

  const fetchUploads = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/dashboard/uploads')
      setUploads(response.data.uploads || [])
    } catch (error) {
      console.error('Failed to fetch uploads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = async (upload) => {
    try {
      setPreviewLoading(true)
      setSelectedUpload(upload)
      const response = await apiClient.get(`/dashboard/uploads/${upload.id}`)
      setPreviewData(response.data.data)
    } catch (error) {
      console.error('Failed to fetch upload data:', error)
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleDelete = async (uploadId) => {
    if (!confirm('Are you sure you want to delete this upload?')) return
    
    try {
      await apiClient.delete(`/dashboard/uploads/${uploadId}`)
      await fetchUploads() // Refresh the list
    } catch (error) {
      console.error('Failed to delete upload:', error)
    }
  }

  // Filter uploads based on search and filters
  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = upload.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         upload.originalFilename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || upload.status === statusFilter
    const matchesFileType = fileTypeFilter === "all" || upload.fileType === fileTypeFilter
    
    return matchesSearch && matchesStatus && matchesFileType
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const variants = {
      completed: "default",
      processing: "secondary",
      error: "destructive",
      uploaded: "outline"
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const getFileTypeBadge = (fileType) => {
    return <Badge variant="outline" className="text-xs">{fileType.toUpperCase()}</Badge>
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <SiteHeader />
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <SiteHeader />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
                  <p className="text-muted-foreground">
                    Manage and view all your uploaded Excel files
                  </p>
                </div>
                <Button>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Upload New File
                </Button>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search files..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="uploaded">Uploaded</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="xlsx">XLSX</SelectItem>
                        <SelectItem value="xls">XLS</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Data Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Files ({filteredUploads.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Rows</TableHead>
                          <TableHead>Columns</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Uploaded</TableHead>
                          <TableHead>Last Accessed</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUploads.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              {uploads.length === 0 ? "No files uploaded yet" : "No files match your filters"}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUploads.map((upload) => (
                            <TableRow key={upload.id}>
                              <TableCell className="font-medium">
                                <div>
                                  <div>{upload.filename}</div>
                                  {upload.originalFilename !== upload.filename && (
                                    <div className="text-xs text-muted-foreground">
                                      {upload.originalFilename}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{getFileTypeBadge(upload.fileType)}</TableCell>
                              <TableCell>{upload.rowCount.toLocaleString()}</TableCell>
                              <TableCell>{upload.columnCount}</TableCell>
                              <TableCell>{getStatusBadge(upload.status)}</TableCell>
                              <TableCell>{formatDate(upload.uploadDate)}</TableCell>
                              <TableCell>{formatDate(upload.lastAccessed)}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <IconDotsVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handlePreview(upload)}>
                                      <IconEye className="mr-2 h-4 w-4" />
                                      Preview
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <IconDownload className="mr-2 h-4 w-4" />
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleDelete(upload.id)}
                                      className="text-destructive"
                                    >
                                      <IconTrash className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Dialog */}
            <Dialog open={!!selectedUpload} onOpenChange={() => setSelectedUpload(null)}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Preview: {selectedUpload?.filename}</DialogTitle>
                  <DialogDescription>
                    {selectedUpload && `${selectedUpload.rowCount} rows × ${selectedUpload.columnCount} columns`}
                  </DialogDescription>
                </DialogHeader>
                <div className="overflow-auto max-h-[60vh]">
                  {previewLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : previewData ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {selectedUpload?.headers?.map((header) => (
                            <TableHead key={header}>{header}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.slice(0, 50).map((row, index) => (
                          <TableRow key={index}>
                            {selectedUpload?.headers?.map((header) => (
                              <TableCell key={header} className="max-w-[200px] truncate">
                                {row[header] !== null && row[header] !== undefined ? String(row[header]) : ''}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : null}
                  {previewData && previewData.length > 50 && (
                    <div className="text-xs text-muted-foreground mt-2 text-center">
                      Showing first 50 of {previewData.length} rows
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
} 