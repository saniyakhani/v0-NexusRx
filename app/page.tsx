"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingScreen } from "@/components/loading-screen"
import { Pill, Beaker, Activity, ShieldAlert, User, Stethoscope, ArrowRight, Sparkles, Lock } from "lucide-react"

export default function HomePage() {
  const [showLoading, setShowLoading] = useState(true)
  const router = useRouter()

  if (showLoading) {
    return <LoadingScreen onLoadingComplete={() => setShowLoading(false)} />
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background image with 30% opacity */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('/images/prescription-bottles-bg.jpg')" }}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Pill className="h-12 w-12 text-primary" />
            </div>
          </div>
          <Badge variant="outline" className="text-primary border-primary/30">
            AI-Enabled Pharmaceutical Intelligence
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground font-serif tracking-tight text-balance glow-text">
            NexusRx Repurposing Studio
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Evaluate unconventional drug candidates for disease targets, analyze patient-specific applicability,
            and deliver OTC ingredient-matched alternatives in one clinical interface.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/auth/sign-up">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/auth/login">
                Sign In
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Overview */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">
              Platform Features
            </h2>
            <p className="text-muted-foreground">
              Choose the access level that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Provider Features */}
            <Card className="bg-card border-border shadow-sm overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-card-foreground">
                      Provider Access
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Advanced clinical tools for healthcare professionals
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                      <Beaker className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Repurposing Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Evaluate unconventional drug candidates for disease targets with AI-powered insights
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Use-Case Effects</h4>
                      <p className="text-sm text-muted-foreground">
                        Analyze patient-specific applicability including symptoms and comorbidities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                      <ShieldAlert className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">AI Drug Decision</h4>
                      <p className="text-sm text-muted-foreground">
                        Get AI-powered patient drug recommendations based on medical history
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/auth/sign-up">
                    Register as Provider
                    <Lock className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Patient Features */}
            <Card className="bg-card border-border shadow-sm overflow-hidden">
              <CardHeader className="bg-accent/5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <User className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-card-foreground">
                      Patient Access
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Personal health tools for informed decisions
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                      <Pill className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">OTC Alternative Finder</h4>
                      <p className="text-sm text-muted-foreground">
                        Find over-the-counter alternatives matched to your symptoms
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                      <Sparkles className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Ingredient Matching</h4>
                      <p className="text-sm text-muted-foreground">
                        Get ingredient-matched OTC options based on your current medications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                      <Activity className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Personalized Recommendations</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive tailored suggestions based on your symptom profile
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/auth/sign-up">
                    Register as Patient
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Trust Section */}
        <section className="text-center space-y-6 py-8">
          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardContent className="p-8 space-y-4">
              <h3 className="text-xl font-semibold text-foreground font-serif">
                Trusted by Healthcare Professionals
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                NexusRx combines cutting-edge AI with pharmaceutical data to provide accurate, 
                evidence-based drug repurposing insights. Our platform is designed with clinical 
                workflows in mind, ensuring seamless integration into your practice.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Badge variant="secondary" className="text-sm">HIPAA Compliant</Badge>
                <Badge variant="secondary" className="text-sm">Evidence-Based</Badge>
                <Badge variant="secondary" className="text-sm">AI-Powered</Badge>
                <Badge variant="secondary" className="text-sm">Secure Platform</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            NexusRx Repurposing Studio - AI-Enabled Pharmaceutical Intelligence
          </p>
        </footer>
      </main>
    </div>
  )
}
