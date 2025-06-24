import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, ChevronDown, Settings, User } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { getInitials } from "@/lib/utils"
import { Link } from "react-router-dom"

const DashboardHeader = ({ user, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary">
              <span className="text-primary-foreground font-bold text-lg">DV</span>
            </div>
            <span className="text-xl font-bold text-foreground">DataViz</span>
          </div>
          {/* Theme Toggle and User Menu */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 gap-3 px-3 rounded-xl">
                  <Avatar className="size-8">
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block font-semibold text-foreground">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown className="size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" className="text-sm font-medium hover:underline">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="size-4 mr-2" />Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="size-4 mr-2" />Sign out
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
