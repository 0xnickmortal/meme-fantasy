"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js"

// Define wallet type
export type WalletType = "phantom" | "solflare" | null

// Define wallet context type
interface WalletContextType {
  wallet: WalletType
  address: string | null
  balance: number
  isConnecting: boolean
  isConnected: boolean
  connect: (type: WalletType) => Promise<void>
  disconnect: () => void
  refreshBalance: () => Promise<void>
}

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Create Solana connection - using devnet instead of mainnet-beta to avoid access limits
// Can also use custom RPC endpoint if available
const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

// Wallet provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletType>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Check if there's a saved wallet connection
  useEffect(() => {
    const savedWallet = localStorage.getItem("connectedWallet")
    const savedAddress = localStorage.getItem("walletAddress")

    if (savedWallet && savedAddress) {
      // Set saved state
      setWallet(savedWallet as WalletType)
      setAddress(savedAddress)
      setIsConnected(true)

      // Get balance
      fetchBalance(savedAddress).catch(console.error)

      // Try to reconnect
      connect(savedWallet as WalletType).catch(() => {
        // If reconnection fails, clear saved state
        localStorage.removeItem("connectedWallet")
        localStorage.removeItem("walletAddress")
        setWallet(null)
        setAddress(null)
        setIsConnected(false)
      })
    }
  }, [])

  // Get wallet balance
  const fetchBalance = async (walletAddress: string) => {
    try {
      const publicKey = new PublicKey(walletAddress)
      const lamports = await connection.getBalance(publicKey)
      const solBalance = lamports / LAMPORTS_PER_SOL
      setBalance(solBalance)
      return solBalance
    } catch (error) {
      console.error("Failed to get balance:", error)

      // Even if getting balance fails, don't affect connection status
      // Return current balance or default value
      return balance || 0
    }
  }

  // Refresh balance
  const refreshBalance = async () => {
    if (address) {
      try {
        await fetchBalance(address)
        return true
      } catch (error) {
        console.error("Failed to refresh balance:", error)
        // If on devnet, try requesting airdrop
        if (connection.rpcEndpoint.includes("devnet")) {
          try {
            const publicKey = new PublicKey(address)
            // Try requesting 1 SOL airdrop
            await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL)
            // Wait for confirmation
            await new Promise((resolve) => setTimeout(resolve, 2000))
            // Get balance again
            await fetchBalance(address)
            toast({
              title: "Airdrop Requested",
              description: "Requested 1 SOL airdrop on devnet",
            })
          } catch (airdropError) {
            console.error("Airdrop request failed:", airdropError)
          }
        }
        return false
      }
    }
    return false
  }

  // Connect wallet
  const connect = async (type: WalletType) => {
    if (!type) return

    setIsConnecting(true)

    try {
      // Check if wallet is installed
      if (type === "phantom") {
        if (!window.phantom?.solana) {
          window.open("https://phantom.app/", "_blank")
          throw new Error("Please install Phantom wallet")
        }

        // Connect Phantom wallet
        const provider = window.phantom?.solana
        const response = await provider.connect()
        const publicKey = response.publicKey.toString()

        // Get balance - continue even if it fails
        let solBalance = 0
        try {
          solBalance = await fetchBalance(publicKey)
        } catch (error) {
          console.error("Failed to get balance, using default:", error)
        }

        setWallet(type)
        setAddress(publicKey)
        setBalance(solBalance)
        setIsConnected(true)

        // Save connection state
        localStorage.setItem("connectedWallet", type)
        localStorage.setItem("walletAddress", publicKey)

        toast({
          title: "Wallet Connected",
          description: `Successfully connected to ${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`,
        })
      } else if (type === "solflare") {
        if (!window.solflare) {
          window.open("https://solflare.com/", "_blank")
          throw new Error("Please install Solflare wallet")
        }

        // Connect Solflare wallet
        const provider = window.solflare
        await provider.connect()
        const publicKey = provider.publicKey.toString()

        // Get balance - continue even if it fails
        let solBalance = 0
        try {
          solBalance = await fetchBalance(publicKey)
        } catch (error) {
          console.error("Failed to get balance, using default:", error)
        }

        setWallet(type)
        setAddress(publicKey)
        setBalance(solBalance)
        setIsConnected(true)

        // Save connection state
        localStorage.setItem("connectedWallet", type)
        localStorage.setItem("walletAddress", publicKey)

        toast({
          title: "Wallet Connected",
          description: `Successfully connected to ${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`,
        })
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnect = () => {
    if (wallet === "phantom" && window.phantom?.solana) {
      window.phantom.solana.disconnect()
    } else if (wallet === "solflare" && window.solflare) {
      window.solflare.disconnect()
    }

    setWallet(null)
    setAddress(null)
    setBalance(0)
    setIsConnected(false)

    // Clear saved state
    localStorage.removeItem("connectedWallet")
    localStorage.removeItem("walletAddress")

    toast({
      title: "Disconnected",
      description: "Wallet disconnected successfully",
    })
  }

  // Listen for wallet account changes
  useEffect(() => {
    const handleAccountChange = async () => {
      if (wallet === "phantom" && window.phantom?.solana) {
        try {
          const response = await window.phantom.solana.connect({ onlyIfTrusted: true })
          const publicKey = response.publicKey.toString()

          if (publicKey !== address) {
            setAddress(publicKey)
            localStorage.setItem("walletAddress", publicKey)
            await fetchBalance(publicKey)
          }
        } catch (error) {
          console.error("Failed to handle account change:", error)
        }
      } else if (wallet === "solflare" && window.solflare) {
        try {
          const publicKey = window.solflare.publicKey.toString()

          if (publicKey !== address) {
            setAddress(publicKey)
            localStorage.setItem("walletAddress", publicKey)
            await fetchBalance(publicKey)
          }
        } catch (error) {
          console.error("Failed to handle account change:", error)
        }
      }
    }

    // Set interval to refresh balance periodically - reduce frequency to avoid request limits
    const balanceInterval = setInterval(() => {
      if (address) {
        fetchBalance(address).catch(console.error)
      }
    }, 60000) // Refresh every 60 seconds

    return () => {
      clearInterval(balanceInterval)
    }
  }, [wallet, address])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        address,
        balance,
        isConnecting,
        isConnected,
        connect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

// Use wallet context hook
export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Add global type definitions for TypeScript
declare global {
  interface Window {
    phantom?: {
      solana?: {
        connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>
        disconnect: () => Promise<void>
      }
    }
    solflare?: {
      connect: () => Promise<void>
      disconnect: () => Promise<void>
      publicKey: { toString: () => string }
    }
  }
}
