import { CardRarity } from "./enums"

export interface CardData {
  id: number
  name: string
  rarity: CardRarity
  power: number
  image: string
  socialScore: number
  isNFT: boolean
}

// 卡片图片资源
export const cardImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-olr9d2aE2Q4B1q7bGUOO6Q9Sa45wJV.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-kOCVmyOO9SXGYayxMy3W2kHbjXUiVR.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-M7wTxZE2HqPO1FddK78pCSr3SDdoMS.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-cwDwOaf6X9BujnFhGzYr2GAytsznki.png",
]

// 卡片名称库
export const cardNames = [
  "DOGE",
  "PEPE",
  "SHIB",
  "FLOKI",
  "BONK",
  "SAMO",
  "ELON",
  "WOJAK",
  "SNEK",
  "MOON",
  "CHAD",
  "FROG",
  "HODL",
  "BULL",
  "BEAR",
  "PUMP",
  "DUMP",
  "MOON",
  "LAMBO",
  "WHALE",
  "APE",
  "DEFI",
  "NFT",
  "MEME",
  "COIN",
  "TOKEN",
  "CRYPTO",
  "DIAMOND",
  "HANDS",
  "ROCKET",
]

// 不同包类型的稀有度分布
export const rarityDistribution = {
  doge: {
    [CardRarity.Common]: 50,
    [CardRarity.Uncommon]: 30,
    [CardRarity.Rare]: 15,
    [CardRarity.Legendary]: 4,
    [CardRarity.UltraRare]: 0.9,
    [CardRarity.SuperRare]: 0.1,
  },
  popcat: {
    [CardRarity.Common]: 40,
    [CardRarity.Uncommon]: 35,
    [CardRarity.Rare]: 20,
    [CardRarity.Legendary]: 4,
    [CardRarity.UltraRare]: 0.8,
    [CardRarity.SuperRare]: 0.2,
  },
  pepe: {
    [CardRarity.Common]: 30,
    [CardRarity.Uncommon]: 35,
    [CardRarity.Rare]: 25,
    [CardRarity.Legendary]: 8,
    [CardRarity.UltraRare]: 1.5,
    [CardRarity.SuperRare]: 0.5,
  },
}

// 根据稀有度生成卡牌属性
export function generateCardStats(rarity: CardRarity): { power: number; socialScore: number } {
  let basePower = 0
  let baseSocialScore = 0

  switch (rarity) {
    case CardRarity.Common:
      basePower = 4000 + Math.floor(Math.random() * 1000)
      baseSocialScore = 50 + Math.floor(Math.random() * 20)
      break
    case CardRarity.Uncommon:
      basePower = 5000 + Math.floor(Math.random() * 1500)
      baseSocialScore = 65 + Math.floor(Math.random() * 20)
      break
    case CardRarity.Rare:
      basePower = 6500 + Math.floor(Math.random() * 2000)
      baseSocialScore = 75 + Math.floor(Math.random() * 15)
      break
    case CardRarity.Legendary:
      basePower = 8500 + Math.floor(Math.random() * 1500)
      baseSocialScore = 85 + Math.floor(Math.random() * 15)
      break
    case CardRarity.UltraRare:
      basePower = 9500 + Math.floor(Math.random() * 1000)
      baseSocialScore = 90 + Math.floor(Math.random() * 10)
      break
    case CardRarity.SuperRare:
      basePower = 10000 + Math.floor(Math.random() * 500)
      baseSocialScore = 95 + Math.floor(Math.random() * 5)
      break
  }

  return {
    power: basePower,
    socialScore: baseSocialScore,
  }
}

// 根据包类型随机生成稀有度
export function generateRarity(packType = "doge"): CardRarity {
  const distribution = rarityDistribution[packType as keyof typeof rarityDistribution] || rarityDistribution.doge
  const rand = Math.random() * 100

  let cumulativeChance = 0
  for (const [rarity, chance] of Object.entries(distribution)) {
    cumulativeChance += chance
    if (rand <= cumulativeChance) {
      return rarity as CardRarity
    }
  }

  return CardRarity.Common // 默认返回普通卡
}

// 生成一张随机卡牌
export function generateRandomCard(packType = "doge"): CardData {
  const rarity = generateRarity(packType)
  const { power, socialScore } = generateCardStats(rarity)
  const randomId = Date.now() + Math.floor(Math.random() * 1000)
  const randomName = cardNames[Math.floor(Math.random() * cardNames.length)]
  const randomImage = cardImages[Math.floor(Math.random() * cardImages.length)]
  const isNFT = Math.random() < 0.2 // 20%的概率是NFT

  return {
    id: randomId,
    name: randomName,
    rarity,
    power,
    image: randomImage,
    socialScore,
    isNFT,
  }
}

// 生成一组随机卡牌
export function generateCardPack(packType = "doge", count = 5): CardData[] {
  const cards: CardData[] = []
  for (let i = 0; i < count; i++) {
    cards.push(generateRandomCard(packType))
  }

  // 按稀有度排序
  return cards.sort((a, b) => {
    const rarityOrder = {
      [CardRarity.Common]: 0,
      [CardRarity.Uncommon]: 1,
      [CardRarity.Rare]: 2,
      [CardRarity.Legendary]: 3,
      [CardRarity.UltraRare]: 4,
      [CardRarity.SuperRare]: 5,
    }

    return rarityOrder[b.rarity] - rarityOrder[a.rarity]
  })
}

