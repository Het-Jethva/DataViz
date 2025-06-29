import React, { useState, useEffect } from "react"
import { AppSidebar } from "./app-sidebar"
import { SiteHeader } from "./site-header"
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
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  MoreHorizontal,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Trash2,
  Edit,
  Copy,
  Calendar,
  FileText,
  Database,
  Users,
  TrendingUp,
  Filter,
  Plus,
  RefreshCw,
} from "lucide-react"
import apiClient, { deleteUserUpload } from "../services/api"

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedProject, setSelectedProject] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Fetch projects from database
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/dashboard/uploads')
      setProjects(response.data.uploads || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (projectId) => {
    console.log('Attempting to delete project with ID:', projectId)
    
    if (!projectId) {
      console.error('No project ID provided')
      alert('Error: No project ID found')
      return
    }
    
    try {
      // Use the existing deleteUserUpload function
      const response = await deleteUserUpload(projectId)
      console.log('Delete response:', response)
      
      if (response.data.success) {
        // Remove from local state
        setProjects(projects.filter(project => (project.id || project._id) !== projectId))
        setDeleteDialogOpen(false)
        setSelectedProject(null)
        
        console.log('Project deleted successfully')
        // You could add a toast notification here for success
      } else {
        console.error('Delete failed:', response.data.error)
        // You could add a toast notification here for error
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.error || 'Failed to delete project'
        console.error('Server error:', errorMessage)
        alert(`Delete failed: ${errorMessage}`)
      } else if (error.request) {
        // Network error
        console.error('Network error:', error.request)
        alert('Network error. Please check your connection.')
      } else {
        // Other error
        console.error('Error:', error.message)
        alert(`Error: ${error.message}`)
      }
    }
  }

  const handleVisualize = (project) => {
    // Navigate to visualization page with project data
    console.log('Visualize project:', project)
  }

  const handleDownload = (project) => {
    // Download project data
    console.log('Download project:', project)
  }

  const handleDuplicate = (project) => {
    // Duplicate project
    console.log('Duplicate project:', project)
  }

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
    const statusConfig = {
      active: { variant: "default", text: "Active" },
      archived: { variant: "secondary", text: "Archived" },
      processing: { variant: "outline", text: "Processing" },
      error: { variant: "destructive", text: "Error" }
    }
    
    const config = statusConfig[status] || statusConfig.active
    return <Badge variant={config.variant}>{config.text}</Badge>
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    processing: projects.filter(p => p.status === 'processing').length,
    archived: projects.filter(p => p.status === 'archived').length
  }

  return (
    <SidebarProvider>
      <div className="h-screen flex bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <SiteHeader />
          <main className="flex-1 p-6 overflow-hidden">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <p className="text-muted-foreground">
                      Manage your data visualization projects and uploaded files
                    </p>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Project
                  </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                          <p className="text-2xl font-bold">{stats.total}</p>
                        </div>
                        <Database className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Active</p>
                          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Processing</p>
                          <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
                        </div>
                        <RefreshCw className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Archived</p>
                          <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
                        </div>
                        <FileText className="h-8 w-8 text-gray-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={fetchProjects}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Projects Table */}
              <Card className="flex-1 flex flex-col min-h-0">
                <CardHeader>
                  <CardTitle>Uploaded Files & Projects</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 min-h-0">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Rows</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Uploaded</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProjects.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8">
                                <div className="flex flex-col items-center gap-2">
                                  <FileText className="h-12 w-12 text-muted-foreground" />
                                  <p className="text-muted-foreground">No projects found</p>
                                  <Button variant="outline" size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Upload your first file
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredProjects.map((project) => (
                              <TableRow key={project.id || project._id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium">{project.filename}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {project.description || "No description"}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {project.fileType || "Excel"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {project.fileSize ? `${(project.fileSize / 1024 / 1024).toFixed(2)} MB` : "N/A"}
                                </TableCell>
                                <TableCell>
                                  {project.rowCount || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(project.status || 'active')}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    {formatDate(project.uploadedAt || project.uploadDate || project.createdAt)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem onClick={() => handleVisualize(project)}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Data
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleVisualize(project)}>
                                        <BarChart3 className="h-4 w-4 mr-2" />
                                        Create Chart
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleVisualize(project)}>
                                        <PieChart className="h-4 w-4 mr-2" />
                                        Pie Chart
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleVisualize(project)}>
                                        <LineChart className="h-4 w-4 mr-2" />
                                        Line Chart
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => handleDownload(project)}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDuplicate(project)}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Duplicate
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        onClick={() => {
                                          console.log('Project to delete:', project)
                                          console.log('Project ID:', project.id || project._id)
                                          setSelectedProject(project)
                                          setDeleteDialogOpen(true)
                                        }}
                                        className="text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
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
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProject?.filename}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDeleteProject(selectedProject?.id || selectedProject?._id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
} 