import { useEffect, useState, useCallback } from "react"
import apiClient from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { fetchUserUploads } from "@/services/api"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", email: "" })
  const [saving, setSaving] = useState(false)
  const [passwords, setPasswords] = useState({ current: "", new: "" })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [uploadCount, setUploadCount] = useState(0)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await apiClient.get("/auth/profile", { withCredentials: true })
      setUser(res.data.data)
      setForm({ name: res.data.data.name, email: res.data.data.email })
    } catch (err) {
      setError("Failed to load profile.")
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  const fetchUploads = useCallback(async () => {
    try {
      const res = await fetchUserUploads()
      setUploadCount(res.data.uploads.length)
    } catch (err) {
      setUploadCount(0)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
    fetchUploads()
  }, [fetchProfile, fetchUploads])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiClient.put("/auth/profile", form, { withCredentials: true })
      toast.success("Profile updated!")
    } catch (err) {
      toast.error("Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordSaving(true)
    try {
      await apiClient.put(
        "/auth/change-password",
        { currentPassword: passwords.current, newPassword: passwords.new },
        { withCredentials: true }
      )
      toast.success("Password changed!")
      setPasswords({ current: "", new: "" })
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to change password."
      )
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Profile summary */}
        <div className="md:col-span-1 flex flex-col items-center bg-muted/50 rounded-xl p-6 h-fit">
          <Avatar className="size-24 mb-4">
            <AvatarFallback className="text-3xl">
              {user?.name?.split(" ").map(n => n[0]).join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-xl font-bold mb-1">{user?.name || "Profile"}</div>
          <div className="text-muted-foreground mb-2">{user?.email}</div>
          <div className="text-sm text-muted-foreground mb-2">Total Uploads: {uploadCount}</div>
        </div>
        {/* Right: Forms */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Name</label>
                  <Input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <Input name="email" value={form.email} onChange={handleChange} required type="email" readOnly />
                </div>
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Current Password</label>
                  <Input name="current" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} type="password" required minLength={6} />
                </div>
                <div>
                  <label className="block mb-1 font-medium">New Password</label>
                  <Input name="new" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} type="password" required minLength={6} />
                </div>
                <Button type="submit" disabled={passwordSaving}>{passwordSaving ? "Saving..." : "Change Password"}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile 