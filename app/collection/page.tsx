"use client"

import { useState, useEffect } from "react"
import { MemeCard } from "@/components/meme-card"
import { CardRarity } from "@/lib/enums"
import { Button } from "@/components/ui/button"
import { Trash2, Check, X, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCollection } from "@/lib/contexts/collection-context"

type MemeCardType = {
  id: number
  name: string
  rarity: CardRarity
  power: number
  image: string
  socialScore: number
  isNFT: boolean
}

export default function CollectionPage() {
  const { cards: collectionCards, removeCards } = useCollection()
  const [myCards, setMyCards] = useState<MemeCardType[]>([])
  const [memeDust, setMemeDust] = useState(250)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [disenchantResult, setDisenchantResult] = useState<{ dust: number; cards: number } | null>(null)

  // 将 CollectionContext 中的卡片转换为组件需要的格式
  useEffect(() => {
    if (collectionCards && collectionCards.length > 0) {
      const formattedCards = collectionCards.map((card) => ({
        id: card.id,
        name: card.name,
        rarity: card.rarity,
        power: card.power,
        image: card.image,
        socialScore: card.socialScore,
        isNFT: card.isNFT,
      }))

      setMyCards(formattedCards)
    } else {
      setMyCards([])
    }
  }, [collectionCards])

  const toggleSelectMode = () => {
    setSelectMode(!selectMode)
    setSelectedCards([])
  }

  const toggleCardSelection = (cardId: number) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId))
    } else {
      setSelectedCards([...selectedCards, cardId])
    }
  }

  const handleConfirmClick = () => {
    if (selectedCards.length > 0) {
      setShowConfirmDialog(true)
    }
  }

  const handleDisenchant = () => {
    // Calculate dust based on card rarity
    const dustValues: Record<CardRarity, number> = {
      [CardRarity.Common]: 5,
      [CardRarity.Uncommon]: 20,
      [CardRarity.Rare]: 100,
      [CardRarity.Legendary]: 400,
      [CardRarity.UltraRare]: 800,
      [CardRarity.SuperRare]: 1600,
    }

    const selectedCardObjects = myCards.filter((card) => selectedCards.includes(card.id))
    const totalDust = selectedCardObjects.reduce((sum, card) => sum + dustValues[card.rarity], 0)

    // Set the result
    setDisenchantResult({
      dust: totalDust,
      cards: selectedCards.length,
    })

    // Update dust balance
    setMemeDust(memeDust + totalDust)

    // 从 CollectionContext 中移除卡片
    removeCards(selectedCards)

    // Reset selection
    setSelectedCards([])
    setSelectMode(false)
  }

  const closeDialog = () => {
    setShowConfirmDialog(false)
    setDisenchantResult(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Collection</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-card px-4 py-2 rounded-lg border">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="font-medium">{memeDust} Meme Dust</span>
          </div>
          <Button
            variant={selectMode ? "default" : "outline"}
            onClick={selectMode ? handleConfirmClick : toggleSelectMode}
            className={selectMode && selectedCards.length > 0 ? "bg-primary" : ""}
          >
            {selectMode ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Confirm ({selectedCards.length})
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Disenchant
              </>
            )}
          </Button>
        </div>
      </div>

      {myCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg border">
          <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Your collection is empty</h2>
          <p className="text-muted-foreground text-center">Open card packs to add cards to your collection</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myCards.map((card) => (
            <div
              key={card.id}
              className={`group transition-transform duration-300 ease-in-out hover:scale-[1.02] ${
                selectMode ? "cursor-pointer" : ""
              } ${selectedCards.includes(card.id) ? "ring-4 ring-primary rounded-lg" : ""}`}
              onClick={() => selectMode && toggleCardSelection(card.id)}
            >
              <MemeCard card={card} />
            </div>
          ))}
        </div>
      )}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{disenchantResult ? "Disenchant Complete" : "Confirm Disenchant"}</DialogTitle>
          </DialogHeader>

          {disenchantResult ? (
            <div className="py-4 text-center">
              <div className="text-lg mb-2">You received:</div>
              <div className="text-2xl font-bold text-primary">{disenchantResult.dust} Meme Dust</div>
              <div className="text-sm text-muted-foreground mt-2">
                Disenchanted {disenchantResult.cards} card{disenchantResult.cards !== 1 ? "s" : ""}
              </div>
              <div className="mt-4 text-sm">
                New balance: <span className="font-medium">{memeDust} Meme Dust</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                Are you sure you want to disenchant {selectedCards.length} selected card
                {selectedCards.length !== 1 ? "s" : ""}?
              </div>
              <div className="text-sm text-muted-foreground">This action cannot be undone.</div>
            </div>
          )}

          <DialogFooter>
            {disenchantResult ? (
              <Button onClick={closeDialog} className="w-full">
                Close
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={closeDialog} className="w-full sm:w-auto">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleDisenchant} variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Disenchant
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

