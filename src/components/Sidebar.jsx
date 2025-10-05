"use client"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, BookOpen, Calendar, DollarSign, BarChart3, Bell, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Students",
      icon: Users,
      path: "/students",
    },
    {
      title: "Grades",
      icon: BookOpen,
      path: "/grades",
    },
    {
      title: "Attendance",
      icon: Calendar,
      path: "/attendance",
    },
    {
      title: "Fees",
      icon: DollarSign,
      path: "/fees",
    },
    {
      title: "Reports",
      icon: BarChart3,
      path: "/reports",
    },
    {
      title: "Notifications",
      icon: Bell,
      path: "/notifications",
    },
  ]

  const bottomMenuItems = [
    {
      title: "Help",
      icon: HelpCircle,
      path: "/help",
    },
  ]

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="lg:hidden flex justify-end p-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <div className="mb-4">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Main Menu</p>
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Icon className={cn("h-5 w-5", active ? "text-white" : "text-gray-500")} />
                  {item.title}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Navigation */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-1">
            <div className="mb-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</p>
            </div>
            {bottomMenuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Icon className={cn("h-5 w-5", active ? "text-white" : "text-gray-500")} />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
