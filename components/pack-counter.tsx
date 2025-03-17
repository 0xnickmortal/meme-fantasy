"use client"

import { usePackOpportunity } from "@/lib/contexts/pack-opportunity-context"
import { Package, Clock } from "lucide-react"

export function PackCounter() {
  const { packOpportunities, formattedTimeUntilNextPack, isTimerActive } = usePackOpportunity()

  return (
    <div className="bg-card border rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center">
        <Package className="h-5 w-5 mr-2 text-primary" />
        <span className="font-medium">Pack Opportunities:</span>
        <span className="ml-2 font-bold text-primary">{packOpportunities}/5</span>
      </div>

      {isTimerActive && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>Next pack in: {formattedTimeUntilNextPack}</span>
        </div>
      )}

      {!isTimerActive && packOpportunities === 5 && (
        <div className="text-sm text-muted-foreground">Maximum opportunities reached</div>
      )}
    </div>
  )
}

