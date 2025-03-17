export enum CardRarity {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  Legendary = "Legendary",
  UltraRare = "UltraRare",
  SuperRare = "SuperRare",
}

export const rarityColors: Record<CardRarity, string> = {
  [CardRarity.Common]: "bg-gray-500",
  [CardRarity.Uncommon]: "bg-green-500",
  [CardRarity.Rare]: "bg-blue-500",
  [CardRarity.Legendary]: "bg-yellow-500",
  [CardRarity.UltraRare]: "bg-purple-500",
  [CardRarity.SuperRare]: "bg-red-500",
}

