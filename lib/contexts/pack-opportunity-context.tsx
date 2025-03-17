"use client"

import { createContext, useContext, type ReactNode, useState, useEffect } from "react"

interface PackOpportunityContextType {
  packOpportunities: number
  timeUntilNextPack: number
  formattedTimeUntilNextPack: string
  isTimerActive: boolean
  usePackOpportunity: () => boolean
  isPackOpening: boolean
  setIsPackOpening: (isOpening: boolean) => void
}

const PackOpportunityContext = createContext<PackOpportunityContextType | undefined>(undefined)

export function PackOpportunityProvider({ children }: { children: ReactNode }) {
  const [packOpportunities, setPackOpportunities] = useState(5) // 5 opportunities for new users
  const [timeUntilNextPack, setTimeUntilNextPack] = useState(7200) // 2 hours = 7200 seconds
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isPackOpening, setIsPackOpening] = useState(false)

  // Load state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("packOpportunityState")
    const lastUpdated = localStorage.getItem("packOpportunityLastUpdated")

    if (savedState && lastUpdated) {
      const parsedState = JSON.parse(savedState)
      const lastUpdatedTime = Number.parseInt(lastUpdated, 10)
      const currentTime = Date.now()
      const elapsedSeconds = Math.floor((currentTime - lastUpdatedTime) / 1000)

      // Calculate pack opportunities that should be added during offline period
      const additionalOpportunities = Math.floor(elapsedSeconds / 7200)
      let newOpportunities = Math.min(parsedState.packOpportunities + additionalOpportunities, 5)

      // Calculate new countdown
      let newTimeUntilNextPack = parsedState.timeUntilNextPack - (elapsedSeconds % 7200)
      if (newTimeUntilNextPack <= 0 && newOpportunities < 5) {
        newOpportunities += 1
        newTimeUntilNextPack = 7200
      }

      // If already have 5 opportunities, pause the timer
      const isActive = newOpportunities < 5

      setPackOpportunities(newOpportunities)
      setTimeUntilNextPack(newTimeUntilNextPack > 0 ? newTimeUntilNextPack : 7200)
      setIsTimerActive(isActive)
    } else {
      // New user, set default state
      setPackOpportunities(5)
      setTimeUntilNextPack(7200)
      setIsTimerActive(false)

      // Save to localStorage
      saveState(5, 7200, false)
    }
  }, [])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerActive) {
      interval = setInterval(() => {
        setTimeUntilNextPack((prev) => {
          const newTime = prev - 1

          if (newTime <= 0) {
            // Time's up, increase pack opening opportunity
            const newOpportunities = Math.min(packOpportunities + 1, 5)
            setPackOpportunities(newOpportunities)

            // If reached 5 opportunities, pause timer
            if (newOpportunities >= 5) {
              setIsTimerActive(false)
            }

            saveState(newOpportunities, 7200, newOpportunities < 5)
            return 7200 // Reset to 2 hours
          }

          saveState(packOpportunities, newTime, isTimerActive)
          return newTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, packOpportunities])

  // Use pack opening opportunity
  const usePackOpportunity = () => {
    if (packOpportunities > 0) {
      const newOpportunities = packOpportunities - 1
      setPackOpportunities(newOpportunities)

      // If previously had 5 opportunities (timer paused), now used one, need to start timer
      if (packOpportunities === 5) {
        setIsTimerActive(true)
      }

      saveState(newOpportunities, timeUntilNextPack, true)
      return true
    }
    return false
  }

  // Save state to localStorage
  const saveState = (opportunities: number, time: number, active: boolean) => {
    localStorage.setItem(
      "packOpportunityState",
      JSON.stringify({
        packOpportunities: opportunities,
        timeUntilNextPack: time,
        isTimerActive: active,
      }),
    )
    localStorage.setItem("packOpportunityLastUpdated", Date.now().toString())
  }

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <PackOpportunityContext.Provider
      value={{
        packOpportunities,
        timeUntilNextPack,
        formattedTimeUntilNextPack: formatTime(timeUntilNextPack),
        isTimerActive,
        usePackOpportunity,
        isPackOpening,
        setIsPackOpening,
      }}
    >
      {children}
    </PackOpportunityContext.Provider>
  )
}

export function usePackOpportunity() {
  const context = useContext(PackOpportunityContext)
  if (context === undefined) {
    throw new Error("usePackOpportunity must be used within a PackOpportunityProvider")
  }
  return context
}
