import { Palette, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { useColorTheme } from "@/components/theme-context"

const colorThemes = [
  {
    id: "default",
    name: "Excel Green",
    gradient: "bg-gradient-to-br from-[#39D08A] to-[#179651] dark:from-[#176943] dark:to-[#137144]"
  },
  {
    id: "green-teal",
    name: "Ocean Drive",
    gradient: "bg-gradient-to-br from-[#3B82F6] to-[#14B8A6]"
  },
  {
    id: "purple-blue",
    name: "Royal Twilight",
    gradient: "bg-gradient-to-br from-purple-400 to-blue-400"
  },
  {
    id: "red-orange",
    name: "Sunset Blaze",
    gradient: "bg-gradient-to-br from-red-400 to-orange-400"
  },
]

export function ThemeSelector() {
  const { setTheme } = useTheme()
  const { colorTheme, setColorTheme } = useColorTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
        >
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium">Appearance</div>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-sm font-medium">Color Themes</div>
        {colorThemes.map((theme) => (
          <DropdownMenuItem 
            key={theme.id}
            onClick={() => setColorTheme(theme.id)}
            className={colorTheme === theme.id ? "bg-accent" : ""}
          >
            <span className={`inline-block w-6 h-6 rounded mr-3 border border-border align-middle ${theme.gradient}`}></span>
            {theme.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 