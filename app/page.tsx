"use client"

import { GameDashboard } from "@/components/game-dashboard"
import { WelcomePopup } from "@/components/welcome-popup"

export default function RootClientPage() {
  return (
    <>
      <GameDashboard />
      <WelcomePopup />
    </>
  )
}

