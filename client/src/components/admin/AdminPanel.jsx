import { useEffect, useState, useCallback } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  fetchAdminStats,
  fetchAdminUsers,
  updateAdminUser,
  deleteAdminUser,
} from "@/services/api"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"
import { Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { format } from "date-fns"

const PAGE_SIZE = 10

const AdminPanel = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [editUser, setEditUser] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [viewUser, setViewUser] = useState(null)

  // Restrict access to admins only
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    } else if (user && user.role !== "admin") {
      navigate("/dashboard")
    }
  }, [isAuthenticated, user, navigate])

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetchAdminStats()
      setStats(res.data.data)
    } catch (err) {
      setStats(null)
    }
  }, [])

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetchAdminUsers({ page, limit: PAGE_SIZE, search })
      setUsers(res.data.data.users || res.data.data)
      setTotal(res.data.data.total || 0)
    } catch (err) {
      setError("Failed to load users.")
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchStats()
    fetchUsers()
  }, [fetchStats, fetchUsers])

  // Edit user handlers
  const handleEdit = (user) => setEditUser(user)
  const handleEditChange = (field, value) => setEditUser((u) => ({ ...u, [field]: value }))
  const handleEditSave = async () => {
    setEditLoading(true)
    try {
      await updateAdminUser(editUser._id, {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
        isActive: editUser.isActive,
      })
      setEditUser(null)
      fetchUsers()
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update user.")
    } finally {
      setEditLoading(false)
    }
  }

  // Delete user handlers
  const handleDelete = (id) => setDeleteUserId(id)
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true)
    try {
      await deleteAdminUser(deleteUserId)
      setDeleteUserId(null)
      fetchUsers()
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete user.")
    } finally {
      setDeleteLoading(false)
    }
  }

  // Pagination
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Manage users and view platform statistics</CardDescription>
          </CardHeader>
          <CardContent>
            {!stats ? (
              <div className="flex gap-6">
                <Skeleton className="h-20 w-40" />
                <Skeleton className="h-20 w-40" />
                <Skeleton className="h-20 w-40" />
                <Skeleton className="h-20 w-40" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Total Users</CardTitle>
                    <CardDescription className="text-2xl font-bold">{stats.stats.totalUsers}</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Active Users</CardTitle>
                    <CardDescription className="text-2xl font-bold">{stats.stats.activeUsers}</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Inactive Users</CardTitle>
                    <CardDescription className="text-2xl font-bold">{stats.stats.inactiveUsers}</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Admins</CardTitle>
                    <CardDescription className="text-2xl font-bold">{stats.stats.adminUsers}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            )}
            {stats && stats.recentUsers && (
              <div className="mt-8">
                <CardTitle className="text-base mb-2">Recent Users</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {stats.recentUsers.map((u) => (
                    <Badge key={u._id || u.email} variant="secondary">{u.name} ({u.email})</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Search, view, edit, or delete users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="max-w-xs"
              />
            </div>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="overflow-x-auto rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Joined</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Uploads</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 9 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">No users found.</TableCell>
                    </TableRow>
                  ) : (
                    users.map((u) => (
                      <TableRow key={u._id}>
                        <TableCell className="font-mono text-xs">{u._id}</TableCell>
                        <TableCell>
                          <Button variant="link" size="sm" className="px-0" onClick={() => setViewUser(u)}>{u.name}</Button>
                        </TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={u.isActive ? "default" : "destructive"}>{u.isActive ? "Active" : "Inactive"}</Badge>
                        </TableCell>
                        <TableCell>{u.createdAt ? format(new Date(u.createdAt), "yyyy-MM-dd") : "-"}</TableCell>
                        <TableCell>{u.lastLogin ? format(new Date(u.lastLogin), "yyyy-MM-dd HH:mm") : "-"}</TableCell>
                        <TableCell>{Array.isArray(u.uploadHistory) ? u.uploadHistory.length : 0}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(u)} className="mr-2"><Edit className="w-4 h-4" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this user? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(u._id)} disabled={deleteLoading}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Button size="sm" variant="secondary" onClick={() => setViewUser(u)} className="ml-2">View</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <Button
                        size="sm"
                        variant={page === i + 1 ? "default" : "outline"}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        {/* View User Dialog */}
        {viewUser && (
          <Dialog open={!!viewUser} onOpenChange={(open) => !open && setViewUser(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>Full information for this user</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <div><strong>User ID:</strong> <span className="font-mono text-xs">{viewUser._id}</span></div>
                <div><strong>Name:</strong> {viewUser.name}</div>
                <div><strong>Email:</strong> {viewUser.email}</div>
                <div><strong>Role:</strong> {viewUser.role}</div>
                <div><strong>Status:</strong> {viewUser.isActive ? "Active" : "Inactive"}</div>
                <div><strong>Date Joined:</strong> {viewUser.createdAt ? format(new Date(viewUser.createdAt), "yyyy-MM-dd HH:mm") : "-"}</div>
                <div><strong>Last Login:</strong> {viewUser.lastLogin ? format(new Date(viewUser.lastLogin), "yyyy-MM-dd HH:mm") : "-"}</div>
                <div><strong>Uploads:</strong> {Array.isArray(viewUser.uploadHistory) ? viewUser.uploadHistory.length : 0}</div>
                {Array.isArray(viewUser.uploadHistory) && viewUser.uploadHistory.length > 0 && (
                  <div className="mt-4">
                    <strong>Upload History:</strong>
                    <div className="overflow-x-auto mt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Charts</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {viewUser.uploadHistory.map((up, i) => (
                            <TableRow key={i}>
                              <TableCell>{up.fileName || "-"}</TableCell>
                              <TableCell>{up.uploadDate ? format(new Date(up.uploadDate), "yyyy-MM-dd HH:mm") : "-"}</TableCell>
                              <TableCell>{up.fileSize ? `${(up.fileSize / 1024).toFixed(1)} KB` : "-"}</TableCell>
                              <TableCell>{up.chartCount || 0}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit User Dialog */}
        {editUser && (
          <AlertDialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Edit User</AlertDialogTitle>
                <AlertDialogDescription>Update user role and status</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Name</label>
                  <Input value={editUser.name} onChange={e => handleEditChange("name", e.target.value)} disabled />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <Input value={editUser.email} onChange={e => handleEditChange("email", e.target.value)} disabled />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Role</label>
                  <Select value={editUser.role} onValueChange={val => handleEditChange("role", val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Status</label>
                  <Select value={editUser.isActive ? "active" : "inactive"} onValueChange={val => handleEditChange("isActive", val === "active")}> 
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={editLoading}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleEditSave} disabled={editLoading}>
                  {editLoading ? "Saving..." : "Save Changes"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Delete User Confirm Dialog */}
        {deleteUserId && (
          <AlertDialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this user? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteLoading}>
                  {deleteLoading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}

export default AdminPanel 