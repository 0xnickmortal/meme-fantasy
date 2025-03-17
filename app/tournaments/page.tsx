"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Trophy, Swords, Clock, Star, Sparkles, Wallet, Bot, Plus, X, Save, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import type { CardRarity } from "@/lib/enums"
import { useCollection } from "@/lib/contexts/collection-context"

type MemeCard = {
  id: number
  name: string
  rarity: CardRarity
  power: number
  image: string
  socialScore: number
  isNFT: boolean
}

type Deck = {
  id: string
  name: string
  cards: number[]
}

export default function TournamentsPage() {
  const { cards: myCards } = useCollection()
  const [showDialog, setShowDialog] = useState(false)
  const [showDeckBuilder, setShowDeckBuilder] = useState(false)
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [matchmakingActive, setMatchmakingActive] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [myDecks, setMyDecks] = useState<Deck[]>([])
  const [newDeckName, setNewDeckName] = useState("")
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null)

  // Collection of cards the player owns
  // const [myCards, setMyCards] = useState<MemeCard[]>([
  //   {
  //     id: 1,
  //     name: "DOGE",
  //     rarity: CardRarity.Legendary,
  //     power: 9000,
  //     image:
  //       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/82e484698a3be91a74d423eed2325af-H0swybiltinXt2HoEg2NeySoBtyHiA.png",
  //     socialScore: 95,
  //     isNFT: true,
  //   },
  //   {
  //     id: 2,
  //     name: "PEPE",
  //     rarity: CardRarity.Rare,
  //     power: 7500,
  //     image:
  //       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/82e484698a3be91a74d423eed2325af-H0swybiltinXt2HoEg2NeySoBtyHiA.png",
  //     socialScore: 85,
  //     isNFT: false,
  //   },
  //   {
  //     id: 3,
  //     name: "SHIB",
  //     rarity: CardRarity.Uncommon,
  //     power: 6000,
  //     image:
  //       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/82e484698a3be91a74d423eed2325af-H0swybiltinXt2HoEg2NeySoBtyHiA.png",
  //     socialScore: 75,
  //     isNFT: true,
  //   },
  //   {
  //     id: 4,
  //     name: "FLOKI",
  //     rarity: CardRarity.Common,
  //     power: 5000,
  //     image:
  //       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/82e484698a3be91a74d423eed2325af-H0swybiltinXt2HoEg2NeySoBtyHiA.png",
  //     socialScore: 65,
  //     isNFT: false,
  //   },
  //   {
  //     id: 5,
  //     name: "BONK",
  //     rarity: CardRarity.Rare,
  //     power: 8200,
  //     image:
  //       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/82e484698a3be91a74d423eed2325af-H0swybiltinXt2HoEg2NeySoBtyHiA.png",
  //     socialScore: 88,
  //     isNFT: true,
  //   },
  //   {
  //     id: 6,
  //     name: "SAMO",
  //     rarity: CardRarity.Uncommon,
  //     power: 6500,
  //     image:
  //       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/82e484698a3be91a74d423eed2325af-H0swybiltinXt2HoEg2NeySoBtyHiA.png",
  //     socialScore: 70,
  //     isNFT: false,
  //   },
  //   {
  //     id: 7,
  //     name: "ELON",
  //     rarity: CardRarity.Legendary,
  //     power: 9500,
  //     image:
  //       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/82e484698a3be91a74d423eed2325af-H0swybiltinXt2HoEg2NeySoBtyHiA.png",
  //     socialScore: 98,
  //     isNFT: true,
  //   },
  //   {
  //     id: 8,
  //     name: "WOJAK",
  //     rarity: CardRarity.Common,
  //     power: 4800,
  //     image:
  //       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/82e484698a3be91a74d423eed2325af-H0swybiltinXt2HoEg2NeySoBtyHiA.png",
  //     socialScore: 60,
  //     isNFT: false,
  //   },
  // ])

  // Calculate time until Monday 9pm
  const now = new Date()
  const nextMonday = new Date()
  nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7))
  nextMonday.setHours(21, 0, 0, 0)

  const timeUntilRegistrationEnds = Math.max(0, Math.floor((nextMonday.getTime() - now.getTime()) / (1000 * 60 * 60)))

  const handleRegister = () => {
    setShowDialog(true)
  }

  const handleConfirmRegistration = () => {
    if (selectedDeck) {
      setIsRegistered(true)
      setShowDialog(false)
      // Here you would typically send the registration to your backend
    }
  }

  const startMatchmaking = () => {
    if (selectedDeck) {
      setMatchmakingActive(true)
      // In a real app, this would connect to your matchmaking service
      // For demo purposes, we'll just show the matchmaking state
    }
  }

  const cancelMatchmaking = () => {
    setMatchmakingActive(false)
  }

  const openDeckBuilder = (deck?: Deck) => {
    if (deck) {
      // Edit existing deck
      setEditingDeck(deck)
      setNewDeckName(deck.name)
      setSelectedCards([...deck.cards])
    } else {
      // Create new deck
      setEditingDeck(null)
      setNewDeckName("New Deck")
      setSelectedCards([])
    }
    setShowDeckBuilder(true)
  }

  const toggleCardSelection = (cardId: number) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId))
    } else {
      if (selectedCards.length < 5) {
        setSelectedCards([...selectedCards, cardId])
      }
    }
  }

  const saveDeck = () => {
    if (selectedCards.length !== 5) {
      alert("Your deck must contain exactly 5 cards.")
      return
    }

    if (newDeckName.trim() === "") {
      alert("Please enter a deck name.")
      return
    }

    if (editingDeck) {
      // Update existing deck
      const updatedDecks = myDecks.map((deck) =>
        deck.id === editingDeck.id ? { ...deck, name: newDeckName, cards: selectedCards } : deck,
      )
      setMyDecks(updatedDecks)
    } else {
      // Create new deck
      const newDeck: Deck = {
        id: `deck-${Date.now()}`,
        name: newDeckName,
        cards: selectedCards,
      }
      setMyDecks([...myDecks, newDeck])
    }

    setShowDeckBuilder(false)
  }

  const deleteDeck = (deckId: string) => {
    setMyDecks(myDecks.filter((deck) => deck.id !== deckId))
    if (selectedDeck?.id === deckId) {
      setSelectedDeck(null)
    }
  }

  const calculateDeckPower = (deck: Deck): number => {
    return deck.cards.reduce((total, cardId) => {
      const card = myCards.find((c) => c.id === cardId)
      return total + (card?.power || 0)
    }, 0)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tournaments</h1>
        <div className="flex items-center bg-card px-4 py-2 rounded-lg border">
          <Clock className="w-4 h-4 mr-2 text-yellow-500" />
          <span className="font-medium">Registration ends in {timeUntilRegistrationEnds}h</span>
        </div>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="weekly" className="text-lg py-3">
            <Trophy className="w-5 h-5 mr-2" />
            Weekly Tournament
          </TabsTrigger>
          <TabsTrigger value="matchmaking" className="text-lg py-3">
            <Swords className="w-5 h-5 mr-2" />
            Battle Arena
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Weekly Tournament Rules</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Register with a 5-card deck before Monday 9:00 PM</li>
              <li>Results will be announced one week after registration closes</li>
              <li>Only the top 100 players will receive rewards</li>
              <li>Your deck's total power determines your ranking</li>
              <li>Higher rarity cards contribute more to your deck's power</li>
            </ul>
          </div>

          {isRegistered ? (
            <Card className="bg-primary/20 border border-primary">
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">You're Registered!</h2>
                <p className="text-muted-foreground mb-4">
                  Your deck "{selectedDeck?.name}" has been registered for this week's tournament. Results will be
                  announced next Monday.
                </p>
                <div className="bg-card p-4 rounded-lg mb-6 inline-block">
                  <h3 className="font-medium mb-2">Potential Rewards</h3>
                  <div className="flex items-center justify-center space-x-6">
                    <div className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
                      <span>Up to 1000 Dust</span>
                    </div>
                    <div className="flex items-center">
                      <Wallet className="w-4 h-4 mr-1 text-purple-500" />
                      <span>Up to 0.5 SOL</span>
                    </div>
                    <div className="flex items-center">
                      <Image
                        src="/placeholder.svg?height=16&width=16"
                        alt="Card Pack"
                        width={16}
                        height={16}
                        className="mr-1"
                      />
                      <span>Card Packs</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setIsRegistered(false)}>
                  Cancel Registration
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Weekly Tournament</h2>
                <p className="text-white/80 mb-6">Compete with your best 5-card deck for amazing rewards!</p>
                <div className="flex justify-center space-x-8 mb-6">
                  <div className="bg-black/30 p-4 rounded-lg text-white">
                    <div className="text-lg font-bold mb-1">Top 100</div>
                    <div className="text-sm">Players Rewarded</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg text-white">
                    <div className="text-lg font-bold mb-1">1000 Dust</div>
                    <div className="text-sm">Top Prize</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg text-white">
                    <div className="text-lg font-bold mb-1">0.5 SOL</div>
                    <div className="text-sm">Top Prize</div>
                  </div>
                </div>
                <Button
                  onClick={handleRegister}
                  className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6"
                  size="lg"
                  disabled={myDecks.length === 0}
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Register Now
                </Button>
                {myDecks.length === 0 && <p className="text-white mt-4">You need to create a deck first</p>}
              </div>
            </Card>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">My Decks</h2>
              <Button onClick={() => openDeckBuilder()} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create New Deck
              </Button>
            </div>

            {myDecks.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground mb-4">You haven't created any decks yet</div>
                <Button onClick={() => openDeckBuilder()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Deck
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myDecks.map((deck) => (
                  <Card key={deck.id} className={`${selectedDeck?.id === deck.id ? "ring-2 ring-primary" : ""}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">{deck.name}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span>{calculateDeckPower(deck)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mb-4">
                        {deck.cards.map((cardId) => {
                          const card = myCards.find((c) => c.id === cardId)
                          return (
                            <div
                              key={cardId}
                              className="w-12 h-16 bg-muted rounded-md flex items-center justify-center relative overflow-hidden"
                            >
                              {card && (
                                <div className="absolute inset-0">
                                  <Image
                                    src={card.image || "/placeholder.svg"}
                                    alt={card.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1" onClick={() => openDeckBuilder(deck)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => deleteDeck(deck.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                        <Button className="flex-1" onClick={() => setSelectedDeck(deck)}>
                          Select
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="matchmaking" className="space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Battle Arena Rules</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Select a 5-card deck to battle against other players</li>
              <li>Each card's power is both its attack and health</li>
              <li>Take turns attacking your opponent's cards</li>
              <li>You can control each attack or let the AI play for you</li>
              <li>The player who defeats all opponent's cards wins</li>
              <li>Win battles to earn Meme Dust and climb the leaderboard</li>
            </ul>
          </div>

          {matchmakingActive ? (
            <div className="bg-primary/20 p-8 rounded-lg border border-primary text-center">
              <div className="animate-pulse mb-6">
                <Swords className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Finding Opponent...</h2>
                <p className="text-muted-foreground mt-2">
                  Searching for a worthy opponent for your "{selectedDeck?.name}" deck
                </p>
              </div>
              <div className="flex items-center justify-center mb-6">
                <div className="mr-4">
                  <Bot className={`w-6 h-6 ${autoPlay ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    id="autoplay-toggle"
                    className="sr-only"
                    checked={autoPlay}
                    onChange={() => setAutoPlay(!autoPlay)}
                  />
                  <div className={`block w-14 h-8 rounded-full ${autoPlay ? "bg-primary" : "bg-muted"}`}></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${autoPlay ? "transform translate-x-6" : ""}`}
                  ></div>
                </div>
                <label htmlFor="autoplay-toggle" className="ml-3 text-sm font-medium">
                  AI Auto-Battle
                </label>
              </div>
              <Button variant="outline" onClick={cancelMatchmaking} className="mt-2">
                Cancel Matchmaking
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {myDecks.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="text-muted-foreground mb-4">You need to create a deck before you can battle</div>
                  <Button onClick={() => openDeckBuilder()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Deck
                  </Button>
                </Card>
              ) : (
                <>
                  <h2 className="text-xl font-bold">Select a Deck to Battle</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myDecks.map((deck) => (
                      <Card
                        key={deck.id}
                        className={`cursor-pointer transition-all ${selectedDeck?.id === deck.id ? "ring-2 ring-primary" : "hover:bg-accent/50"}`}
                        onClick={() => setSelectedDeck(deck)}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{deck.name}</h3>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              <span>{calculateDeckPower(deck)}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 mb-4">
                            {deck.cards.map((cardId) => {
                              const card = myCards.find((c) => c.id === cardId)
                              return (
                                <div
                                  key={cardId}
                                  className="w-12 h-16 bg-muted rounded-md flex items-center justify-center relative overflow-hidden"
                                >
                                  {card && (
                                    <div className="absolute inset-0">
                                      <Image
                                        src={card.image || "/placeholder.svg"}
                                        alt={card.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                          {selectedDeck?.id === deck.id && (
                            <Button className="w-full" onClick={startMatchmaking}>
                              Start Battle
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for Weekly Tournament</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <h3 className="font-medium mb-4">Select a Deck (5 cards required)</h3>
            <div className="space-y-4">
              {myDecks.map((deck) => (
                <div
                  key={deck.id}
                  className={`p-4 rounded-lg border cursor-pointer ${selectedDeck?.id === deck.id ? "bg-primary/10 border-primary" : "hover:bg-accent/50"}`}
                  onClick={() => setSelectedDeck(deck)}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{deck.name}</h4>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{calculateDeckPower(deck)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    {deck.cards.map((cardId) => {
                      const card = myCards.find((c) => c.id === cardId)
                      return (
                        <div
                          key={cardId}
                          className="w-8 h-12 bg-muted rounded-md flex items-center justify-center text-xs relative overflow-hidden"
                        >
                          {card && (
                            <div className="absolute inset-0">
                              <Image
                                src={card.image || "/placeholder.svg"}
                                alt={card.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRegistration} disabled={!selectedDeck}>
              Confirm Registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeckBuilder} onOpenChange={setShowDeckBuilder}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingDeck ? "Edit Deck" : "Create New Deck"}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center space-x-4 mb-6">
              <Input
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                placeholder="Deck Name"
                className="max-w-xs"
              />
              <div className="text-sm text-muted-foreground">{selectedCards.length}/5 cards selected</div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Selected Cards</h3>
              <div className="flex space-x-4 min-h-[120px] p-4 border rounded-lg">
                {selectedCards.length === 0 ? (
                  <div className="flex items-center justify-center w-full text-muted-foreground">
                    Select up to 5 cards from your collection
                  </div>
                ) : (
                  selectedCards.map((cardId) => {
                    const card = myCards.find((c) => c.id === cardId)
                    return (
                      <div
                        key={cardId}
                        className="relative w-20 h-28 bg-muted rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => toggleCardSelection(cardId)}
                      >
                        {card && (
                          <>
                            <Image
                              src={card.image || "/placeholder.svg"}
                              alt={card.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <X className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-xs text-center text-white">
                              {card.name}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <h3 className="font-medium mb-2">Your Collection</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto p-2">
              {myCards.map((card) => (
                <div
                  key={card.id}
                  className={`relative w-full aspect-[1/1.4] bg-muted rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selectedCards.includes(card.id) ? "border-primary" : "border-transparent"
                  } ${selectedCards.length >= 5 && !selectedCards.includes(card.id) ? "opacity-50" : ""}`}
                  onClick={() => toggleCardSelection(card.id)}
                >
                  <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                    <div className="text-white font-medium text-sm">{card.name}</div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <span className="text-xs text-white">{card.power}</span>
                      </div>
                      <div className="text-xs text-white/80">{card.rarity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeckBuilder(false)}>
              Cancel
            </Button>
            <Button onClick={saveDeck} disabled={selectedCards.length !== 5 || newDeckName.trim() === ""}>
              <Save className="w-4 h-4 mr-2" />
              Save Deck
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

