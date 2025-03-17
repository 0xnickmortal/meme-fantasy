"use client"

import { useCollection } from "@/lib/contexts/collection-context"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function CollectionDebug() {
  const { cards, removeCards } = useCollection()
  const [count, setCount] = useState(0)

  const handleClearCollection = () => {
    // 清空收藏 - 使用更安全的方式
    const cardIds = cards.map((card) => card.id)
    if (cardIds.length > 0) {
      removeCards(cardIds)
      setCount((prev) => prev + 1) // 触发重新渲染
    }
  }

  const handleLogCollection = () => {
    console.log("Current collection:", cards)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card p-2 rounded-lg border shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="text-xs">Cards in collection: {cards.length}</div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleLogCollection}>
            Log
          </Button>
          <Button size="sm" variant="destructive" onClick={handleClearCollection}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}

