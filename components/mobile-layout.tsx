"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { usePackOpportunity } from "@/lib/contexts/pack-opportunity-context"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)
  const { isPackOpening } = usePackOpportunity()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} isPackOpening={isPackOpening} />
      <div className={`flex-1 ${isMobile ? "ml-0" : "ml-64"}`}>
        <div className="flex justify-between items-center p-4 border-b">
          {isMobile && (
            <Button onClick={toggleSidebar} size="icon" variant="outline">
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <div className={isMobile ? "ml-auto" : ""}>
            <WalletConnectButton />
          </div>
        </div>
        <main className="container mx-auto p-6">{children}</main>
      </div>
    </>
  )
}

