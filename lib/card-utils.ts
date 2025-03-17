// 新上传的四张卡片图片URL
export const cardImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cardpack1.png-urov4vhTcaPaSFLeVMgIDczIQmAUwl.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cardpack2.png-0u8J2jTf3i497EU1BHVAt8GzworeCW.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cardpack3.png-6ydC6S6tRH44utKuMyzrqhJAIpfohX.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/package_pepe-yw5yfbRpE4jznLXgSzFipRwP6QiMiF.glb",
]

// 随机选择一张卡片图片
export function getRandomCardImage(): string {
  const randomIndex = Math.floor(Math.random() * cardImages.length)
  return cardImages[randomIndex]
}

// 根据包类型获取特定的卡片图片
export function getCardImageByType(packType: string | null): string {
  switch (packType) {
    case "doge":
      return cardImages[0]
    case "popcat":
      return cardImages[1]
    case "pepe":
      return cardImages[2]
    default:
      return getRandomCardImage()
  }
}

