"use client"

import { usePackOpportunity } from "@/lib/contexts/pack-opportunity-context"

export function PackOpeningOverlay() {
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

