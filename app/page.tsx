"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, XCircle, Pill, Beaker, Activity, ShieldAlert } from "lucide-react"

interface DrugCandidate {
  drug: string
  mechanism: string
  evidenceLevel: string
  rationale: string
}

interface RepurposingResult {
  disease: string
  candidates: DrugCandidate[]
}

interface UseCaseEffect {
  drug: string
  applicability: string
  expectedEffects: string[]
  sideEffectRisks: string[]
  contraindicationFlags: string[]
}

interface UseCaseResult {
  condition: string
  effects: UseCaseEffect[]
}

interface DrugDecision {
  drug: string
  decision: "recommended" | "caution" | "avoid"
  reasoning: string
  warnings: string[]
}

interface ProviderResult {
  condition: string
  patientFactors: {
    symptoms: string[]
    medicalHistory: string[]
  }
  decisions: DrugDecision[]
}

interface OTCMatch {
  symptom: string
  otcOptions: {
    product: string
    activeIngredient: string
    mechanism: string
    warnings: string[]
  }[]
}

interface PatientResult {
  requestedSymptoms: string[]
  matches: OTCMatch[]
}

function splitCSV(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

async function postJson(url: string, body: object) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || "Request failed")
  }
  return data
}

export default function NexusRxPage() {
  const [repurposingDisease, setRepurposingDisease] = useState("")
  const [repurposingResult, setRepurposingResult] = useState<RepurposingResult | null>(null)
  const [repurposingError, setRepurposingError] = useState("")
  const [repurposingLoading, setRepurposingLoading] = useState(false)

  const [useCaseCondition, setUseCaseCondition] = useState("")
  const [useCaseSymptoms, setUseCaseSymptoms] = useState("")
  const [useCaseComorbidities, setUseCaseComorbidities] = useState("")
  const [useCaseResult, setUseCaseResult] = useState<UseCaseResult | null>(null)
  const [useCaseError, setUseCaseError] = useState("")
  const [useCaseLoading, setUseCaseLoading] = useState(false)

  const [providerCondition, setProviderCondition] = useState("")
  const [providerSymptoms, setProviderSymptoms] = useState("")
  const [providerHistory, setProviderHistory] = useState("")
  const [providerResult, setProviderResult] = useState<ProviderResult | null>(null)
  const [providerError, setProviderError] = useState("")
  const [providerLoading, setProviderLoading] = useState(false)

  const [patientMedication, setPatientMedication] = useState("")
  const [patientSymptoms, setPatientSymptoms] = useState("")
  const [patientResult, setPatientResult] = useState<PatientResult | null>(null)
  const [patientError, setPatientError] = useState("")
  const [patientLoading, setPatientLoading] = useState(false)

  async function handleRepurposing(e: React.FormEvent) {
    e.preventDefault()
    setRepurposingLoading(true)
    setRepurposingResult(null)
    setRepurposingError("")

    try {
      const data = await postJson("/api/provider/repurposing", { disease: repurposingDisease })
      setRepurposingResult(data)
    } catch (error) {
      setRepurposingError(error instanceof Error ? error.message : "Request failed")
    } finally {
      setRepurposingLoading(false)
    }
  }

  async function handleUseCase(e: React.FormEvent) {
    e.preventDefault()
    setUseCaseLoading(true)
    setUseCaseResult(null)
    setUseCaseError("")

    try {
      const data = await postJson("/api/provider/use-case", {
        condition: useCaseCondition,
        symptoms: splitCSV(useCaseSymptoms),
        comorbidities: splitCSV(useCaseComorbidities),
      })
      setUseCaseResult(data)
    } catch (error) {
      setUseCaseError(error instanceof Error ? error.message : "Request failed")
    } finally {
      setUseCaseLoading(false)
    }
  }

  async function handleProviderDecision(e: React.FormEvent) {
    e.preventDefault()
    setProviderLoading(true)
    setProviderResult(null)
    setProviderError("")

    try {
      const data = await postJson("/api/provider/patient-drug-decision", {
        condition: providerCondition,
        symptoms: splitCSV(providerSymptoms),
        medicalHistory: splitCSV(providerHistory),
      })
      setProviderResult(data)
    } catch (error) {
      setProviderError(error instanceof Error ? error.message : "Request failed")
    } finally {
      setProviderLoading(false)
    }
  }

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
    <div className="min-h-screen bg-background relative">
      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,_oklch(0.55_0.10_145_/_0.1),_transparent_50%)]" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 space-y-10">
        {/* Hero Section */}
        <section className="text-center space-y-4 bg-card rounded-2xl p-8 border border-border shadow-sm">
          <p className="text-primary text-sm font-medium tracking-widest uppercase">
            AI-Enabled Pharmaceutical Intelligence
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground font-serif tracking-tight text-balance">
            NexusRx Repurposing Studio
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Evaluate unconventional drug candidates for disease targets, analyze patient-specific applicability,
            and deliver OTC ingredient-matched alternatives in one clinical interface.
          </p>
        </section>

        {/* Panel Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Repurposing Analysis */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-card-foreground">Provider: Repurposing Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleRepurposing} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repurposing-disease" className="text-muted-foreground">
                    Disease target
                  </Label>
                  <Input
                    id="repurposing-disease"
                    placeholder="e.g., Fibromyalgia"
                    value={repurposingDisease}
                    onChange={(e) => setRepurposingDisease(e.target.value)}
                    required
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={repurposingLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {repurposingLoading ? "Analyzing..." : "Analyze low-frequency use potential"}
                </Button>
              </form>
              {repurposingError && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{repurposingError}</p>
                </div>
              )}
              {repurposingResult && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Beaker className="w-4 h-4" />
                    <span>Results for <span className="font-medium text-foreground">{repurposingResult.disease}</span></span>
                  </div>
                  {repurposingResult.candidates.map((candidate, idx) => (
                    <div key={idx} className="p-4 bg-muted/50 border border-border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <Pill className="w-4 h-4 text-primary" />
                          {candidate.drug}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {candidate.evidenceLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Mechanism:</span> {candidate.mechanism}
                      </p>
                      <p className="text-sm text-foreground">{candidate.rationale}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Use-Case Effects */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-card-foreground">Provider: Use-Case Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleUseCase} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="usecase-condition" className="text-muted-foreground">
                    Condition
                  </Label>
                  <Input
                    id="usecase-condition"
                    placeholder="e.g., Neuroinflammation"
                    value={useCaseCondition}
                    onChange={(e) => setUseCaseCondition(e.target.value)}
                    required
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usecase-symptoms" className="text-muted-foreground">
                    Symptoms (comma-separated)
                  </Label>
                  <Input
                    id="usecase-symptoms"
                    placeholder="fatigue, pain, inflammation"
                    value={useCaseSymptoms}
                    onChange={(e) => setUseCaseSymptoms(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usecase-comorbidities" className="text-muted-foreground">
                    Comorbidities (comma-separated)
                  </Label>
                  <Input
                    id="usecase-comorbidities"
                    placeholder="asthma, kidney disease"
                    value={useCaseComorbidities}
                    onChange={(e) => setUseCaseComorbidities(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={useCaseLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {useCaseLoading ? "Analyzing..." : "Analyze applicability and effects"}
                </Button>
              </form>
              {useCaseError && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{useCaseError}</p>
                </div>
              )}
              {useCaseResult && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="w-4 h-4" />
                    <span>Effects for <span className="font-medium text-foreground">{useCaseResult.condition}</span></span>
                  </div>
                  {useCaseResult.effects.map((effect, idx) => (
                    <div key={idx} className="p-4 bg-muted/50 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <Pill className="w-4 h-4 text-primary" />
                          {effect.drug}
                        </h4>
                        <Badge variant={effect.applicability === "High" ? "default" : "secondary"} className="text-xs">
                          {effect.applicability} Applicability
                        </Badge>
                      </div>
                      {effect.expectedEffects.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Expected Effects</p>
                          <div className="flex flex-wrap gap-1">
                            {effect.expectedEffects.map((eff, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                {eff}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {effect.sideEffectRisks.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Side Effect Risks</p>
                          <div className="flex flex-wrap gap-1">
                            {effect.sideEffectRisks.map((risk, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/20">
                                {risk}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {effect.contraindicationFlags.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Contraindications</p>
                          <div className="flex flex-wrap gap-1">
                            {effect.contraindicationFlags.map((flag, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Patient Drug Decision */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-card-foreground">Provider: AI Patient Drug Decision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleProviderDecision} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider-condition" className="text-muted-foreground">
                    Primary condition
                  </Label>
                  <Input
                    id="provider-condition"
                    placeholder="e.g., Migraine"
                    value={providerCondition}
                    onChange={(e) => setProviderCondition(e.target.value)}
                    required
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-symptoms" className="text-muted-foreground">
                    Symptoms (comma-separated)
                  </Label>
                  <Input
                    id="provider-symptoms"
                    placeholder="headache, nausea"
                    value={providerSymptoms}
                    onChange={(e) => setProviderSymptoms(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-history" className="text-muted-foreground">
                    Medical history (comma-separated)
                  </Label>
                  <Input
                    id="provider-history"
                    placeholder="bradycardia, asthma"
                    value={providerHistory}
                    onChange={(e) => setProviderHistory(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={providerLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {providerLoading ? "Analyzing..." : "Run AI applicability decision"}
                </Button>
              </form>
              {providerError && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{providerError}</p>
                </div>
              )}
              {providerResult && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Decisions for <span className="font-medium text-foreground">{providerResult.condition}</span></span>
                  </div>
                  {providerResult.patientFactors && (
                    <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Patient factors:</span>{" "}
                        {[...providerResult.patientFactors.symptoms, ...providerResult.patientFactors.medicalHistory].join(", ") || "None specified"}
                      </p>
                    </div>
                  )}
                  {providerResult.decisions.map((decision, idx) => (
                    <div key={idx} className="p-4 bg-muted/50 border border-border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <Pill className="w-4 h-4 text-primary" />
                          {decision.drug}
                        </h4>
                        <Badge 
                          className={`text-xs ${
                            decision.decision === "recommended" 
                              ? "bg-primary/20 text-primary border-primary/30" 
                              : decision.decision === "caution" 
                                ? "bg-amber-500/20 text-amber-700 border-amber-500/30" 
                                : "bg-destructive/20 text-destructive border-destructive/30"
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            {decision.decision === "recommended" ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : decision.decision === "caution" ? (
                              <AlertCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {decision.decision.charAt(0).toUpperCase() + decision.decision.slice(1)}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground">{decision.reasoning}</p>
                      {decision.warnings.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {decision.warnings.map((warning, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/20">
                              {warning}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* OTC Alternative Matching */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-card-foreground">Patient: OTC Alternative Matching</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handlePatientOTC} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-medication" className="text-muted-foreground">
                    Current medication (optional)
                  </Label>
                  <Input
                    id="patient-medication"
                    placeholder="e.g., Prescription anti-inflammatory"
                    value={patientMedication}
                    onChange={(e) => setPatientMedication(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-symptoms" className="text-muted-foreground">
                    Symptoms (comma-separated)
                  </Label>
                  <Input
                    id="patient-symptoms"
                    placeholder="pain, allergy"
                    value={patientSymptoms}
                    onChange={(e) => setPatientSymptoms(e.target.value)}
                    required
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={patientLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {patientLoading ? "Matching..." : "Find OTC ingredient alternatives"}
                </Button>
              </form>
              {patientError && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{patientError}</p>
                </div>
              )}
              {patientResult && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Pill className="w-4 h-4" />
                    <span>OTC alternatives for: {patientResult.requestedSymptoms.join(", ")}</span>
                  </div>
                  {patientResult.matches.map((match, idx) => (
                    <div key={idx} className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground capitalize">{match.symptom}</h4>
                      {match.otcOptions.map((option, i) => (
                        <div key={i} className="p-3 bg-muted/50 border border-border rounded-lg space-y-2 ml-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{option.product}</span>
                            <Badge variant="outline" className="text-xs">
                              {option.activeIngredient}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{option.mechanism}</p>
                          {option.warnings.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {option.warnings.map((warning, j) => (
                                <Badge key={j} variant="outline" className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/20">
                                  {warning}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
