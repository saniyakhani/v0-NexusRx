"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function LoadingScreen({ onLoadingComplete }: { onLoadingComplete?: () => void }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      onLoadingComplete?.()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onLoadingComplete])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Background image with lighter opacity and 69% reduced brightness */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/images/prescription-bottles-bg.jpg')",
          opacity: 0.2,
          filter: "brightness(0.31)"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <Image 
          src="/images/nexusrx-logo.png" 
          alt="NexusRx Logo" 
          width={120} 
          height={120}
          className="object-contain"
          priority
        />
        
        {/* Glowing Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary glow-text text-center">
          NexusRx Repurposing Studio
        </h1>
        
        {/* Pyramid Loader */}
        <div className="pyramid-loader">
          <div className="pyramid-wrapper">
            <span className="pyramid-side pyramid-side1" />
            <span className="pyramid-side pyramid-side2" />
            <span className="pyramid-side pyramid-side3" />
            <span className="pyramid-side pyramid-side4" />
            <span className="pyramid-shadow" />
          </div>
        </div>
        
        <p className="text-muted-foreground text-lg animate-pulse">
          Initializing AI-Enabled Pharmaceutical Intelligence...
        </p>
      </div>
    </div>
  )
}
