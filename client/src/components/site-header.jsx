
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <SidebarTrigger className="mr-4" />
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
      </div>
    </header>
  )
}
