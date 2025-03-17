"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MemeCard } from "@/components/meme-card"
import type { CardData } from "@/lib/card-data"
import { useCollection } from "@/lib/contexts/collection-context"
import { motion, AnimatePresence } from "framer-motion"

interface CardRevealDialogProps {
  cards: CardData[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
  autoStart?: boolean
}

export function CardRevealDialog({ cards, open, onOpenChange, onComplete, autoStart = false }: CardRevealDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [revealComplete, setRevealComplete] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const { addCards } = useCollection()
  const [cardsAdded, setCardsAdded] = useState(false)

  // 重置状态
  useEffect(() => {
    if (open) {
      setCurrentIndex(-1)
      setRevealComplete(false)
      setIsRevealing(false)
      setCardsAdded(false)

      // 如果设置了自动开始，则在对话框打开后自动开始展示
      if (autoStart) {
        const timer = setTimeout(() => {
          startReveal()
        }, 500) // 短暂延迟，让对话框动画完成
        return () => clearTimeout(timer)
      }
    }
  }, [open, autoStart])

  // 开始展示卡牌
  const startReveal = () => {
    setIsRevealing(true)
    setCurrentIndex(0)
  }

  // 展示下一张卡牌
  const revealNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setRevealComplete(true)
      // 将卡牌添加到收藏（如果尚未添加）
      if (!cardsAdded && cards && cards.length > 0) {
        addCards(cards)
        setCardsAdded(true)
      }
    }
  }

  // 添加一个新的handleSkip函数
  const handleSkip = () => {
    // 直接跳到完成状态
    setRevealComplete(true)
    // 确保卡片已添加到收藏
    if (!cardsAdded && cards && cards.length > 0) {
      addCards(cards)
      setCardsAdded(true)
    }
  }

  // 完成展示
  const handleComplete = () => {
    // 确保卡片已添加到收藏
    if (!cardsAdded && cards && cards.length > 0) {
      addCards(cards)
      setCardsAdded(true)
    }
    onOpenChange(false)
    onComplete()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // 如果对话框关闭，确保卡片已添加到收藏
        if (!isOpen && !cardsAdded && revealComplete && cards && cards.length > 0) {
          addCards(cards)
        }
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {!isRevealing
              ? "Your New Cards Await!"
              : !revealComplete
                ? `Revealing Card ${currentIndex + 1} of ${cards.length}`
                : "All Cards Revealed!"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {!isRevealing ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative w-32 h-40 bg-card rounded-lg flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
                    >
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        <Button onClick={startReveal} size="lg" className="px-8">
                          Reveal Cards
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          ) : !revealComplete ? (
            <div className="flex flex-col items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  {currentIndex >= 0 && currentIndex < cards.length && <MemeCard card={cards[currentIndex]} />}
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-4 mt-4">
                <Button onClick={revealNext} size="lg" className="px-8">
                  {currentIndex < cards.length - 1 ? "Reveal Next Card" : "Complete"}
                </Button>
                <Button onClick={handleSkip} variant="outline" size="lg" className="px-8">
                  Skip
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {cards.map((card) => (
                  <div key={card.id} className="transform transition-all hover:scale-105">
                    <MemeCard card={card} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {revealComplete && (
            <Button onClick={handleComplete} className="w-full">
              Add to Collection
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

