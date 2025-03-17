"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
// 在文件顶部的import部分添加Share图标
import { Search, Filter, Star, Wallet, ShoppingCart, Tag, TrendingUp, Heart, Share, X } from "lucide-react"
import { CardRarity, rarityColors } from "@/lib/enums"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// 类型定义
type NFTCard = {
  id: string
  name: string
  rarity: CardRarity
  power?: number
  image: string
  price: number
  previousPrice?: number
  seller?: string
  sellerAvatar?: string
  bids?: number
  likes?: number
  topBid?: number
  endTime?: string
  isAuction?: boolean
  description: string
  currency: string
  owner: string
  creator: string
  collection: string
  attributes: { trait_type: string; value: string }[]
  isVerified: boolean
  listedAt: string
}

// 在文件顶部添加新的卡片图片常量
const NEW_CARD_IMAGES = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-olr9d2aE2Q4B1q7bGUOO6Q9Sa45wJV.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-kOCVmyOO9SXGYayxMy3W2kHbjXUiVR.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-M7wTxZE2HqPO1FddK78pCSr3SDdoMS.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-cwDwOaf6X9BujnFhGzYr2GAytsznki.png",
]

// 获取随机卡片图片的函数
function getRandomCardImage(): string {
  const randomIndex = Math.floor(Math.random() * NEW_CARD_IMAGES.length)
  return NEW_CARD_IMAGES[randomIndex]
}

