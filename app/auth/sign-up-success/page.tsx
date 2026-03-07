import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background image with lighter opacity and 69% reduced brightness */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/images/prescription-bottles-bg.jpg')",
          opacity: 0.2,
          filter: "brightness(0.31)"
        }}
      />
      
      <Card className="relative z-10 w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Image 
                src="/images/nexusrx-logo.png" 
                alt="NexusRx Logo" 
                width={80} 
                height={80}
                className="object-contain"
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-serif glow-text">Check Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a confirmation link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-3 p-4 bg-muted rounded-lg">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click the link in your email to verify your account and get started with NexusRx
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or try signing up again.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/auth/login">Go to Login</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
