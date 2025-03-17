import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Sparkles } from "lucide-react"
import { type CardRarity, rarityColors } from "@/lib/enums"

interface MemeCardProps {
  card: {
    id: number
    name: string
    rarity: CardRarity
    power: number
    image: string
    socialScore: number
    isNFT: boolean
  }
}

export function MemeCard({ card }: MemeCardProps) {
  const getRarityColor = (rarity: CardRarity): string => {
    return rarityColors[rarity] || "bg-gray-500" // Default to gray if rarity not found
  }

  return (
    <div className="relative pt-8 px-4 group">
      <div className="absolute top-0 left-4 z-10">
        <Badge variant="secondary" className={`${getRarityColor(card.rarity)} text-white`}>
          {card.rarity}
        </Badge>
      </div>
      {card.isNFT && (
        <div className="absolute top-0 right-4 z-10">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            <Sparkles className="w-3 h-3 mr-1" />
            NFT
          </Badge>
        </div>
      )}
      <Card className="card-shine relative overflow-hidden">
        <div className="relative aspect-[1/1.4] overflow-hidden rounded-lg">
          <div className="absolute inset-0">
            <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-contain" priority />
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-bold">{card.name}</h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{card.power}</span>
            </div>
            <div className="text-sm text-muted-foreground">Social Score: {card.socialScore}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

