"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/toaster"
import { PackOpportunityProvider } from "@/lib/contexts/pack-opportunity-context"
import { CollectionProvider } from "@/lib/contexts/collection-context"
import { usePackOpportunity } from "@/lib/contexts/pack-opportunity-context"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PackOpportunityProvider>
      <CollectionProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
        <Toaster />
        <PackOpeningOverlay />
      </CollectionProvider>
    </PackOpportunityProvider>
  )
}

function PackOpeningOverlay() {
  const { isPackOpening } = usePackOpportunity()

  if (!isPackOpening) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 pointer-events-auto" onClick={(e) => e.preventDefault()}>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-md">
        <p className="text-center font-medium">Pack opening in progress... Please wait</p>
      </div>
    </div>
  )
}

