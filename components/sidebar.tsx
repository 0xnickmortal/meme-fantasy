"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, ShoppingCart, Trophy, Compass, BarChart2, Album, Store, X } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  onClose?: () => void
  isPackOpening?: boolean
}

export function Sidebar({ className, isOpen = false, onClose, isPackOpening = false, ...props }: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useMobile()

  const links = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "My Collection",
      href: "/collection",
      icon: Album,
    },
    {
      name: "Card Shop",
      href: "/shop",
      icon: ShoppingCart,
    },
    {
      name: "Tournaments",
      href: "/tournaments",
      icon: Trophy,
    },
    {
      name: "Marketplace",
      href: "/marketplace",
      icon: Store,
    },
    {
      name: "Discover",
      href: "/discover",
      icon: Compass,
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: BarChart2,
    },
  ]

  if (isMobile) {
    return (
      <aside
        className={cn(
          "w-64 border-r bg-card fixed top-0 left-0 h-screen overflow-y-auto z-40 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
        {...props}
      >
        <div className="sticky top-0 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                meme.fantasy
              </span>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-accent">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (isPackOpening) {
                    e.preventDefault()
                  } else if (onClose) {
                    onClose()
                  }
                }}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground",
                  pathname === link.href ? "bg-muted font-medium text-primary" : "text-muted-foreground",
                  isPackOpening && "opacity-50 cursor-not-allowed",
                )}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 border-r bg-card fixed top-0 left-0 h-screen overflow-y-auto z-40">
      <div className="sticky top-0 p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            meme.fantasy
          </span>
        </div>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => {
                if (isPackOpening) {
                  e.preventDefault()
                }
              }}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground",
                pathname === link.href ? "bg-muted font-medium text-primary" : "text-muted-foreground",
                isPackOpening && "opacity-50 cursor-not-allowed",
              )}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