// 更新 mockNFTCards 数组中的 image 属性
// 找到 mockNFTCards 数组定义，并更新所有 image 属性
// 例如:
const mockNFTCards: NFTCard[] = [
  {
    id: "1",
    name: "Doge King",
    description: "The king of all meme coins, featuring the iconic Shiba Inu.",
    image: NEW_CARD_IMAGES[0],
    price: 0.45,
    currency: "SOL",
    owner: "CryptoKing",
    creator: "MemeDAO",
    rarity: CardRarity.Legendary,
    collection: "OG Memes",
    attributes: [
      { trait_type: "Power", value: "9500" },
      { trait_type: "Defense", value: "8700" },
      { trait_type: "Special", value: "Moon Howl" },
    ],
    isVerified: true,
    listedAt: "2023-09-15T14:30:00Z",
  },
  {
    id: "2",
    name: "Pepe Rare",
    description: "A rare Pepe card from the original collection.",
    image: NEW_CARD_IMAGES[1],
    price: 0.32,
    currency: "SOL",
    owner: "PepeWhale",
    creator: "MemeDAO",
    rarity: CardRarity.Rare,
    collection: "OG Memes",
    attributes: [
      { trait_type: "Power", value: "7800" },
      { trait_type: "Defense", value: "6500" },
      { trait_type: "Special", value: "Meme Magic" },
    ],
    isVerified: true,
    listedAt: "2023-09-14T10:15:00Z",
  },
  {
    id: "3",
    name: "Shiba Strong",
    description: "A strong Shiba Inu card ready to defend your collection.",
    image: NEW_CARD_IMAGES[2],
    price: 0.28,
    currency: "SOL",
    owner: "ShibaHolder",
    creator: "MemeDAO",
    rarity: CardRarity.Uncommon,
    collection: "OG Memes",
    attributes: [
      { trait_type: "Power", value: "6800" },
      { trait_type: "Defense", value: "7200" },
      { trait_type: "Special", value: "Loyal Guard" },
    ],
    isVerified: true,
    listedAt: "2023-09-13T08:00:00Z",
  },
  {
    id: "4",
    name: "Floki Fast",
    description: "A fast and agile Floki card to boost your meme game.",
    image: NEW_CARD_IMAGES[3],
    price: 0.22,
    currency: "SOL",
    owner: "FlokiFan",
    creator: "MemeDAO",
    rarity: CardRarity.Common,
    collection: "OG Memes",
    attributes: [
      { trait_type: "Power", value: "5500" },
      { trait_type: "Defense", value: "5000" },
      { trait_type: "Special", value: "Viking Speed" },
    ],
    isVerified: true,
    listedAt: "2023-09-12T16:45:00Z",
  },
  {
    id: "5",
    name: "Bonk Hammer",
    description: "A Bonk card wielding the mighty hammer of justice.",
    image: NEW_CARD_IMAGES[0],
    price: 0.38,
    currency: "SOL",
    owner: "BonkMaster",
    creator: "MemeDAO",
    rarity: CardRarity.Rare,
    collection: "OG Memes",
    attributes: [
      { trait_type: "Power", value: "7500" },
      { trait_type: "Defense", value: "7000" },
      { trait_type: "Special", value: "Hammer Time" },
    ],
    isVerified: true,
    listedAt: "2023-09-11T12:30:00Z",
  },
  {
    id: "6",
    name: "Samoyed Smile",
    description: "A smiling Samoyed card spreading joy and good vibes.",
    image: NEW_CARD_IMAGES[1],
    price: 0.25,
    currency: "SOL",
    owner: "SamoyedLover",
    creator: "MemeDAO",
    rarity: CardRarity.Uncommon,
    collection: "OG Memes",
    attributes: [
      { trait_type: "Power", value: "6200" },
      { trait_type: "Defense", value: "6000" },
      { trait_type: "Special", value: "Happy Vibes" },
    ],
    isVerified: true,
    listedAt: "2023-09-10T09:15:00Z",
  },
  {
    id: "7",
    name: "Elon Vision",
    description: "An Elon card with a vision for the future of memes.",
    image: NEW_CARD_IMAGES[2],
    price: 0.5,
    currency: "SOL",
    owner: "ElonFanatic",
    creator: "MemeDAO",
    rarity: CardRarity.Legendary,
    collection: "OG Memes",
    attributes: [
      { trait_type: "Power", value: "9800" },
      { trait_type: "Defense", value: "9000" },
      { trait_type: "Special", value: "Future Sight" },
    ],
    isVerified: true,
    listedAt: "2023-09-09T18:00:00Z",
  },
  {
    id: "8",
    name: "Wojak Feels",
    description: "A Wojak card capturing all the feels of the meme world.",
    image: NEW_CARD_IMAGES[3],
    price: 0.18,
    currency: "SOL",
    owner: "WojakWatcher",
    creator: "MemeDAO",
    rarity: CardRarity.Common,
    collection: "OG Memes",
    attributes: [
      { trait_type: "Power", value: "5000" },
      { trait_type: "Defense", value: "4800" },
      { trait_type: "Special", value: "Empathy Aura" },
    ],
    isVerified: true,
    listedAt: "2023-09-08T14:45:00Z",
  },
  {
    id: "9",
    name: "Snek Stealth",
    description: "A Snek card with unmatched stealth and cunning.",
    image: NEW_CARD_IMAGES[0],
    price: 0.42,
    currency: "SOL",
    owner: "SnekSneaker",
    creator: "MemeDAO",
    rarity: CardRarity.SuperRare,
    collection: "OG Memes",
    attributes: [
      { trait_type: "Power", value: "8500" },
      { trait_type: "Defense", value: "8000" },
      { trait_type: "Special", value: "Silent Strike" },
    ],
    isVerified: true,
    listedAt: "2023-09-07T11:30:00Z",
  },
  {
    id: "10",
    name: "Moon Landing",
    description: "A Moon card celebrating the ultimate meme achievement.",
    image: NEW_CARD_IMAGES[1],
    price: 0.6,
    currency: "SOL",
    owner: "MoonMission",
    creator: "MemeDAO",
    rarity: CardRarity.UltraRare,
    collection: "OG Memes",
    attributes: [
      { trait_type: "Power", value: "10000" },
      { trait_type: "Defense", value: "9500" },
      { trait_type: "Special", value: "Gravity Defiance" },
    ],
    isVerified: true,
    listedAt: "2023-09-06T20:15:00Z",
  },
  {
    id: "11",
    name: "Solana Summer",
    description: "A Solana-themed card capturing the essence of summer vibes.",
    image: NEW_CARD_IMAGES[2],
    price: 0.3,
    currency: "SOL",
    owner: "SolanaSurfer",
    creator: "MemeDAO",
    rarity: CardRarity.Rare,
    collection: "OG Memes",
    attributes: [
      { trait_type: "Power", value: "7200" },
      { trait_type: "Defense", value: "6800" },
      { trait_type: "Special", value: "Wave Rider" },
    ],
    isVerified: true,
    listedAt: "2023-09-05T17:00:00Z",
  },
  {
    id: "12",
    name: "Crypto Kitty",
    description: "A Crypto Kitty card bringing digital cuteness to your collection.",
    image: NEW_CARD_IMAGES[3],
    price: 0.2,
    currency: "SOL",
    owner: "KittyKeeper",
    creator: "MemeDAO",
    rarity: CardRarity.Uncommon,
    collection: "OG Memes",
    attributes: [
      { trait_type: "Power", value: "6000" },
      { trait_type: "Defense", value: "5800" },
      { trait_type: "Special", value: "Purrfect Charm" },
    ],
    isVerified: true,
    listedAt: "2023-09-04T13:45:00Z",
  },
]

