"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { CardRevealDialog } from "./card-reveal-dialog"
import { generateCardPack } from "@/lib/card-data"
import { motion } from "framer-motion"

interface PackOpeningProps {
  packType?: string | null
  onComplete?: () => void
}

export function PackOpening({ packType = "doge", onComplete }: PackOpeningProps) {
  const [rotation, setRotation] = useState(0)
  const [isOpening, setIsOpening] = useState(true)
  const [showRevealDialog, setShowRevealDialog] = useState(false)
  const [generatedCards, setGeneratedCards] = useState(generateCardPack(packType || "doge", 5))

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 10) % 360)
    }, 50)

    // 模拟开包过程
    const timer = setTimeout(() => {
      setIsOpening(false)
      // 直接显示卡牌展示弹窗
      setShowRevealDialog(true)
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  // 根据包类型选择不同的颜色
  const getPackColor = () => {
    switch (packType) {
      case "doge":
        return "text-yellow-500"
      case "popcat":
        return "text-blue-500"
      case "pepe":
        return "text-green-500"
      default:
        return "text-primary"
    }
  }

  const handleRevealComplete = () => {
    if (onComplete) {
      onComplete()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
      {isOpening && (
        <motion.div
          className="text-center space-y-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          <Sparkles className={`w-16 h-16 ${getPackColor()} mx-auto`} style={{ transform: `rotate(${rotation}deg)` }} />
          <p className="text-xl font-semibold animate-pulse">
            Opening {packType ? `${packType.toUpperCase()} Pack` : "Pack"}...
          </p>
        </motion.div>
      )}

      <CardRevealDialog
        cards={generatedCards}
        open={showRevealDialog}
        onOpenChange={setShowRevealDialog}
        onComplete={handleRevealComplete}
        autoStart={true}
      />
    </div>
  )
}
// 检查是否有任何地方调用了 usePackOpportunity

// 这个组件不应该直接调用 usePackOpportunity，而应该由父组件 GameDashboard 来管理
// 确认这个组件中没有调用 usePackOpportunity 的代码

