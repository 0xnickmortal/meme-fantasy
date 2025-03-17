"use client"

import { useState, useRef } from "react"
import Spline from "@splinetool/react-spline"
import { Button } from "@/components/ui/button"

interface SplineCardPackProps {
  splineUrl: string
  onClick: () => void
  isDisabled: boolean
  packType: "doge" | "popcat" | "pepe"
}

export function SplineCardPack({ splineUrl, onClick, isDisabled, packType }: SplineCardPackProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Get pack color based on type
  const getPackColor = () => {
    switch (packType) {
      case "doge":
        return "from-yellow-500/20 to-yellow-500/10"
      case "popcat":
        return "from-blue-500/20 to-blue-500/10"
      case "pepe":
        return "from-green-500/20 to-green-500/10"
      default:
        return "from-primary/20 to-primary/10"
    }
  }

  // Get button glow color based on type
  const getButtonGlow = () => {
    switch (packType) {
      case "doge":
        return "shadow-[0_0_10px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]"
      case "popcat":
        return "shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
      case "pepe":
        return "shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
      default:
        return "shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center h-full w-full transition-all duration-300 ${
        isHovered && !isDisabled ? "scale-105" : "scale-100"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      <div className={`w-full h-full ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}>
        <Spline scene={splineUrl} onLoad={() => setIsLoading(false)} />
      </div>

      <div
        className={`absolute bottom-0 mb-4 transition-all duration-300 ${
          isHovered ? "opacity-100 transform translate-y-0" : "opacity-80 transform translate-y-2"
        }`}
      >
        <div
          className={`bg-background/80 backdrop-blur-sm rounded-lg p-2 border border-${packType === "doge" ? "yellow" : packType === "popcat" ? "blue" : "green"}-500/30`}
        >
          <Button
            onClick={onClick}
            disabled={isDisabled}
            variant="default"
            size="default"
            className={`font-semibold transition-all duration-300 ${
              !isDisabled ? `${getButtonGlow()} hover:scale-105` : ""
            }`}
          >
            {isDisabled ? "Unavailable" : "Open Pack"}
          </Button>
        </div>
      </div>
    </div>
  )
}

