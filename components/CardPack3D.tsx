"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF, Html } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"

interface CardPackProps {
  position: [number, number, number]
  onClick: () => void
  isDisabled: boolean
  packType: "doge" | "popcat" | "pepe" // Add this line
}

// Update function signature, add packType parameter
export function CardPack3D({ position, onClick, isDisabled, packType }: CardPackProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  // Choose different GLB file based on packType
  const modelUrl = {
    doge: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/package_doge-rkxeJRrNZM7ngHuCKAzxEw284Fybj2.glb",
    popcat: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/package_popcat-u0sMdyz0AgiOJXY59v6B2sRlWnVdmW.glb",
    pepe: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/package_pepe-yw5yfbRpE4jznLXgSzFipRwP6QiMiF.glb",
  }[packType]

  // Load corresponding GLB file
  const { scene } = useGLTF(modelUrl)

  // Clone scene to avoid modifying cached original scene
  const model = scene.clone()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  // If disabled, apply gray material
  if (isDisabled) {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({ color: "#888888" })
      }
    })
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? [3.3, 3.3, 3.3] : [3, 3, 3]}
    >
      <primitive object={model} />
      <Html
        position={[0, -1, 0]}
        center
        style={{
          transition: "all 0.2s",
          opacity: hovered ? 1 : 0.9,
          pointerEvents: "auto",
        }}
        zIndexRange={[100, 0]}
      >
        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2">
          <Button
            onClick={onClick}
            disabled={isDisabled}
            variant="default"
            size="default"
            className={`font-semibold transition-all duration-300 ${
              !isDisabled
                ? "shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-105"
                : ""
            }`}
          >
            {isDisabled ? "Unavailable" : "Open Pack"}
          </Button>
        </div>
      </Html>
    </group>
  )
}

// Preload all models to improve performance
useGLTF.preload(
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/package_doge-rkxeJRrNZM7ngHuCKAzxEw284Fybj2.glb",
)
useGLTF.preload(
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/package_popcat-u0sMdyz0AgiOJXY59v6B2sRlWnVdmW.glb",
)
useGLTF.preload(
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/package_pepe-yw5yfbRpE4jznLXgSzFipRwP6QiMiF.glb",
)
