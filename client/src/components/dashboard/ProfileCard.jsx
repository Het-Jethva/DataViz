import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Shield,
  Calendar,
  Clock,
  Upload,
  Crown,
  Star,
} from "lucide-react"

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

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Crown className="size-3" />
      case "moderator":
        return <Shield className="size-3" />
      case "premium":
        return <Star className="size-3" />
      default:
        return <User className="size-3" />
    }
  }

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="size-20 ring-4 ring-white dark:ring-slate-800 shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 size-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
              <div className="size-2 bg-white rounded-full" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {user?.name || "User"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 break-all max-w-[200px]">
              {user?.email || "user@example.com"}
            </p>
            {user?.role && (
              <Badge
                variant={getRoleBadgeVariant(user.role)}
                className="gap-1 font-medium"
              >
                {getRoleIcon(user.role)}
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator className="bg-slate-200 dark:bg-slate-700" />

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <User className="size-4" />
              </div>
              <span className="font-medium">Role</span>
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 capitalize">
              {user?.role || "User"}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <Calendar className="size-4" />
              </div>
              <span className="font-medium">Member since</span>
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {formatDate(user?.createdAt)}
            </span>
          </div>

          {user?.lastLogin && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Clock className="size-4" />
                </div>
                <span className="font-medium">Last active</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {formatDate(user.lastLogin)}
              </span>
            </div>
          )}

          {user?.uploadsCount !== undefined && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Upload className="size-4" />
                </div>
                <span className="font-medium">Total uploads</span>
              </div>
              <Badge
                variant="secondary"
                className="font-semibold"
              >
                {user.uploadsCount}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileCard
