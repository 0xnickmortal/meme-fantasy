"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Search, TrendingUp, RefreshCw, ExternalLink, Heart, MessageCircle, Repeat } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// 在文件顶部添加新的卡片图片常量
const NEW_CARD_IMAGES = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-olr9d2aE2Q4B1q7bGUOO6Q9Sa45wJV.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-kOCVmyOO9SXGYayxMy3W2kHbjXUiVR.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-M7wTxZE2HqPO1FddK78pCSr3SDdoMS.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-cwDwOaf6X9BujnFhGzYr2GAytsznki.png",
]

// 模拟的Twitter/X数据
type Tweet = {
  id: string
  account: {
    handle: string
    name: string
    avatar: string
    verified: boolean
  }
  content: string
  image?: string
  timestamp: string
  stats: {
    likes: number
    comments: number
    reposts: number
  }
}

type CoinAccount = {
  id: string
  name: string
  handle: string
  avatar: string
  description: string
  followers: number
  verified: boolean
}

// 更新 coinAccounts 数组中的 avatar 属性
const coinAccounts: CoinAccount[] = [
  {
    id: "dogecoin",
    name: "Dogecoin",
    handle: "dogecoin",
    avatar: NEW_CARD_IMAGES[0],
    description: "The original meme coin. Much wow!",
    followers: 3200000,
    verified: true,
  },
  {
    id: "pepe",
    name: "Pepe",
    handle: "pepecoineth",
    avatar: NEW_CARD_IMAGES[1],
    description: "The most memeable memecoin in crypto.",
    followers: 450000,
    verified: true,
  },
  {
    id: "shib",
    name: "SHIB",
    handle: "Shibtoken",
    avatar: NEW_CARD_IMAGES[2],
    description: "SHIB - The Dogecoin Killer. Decentralized meme token that grew into a vibrant ecosystem.",
    followers: 3900000,
    verified: true,
  },
  {
    id: "bonk",
    name: "BONK",
    handle: "bonk_inu",
    avatar: NEW_CARD_IMAGES[3],
    description: "The first Solana dog coin for the people, by the people.",
    followers: 280000,
    verified: true,
  },
]

// 更新 mockTweets 对象中的 avatar 和 image 属性
// 找到 mockTweets 对象定义，并更新所有相关属性
const mockTweets: Record<string, Tweet[]> = {
  dogecoin: [
    {
      id: "doge1",
      account: {
        handle: "dogecoin",
        name: "Dogecoin",
        avatar: NEW_CARD_IMAGES[0],
        verified: true,
      },
      content:
        "Much wow! Very excited to announce our new partnership with #MemeFantasy trading card game! Collect your favorite DOGE cards now! 🚀🐕",
      image: NEW_CARD_IMAGES[0],
      timestamp: "2h ago",
      stats: {
        likes: 12500,
        comments: 1200,
        reposts: 3400,
      },
    },
    {
      id: "doge2",
      account: {
        handle: "dogecoin",
        name: "Dogecoin",
        avatar: NEW_CARD_IMAGES[0],
        verified: true,
      },
      content:
        "Happy #DogeDay to all our amazing community members! Together we've built something truly special. To the moon! 🌕",
      timestamp: "1d ago",
      stats: {
        likes: 45200,
        comments: 3100,
        reposts: 12400,
      },
    },
  ],
  pepe: [
    {
      id: "pepe1",
      account: {
        handle: "pepecoineth",
        name: "Pepe",
        avatar: NEW_CARD_IMAGES[1],
        verified: true,
      },
      content: "PEPE just broke another ATH! The most memeable memecoin keeps climbing! #PEPE #Crypto #ToTheMoon",
      image: NEW_CARD_IMAGES[1],
      timestamp: "5h ago",
      stats: {
        likes: 8700,
        comments: 920,
        reposts: 2300,
      },
    },
    {
      id: "pepe2",
      account: {
        handle: "pepecoineth",
        name: "Pepe",
        avatar: NEW_CARD_IMAGES[1],
        verified: true,
      },
      content: "New listing alert! $PEPE is now available on another major exchange! The takeover continues! 🐸💚",
      timestamp: "2d ago",
      stats: {
        likes: 12300,
        comments: 1500,
        reposts: 4200,
      },
    },
  ],
  shib: [
    {
      id: "shib1",
      account: {
        handle: "Shibtoken",
        name: "SHIB",
        avatar: NEW_CARD_IMAGES[2],
        verified: true,
      },
      content:
        "SHIB Army, we're excited to announce Shibarium has processed over 35 million transactions! The ecosystem is growing stronger every day. #SHIB #Shibarium",
      image: NEW_CARD_IMAGES[2],
      timestamp: "3h ago",
      stats: {
        likes: 15600,
        comments: 2300,
        reposts: 5100,
      },
    },
    {
      id: "shib2",
      account: {
        handle: "Shibtoken",
        name: "SHIB",
        avatar: NEW_CARD_IMAGES[2],
        verified: true,
      },
      content: "The SHIB burn rate is up 800% in the last 24 hours! Keep burning, SHIB Army! 🔥 #ShibBurn",
      timestamp: "1d ago",
      stats: {
        likes: 23400,
        comments: 3200,
        reposts: 7800,
      },
    },
  ],
  bonk: [
    {
      id: "bonk1",
      account: {
        handle: "bonk_inu",
        name: "BONK",
        avatar: NEW_CARD_IMAGES[3],
        verified: true,
      },
      content: "BONK is now the most traded token on Solana! The people's memecoin keeps winning! #BONK #Solana",
      timestamp: "6h ago",
      stats: {
        likes: 7800,
        comments: 890,
        reposts: 2100,
      },
    },
    {
      id: "bonk2",
      account: {
        handle: "bonk_inu",
        name: "BONK",
        avatar: NEW_CARD_IMAGES[3],
        verified: true,
      },
      content:
        "New BONK merch drop coming next week! Who's ready to rep their favorite Solana memecoin? 👕🧢 #BONKarmy",
      timestamp: "2d ago",
      stats: {
        likes: 5600,
        comments: 720,
        reposts: 1300,
      },
    },
  ],
}

// 获取所有推文并按时间排序
const getAllTweets = (): Tweet[] => {
  const allTweets: Tweet[] = []
  Object.values(mockTweets).forEach((tweets) => {
    allTweets.push(...tweets)
  })

  // 简单的排序逻辑，实际应用中可能需要更复杂的时间解析
  return allTweets.sort((a, b) => {
    if (a.timestamp.includes("h") && b.timestamp.includes("d")) return -1
    if (a.timestamp.includes("d") && b.timestamp.includes("h")) return 1

    const aNum = Number.parseInt(a.timestamp.split(/[hd]/)[0])
    const bNum = Number.parseInt(b.timestamp.split(/[hd]/)[0])

    if (a.timestamp.includes("h") && b.timestamp.includes("h")) return aNum - bNum
    if (a.timestamp.includes("d") && b.timestamp.includes("d")) return aNum - bNum

    return 0
  })
}

