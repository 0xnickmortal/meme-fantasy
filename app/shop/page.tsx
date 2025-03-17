"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sparkles, Info, Wallet } from "lucide-react"
import { CardRevealDialog } from "@/components/card-reveal-dialog"
import { generateCardPack } from "@/lib/card-data"

type PackType = {
  id: string
  name: string
  image: string
  color: string
  solPrice: number
  dustPrice: number
  description: string
  rarityChance: {
    common: number
    uncommon: number
    rare: number
    legendary: number
  }
}

export default function ShopPage() {
  const [memeDust, setMemeDust] = useState(250)
  const [solBalance, setSolBalance] = useState(0.5)
  const [selectedPack, setSelectedPack] = useState<PackType | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"sol" | "dust">("sol")

  // Add these new state variables to the component
  const [showPackOpening, setShowPackOpening] = useState(false)
  const [openingPackType, setOpeningPackType] = useState<string | null>(null)
  const [generatedCards, setGeneratedCards] = useState<any[]>([])

  // Update the cardPacks array to use the new image URLs
  const cardPacks: PackType[] = [
    {
      id: "standard",
      name: "Standard Pack",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-sQ2dWhQmAapB4imequ4Iaa8fy5x4nv.png", // Pepe pack (green)
      color: "from-green-600 to-green-800",
      solPrice: 0.05,
      dustPrice: 100,
      description: "A standard pack with a chance to get common and uncommon cards.",
      rarityChance: {
        common: 80,
        uncommon: 18,
        rare: 2,
        legendary: 0,
      },
    },
    {
      id: "premium",
      name: "Premium Pack",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-dAM2xRY3pCKdFIqSzNLR182YM3Jrcs.png", // Doge pack (orange/yellow)
      color: "from-yellow-500 to-orange-600",
      solPrice: 0.15,
      dustPrice: 300,
      description: "A premium pack with better chances for rare cards.",
      rarityChance: {
        common: 50,
        uncommon: 35,
        rare: 14,
        legendary: 1,
      },
    },
    {
      id: "legendary",
      name: "Legendary Pack",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-uhqbY0uAD8oiDqwDnHCvGnOHeeDEtV.png", // Popcat pack (black/rainbow)
      color: "from-blue-600 to-purple-700",
      solPrice: 0.5,
      dustPrice: 1000,
      description: "A legendary pack with guaranteed rare cards and a high chance for legendary cards.",
      rarityChance: {
        common: 0,
        uncommon: 50,
        rare: 40,
        legendary: 10,
      },
    },
  ]

  const handleBuyClick = (pack: PackType, method: "sol" | "dust") => {
    setSelectedPack(pack)
    setPaymentMethod(method)
    setShowDialog(true)
  }

  // Replace the handleConfirmPurchase function with this updated version
  const handleConfirmPurchase = () => {
    if (!selectedPack) return

    if (paymentMethod === "sol") {
      setSolBalance((prev) => prev - selectedPack.solPrice)
    } else {
      setMemeDust((prev) => prev - selectedPack.dustPrice)
    }

    setShowDialog(false)

    // Generate cards based on the pack type
    const packType = selectedPack.id === "standard" ? "pepe" : selectedPack.id === "premium" ? "doge" : "popcat"

    // Generate 5 cards for the pack
    const cards = generateCardPack(packType, 5)
    setGeneratedCards(cards)

    // Set the pack type for opening animation
    setOpeningPackType(packType)

    // Show the pack opening dialog
    setShowPackOpening(true)
  }

  // Add a function to handle when pack opening is complete
  const handlePackOpeningComplete = () => {
    setShowPackOpening(false)
    setOpeningPackType(null)
  }

  const canAfford = (pack: PackType, method: "sol" | "dust") => {
    if (method === "sol") {
      return solBalance >= pack.solPrice
    } else {
      return memeDust >= pack.dustPrice
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Card Shop</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-card px-4 py-2 rounded-lg border">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="font-medium">{memeDust} Meme Dust</span>
          </div>
          <div className="flex items-center bg-card px-4 py-2 rounded-lg border">
            <Wallet className="w-4 h-4 mr-2 text-purple-500" />
            <span className="font-medium">{solBalance.toFixed(3)} SOL</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardPacks.map((pack) => (
          <Card key={pack.id} className="overflow-hidden">
            <div className={`h-48 bg-gradient-to-r ${pack.color} flex items-center justify-center p-4`}>
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={pack.image || "/placeholder.svg"}
                  alt={pack.name}
                  width={200}
                  height={280}
                  className="object-contain max-h-full"
                  priority
                />
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{pack.name}</h2>
                <button
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSelectedPack(pack)
                    setShowDialog(true)
                  }}
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>

              <Tabs defaultValue="sol" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="sol">Solana</TabsTrigger>
                  <TabsTrigger value="dust">Meme Dust</TabsTrigger>
                </TabsList>
                <TabsContent value="sol" className="space-y-4">
                  <div className="text-center font-bold text-lg">{pack.solPrice} SOL</div>
                  <Button
                    className="w-full"
                    onClick={() => handleBuyClick(pack, "sol")}
                    disabled={!canAfford(pack, "sol")}
                  >
                    {canAfford(pack, "sol") ? "Buy with SOL" : "Insufficient SOL"}
                  </Button>
                </TabsContent>
                <TabsContent value="dust" className="space-y-4">
                  <div className="text-center font-bold text-lg">{pack.dustPrice} Dust</div>
                  <Button
                    className="w-full"
                    onClick={() => handleBuyClick(pack, "dust")}
                    disabled={!canAfford(pack, "dust")}
                  >
                    {canAfford(pack, "dust") ? "Buy with Dust" : "Insufficient Dust"}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPack && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedPack.name} Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <p>{selectedPack.description}</p>

              <div className="space-y-2">
                <h3 className="font-semibold">Card Rarity Chances:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between">
                    <span>Common:</span>
                    <span>{selectedPack.rarityChance.common}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uncommon:</span>
                    <span>{selectedPack.rarityChance.uncommon}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rare:</span>
                    <span>{selectedPack.rarityChance.rare}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Legendary:</span>
                    <span>{selectedPack.rarityChance.legendary}%</span>
                  </div>
                </div>
              </div>

              {paymentMethod === "sol" ? (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="font-medium">Purchase with Solana</div>
                  <div className="flex justify-between mt-2">
                    <span>Price:</span>
                    <span>{selectedPack.solPrice} SOL</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Your balance:</span>
                    <span>{solBalance.toFixed(3)} SOL</span>
                  </div>
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="font-medium">Purchase with Meme Dust</div>
                  <div className="flex justify-between mt-2">
                    <span>Price:</span>
                    <span>{selectedPack.dustPrice} Dust</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Your balance:</span>
                    <span>{memeDust} Dust</span>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmPurchase} disabled={!canAfford(selectedPack, paymentMethod)}>
                Confirm Purchase
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showPackOpening && (
        <CardRevealDialog
          cards={generatedCards}
          open={showPackOpening}
          onOpenChange={setShowPackOpening}
          onComplete={handlePackOpeningComplete}
          autoStart={true}
        />
      )}
    </div>
  )
}

