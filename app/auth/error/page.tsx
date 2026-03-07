"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Image from "next/image"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message") || "An authentication error occurred"

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background image with adjusted opacity and brightness */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/images/prescription-bottles-bg.jpg')",
          opacity: 0.2,
          filter: "brightness(0.31)"
        }}
      />
      
      <Card className="relative z-10 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image 
              src="/images/nexusrx-logo.png" 
              alt="NexusRx Logo" 
              width={80} 
              height={80}
              className="object-contain"
            />
          </div>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl font-sans font-bold glow-text">Authentication Error</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            There was a problem verifying your account. This could happen if the verification link has expired or has already been used.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href="/auth/login">Back to Login</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/auth/sign-up">Create New Account</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
