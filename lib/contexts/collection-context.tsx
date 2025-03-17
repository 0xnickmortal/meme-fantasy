"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CardData } from "../card-data"

interface CollectionContextType {
  cards: CardData[]
  addCards: (newCards: CardData[]) => void
  removeCards: (cardIds: number[]) => void
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined)

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<CardData[]>([])

  // Load card collection from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCards = localStorage.getItem("cardCollection")
      if (savedCards) {
        try {
          setCards(JSON.parse(savedCards))
        } catch (error) {
          console.error("Failed to parse card collection:", error)
        }
      }
    }
  }, [])

  // Save card collection to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cardCollection", JSON.stringify(cards))
    }
  }, [cards])

  // Add new cards to collection
  const addCards = (newCards: CardData[]) => {
    if (newCards && newCards.length > 0) {
      setCards((prevCards) => [...prevCards, ...newCards])
    }
  }

  // Remove cards from collection
  const removeCards = (cardIds: number[]) => {
    if (cardIds && cardIds.length > 0) {
      setCards((prevCards) => prevCards.filter((card) => !cardIds.includes(card.id)))
    }
  }

  return <CollectionContext.Provider value={{ cards, addCards, removeCards }}>{children}</CollectionContext.Provider>
}

export function useCollection() {
  const context = useContext(CollectionContext)
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider")
  }
  return context
}
