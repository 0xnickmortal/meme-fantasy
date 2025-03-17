"use client"

import { useState, useEffect } from "react"

interface PackTimerState {
  packOpportunities: number
  timeUntilNextPack: number // 以秒为单位
  isTimerActive: boolean
}

export function usePackTimer() {
  const [state, setState] = useState<PackTimerState>({
    packOpportunities: 5, // 新用户默认5次机会
    timeUntilNextPack: 7200, // 2小时 = 7200秒
    isTimerActive: false,
  })

  useEffect(() => {
    // 从localStorage加载状态
    const savedState = localStorage.getItem("packTimerState")
    const lastUpdated = localStorage.getItem("packTimerLastUpdated")

    if (savedState && lastUpdated) {
      const parsedState = JSON.parse(savedState) as PackTimerState
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

      setState({
        packOpportunities: newOpportunities,
        timeUntilNextPack: newTimeUntilNextPack > 0 ? newTimeUntilNextPack : 7200,
        isTimerActive: isActive,
      })
    } else {
      // 新用户，设置默认状态
      setState({
        packOpportunities: 5,
        timeUntilNextPack: 7200,
        isTimerActive: false,
      })

      // 保存到localStorage
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
            // 时间到，增加一次开包机会
            const newOpportunities = Math.min(prevState.packOpportunities + 1, 5)
            const isActive = newOpportunities < 5

            const newState = {
              packOpportunities: newOpportunities,
              timeUntilNextPack: 7200, // 重置为2小时
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

  // 使用开包机会
  const usePackOpportunity = () => {
    if (state.packOpportunities > 0) {
      const newOpportunities = state.packOpportunities - 1
      const isActive = newOpportunities < 5

      const newState = {
        packOpportunities: newOpportunities,
        timeUntilNextPack: state.timeUntilNextPack,
        isTimerActive: true, // 使用了一次机会后，激活计时器
      }

      setState(newState)
      saveState(newState)
      return true
    }
    return false
  }

  // 保存状态到localStorage
  const saveState = (state: PackTimerState) => {
    localStorage.setItem("packTimerState", JSON.stringify(state))
    localStorage.setItem("packTimerLastUpdated", Date.now().toString())
  }

  // 格式化时间为 HH:MM:SS
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

