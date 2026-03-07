"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, AlertTriangle, Pill, Beaker, Activity, ShieldAlert } from "lucide-react"

// Matches actual API response from /api/provider/repurposing
interface RepurposingCandidate {
  drug: string
  knownPrimaryUse: string
  disease: string
  confidence: number
  reason: string
  signalStrength: number
  noveltyScore: number
  cautions: string[]
}

interface RepurposingResult {
  disease: string
  results: RepurposingCandidate[]
}

// Matches actual API response from /api/provider/use-case
interface UseCaseAnalysis {
  drug: string
  class: string
  fitScore: number
  rationale: string
  sideEffects: string[]
  contraindicationsDetected: string[]
}

interface UseCaseResult {
  condition: string
  analysis: UseCaseAnalysis[]
}

// Matches actual API response from /api/provider/patient-drug-decision
interface ProviderRecommendation {
  drug: string
  class: string
  fitScore: number
  rationale: string
  sideEffects: string[]
  contraindicationsDetected: string[]
  recommendationLevel: string
}

interface ProviderResult {
  condition: string
  summary: string
  recommendations: ProviderRecommendation[]
}

// Matches actual API response from /api/patient/otc-alternatives
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
                  {repurposingResult.results && repurposingResult.results.length > 0 ? (
                    repurposingResult.results.map((candidate, idx) => (
                      <div key={idx} className="p-4 bg-muted/50 border border-border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <Pill className="w-4 h-4 text-primary" />
                            {candidate.drug}
                          </h4>
                          <Badge variant={candidate.confidence >= 70 ? "default" : "secondary"} className="text-xs">
                            {candidate.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Primary Use:</span> {candidate.knownPrimaryUse}
                        </p>
                        <p className="text-sm text-foreground">{candidate.reason}</p>
                        {candidate.cautions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {candidate.cautions.map((caution, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/20">
                                {caution}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-muted/50 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">No repurposing candidates found for this disease. Try a different condition.</p>
                    </div>
                  )}
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
                    <span>Analysis for <span className="font-medium text-foreground">{useCaseResult.condition}</span></span>
                  </div>
                  {useCaseResult.analysis && useCaseResult.analysis.length > 0 ? (
                    useCaseResult.analysis.map((item, idx) => (
                      <div key={idx} className="p-4 bg-muted/50 border border-border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <Pill className="w-4 h-4 text-primary" />
                            {item.drug}
                          </h4>
                          <Badge variant={item.fitScore >= 70 ? "default" : "secondary"} className="text-xs">
                            {item.fitScore}% fit
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Class:</span> {item.class}
                        </p>
                        <p className="text-sm text-foreground">{item.rationale}</p>
                        {item.sideEffects.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Side Effects</p>
                            <div className="flex flex-wrap gap-1">
                              {item.sideEffects.map((effect, i) => (
                                <Badge key={i} variant="outline" className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/20">
                                  {effect}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {item.contraindicationsDetected.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Contraindications Detected</p>
                            <div className="flex flex-wrap gap-1">
                              {item.contraindicationsDetected.map((flag, i) => (
                                <Badge key={i} variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                                  {flag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-muted/50 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">No applicable drugs found for this condition.</p>
                    </div>
                  )}
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
                  {providerResult.summary && (
                    <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                      <p className="text-muted-foreground">{providerResult.summary}</p>
                    </div>
                  )}
                  {providerResult.recommendations && providerResult.recommendations.length > 0 ? (
                    providerResult.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-4 bg-muted/50 border border-border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <Pill className="w-4 h-4 text-primary" />
                            {rec.drug}
                          </h4>
                          <Badge 
                            className={`text-xs ${
                              rec.fitScore >= 75 
                                ? "bg-primary/20 text-primary border-primary/30" 
                                : rec.fitScore >= 55 
                                  ? "bg-amber-500/20 text-amber-700 border-amber-500/30" 
                                  : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            <span className="flex items-center gap-1">
                              {rec.fitScore >= 75 ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : rec.fitScore >= 55 ? (
                                <AlertTriangle className="w-3 h-3" />
                              ) : (
                                <AlertCircle className="w-3 h-3" />
                              )}
                              {rec.fitScore}% fit
                            </span>
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{rec.recommendationLevel}</p>
                        <p className="text-sm text-foreground">{rec.rationale}</p>
                        {rec.sideEffects.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {rec.sideEffects.map((effect, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/20">
                                {effect}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {rec.contraindicationsDetected.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rec.contraindicationsDetected.map((contra, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                                {contra}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-muted/50 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">No recommendations found for this condition.</p>
                    </div>
                  )}
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
                    <span>Found {patientResult.matchedCount} OTC alternative(s)</span>
                  </div>
                  {patientResult.alternatives && patientResult.alternatives.length > 0 ? (
                    patientResult.alternatives.map((alt, idx) => (
                      <div key={idx} className="p-3 bg-muted/50 border border-border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{alt.option}</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {alt.forSymptom}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {alt.matchedIngredients.map((ingredient, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {alt.expectedEffects.map((effect, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                              {effect}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-muted/50 border border-border rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">No direct OTC matches found.</p>
                      {patientResult.genericPlan && patientResult.genericPlan.length > 0 && (
                        <ul className="text-sm text-foreground list-disc list-inside">
                          {patientResult.genericPlan.map((plan, i) => (
                            <li key={i}>{plan}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
