import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/toaster"
import { CollectionProvider } from "@/lib/contexts/collection-context"
import { PackOpportunityProvider } from "@/lib/contexts/pack-opportunity-context"
import { WalletProvider } from "@/lib/contexts/wallet-context"
import { MobileLayout } from "@/components/mobile-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Meme.Fantasy - Trading Card Game",
  description: "The ultimate memecoin trading card game",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <CollectionProvider>
          <PackOpportunityProvider>
            <WalletProvider>
              <div className="flex min-h-screen">
                <MobileLayout>{children}</MobileLayout>
              </div>
              <Toaster />
            </WalletProvider>
          </PackOpportunityProvider>
        </CollectionProvider>
      </body>
    </html>
  )
}



import './globals.css'