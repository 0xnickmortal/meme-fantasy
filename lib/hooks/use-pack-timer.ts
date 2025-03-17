"use client"

import { useState, useEffect } from "react"

interface PackTimerState {
  packOpportunities: number
  timeUntilNextPack: number // in seconds
  isTimerActive: boolean
}

export function usePackTimer() {
  const [state, setState] = useState<PackTimerState>({
    packOpportunities: 5, // 5 opportunities for new users
    timeUntilNextPack: 7200, // 2 hours = 7200 seconds
    isTimerActive: false,
  })

  useEffect(() => {
    // Load state from localStorage
    const savedState = localStorage.getItem("packTimerState")
    const lastUpdated = localStorage.getItem("packTimerLastUpdated")

    if (savedState && lastUpdated) {
      const parsedState = JSON.parse(savedState) as PackTimerState
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

      setState({
        packOpportunities: newOpportunities,
        timeUntilNextPack: newTimeUntilNextPack > 0 ? newTimeUntilNextPack : 7200,
        isTimerActive: isActive,
      })
    } else {
      // New user, set default state
      setState({
        packOpportunities: 5,
        timeUntilNextPack: 7200,
        isTimerActive: false,
      })

      // Save to localStorage
      saveState({
        packOpportunities: 5,
        timeUntilNextPack: 7200,
        isTimerActive: false,
      })
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (state.isTimerActive) {
      interval = setInterval(() => {
        setState((prevState) => {
          const newTimeUntilNextPack = prevState.timeUntilNextPack - 1

          if (newTimeUntilNextPack <= 0) {
            // Time's up, increase pack opening opportunity
            const newOpportunities = Math.min(prevState.packOpportunities + 1, 5)
            const isActive = newOpportunities < 5

            const newState = {
              packOpportunities: newOpportunities,
              timeUntilNextPack: 7200, // Reset to 2 hours
              isTimerActive: isActive,
            }

            saveState(newState)
            return newState
          }

          const newState = {
            ...prevState,
            timeUntilNextPack: newTimeUntilNextPack,
          }

          saveState(newState)
          return newState
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [state.isTimerActive])

  // Use pack opening opportunity
  const usePackOpportunity = () => {
    if (state.packOpportunities > 0) {
      const newOpportunities = state.packOpportunities - 1
      const isActive = newOpportunities < 5

      const newState = {
        packOpportunities: newOpportunities,
        timeUntilNextPack: state.timeUntilNextPack,
        isTimerActive: true, // Activate timer after using one opportunity
      }

      setState(newState)
      saveState(newState)
      return true
    }
    return false
  }

  // Save state to localStorage
  const saveState = (state: PackTimerState) => {
    localStorage.setItem("packTimerState", JSON.stringify(state))
    localStorage.setItem("packTimerLastUpdated", Date.now().toString())
  }

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return {
    packOpportunities: state.packOpportunities,
    timeUntilNextPack: state.timeUntilNextPack,
    formattedTimeUntilNextPack: formatTime(state.timeUntilNextPack),
    isTimerActive: state.isTimerActive,
    usePackOpportunity,
  }
}
