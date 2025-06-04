"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Layout, Bell, User, LogIn, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/dashboard/themeToggle"
import { signOut, useSession } from "next-auth/react"

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Builder", href: "/builder" },
  { name: "Projects", href: "/projects" },
]

export default function DashboardHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <Layout className="h-6 w-6" />
          <span className="font-bold">Builzee</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground" : "text-foreground/60",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/notify">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </Link>
          {user ? (
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User profile</span>
              </Button>
            </Link>
          ) : null}
          {user ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                signOut()
              }}
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <LogIn className="h-5 w-5" />
                <span className="sr-only">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
