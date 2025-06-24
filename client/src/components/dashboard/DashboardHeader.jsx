import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, BarChart3, ChevronDown, Settings, User } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

const DashboardHeader = ({ user, onLogout }) => {
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

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
              <BarChart3 className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                DataViz
              </h1>
            </div>
          </div>

          {/* Theme Toggle and User Menu */}
          <div className="flex items-center gap-3">
            <ModeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 gap-3 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  <Avatar className="size-8 ring-2 ring-white dark:ring-slate-700 shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {user?.name || "User"}
                    </p>
                  </div>
                  <ChevronDown className="size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm"
                align="end"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                <DropdownMenuItem className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <User className="size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Settings className="size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
