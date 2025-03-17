"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Gift, Package, Clock, ChevronLeft, ChevronRight } from "lucide-react"

export function WelcomePopup() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const totalSteps = 3

  useEffect(() => {
    // Check if user is new
    const isNewUser = localStorage.getItem("isNewUser") !== "false"

    if (isNewUser) {
      setOpen(true)
      // Mark user as no longer new
      localStorage.setItem("isNewUser", "false")
    }
  }, [])

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      setOpen(false)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent
        className="sm:max-w-md"
        style={{ zIndex: 9999 }}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {step === 1 && "Welcome to Meme Fantasy!"}
            {step === 2 && "Open Your Card Packs"}
            {step === 3 && "Collect & Upgrade"}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {step === 1 && "Begin your meme card collection journey"}
            {step === 2 && "Get a new pack opening opportunity every two hours"}
            {step === 3 && "Build your strongest deck"}
          </DialogDescription>
        </DialogHeader>

        {/* Fixed height content container */}
        <div className="flex justify-center py-6">
          <div className="h-[280px] w-full flex items-center justify-center">
            {step === 1 && (
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-64 mb-4">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fantasy%20%284%29-Ett6KUeXyjnHEtAqtP5U9xyYLgwmFs.png"
                    alt="Pepe Card Pack"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-center space-y-2">
                  <p>
                    As a new player, you've received <span className="font-bold text-primary">5</span> pack opening
                    opportunities!
                  </p>
                  <p>Collect meme cards, build decks, and win rewards in tournaments.</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-4 mb-4">
                  <Package className="w-12 h-12 text-primary" />
                  <Clock className="w-10 h-10 text-muted-foreground" />
                  <Package className="w-12 h-12 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <p>
                    Every <span className="font-bold text-primary">two hours</span> you'll get a new pack opening
                    opportunity
                  </p>
                  <p>
                    You can accumulate up to <span className="font-bold text-primary">5</span> opportunities
                  </p>
                  <p>The countdown pauses when you have 5 opportunities</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4">
                  <Gift className="w-full h-full text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <p>Collect cards of different rarities</p>
                  <p>Upgrade your cards to enhance their abilities</p>
                  <p>Participate in tournaments to win rewards and rare cards</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Added margin-top to create more space before the pagination dots */}
        <div className="flex items-center justify-center mt-6 mb-4">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${index + 1 === step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between mt-2">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrevious}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
          ) : (
            <div></div>
          )}

          {step < totalSteps ? (
            <Button onClick={handleNext}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleClose}>Start Game</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

