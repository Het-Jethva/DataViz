import * as React from "react"
import {
  PieChart,
  Folder,
  Users,
  LifeBuoy,
  Settings2,
  Search,
  UserCircle,
  LayoutDashboard,
  MessageCircle,
  LogOut,
  Bell,
  CreditCard,
  User as UserIcon,
  ArrowUpRight,
  Palette,
  BarChart3,
  LineChart,
  ScatterChart,
  AreaChart,
  Plus,
  Sparkles,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "../redux/slices/authSlice"
import { useTheme } from "./theme-provider"
import { useColorTheme } from "./theme-context"
import { DataVizLogo } from "./Logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const navMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: PieChart,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Folder,
  },
  {
    title: "Team",
    url: "/team",
    icon: Users,
  },
  {
    title: "Ask Vizard",
    url: "/chat",
    icon: MessageCircle,
  },
]

const quickCreateOptions = [
  {
    title: "Bar Chart",
    icon: BarChart3,
    description: "Create vertical or horizontal bar charts",
    badge: "Popular",
    features: ["Compare categories", "Show trends", "Easy to read"]
  },
  {
    title: "Pie Chart",
    icon: PieChart,
    description: "Show data as proportions of a whole",
    badge: "Simple",
    features: ["Show percentages", "Part-to-whole", "Clean design"]
  },
  {
    title: "Line Chart",
    icon: LineChart,
    description: "Display trends over time",
    badge: "Trends",
    features: ["Time series data", "Show patterns", "Multiple lines"]
  },
  {
    title: "Scatter Plot",
    icon: ScatterChart,
    description: "Show correlation between variables",
    badge: "Analysis",
    features: ["Correlation analysis", "Outlier detection", "Data clusters"]
  },
  {
    title: "Area Chart",
    icon: AreaChart,
    description: "Display cumulative data over time",
    badge: "Cumulative",
    features: ["Stacked data", "Volume visualization", "Trend analysis"]
  },
]

const navSecondary = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings2,
  },
  {
    title: "Get Help",
    url: "/help",
    icon: LifeBuoy,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
]

function getInitials(name) {
  if (!name) return "U"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const colorThemeGradients = {
  default: "bg-gradient-to-br from-[#39D08A] to-[#179651] dark:from-[#176943] dark:to-[#137144]",
  "green-teal": "bg-gradient-to-br from-[#3B82F6] to-[#14B8A6]",
  "purple-blue": "bg-gradient-to-br from-purple-400 to-blue-400",
  "red-orange": "bg-gradient-to-br from-red-400 to-orange-400",
}

const colorThemeNames = {
  default: "Excel Green",
  "green-teal": "Ocean Drive", 
  "purple-blue": "Royal Twilight",
  "red-orange": "Sunset Blaze",
}

export function AppSidebar(props) {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { theme, setTheme } = useTheme()
  const { colorTheme } = useColorTheme()
  const [quickCreateOpen, setQuickCreateOpen] = React.useState(false)
  
  // Get user data from Redux
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  
  const isActive = (url) => location.pathname === url

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser())
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      // Still navigate to login even if logout fails
      navigate("/login")
    }
  }

  const handleQuickCreate = (chartType) => {
    setQuickCreateOpen(false)
    // Navigate to chart creation page with the selected chart type
    navigate(`/dashboard?chart=${chartType.toLowerCase().replace(' ', '-')}`)
  }

  const avatarGradient = colorThemeGradients[colorTheme] || colorThemeGradients.default
  const themeName = colorThemeNames[colorTheme] || "Default"

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild onClick={() => navigate("/")}
              className="cursor-pointer">
              <div className="flex items-center w-full">
                <DataVizLogo className="h-8 w-auto" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Quick Create Button - First and Different Style */}
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <Dialog open={quickCreateOpen} onOpenChange={setQuickCreateOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  className={`${
                    theme === 'dark' 
                      ? 'bg-white text-black hover:bg-gray-100' 
                      : 'bg-black text-white hover:bg-gray-800'
                  } font-semibold shadow-lg hover:shadow-xl transition-all duration-200`}
                >
                  <Plus className="h-4 w-4" />
                  <span>Quick Create</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Create Charts
                  </DialogTitle>
                  <DialogDescription>
                    Choose a chart type to start visualizing your data. Each option is optimized for specific data types and use cases.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {quickCreateOptions.map((option) => (
                    <Card 
                      key={option.title}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-foreground/20 bg-card"
                      onClick={() => handleQuickCreate(option.title)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-lg bg-muted border border-border">
                            <option.icon className="h-5 w-5 text-foreground" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {option.badge}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{option.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {option.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {option.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1 h-1 bg-foreground rounded-full"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu className="mt-4">
          {navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className={isActive(item.url) ? "bg-muted dark:bg-neutral-800 text-black dark:text-white font-semibold" : "hover:bg-muted dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-100"}
                onClick={() => navigate(item.url)}
                asChild={false}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarMenu className="mt-6">
          {navSecondary.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                size="sm"
                className={isActive(item.url) ? "bg-muted dark:bg-neutral-800 text-black dark:text-white font-semibold" : "hover:bg-muted dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-100"}
                onClick={() => navigate(item.url)}
                asChild={false}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 px-4 py-3 border-t cursor-pointer select-none">
              {user && user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <div className={`size-8 rounded-full flex items-center justify-center font-medium text-base text-white ${avatarGradient}`}>
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium text-sm">{user?.name || "User"}</div>
                <div className="truncate text-xs text-muted-foreground">{user?.email || "user@example.com"}</div>
              </div>
              <span className="ml-2 text-muted-foreground">▾</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end">
            <DropdownMenuLabel className="flex items-center gap-3">
              {user && user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <div className={`size-8 rounded-full flex items-center justify-center font-medium text-base text-white ${avatarGradient}`}>
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium text-sm">{user?.name || "User"}</div>
                <div className="truncate text-xs text-muted-foreground">{user?.email || "user@example.com"}</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Theme Information */}
            <DropdownMenuItem className="flex items-center justify-between">
              <div className="flex items-center">
                <Palette className="mr-2 h-4 w-4" />
                <span>Theme</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${avatarGradient}`}></div>
                <span className="text-xs text-muted-foreground">{themeName}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center justify-between">
              <span>Mode</span>
              <span className="text-xs text-muted-foreground capitalize">{theme}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/profile")}> 
              <UserIcon className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
