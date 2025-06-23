import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Calendar, Clock, Upload } from "lucide-react"

const ProfileCard = ({ user }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "N/A"
    }
  }

  const getInitials = (name) => {
    if (!name) return "U"
    const names = name.trim().split(" ")
    if (names.length >= 2) {
      return (
        names[0].charAt(0) + names[names.length - 1].charAt(0)
      ).toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  const getRoleBadgeVariant = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "destructive"
      case "moderator":
        return "secondary"
      case "premium":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader className="text-center pb-4">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <CardTitle className="text-xl">{user?.name || "User"}</CardTitle>
            <p className="text-sm text-muted-foreground break-all">
              {user?.email || "user@example.com"}
            </p>
            {user?.role && (
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Role</span>
          </div>
          <span className="text-sm font-medium capitalize">
            {user?.role || "User"}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Member since</span>
          </div>
          <span className="text-sm font-medium">
            {formatDate(user?.createdAt)}
          </span>
        </div>

        {user?.lastLogin && (
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last active</span>
            </div>
            <span className="text-sm font-medium">
              {formatDate(user.lastLogin)}
            </span>
          </div>
        )}

        {user?.uploadsCount !== undefined && (
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload className="h-4 w-4" />
              <span>Total uploads</span>
            </div>
            <span className="text-sm font-medium">{user.uploadsCount}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ProfileCard