// 确保所有卡片都使用新图片，可以循环分配或者手动指定

// 排序选项
type SortOption = {
  value: string
  label: string
}

const sortOptions: SortOption[] = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "power-desc", label: "Power: High to Low" },
  { value: "power-asc", label: "Power: Low to High" },
  { value: "bids-desc", label: "Most Bids" },
  { value: "likes-desc", label: "Most Liked" },
  { value: "newest", label: "Newest" },
]

// 格式化价格
const formatPrice = (price: number): string => {
  return price.toFixed(3)
}

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export default function MarketplacePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [cards, setCards] = useState<NFTCard[]>([])
  const [filteredCards, setFilteredCards] = useState<NFTCard[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortOption, setSortOption] = useState("price-asc")
  const [priceRange, setPriceRange] = useState([0, 0.5])
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [selectedCard, setSelectedCard] = useState<NFTCard | null>(null)
  const [showCardDialog, setShowCardDialog] = useState(false)
  const [bidAmount, setBidAmount] = useState("")
  const [walletBalance, setWalletBalance] = useState(0.5)

  // 筛选选项
  const [filterOptions, setFilterOptions] = useState({
    onlyAuctions: false,
    onlyBuyNow: false,
    legendary: false,
    rare: false,
    common: false,
    highPower: false,
  })

  // 模拟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setCards(mockNFTCards)
      setFilteredCards(mockNFTCards)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // 应用筛选和排序
  useEffect(() => {
    if (cards.length === 0) return

    let result = [...cards]

    // 应用搜索
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (card) => card.name.toLowerCase().includes(query) || card.owner.toLowerCase().includes(query),
      )
    }

    // 应用标签筛选
    if (activeTab === "auctions") {
      result = result.filter((card) => card.isAuction)
    } else if (activeTab === "buy-now") {
      result = result.filter((card) => !card.isAuction)
    } else if (activeTab === "trending") {
      result = result.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 6)
    }

    // 应用价格范围
    result = result.filter((card) => card.price >= priceRange[0] && card.price <= priceRange[1])

    // 应用其他筛选
    if (filterOptions.onlyAuctions) {
      result = result.filter((card) => card.isAuction)
    }

    if (filterOptions.onlyBuyNow) {
      result = result.filter((card) => !card.isAuction)
    }

    if (filterOptions.legendary) {
      result = result.filter(
        (card) =>
          card.rarity === CardRarity.Legendary ||
          card.rarity === CardRarity.UltraRare ||
          card.rarity === CardRarity.SuperRare,
      )
    }

    if (filterOptions.rare) {
      result = result.filter((card) => card.rarity === CardRarity.Rare)
    }

    if (filterOptions.common) {
      result = result.filter((card) => card.rarity === CardRarity.Common || card.rarity === CardRarity.Uncommon)
    }

    if (filterOptions.highPower) {
      result = result.filter((card) => (card.power || 0) >= 7000)
    }

    // 应用排序
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortOption === "power-desc") {
      result.sort((a, b) => (b.power || 0) - (a.power || 0))
    } else if (sortOption === "power-asc") {
      result.sort((a, b) => (a.power || 0) - (b.power || 0))
    } else if (sortOption === "bids-desc") {
      result.sort((a, b) => (b.bids || 0) - (a.bids || 0))
    } else if (sortOption === "likes-desc") {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    } else if (sortOption === "newest") {
      result.sort((a, b) => Number(b.id) - Number(a.id))
    }

    setFilteredCards(result)
  }, [cards, searchQuery, activeTab, sortOption, priceRange, filterOptions])

  // 处理搜索
  const handleSearch = () => {
    // 搜索逻辑已在useEffect中处理
  }

  // 处理出价
  const handleBid = () => {
    if (!selectedCard || !bidAmount) return

    const bidValue = Number.parseFloat(bidAmount)
    if (isNaN(bidValue) || bidValue <= (selectedCard.topBid || 0)) {
      alert("Please enter a valid bid amount higher than the current top bid")
      return
    }

    if (bidValue > walletBalance) {
      alert("Insufficient balance")
      return
    }

    // 模拟出价成功
    setWalletBalance((prev) => prev - bidValue)
    setShowCardDialog(false)

    // 在实际应用中，这里会调用API来提交出价
  }

  // 处理购买
  const handleBuyNow = () => {
    if (!selectedCard) return

    if (selectedCard.price > walletBalance) {
      alert("Insufficient balance")
      return
    }

    // 模拟购买成功
    setWalletBalance((prev) => prev - selectedCard.price)
    setShowCardDialog(false)

    // 在实际应用中，这里会调用API来完成购买
  }

  // 重置筛选器
  const resetFilters = () => {
    setFilterOptions({
      onlyAuctions: false,
      onlyBuyNow: false,
      legendary: false,
      rare: false,
      common: false,
      highPower: false,
    })
    setPriceRange([0, 0.5])
    setShowFilterDialog(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">NFT Marketplace</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-card px-4 py-2 rounded-lg border">
            <Wallet className="w-4 h-4 mr-2 text-purple-500" />
            <span className="font-medium">{walletBalance.toFixed(3)} SOL</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, seller..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilterDialog(true)}
            className={
              Object.values(filterOptions).some(Boolean) || priceRange[0] > 0 || priceRange[1] < 0.5
                ? "relative bg-primary/10 border-primary"
                : ""
            }
          >
            <Filter className="h-4 w-4" />
            {Object.values(filterOptions).some(Boolean) || priceRange[0] > 0 || priceRange[1] < 0.5 ? (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            ) : null}
          </Button>

          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All NFTs</TabsTrigger>
          <TabsTrigger value="auctions">Auctions</TabsTrigger>
          <TabsTrigger value="buy-now">Buy Now</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(8)
                .fill(0)
                .map((_, i) => <NFTCardSkeleton key={i} />)
            ) : filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <NFTCardItem
                  key={card.id}
                  card={card}
                  onClick={() => {
                    setSelectedCard(card)
                    setShowCardDialog(true)
                    setBidAmount(((card.topBid || 0) + 0.001).toFixed(3))
                  }}
                />
              ))
            ) : (
              <div className="col-span-full p-8 text-center">
                <div className="text-muted-foreground">No NFTs found matching your criteria</div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="auctions" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(8)
                .fill(0)
                .map((_, i) => <NFTCardSkeleton key={i} />)
            ) : filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <NFTCardItem
                  key={card.id}
                  card={card}
                  onClick={() => {
                    setSelectedCard(card)
                    setShowCardDialog(true)
                    setBidAmount(((card.topBid || 0) + 0.001).toFixed(3))
                  }}
                />
              ))
            ) : (
              <div className="col-span-full p-8 text-center">
                <div className="text-muted-foreground">No auctions found matching your criteria</div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="buy-now" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(8)
                .fill(0)
                .map((_, i) => <NFTCardSkeleton key={i} />)
            ) : filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <NFTCardItem
                  key={card.id}
                  card={card}
                  onClick={() => {
                    setSelectedCard(card)
                    setShowCardDialog(true)
                    setBidAmount(((card.topBid || 0) + 0.001).toFixed(3))
                  }}
                />
              ))
            ) : (
              <div className="col-span-full p-8 text-center">
                <div className="text-muted-foreground">No buy now items found matching your criteria</div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(8)
                .fill(0)
                .map((_, i) => <NFTCardSkeleton key={i} />)
            ) : filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <NFTCardItem
                  key={card.id}
                  card={card}
                  onClick={() => {
                    setSelectedCard(card)
                    setShowCardDialog(true)
                    setBidAmount(((card.topBid || 0) + 0.001).toFixed(3))
                  }}
                />
              ))
            ) : (
              <div className="col-span-full p-8 text-center">
                <div className="text-muted-foreground">No trending items found</div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 筛选对话框 */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter NFTs</DialogTitle>
            <DialogDescription>Apply filters to narrow down your results</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Price Range (SOL)</h3>
              <div className="flex items-center justify-between mb-2">
                <span>{priceRange[0].toFixed(3)}</span>
                <span>{priceRange[1].toFixed(3)}</span>
              </div>
              <Slider
                defaultValue={priceRange}
                max={0.5}
                step={0.001}
                value={priceRange}
                onValueChange={setPriceRange}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium mb-2">Sale Type</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="only-auctions"
                  checked={filterOptions.onlyAuctions}
                  onCheckedChange={(checked) =>
                    setFilterOptions({ ...filterOptions, onlyAuctions: checked as boolean, onlyBuyNow: false })
                  }
                />
                <Label htmlFor="only-auctions" className="text-sm font-medium">
                  Auctions Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="only-buy-now"
                  checked={filterOptions.onlyBuyNow}
                  onCheckedChange={(checked) =>
                    setFilterOptions({ ...filterOptions, onlyBuyNow: checked as boolean, onlyAuctions: false })
                  }
                />
                <Label htmlFor="only-buy-now" className="text-sm font-medium">
                  Buy Now Only
                </Label>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium mb-2">Rarity</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="legendary"
                  checked={filterOptions.legendary}
                  onCheckedChange={(checked) => setFilterOptions({ ...filterOptions, legendary: checked as boolean })}
                />
                <Label htmlFor="legendary" className="text-sm font-medium">
                  Legendary & Ultra Rare
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rare"
                  checked={filterOptions.rare}
                  onCheckedChange={(checked) => setFilterOptions({ ...filterOptions, rare: checked as boolean })}
                />
                <Label htmlFor="rare" className="text-sm font-medium">
                  Rare
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="common"
                  checked={filterOptions.common}
                  onCheckedChange={(checked) => setFilterOptions({ ...filterOptions, common: checked as boolean })}
                />
                <Label htmlFor="common" className="text-sm font-medium">
                  Common & Uncommon
                </Label>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium mb-2">Other</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="high-power"
                  checked={filterOptions.highPower}
                  onCheckedChange={(checked) => setFilterOptions({ ...filterOptions, highPower: checked as boolean })}
                />
                <Label htmlFor="high-power" className="text-sm font-medium">
                  High Power (7000+)
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={resetFilters} type="button">
              Reset Filters
            </Button>
            <Button onClick={() => setShowFilterDialog(false)} type="button">
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* NFT详情对话框 */}
      <Dialog open={showCardDialog} onOpenChange={setShowCardDialog}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] h-[90vh] p-0 overflow-hidden flex flex-col">
          <div className="flex flex-col md:flex-row h-full">
            {/* 左侧图片区域 */}
            <div className="w-full md:w-1/2 h-full bg-black flex items-center justify-center p-4 relative">
              {selectedCard && (
                <>
                  <button
                    className="absolute top-4 right-4 z-10 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                    onClick={() => setShowCardDialog(false)}
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                  <div className="relative w-full h-full max-h-[80vh] aspect-square">
                    <div className="absolute inset-0 p-4">
                      <Image
                        src={selectedCard.image || "/placeholder.svg"}
                        alt={selectedCard.name}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 右侧详情区域 */}
            <div className="w-full md:w-1/2 h-full overflow-y-auto p-6">
              {selectedCard && (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-1">
                        #{selectedCard.id} {selectedCard.name}
                      </h1>
                      <div className="flex items-center">
                        <Badge variant="secondary" className={`${rarityColors[selectedCard.rarity]} text-white mr-2`}>
                          {selectedCard.rarity}
                        </Badge>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <div className="relative w-5 h-5 rounded-full overflow-hidden mr-1">
                            <Image
                              src={selectedCard.owner || "/placeholder.svg"}
                              alt={selectedCard.owner}
                              fill
                              className="object-cover"
                            />
                          </div>
                          Owned by <span className="text-primary ml-1">{selectedCard.owner}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-card p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">PRICE</div>
                      <div className="font-bold">{formatPrice(selectedCard.price)} SOL</div>
                    </div>
                    <div className="bg-card p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">COLLECTION</div>
                      <div className="font-bold">{selectedCard.collection}</div>
                    </div>
                    <div className="bg-card p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">POWER</div>
                      <div className="font-bold">{selectedCard.attributes[0].value}</div>
                    </div>
                    <div className="bg-card p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">DEFENSE</div>
                      <div className="font-bold">{selectedCard.attributes[1].value}</div>
                    </div>
                  </div>

                  <div className="bg-card p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold">Current Price</div>
                    </div>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold mr-2">{formatPrice(selectedCard.price)} SOL</span>
                      <span className="text-muted-foreground">≈ ${(selectedCard.price * 100).toFixed(2)}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">Buy Now</Button>
                      <Button variant="outline" className="flex-1">
                        Make Offer
                      </Button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <Tabs defaultValue="traits">
                      <TabsList className="w-full">
                        <TabsTrigger value="traits">Traits</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="offers">Offers</TabsTrigger>
                      </TabsList>
                      <TabsContent value="traits" className="mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-card p-3 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">RARITY</div>
                            <div className="font-medium">{selectedCard.rarity}</div>
                            <div className="text-xs text-primary mt-1">Top {Math.floor(Math.random() * 10) + 1}%</div>
                          </div>
                          <div className="bg-card p-3 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">POWER</div>
                            <div className="font-medium">{selectedCard.attributes[0].value}</div>
                            <div className="text-xs text-primary mt-1">Top {Math.floor(Math.random() * 15) + 5}%</div>
                          </div>
                          <div className="bg-card p-3 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">DEFENSE</div>
                            <div className="font-medium">{selectedCard.attributes[1].value}</div>
                            <div className="text-xs text-primary mt-1">Top {Math.floor(Math.random() * 20) + 10}%</div>
                          </div>
                          <div className="bg-card p-3 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">SPECIAL ABILITY</div>
                            <div className="font-medium">{selectedCard.attributes[2].value}</div>
                            <div className="text-xs text-primary mt-1">
                              +{Math.floor(Math.random() * 20) + 10}% Virality
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="history" className="mt-4">
                        <div className="space-y-4">
                          <div className="bg-card p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Listed for {formatPrice(selectedCard.price)} SOL</span>
                              </div>
                              <div className="text-sm text-muted-foreground">2 days ago</div>
                            </div>
                          </div>
                          <div className="bg-card p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <ShoppingCart className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Purchased for {formatPrice(selectedCard.price)} SOL</span>
                              </div>
                              <div className="text-sm text-muted-foreground">1 week ago</div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="offers" className="mt-4">
                        <div className="text-center py-6 text-muted-foreground">No offers yet</div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold mb-3">Price History</h3>
                    <div className="bg-card rounded-lg p-4 h-[200px] flex items-center justify-center">
                      <div className="w-full h-full relative">
                        {/* 这里可以添加价格历史图表，但为了简单起见，我们使用一个占位符 */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TrendingUp className="h-16 w-16 text-muted-foreground/20" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold mb-3">More from this collection</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {cards
                        .filter((c) => c.id !== selectedCard.id)
                        .slice(0, 3)
                        .map((card) => (
                          <div
                            key={card.id}
                            className="bg-card rounded-lg overflow-hidden cursor-pointer hover:ring-1 hover:ring-primary transition-all"
                            onClick={() => {
                              setSelectedCard(card)
                            }}
                          >
                            <div className="relative aspect-square">
                              <Image
                                src={card.image || "/placeholder.svg"}
                                alt={card.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-2">
                              <div className="text-sm font-medium truncate">{card.name}</div>
                              <div className="text-xs text-muted-foreground">{formatPrice(card.price)} SOL</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// NFT卡片组件
// 修改 NFTCardItem 组件以适应新的卡片图片比例
function NFTCardItem({ card, onClick }: { card: NFTCard; onClick: () => void }) {
  return (
    <Card
      className="overflow-hidden hover:border-primary transition-colors cursor-pointer card-shine"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <div className="absolute inset-0 p-4">
          <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-contain" priority />
        </div>
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <Badge variant="secondary" className={`${rarityColors[card.rarity]} text-white`}>
                {card.rarity}
              </Badge>
            </div>
            <h3 className="font-bold">{card.name}</h3>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span>{card.attributes[0].value}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">Price:</div>
          <div className="font-medium">{formatPrice(card.price)} SOL</div>
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center">
            <Heart className="w-3 h-3 mr-1" />
            {Math.floor(Math.random() * 100)}
          </div>
          <div className="flex items-center">
            <ShoppingCart className="w-3 h-3 mr-1" />
            Buy Now
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// NFT卡片骨架屏组件
// 修改 NFTCardSkeleton 组件以匹配新的卡片比例
function NFTCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square rounded-lg m-4" />
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-10" />
        </div>
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-14" />
        </div>
      </CardContent>
    </Card>
  )
}