// 获取热门推文
const getHotTweets = (): Tweet[] => {
  const allTweets = getAllTweets()
  return [...allTweets]
    .sort((a, b) => b.stats.likes + b.stats.reposts * 2 - (a.stats.likes + a.stats.reposts * 2))
    .slice(0, 5)
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

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [tweets, setTweets] = useState<Tweet[]>([])

  // 模拟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)

      if (activeTab === "all") {
        setTweets(getAllTweets())
      } else if (activeTab === "hot") {
        setTweets(getHotTweets())
      } else {
        setTweets(mockTweets[activeTab] || [])
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [activeTab])

  // 处理搜索
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      if (activeTab === "all") {
        setTweets(getAllTweets())
      } else if (activeTab === "hot") {
        setTweets(getHotTweets())
      } else {
        setTweets(mockTweets[activeTab] || [])
      }
      return
    }

    const query = searchQuery.toLowerCase()
    let filteredTweets: Tweet[] = []

    if (activeTab === "all") {
      filteredTweets = getAllTweets()
    } else if (activeTab === "hot") {
      filteredTweets = getHotTweets()
    } else {
      filteredTweets = mockTweets[activeTab] || []
    }

    setTweets(
      filteredTweets.filter(
        (tweet) =>
          tweet.content.toLowerCase().includes(query) ||
          tweet.account.name.toLowerCase().includes(query) ||
          tweet.account.handle.toLowerCase().includes(query),
      ),
    )
  }

  // 处理刷新
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)

      if (activeTab === "all") {
        setTweets(getAllTweets())
      } else if (activeTab === "hot") {
        setTweets(getHotTweets())
      } else {
        setTweets(mockTweets[activeTab] || [])
      }
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Discover</h1>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tweets, accounts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 左侧账号列表 */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-4">Meme Accounts</h2>
              <div className="space-y-4">
                {coinAccounts.map((account) => (
                  <div
                    key={account.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors ${activeTab === account.id ? "bg-accent" : ""}`}
                    onClick={() => {
                      setActiveTab(account.id)
                      setIsLoading(true)
                    }}
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={account.avatar || "/placeholder.svg"}
                        alt={account.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{account.name}</span>
                        {account.verified && (
                          <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
                            <Sparkles className="w-3 h-3" />
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">@{account.handle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-4">Trending Topics</h2>
              <div className="space-y-2">
                {["#MemeFantasy", "#Crypto", "#NFTs", "#Solana", "#Ethereum", "#DeFi", "#Web3"].map((topic) => (
                  <div key={topic} className="flex items-center justify-between">
                    <span className="text-primary font-medium">{topic}</span>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧推文列表 */}
        <div className="md:col-span-3">
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={(value) => {
              setActiveTab(value)
              setIsLoading(true)
            }}
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="all">All Feeds</TabsTrigger>
              <TabsTrigger value="hot">Hot</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => <TweetSkeleton key={i} />)
              ) : tweets.length > 0 ? (
                tweets.map((tweet) => <TweetCard key={tweet.id} tweet={tweet} />)
              ) : (
                <Card className="p-8 text-center">
                  <div className="text-muted-foreground">No tweets found</div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="hot" className="space-y-4">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => <TweetSkeleton key={i} />)
              ) : tweets.length > 0 ? (
                tweets.map((tweet) => <TweetCard key={tweet.id} tweet={tweet} />)
              ) : (
                <Card className="p-8 text-center">
                  <div className="text-muted-foreground">No hot tweets found</div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => <TweetSkeleton key={i} />)
              ) : (
                <Card className="p-8 text-center">
                  <div className="text-muted-foreground">Trending data coming soon</div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// 推文卡片组件
function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <Card className="overflow-hidden hover:border-primary transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
            <Image
              src={tweet.account.avatar || "/placeholder.svg"}
              alt={tweet.account.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-bold">{tweet.account.name}</span>
                {tweet.account.verified && (
                  <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
                    <Sparkles className="w-3 h-3" />
                  </Badge>
                )}
                <span className="text-muted-foreground ml-1 text-sm">@{tweet.account.handle}</span>
              </div>
              <span className="text-muted-foreground text-sm">{tweet.timestamp}</span>
            </div>

            <div className="mt-2 break-words">{tweet.content}</div>

            {tweet.image && (
              <div className="mt-3 relative rounded-lg overflow-hidden">
                <Image
                  src={tweet.image || "/placeholder.svg"}
                  alt="Tweet image"
                  width={500}
                  height={300}
                  className="object-cover w-full max-h-[300px]"
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-4 text-muted-foreground">
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <Heart className="w-4 h-4" />
                <span>{formatNumber(tweet.stats.likes)}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>{formatNumber(tweet.stats.comments)}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <Repeat className="w-4 h-4" />
                <span>{formatNumber(tweet.stats.reposts)}</span>
              </button>
              <a
                href={`https://x.com/${tweet.account.handle}/status/${tweet.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View</span>
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 推文骨架屏组件
function TweetSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-3/4 mt-1" />
            <Skeleton className="h-40 w-full mt-3 rounded-lg" />
            <div className="flex justify-between mt-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

