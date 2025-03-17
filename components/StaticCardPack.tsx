"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"

interface StaticCardPackProps {
  onClick: () => void
  isDisabled: boolean
  packType: "doge" | "popcat" | "pepe"
}

export function StaticCardPack({ onClick, isDisabled, packType }: StaticCardPackProps) {
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Pack images for each type
  const packImages = {
    doge: "/assets/packs/doge_pack.png",
    popcat: "/assets/packs/popcat_pack.png",
    pepe: "/assets/packs/pepe_pack.png",
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

  // Get border color based on type
  const getBorderColor = () => {
    switch (packType) {
      case "doge":
        return "border-yellow-500/30"
      case "popcat":
        return "border-blue-500/30"
      case "pepe":
        return "border-green-500/30"
      default:
        return "border-primary/30"
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center h-full w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="w-64 h-64 relative"
        animate={{
          scale: isHovered && !isDisabled ? 1.05 : 1,
          rotateY: isHovered ? [0, 5, 0, -5, 0] : 0,
        }}
        transition={{
          scale: { duration: 0.3 },
          rotateY: { repeat: isHovered ? Number.POSITIVE_INFINITY : 0, duration: 2 },
        }}
      >
        <Image
          src={packImages[packType] || "/placeholder.svg"}
          alt={`${packType} pack`}
          fill
          className="object-contain drop-shadow-lg"
          priority
        />
      </motion.div>

      <motion.div
        className="absolute bottom-0 mb-4"
        animate={{
          y: isHovered ? 0 : 8,
          opacity: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className={`bg-background/80 backdrop-blur-sm rounded-lg p-2 border ${getBorderColor()}`}>
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
      </motion.div>
    </div>
  )
}

