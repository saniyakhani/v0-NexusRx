"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Pill, User, Heart, Search, ShoppingBag } from "lucide-react"

interface OTCAlternative {
  forSymptom: string
  option: string
  matchedIngredients: string[]
  expectedEffects: string[]
}

interface PatientResult {
  currentMedication: string
  matchedCount: number
  alternatives: OTCAlternative[]
  genericPlan: string[]
}

function splitCSV(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean)
}

async function postJson(url: string, body: object) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || "Request failed")
  return data
}

export function PatientDashboard() {
  const [patientMedication, setPatientMedication] = useState("")
  const [patientSymptoms, setPatientSymptoms] = useState("")
  const [patientResult, setPatientResult] = useState<PatientResult | null>(null)
  const [patientError, setPatientError] = useState("")
  const [patientLoading, setPatientLoading] = useState(false)

  async function handlePatientOTC(e: React.FormEvent) {
    e.preventDefault()
    setPatientLoading(true)
    setPatientResult(null)
    setPatientError("")
    try {
      const data = await postJson("/api/patient/otc-alternatives", {
        currentMedication: patientMedication,
        symptoms: splitCSV(patientSymptoms),
      })
      setPatientResult(data)
    } catch (error) {
      setPatientError(error instanceof Error ? error.message : "Request failed")
    } finally {
      setPatientLoading(false)
    }
  }

  return (
    <div className="relative">
      <div className="fixed inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,_oklch(0.55_0.10_145_/_0.1),_transparent_50%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Patient Hero */}
        <section className="text-center space-y-4 bg-card rounded-2xl p-8 border border-border shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <User className="h-6 w-6 text-primary" />
            <Badge variant="outline" className="text-primary border-primary/30">Patient Access</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-serif tracking-tight text-balance">
            Patient Dashboard
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Find OTC ingredient-matched alternatives for your symptoms. Get personalized recommendations based on your current medications.
          </p>
        </section>

        {/* Quick Tips */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-start gap-3">
              <Search className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground text-sm">Search Symptoms</h3>
                <p className="text-xs text-muted-foreground">Enter your symptoms to find matching OTC options</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-start gap-3">
              <ShoppingBag className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground text-sm">OTC Alternatives</h3>
                <p className="text-xs text-muted-foreground">Get ingredient-matched over-the-counter options</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-start gap-3">
              <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground text-sm">Stay Informed</h3>
                <p className="text-xs text-muted-foreground">Always consult your healthcare provider</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* OTC Alternative Finder */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-card-foreground flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              OTC Alternative Finder
            </CardTitle>
            <CardDescription>
              Enter your current medication and symptoms to find over-the-counter alternatives that may help.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handlePatientOTC} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient-medication" className="text-foreground font-medium">
                  Current Medication (optional)
                </Label>
                <Input
                  id="patient-medication"
                  placeholder="e.g., Prescription anti-inflammatory"
                  value={patientMedication}
                  onChange={(e) => setPatientMedication(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your current prescription medication to find similar OTC options
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-symptoms" className="text-foreground font-medium">
                  Symptoms (comma-separated)
                </Label>
                <Input
                  id="patient-symptoms"
                  placeholder="pain, headache, allergy, cold"
                  value={patientSymptoms}
                  onChange={(e) => setPatientSymptoms(e.target.value)}
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  List your symptoms separated by commas for more accurate results
                </p>
              </div>
              <Button type="submit" disabled={patientLoading} size="lg" className="w-full">
                {patientLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                    Finding alternatives...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Find OTC Alternatives
                  </span>
                )}
              </Button>
            </form>

            {patientError && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{patientError}</p>
              </div>
            )}

            {patientResult && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">Results</h3>
                  <Badge variant="secondary">
                    {patientResult.matchedCount} alternative{patientResult.matchedCount !== 1 ? "s" : ""} found
                  </Badge>
                </div>

                {patientResult.alternatives?.length > 0 ? (
                  <div className="grid gap-4">
                    {patientResult.alternatives.map((alt, idx) => (
                      <Card key={idx} className="bg-muted/30 border-border">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                              <Pill className="w-4 h-4 text-primary" />
                              {alt.option}
                            </h4>
                            <Badge variant="outline" className="capitalize">
                              {alt.forSymptom}
                            </Badge>
                          </div>
                          
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Active Ingredients</p>
                            <div className="flex flex-wrap gap-2">
                              {alt.matchedIngredients.map((ingredient, i) => (
                                <Badge key={i} variant="secondary" className="text-sm">
                                  {ingredient}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Expected Effects</p>
                            <div className="flex flex-wrap gap-2">
                              {alt.expectedEffects.map((effect, i) => (
                                <Badge key={i} variant="outline" className="text-sm bg-primary/10 text-primary border-primary/20">
                                  {effect}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-muted/30 border-border">
                    <CardContent className="p-6 text-center space-y-3">
                      <p className="text-muted-foreground">No direct OTC matches found for your symptoms.</p>
                      {patientResult.genericPlan?.length > 0 && (
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground mb-2">General Recommendations:</p>
                          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                            {patientResult.genericPlan.map((plan, i) => (
                              <li key={i}>{plan}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-amber-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Disclaimer:</strong> These suggestions are for informational purposes only. 
                      Always consult with your healthcare provider before starting any new medication.
                    </span>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
