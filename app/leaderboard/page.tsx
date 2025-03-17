"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CardRarity, rarityColors } from "@/lib/enums"
import {
  Search,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Star,
  Users,
  TrendingUp,
  Filter,
  SortAsc,
  SortDesc,
  Check,
  X,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Types
type MemeCard = {
  id: number
  name: string
  rarity: CardRarity
  power: number
  image: string
  socialScore: number
  isNFT: boolean
  marketValue: number
  change24h: number
}

type Player = {
  id: number
  name: string
  avatar: string
  cardsOwned: number
  totalValue: number
  rank: number
  previousRank: number
  rareCards: number
}

type SortOption = {
  id: string
  label: string
  key: keyof MemeCard | keyof Player
  direction: "asc" | "desc"
}

type FilterOption = {
  id: string
  label: string
  checked: boolean
}

// 在文件顶部添加新的卡片图片常量
const NEW_CARD_IMAGES = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-olr9d2aE2Q4B1q7bGUOO6Q9Sa45wJV.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-kOCVmyOO9SXGYayxMy3W2kHbjXUiVR.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-M7wTxZE2HqPO1FddK78pCSr3SDdoMS.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-cwDwOaf6X9BujnFhGzYr2GAytsznki.png",
]

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRarity, setFilterRarity] = useState<CardRarity | "All">("All")
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<"cards" | "players">("cards")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const sortMenuRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  // Use useEffect to set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Sort state
  const [cardSortOption, setCardSortOption] = useState<SortOption>({
    id: "marketValue-desc",
    label: "Market Value (High to Low)",
    key: "marketValue",
    direction: "desc",
  })

  const [playerSortOption, setPlayerSortOption] = useState<SortOption>({
    id: "totalValue-desc",
    label: "Total Value (High to Low)",
    key: "totalValue",
    direction: "desc",
  })

  // Filter options
  const [cardFilters, setCardFilters] = useState<FilterOption[]>([
    { id: "isNFT", label: "NFT Cards Only", checked: false },
    { id: "positive", label: "Positive 24h Change", checked: false },
    { id: "highPower", label: "High Power (7000+)", checked: false },
  ])

  const [playerFilters, setPlayerFilters] = useState<FilterOption[]>([
    { id: "top10", label: "Top 10 Only", checked: false },
    { id: "highRare", label: "High Rare Cards (10+)", checked: false },
    { id: "highCards", label: "High Card Count (100+)", checked: false },
  ])

  // Close sort menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Sample data for meme cards
  const memeCards: MemeCard[] = [
    {
      id: 1,
      name: "DOGE",
      rarity: CardRarity.Legendary,
      power: 9000,
      image: NEW_CARD_IMAGES[0],
      socialScore: 95,
      isNFT: true,
      marketValue: 0.19,
      change24h: 5.2,
    },
    {
      id: 2,
      name: "PEPE",
      rarity: CardRarity.Rare,
      power: 7500,
      image: NEW_CARD_IMAGES[1],
      socialScore: 85,
      isNFT: false,
      marketValue: 0.12,
      change24h: -2.1,
    },
    {
      id: 3,
      name: "SHIB",
      rarity: CardRarity.Uncommon,
      power: 6000,
      image: NEW_CARD_IMAGES[2],
      socialScore: 75,
      isNFT: true,
      marketValue: 0.09,
      change24h: 1.8,
    },
    {
      id: 4,
      name: "FLOKI",
      rarity: CardRarity.Common,
      power: 5000,
      image: NEW_CARD_IMAGES[3],
      socialScore: 65,
      isNFT: false,
      marketValue: 0.04,
      change24h: 0.5,
    },
    {
      id: 5,
      name: "BONK",
      rarity: CardRarity.Rare,
      power: 8200,
      image: NEW_CARD_IMAGES[0],
      socialScore: 88,
      isNFT: true,
      marketValue: 0.14,
      change24h: 7.3,
    },
    {
      id: 6,
      name: "SAMO",
      rarity: CardRarity.Uncommon,
      power: 6500,
      image: NEW_CARD_IMAGES[1],
      socialScore: 70,
      isNFT: false,
      marketValue: 0.08,
      change24h: -1.2,
    },
    {
      id: 7,
      name: "ELON",
      rarity: CardRarity.Legendary,
      power: 9500,
      image: NEW_CARD_IMAGES[2],
      socialScore: 98,
      isNFT: true,
      marketValue: 0.22,
      change24h: 9.5,
    },
    {
      id: 8,
      name: "WOJAK",
      rarity: CardRarity.Common,
      power: 4800,
      image: NEW_CARD_IMAGES[3],
      socialScore: 60,
      isNFT: false,
      marketValue: 0.03,
      change24h: -0.8,
    },
    {
      id: 9,
      name: "SNEK",
      rarity: CardRarity.SuperRare,
      power: 9800,
      image: NEW_CARD_IMAGES[0],
      socialScore: 92,
      isNFT: true,
      marketValue: 0.31,
      change24h: 12.4,
    },
    {
      id: 10,
      name: "MOON",
      rarity: CardRarity.UltraRare,
      power: 10200,
      image: NEW_CARD_IMAGES[1],
      socialScore: 99,
      isNFT: true,
      marketValue: 0.45,
      change24h: 15.7,
    },
  ]

  // Sample data for players
  const players: Player[] = [
    {
      id: 1,
      name: "CryptoKing",
      avatar: "/placeholder.svg?height=40&width=40",
      cardsOwned: 178,
      totalValue: 12.45,
      rank: 1,
      previousRank: 1,
      rareCards: 23,
    },
    {
      id: 2,
      name: "MemeQueen",
      avatar: "/placeholder.svg?height=40&width=40",
      cardsOwned: 156,
      totalValue: 10.82,
      rank: 2,
      previousRank: 3,
      rareCards: 18,
    },
    {
      id: 3,
      name: "DogeWhale",
      avatar: "/placeholder.svg?height=40&width=40",
      cardsOwned: 143,
      totalValue: 9.76,
      rank: 3,
      previousRank: 2,
      rareCards: 15,
    },
    {
      id: 4,
      name: "ShibArmy",
      avatar: "/placeholder.svg?height=40&width=40",
      cardsOwned: 132,
      totalValue: 8.91,
      rank: 4,
      previousRank: 5,
      rareCards: 12,
    },
    {
      id: 5,
      name: "PepeCollector",
      avatar: "/placeholder.svg?height=40&width=40",
      cardsOwned: 127,
      totalValue: 8.45,
      rank: 5,
      previousRank: 4,
      rareCards: 14,
    },
    {
      id: 6,
      name: "MoonBoy",
      avatar: "/placeholder.svg?height=40&width=40",
      cardsOwned: 118,
      totalValue: 7.92,
      rank: 6,
      previousRank: 7,
      rareCards: 10,
    },
    {
      id: 7,
      name: "DiamondHands",
      avatar: "/placeholder.svg?height=40&width=40",
      cardsOwned: 112,
      totalValue: 7.65,
      rank: 7,
      previousRank: 6,
      rareCards: 11,
    },
    {
      id: 8,
      name: "NFTMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      cardsOwned: 103,
      totalValue: 7.12,
      rank: 8,
      previousRank: 10,
      rareCards: 9,
    },
    {
      id: 9,
      name: "TokenGuru",
      avatar: "/placeholder.svg?height=40&width=40",
      cardsOwned: 98,
      totalValue: 6.78,
      rank: 9,
      previousRank: 8,
      rareCards: 8,
    },
    {
      id: 10,
      name: "CoinHunter",
      avatar: "/placeholder.svg?height=40&width=40",
      cardsOwned: 92,
      totalValue: 6.45,
      rank: 10,
      previousRank: 9,
      rareCards: 7,
    },
    {
      id: 11,
      name: "SolanaFan",
      avatar: "/placeholder.svg?height=40&width=40",
      cardsOwned: 85,
      totalValue: 5.95,
      rank: 11,
      previousRank: 12,
      rareCards: 6,
    },
    {
      id: 12,
      name: "CryptoNoob",
      avatar: "/placeholder.svg?height=40&width=40",
      cardsOwned: 78,
      totalValue: 5.45,
      rank: 12,
      previousRank: 11,
      rareCards: 5,
    },
  ]

  // Card sort options
  const cardSortOptions: SortOption[] = [
    { id: "marketValue-desc", label: "Market Value (High to Low)", key: "marketValue", direction: "desc" },
    { id: "marketValue-asc", label: "Market Value (Low to High)", key: "marketValue", direction: "asc" },
    { id: "power-desc", label: "Power (High to Low)", key: "power", direction: "desc" },
    { id: "power-asc", label: "Power (Low to High)", key: "power", direction: "asc" },
    { id: "change24h-desc", label: "24h Change (High to Low)", key: "change24h", direction: "desc" },
    { id: "name-asc", label: "Name (A to Z)", key: "name", direction: "asc" },
    { id: "name-desc", label: "Name (Z to A)", key: "name", direction: "desc" },
  ]

  // Player sort options
  const playerSortOptions: SortOption[] = [
    { id: "rank-asc", label: "Rank (Top to Bottom)", key: "rank", direction: "asc" },
    { id: "totalValue-desc", label: "Total Value (High to Low)", key: "totalValue", direction: "desc" },
    { id: "cardsOwned-desc", label: "Cards Owned (High to Low)", key: "cardsOwned", direction: "desc" },
    { id: "rareCards-desc", label: "Rare Cards (High to Low)", key: "rareCards", direction: "desc" },
    { id: "name-asc", label: "Name (A to Z)", key: "name", direction: "asc" },
    { id: "name-desc", label: "Name (Z to A)", key: "name", direction: "desc" },
  ]

  // Toggle filter option
  const toggleCardFilter = (id: string) => {
    setCardFilters(cardFilters.map((filter) => (filter.id === id ? { ...filter, checked: !filter.checked } : filter)))
  }

  const togglePlayerFilter = (id: string) => {
    setPlayerFilters(
      playerFilters.map((filter) => (filter.id === id ? { ...filter, checked: !filter.checked } : filter)),
    )
  }

  // Reset filters
  const resetFilters = () => {
    if (activeTab === "cards") {
      setCardFilters(cardFilters.map((filter) => ({ ...filter, checked: false })))
      setFilterRarity("All")
    } else {
      setPlayerFilters(playerFilters.map((filter) => ({ ...filter, checked: false })))
    }
  }

  // Apply filters to cards
  const filteredCards = memeCards
    .filter((card) => {
      // Search filter
      if (!card.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Rarity filter
      if (filterRarity !== "All" && card.rarity !== filterRarity) {
        return false
      }

      // Custom filters
      for (const filter of cardFilters) {
        if (filter.checked) {
          if (filter.id === "isNFT" && !card.isNFT) {
            return false
          }
          if (filter.id === "positive" && card.change24h <= 0) {
            return false
          }
          if (filter.id === "highPower" && card.power < 7000) {
            return false
          }
        }
      }

      return true
    })
    .sort((a, b) => {
      const key = cardSortOption.key as keyof MemeCard
      const aValue = a[key]
      const bValue = b[key]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return cardSortOption.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return cardSortOption.direction === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

  // Apply filters to players
  const filteredPlayers = players
    .filter((player) => {
      // Search filter
      if (!player.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Custom filters
      for (const filter of playerFilters) {
        if (filter.checked) {
          if (filter.id === "top10" && player.rank > 10) {
            return false
          }
          if (filter.id === "highRare" && player.rareCards < 10) {
            return false
          }
          if (filter.id === "highCards" && player.cardsOwned < 100) {
            return false
          }
        }
      }

      return true
    })
    .sort((a, b) => {
      const key = playerSortOption.key as keyof Player
      const aValue = a[key]
      const bValue = b[key]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return playerSortOption.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return playerSortOption.direction === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

  // Get rank change indicator
  const getRankChange = (current: number, previous: number) => {
    if (current < previous) return { icon: <ArrowUp className="w-4 h-4 text-green-500" />, text: "up" }
    if (current > previous) return { icon: <ArrowDown className="w-4 h-4 text-red-500" />, text: "down" }
    return { icon: null, text: "same" }
  }

  // Handle column header click for sorting
  const handleColumnSort = (key: keyof MemeCard | keyof Player) => {
    if (activeTab === "cards") {
      // Find the current sort option with this key
      const currentOption = cardSortOptions.find((option) => option.key === key)
      if (!currentOption) return

      // If already sorting by this key, toggle direction
      if (cardSortOption.key === key) {
        const newDirection = cardSortOption.direction === "asc" ? "desc" : "asc"
        const newOption = cardSortOptions.find((option) => option.key === key && option.direction === newDirection)
        if (newOption) setCardSortOption(newOption)
      } else {
        // Default to descending for first click
        const newOption = cardSortOptions.find((option) => option.key === key && option.direction === "desc")
        if (newOption) setCardSortOption(newOption)
      }
    } else {
      // Same logic for players
      const currentOption = playerSortOptions.find((option) => option.key === key)
      if (!currentOption) return

      if (playerSortOption.key === key) {
        const newDirection = playerSortOption.direction === "asc" ? "desc" : "asc"
        const newOption = playerSortOptions.find((option) => option.key === key && option.direction === newDirection)
        if (newOption) setPlayerSortOption(newOption)
      } else {
        const newOption = playerSortOptions.find((option) => option.key === key && option.direction === "desc")
        if (newOption) setPlayerSortOption(newOption)
      }
    }
  }

  // 获取排序图标的辅助函数
  const getSortIcon = (key: keyof MemeCard | keyof Player) => {
    if (activeTab === "cards" && cardSortOption.key === key) {
      return cardSortOption.direction === "asc" ? (
        <SortAsc className="h-4 w-4 inline ml-1" />
      ) : (
        <SortDesc className="h-4 w-4 inline ml-1" />
      )
    }
    if (activeTab === "players" && playerSortOption.key === key) {
      return playerSortOption.direction === "asc" ? (
        <SortAsc className="h-4 w-4 inline ml-1" />
      ) : (
        <SortDesc className="h-4 w-4 inline ml-1" />
      )
    }
    return null
  }

  // Count active filters
  const activeCardFilters = cardFilters.filter((f) => f.checked).length + (filterRarity !== "All" ? 1 : 0)
  const activePlayerFilters = playerFilters.filter((f) => f.checked).length

  // Only render the client-side content after hydration
  if (!isClient) {
    return <div suppressHydrationWarning>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <div className="text-sm text-muted-foreground" suppressHydrationWarning>
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cards or players..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilterDialog(true)}
            className={
              (activeTab === "cards" && activeCardFilters > 0) || (activeTab === "players" && activePlayerFilters > 0)
                ? "relative bg-primary/10 border-primary"
                : ""
            }
          >
            <Filter className="h-4 w-4" />
            {activeTab === "cards" && activeCardFilters > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeCardFilters}
              </span>
            )}
            {activeTab === "players" && activePlayerFilters > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activePlayerFilters}
              </span>
            )}
          </Button>

          <div className="relative">
            <Button variant="outline" size="icon" onClick={() => setShowSortMenu(!showSortMenu)}>
              {activeTab === "cards" && cardSortOption.direction === "asc" && <SortAsc className="h-4 w-4" />}
              {activeTab === "cards" && cardSortOption.direction === "desc" && <SortDesc className="h-4 w-4" />}
              {activeTab === "players" && playerSortOption.direction === "asc" && <SortAsc className="h-4 w-4" />}
              {activeTab === "players" && playerSortOption.direction === "desc" && <SortDesc className="h-4 w-4" />}
            </Button>

            {showSortMenu && (
              <div
                ref={sortMenuRef}
                className="absolute right-0 z-50 mt-2 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
              >
                <div className="px-2 py-1.5 text-sm font-semibold">Sort By</div>
                <div className="-mx-1 my-1 h-px bg-muted"></div>

                {activeTab === "cards" ? (
                  <div>
                    {cardSortOptions.map((option) => (
                      <div
                        key={option.id}
                        className="relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          setCardSortOption(option)
                          setShowSortMenu(false)
                        }}
                      >
                        {option.label}
                        {cardSortOption.id === option.id && <Check className="h-4 w-4" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {playerSortOptions.map((option) => (
                      <div
                        key={option.id}
                        className="relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          setPlayerSortOption(option)
                          setShowSortMenu(false)
                        }}
                      >
                        {option.label}
                        {playerSortOption.id === option.id && <Check className="h-4 w-4" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="cards"
        className="w-full"
        onValueChange={(value) => setActiveTab(value as "cards" | "players")}
      >
        <TabsList className="grid w-full grid-cols-2 mb-8 h-16">
          <TabsTrigger value="cards" className="text-lg py-4 h-full">
            <TrendingUp className="w-5 h-5 mr-2" />
            Card Values
          </TabsTrigger>
          <TabsTrigger value="players" className="text-lg py-4 h-full">
            <Users className="w-5 h-5 mr-2" />
            Top Collectors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Rank</th>
                      <th className="text-left p-4 font-medium">
                        <button
                          onClick={() => handleColumnSort("name")}
                          className="font-medium flex items-center hover:text-primary transition-colors"
                        >
                          Card {getSortIcon("name")}
                        </button>
                      </th>
                      <th className="text-left p-4 font-medium">
                        <button
                          onClick={() => handleColumnSort("rarity")}
                          className="font-medium flex items-center hover:text-primary transition-colors"
                        >
                          Rarity {getSortIcon("rarity")}
                        </button>
                      </th>
                      <th className="text-left p-4 font-medium">
                        <button
                          onClick={() => handleColumnSort("power")}
                          className="font-medium flex items-center hover:text-primary transition-colors"
                        >
                          Power {getSortIcon("power")}
                        </button>
                      </th>
                      <th className="text-right p-4 font-medium">
                        <button
                          onClick={() => handleColumnSort("marketValue")}
                          className="font-medium flex items-center justify-end hover:text-primary transition-colors ml-auto"
                        >
                          Market Value {getSortIcon("marketValue")}
                        </button>
                      </th>
                      <th className="text-right p-4 font-medium">
                        <button
                          onClick={() => handleColumnSort("change24h")}
                          className="font-medium flex items-center justify-end hover:text-primary transition-colors ml-auto"
                        >
                          24h Change {getSortIcon("change24h")}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCards.map((card, index) => (
                      <tr key={card.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium">{index + 1}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-md overflow-hidden">
                              <Image
                                src={card.image || "/placeholder.svg"}
                                alt={card.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{card.name}</div>
                              {card.isNFT && (
                                <div className="flex items-center text-xs text-primary">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  NFT
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className={`${rarityColors[card.rarity]} text-white`}>
                            {card.rarity}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            {card.power}
                          </div>
                        </td>
                        <td className="p-4 text-right font-medium">{card.marketValue.toFixed(3)} SOL</td>
                        <td className="p-4 text-right">
                          <span className={card.change24h >= 0 ? "text-green-500" : "text-red-500"}>
                            {card.change24h >= 0 ? "+" : ""}
                            {card.change24h.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredCards.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No cards match your filters. Try adjusting your search or filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="players" className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">
                        <button
                          onClick={() => handleColumnSort("rank")}
                          className="font-medium flex items-center hover:text-primary transition-colors"
                        >
                          Rank {getSortIcon("rank")}
                        </button>
                      </th>
                      <th className="text-left p-4 font-medium">
                        <button
                          onClick={() => handleColumnSort("name")}
                          className="font-medium flex items-center hover:text-primary transition-colors"
                        >
                          Player {getSortIcon("name")}
                        </button>
                      </th>
                      <th className="text-center p-4 font-medium">
                        <button
                          onClick={() => handleColumnSort("cardsOwned")}
                          className="font-medium flex items-center justify-center hover:text-primary transition-colors mx-auto"
                        >
                          Cards Owned {getSortIcon("cardsOwned")}
                        </button>
                      </th>
                      <th className="text-center p-4 font-medium">
                        <button
                          onClick={() => handleColumnSort("rareCards")}
                          className="font-medium flex items-center justify-center hover:text-primary transition-colors mx-auto"
                        >
                          Rare Cards {getSortIcon("rareCards")}
                        </button>
                      </th>
                      <th className="text-right p-4 font-medium">
                        <button
                          onClick={() => handleColumnSort("totalValue")}
                          className="font-medium flex items-center justify-end hover:text-primary transition-colors ml-auto"
                        >
                          Total Value {getSortIcon("totalValue")}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player) => {
                      const rankChange = getRankChange(player.rank, player.previousRank)
                      return (
                        <tr key={player.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{player.rank}</span>
                              {rankChange.icon}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                  src={player.avatar || "/placeholder.svg"}
                                  alt={player.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="font-medium">{player.name}</div>
                            </div>
                          </td>
                          <td className="p-4 text-center font-medium">{player.cardsOwned}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-yellow-500 mr-1" />
                              {player.rareCards}
                            </div>
                          </td>
                          <td className="p-4 text-right font-medium">{player.totalValue.toFixed(2)} SOL</td>
                        </tr>
                      )
                    })}
                    {filteredPlayers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          No players match your filters. Try adjusting your search or filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter {activeTab === "cards" ? "Cards" : "Players"}</DialogTitle>
            <DialogDescription>Apply filters to narrow down your results</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {activeTab === "cards" && (
              <>
                <div className="mb-4">
                  <Label htmlFor="rarity-filter" className="text-sm font-medium">
                    Rarity
                  </Label>
                  <select
                    id="rarity-filter"
                    className="w-full mt-1 bg-background border rounded-md px-3 py-2 text-sm"
                    value={filterRarity}
                    onChange={(e) => setFilterRarity(e.target.value as CardRarity | "All")}
                  >
                    <option value="All">All Rarities</option>
                    <option value={CardRarity.Common}>Common</option>
                    <option value={CardRarity.Uncommon}>Uncommon</option>
                    <option value={CardRarity.Rare}>Rare</option>
                    <option value={CardRarity.Legendary}>Legendary</option>
                    <option value={CardRarity.UltraRare}>Ultra Rare</option>
                    <option value={CardRarity.SuperRare}>Super Rare</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {cardFilters.map((filter) => (
                    <div key={filter.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={filter.id}
                        checked={filter.checked}
                        onCheckedChange={() => toggleCardFilter(filter.id)}
                      />
                      <Label htmlFor={filter.id} className="text-sm font-medium">
                        {filter.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === "players" && (
              <div className="space-y-3">
                {playerFilters.map((filter) => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={filter.id}
                      checked={filter.checked}
                      onCheckedChange={() => togglePlayerFilter(filter.id)}
                    />
                    <Label htmlFor={filter.id} className="text-sm font-medium">
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={resetFilters} type="button">
              <X className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={() => setShowFilterDialog(false)} type="button">
              <Check className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

