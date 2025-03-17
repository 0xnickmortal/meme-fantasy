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
  const [packOpportunities, setPackOpportunities] = useState(5) // 新用户默认5次机会
  const [timeUntilNextPack, setTimeUntilNextPack] = useState(7200) // 2小时 = 7200秒
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isPackOpening, setIsPackOpening] = useState(false)

  // 从localStorage加载状态
  useEffect(() => {
    const savedState = localStorage.getItem("packOpportunityState")
    const lastUpdated = localStorage.getItem("packOpportunityLastUpdated")

    if (savedState && lastUpdated) {
      const parsedState = JSON.parse(savedState)
      const lastUpdatedTime = Number.parseInt(lastUpdated, 10)
      const currentTime = Date.now()
      const elapsedSeconds = Math.floor((currentTime - lastUpdatedTime) / 1000)

      // 计算在离线期间应该增加的开包机会
      const additionalOpportunities = Math.floor(elapsedSeconds / 7200)
      let newOpportunities = Math.min(parsedState.packOpportunities + additionalOpportunities, 5)

      // 计算新的倒计时
      let newTimeUntilNextPack = parsedState.timeUntilNextPack - (elapsedSeconds % 7200)
      if (newTimeUntilNextPack <= 0 && newOpportunities < 5) {
        newOpportunities += 1
        newTimeUntilNextPack = 7200
      }

      // 如果已经有5次机会，暂停计时器
      const isActive = newOpportunities < 5

      setPackOpportunities(newOpportunities)
      setTimeUntilNextPack(newTimeUntilNextPack > 0 ? newTimeUntilNextPack : 7200)
      setIsTimerActive(isActive)
    } else {
      // 新用户，设置默认状态
      setPackOpportunities(5)
      setTimeUntilNextPack(7200)
      setIsTimerActive(false)

      // 保存到localStorage
      saveState(5, 7200, false)
    }
  }, [])

  // 计时器
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerActive) {
      interval = setInterval(() => {
        setTimeUntilNextPack((prev) => {
          const newTime = prev - 1

          if (newTime <= 0) {
            // 时间到，增加一次开包机会
            const newOpportunities = Math.min(packOpportunities + 1, 5)
            setPackOpportunities(newOpportunities)

            // 如果达到5次机会，暂停计时器
            if (newOpportunities >= 5) {
              setIsTimerActive(false)
            }

            saveState(newOpportunities, 7200, newOpportunities < 5)
            return 7200 // 重置为2小时
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

  // 使用开包机会
  const usePackOpportunity = () => {
    if (packOpportunities > 0) {
      const newOpportunities = packOpportunities - 1
      setPackOpportunities(newOpportunities)

      // 如果之前有5次机会（计时器暂停），现在使用了一次，需要启动计时器
      if (packOpportunities === 5) {
        setIsTimerActive(true)
      }

      saveState(newOpportunities, timeUntilNextPack, true)
      return true
    }
    return false
  }

  // 保存状态到localStorage
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

  // 格式化时间为 HH:MM:SS
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

