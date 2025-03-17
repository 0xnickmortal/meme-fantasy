"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js"

// 定义钱包类型
export type WalletType = "phantom" | "solflare" | null

// 定义钱包上下文类型
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

// 创建上下文
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// 创建Solana连接 - 使用devnet而不是mainnet-beta来避免访问限制
// 也可以使用自定义RPC端点，如果有的话
const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

// 钱包提供者组件
export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletType>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // 检查是否有保存的钱包连接
  useEffect(() => {
    const savedWallet = localStorage.getItem("connectedWallet")
    const savedAddress = localStorage.getItem("walletAddress")

    if (savedWallet && savedAddress) {
      // 设置保存的状态
      setWallet(savedWallet as WalletType)
      setAddress(savedAddress)
      setIsConnected(true)

      // 获取余额
      fetchBalance(savedAddress).catch(console.error)

      // 尝试重新连接
      connect(savedWallet as WalletType).catch(() => {
        // 如果重连失败，清除保存的状态
        localStorage.removeItem("connectedWallet")
        localStorage.removeItem("walletAddress")
        setWallet(null)
        setAddress(null)
        setIsConnected(false)
      })
    }
  }, [])

  // 获取钱包余额
  const fetchBalance = async (walletAddress: string) => {
    try {
      const publicKey = new PublicKey(walletAddress)
      const lamports = await connection.getBalance(publicKey)
      const solBalance = lamports / LAMPORTS_PER_SOL
      setBalance(solBalance)
      return solBalance
    } catch (error) {
      console.error("获取余额失败:", error)

      // 即使获取余额失败，也不影响连接状态
      // 返回当前余额或默认值
      return balance || 0
    }
  }

  // 刷新余额
  const refreshBalance = async () => {
    if (address) {
      try {
        await fetchBalance(address)
        return true
      } catch (error) {
        console.error("刷新余额失败:", error)
        // 如果是devnet，可以尝试请求空投
        if (connection.rpcEndpoint.includes("devnet")) {
          try {
            const publicKey = new PublicKey(address)
            // 尝试请求空投1个SOL
            await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL)
            // 等待确认
            await new Promise((resolve) => setTimeout(resolve, 2000))
            // 重新获取余额
            await fetchBalance(address)
            toast({
              title: "已请求空投",
              description: "在开发网络上请求了1个SOL的空投",
            })
          } catch (airdropError) {
            console.error("空投请求失败:", airdropError)
          }
        }
        return false
      }
    }
    return false
  }

  // 连接钱包
  const connect = async (type: WalletType) => {
    if (!type) return

    setIsConnecting(true)

    try {
      // 检查钱包是否已安装
      if (type === "phantom") {
        if (!window.phantom?.solana) {
          window.open("https://phantom.app/", "_blank")
          throw new Error("请安装Phantom钱包")
        }

        // 连接Phantom钱包
        const provider = window.phantom?.solana
        const response = await provider.connect()
        const publicKey = response.publicKey.toString()

        // 获取余额 - 即使失败也继续
        let solBalance = 0
        try {
          solBalance = await fetchBalance(publicKey)
        } catch (error) {
          console.error("获取余额失败，使用默认值:", error)
        }

        setWallet(type)
        setAddress(publicKey)
        setBalance(solBalance)
        setIsConnected(true)

        // 保存连接状态
        localStorage.setItem("connectedWallet", type)
        localStorage.setItem("walletAddress", publicKey)

        toast({
          title: "钱包已连接",
          description: `已成功连接到 ${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`,
        })
      } else if (type === "solflare") {
        if (!window.solflare) {
          window.open("https://solflare.com/", "_blank")
          throw new Error("请安装Solflare钱包")
        }

        // 连接Solflare钱包
        const provider = window.solflare
        await provider.connect()
        const publicKey = provider.publicKey.toString()

        // 获取余额 - 即使失败也继续
        let solBalance = 0
        try {
          solBalance = await fetchBalance(publicKey)
        } catch (error) {
          console.error("获取余额失败，使用默认值:", error)
        }

        setWallet(type)
        setAddress(publicKey)
        setBalance(solBalance)
        setIsConnected(true)

        // 保存连接状态
        localStorage.setItem("connectedWallet", type)
        localStorage.setItem("walletAddress", publicKey)

        toast({
          title: "钱包已连接",
          description: `已成功连接到 ${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`,
        })
      }
    } catch (error: any) {
      console.error("连接钱包失败:", error)
      toast({
        title: "连接失败",
        description: error.message || "连接钱包时出现错误",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // 断开钱包连接
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

    // 清除保存的状态
    localStorage.removeItem("connectedWallet")
    localStorage.removeItem("walletAddress")

    toast({
      title: "已断开连接",
      description: "钱包已成功断开连接",
    })
  }

  // 监听钱包账户变化
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
          console.error("账户变更处理失败:", error)
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
          console.error("账户变更处理失败:", error)
        }
      }
    }

    // 设置定期刷新余额的计时器 - 减少频率以避免请求限制
    const balanceInterval = setInterval(() => {
      if (address) {
        fetchBalance(address).catch(console.error)
      }
    }, 60000) // 每60秒刷新一次

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

// 使用钱包上下文的Hook
export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// 为TypeScript添加全局类型定义
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

