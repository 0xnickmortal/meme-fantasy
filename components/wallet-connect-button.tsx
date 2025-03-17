"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Wallet, LogOut, ChevronDown, Copy, ExternalLink, RefreshCw, CloudLightning } from "lucide-react"
import { useWallet, type WalletType } from "@/lib/contexts/wallet-context"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js"

export function WalletConnectButton() {
  const { wallet, address, balance, isConnecting, isConnected, connect, disconnect, refreshBalance } = useWallet()
  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAirdropping, setIsAirdropping] = useState(false)

  // Format address display
  const formatAddress = (address: string | null) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  // View in block explorer
  const viewOnExplorer = () => {
    if (address) {
      // Use devnet explorer
      window.open(`https://explorer.solana.com/address/${address}?cluster=devnet`, "_blank")
    }
  }

  // Refresh balance
  const handleRefreshBalance = async () => {
    if (!isRefreshing) {
      setIsRefreshing(true)
      try {
        await refreshBalance()
        toast({
          title: "Balance Updated",
          description: `Current balance: ${balance.toFixed(4)} SOL`,
        })
      } catch (error) {
        toast({
          title: "Update Failed",
          description: "Unable to get latest balance",
          variant: "destructive",
        })
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  // Request airdrop (only valid on devnet)
  const requestAirdrop = async () => {
    if (!address || isAirdropping) return

    setIsAirdropping(true)
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
      const publicKey = new PublicKey(address)

      // Request 1 SOL airdrop
      const signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL)

      toast({
        title: "Airdrop Request Submitted",
        description: "Processing your SOL airdrop request...",
      })

      // Wait for transaction confirmation
      await connection.confirmTransaction(signature)

      // Refresh balance
      await refreshBalance()

      toast({
        title: "Airdrop Successful",
        description: "Received 1 SOL, balance updated",
      })
    } catch (error) {
      console.error("Airdrop request failed:", error)
      toast({
        title: "Airdrop Failed",
        description: "Error requesting SOL airdrop",
        variant: "destructive",
      })
    } finally {
      setIsAirdropping(false)
    }
  }

  // Wallet options
  const walletOptions = [
    {
      type: "phantom" as WalletType,
      name: "Phantom",
      logo: "/assets/wallets/phantom.png",
      description: "Connect to Phantom Wallet",
    },
    {
      type: "solflare" as WalletType,
      name: "Solflare",
      logo: "/assets/wallets/solflare.png",
      description: "Connect to Solflare Wallet",
    },
  ]

  // If connected, show wallet info
  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {wallet === "phantom" ? (
              <Image src="/assets/wallets/phantom.png" alt="Phantom" width={20} height={20} className="rounded-full" />
            ) : wallet === "solflare" ? (
              <Image
                src="/assets/wallets/solflare.png"
                alt="Solflare"
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            <span>{formatAddress(address)}</span>
            <span className="text-xs text-muted-foreground">{balance.toFixed(4)} SOL</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleRefreshBalance} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Balance
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyAddress}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={viewOnExplorer}>
            <ExternalLink className="w-4 h-4 mr-2" />
            View in Explorer
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Only show airdrop option on devnet */}
          <DropdownMenuItem onClick={requestAirdrop} disabled={isAirdropping}>
            <CloudLightning className={`w-4 h-4 mr-2 ${isAirdropping ? "animate-pulse" : ""}`} />
            Request SOL Airdrop (Devnet)
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={disconnect}>
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Not connected state, show connect button
  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowConnectDialog(true)}
        disabled={isConnecting}
        className="flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>Choose a wallet to connect (using Devnet)</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {walletOptions.map((option) => (
              <Button
                key={option.type}
                variant="outline"
                className="flex items-center justify-start gap-3 h-14"
                onClick={() => {
                  connect(option.type)
                  setShowConnectDialog(false)
                }}
              >
                <div className="w-8 h-8 relative">
                  <Image
                    src={option.logo || "/placeholder.svg"}
                    alt={option.name}
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
                <div className="text-left">
                  <div className="font-medium">{option.name}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
