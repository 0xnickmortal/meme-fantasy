"use client"

import { useState, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, PerspectiveCamera } from "@react-three/drei"
import { CardPack3D } from "@/components/CardPack3D"
import { PackOpening } from "@/components/pack-opening"
import { PackCounter } from "@/components/pack-counter"
import { usePackOpportunity } from "@/lib/contexts/pack-opportunity-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function GameDashboard() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const {
    packOpportunities,
    usePackOpportunity: usePackOpportunityFn,
    setIsPackOpening,
    isPackOpening,
  } = usePackOpportunity()
  const [canOpenPack, setCanOpenPack] = useState(false)
  const [noOpportunities, setNoOpportunities] = useState(false)
  const [openingPackType, setOpeningPackType] = useState<string | null>(null)
  const [packOpeningAttempted, setPackOpeningAttempted] = useState(false)
  const [isPackOpeningLocal, setIsPackOpeningLocal] = useState(false)

  useEffect(() => {
    setCanOpenPack(packOpportunities > 0)
    setNoOpportunities(packOpportunities <= 0)
  }, [packOpportunities])

  useEffect(() => {
    if (openingPackType) {
      setIsPackOpeningLocal(true)
      setIsPackOpening(true)
    }
  }, [openingPackType, setIsPackOpening])

  const handleOpenPack = (packType: string) => {
    setPackOpeningAttempted(true)
    let success = false
    if (canOpenPack) {
      success = usePackOpportunityFn()
    }
    if (success) {
      setOpeningPackType(packType)
      setSelectedPack(packType)
    } else {
      setNoOpportunities(true)
      console.log("No pack opportunities left")
    }
  }

  useEffect(() => {
    if (!isPackOpening) {
      setPackOpeningAttempted(false)
    }
  }, [isPackOpening])

  const handlePackOpeningComplete = () => {
    setIsPackOpeningLocal(false)
    setIsPackOpening(false)
    setSelectedPack(null)
    setOpeningPackType(null)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto relative" style={{ zIndex: 1 }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Card Packs</h1>
        <PackCounter />
      </div>

      {noOpportunities && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            You have no pack opportunities left. Wait for the timer to get more opportunities.
          </AlertDescription>
        </Alert>
      )}

      {isPackOpeningLocal ? (
        <PackOpening packType={selectedPack || "standard"} onComplete={handlePackOpeningComplete} />
      ) : (
        <div className="w-full h-[800px] relative" style={{ zIndex: 1 }}>
          <Canvas style={{ position: "relative", zIndex: 1 }}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <CardPack3D
                position={[-5, 0, 0]}
                onClick={() => handleOpenPack("doge")}
                isDisabled={!canOpenPack || (selectedPack !== null && selectedPack !== "doge")}
                packType="doge"
              />
              <CardPack3D
                position={[0, 0, 0]}
                onClick={() => handleOpenPack("popcat")}
                isDisabled={!canOpenPack || (selectedPack !== null && selectedPack !== "popcat")}
                packType="popcat"
              />
              <CardPack3D
                position={[5, 0, 0]}
                onClick={() => handleOpenPack("pepe")}
                isDisabled={!canOpenPack || (selectedPack !== null && selectedPack !== "pepe")}
                packType="pepe"
              />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>
      )}

      <div className="text-center mt-4">
        <p className="text-muted-foreground">
          Choose one pack to open. You have {packOpportunities} opportunities left.
        </p>
      </div>
    </div>
  )
}

