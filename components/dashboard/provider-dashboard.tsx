"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, AlertTriangle, Pill, Beaker, Activity, ShieldAlert, Stethoscope } from "lucide-react"

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

export function ProviderDashboard() {
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

  return (
    <div className="relative">
      <div className="fixed inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,_oklch(0.55_0.10_145_/_0.1),_transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Provider Hero */}
        <section className="text-center space-y-4 bg-card rounded-2xl p-8 border border-border shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <Badge variant="outline" className="text-primary border-primary/30">Provider Access</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-serif tracking-tight text-balance">
            Provider Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Access advanced drug repurposing analysis, use-case evaluation, and AI-powered patient drug decisions.
          </p>
        </section>

        {/* Provider Tools Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Repurposing Analysis */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <Beaker className="h-5 w-5 text-primary" />
                Repurposing Analysis
              </CardTitle>
              <CardDescription>Evaluate unconventional drug candidates for disease targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleRepurposing} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repurposing-disease" className="text-muted-foreground">Disease target</Label>
                  <Input
                    id="repurposing-disease"
                    placeholder="e.g., Fibromyalgia"
                    value={repurposingDisease}
                    onChange={(e) => setRepurposingDisease(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={repurposingLoading} className="w-full">
                  {repurposingLoading ? "Analyzing..." : "Analyze Candidates"}
                </Button>
              </form>
              {repurposingError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{repurposingError}</p>
                </div>
              )}
              {repurposingResult && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Results for <span className="font-medium text-foreground">{repurposingResult.disease}</span>
                  </p>
                  {repurposingResult.results?.length > 0 ? (
                    repurposingResult.results.map((candidate, idx) => (
                      <div key={idx} className="p-3 bg-muted/50 border border-border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground text-sm flex items-center gap-1">
                            <Pill className="w-3 h-3 text-primary" />
                            {candidate.drug}
                          </h4>
                          <Badge variant={candidate.confidence >= 70 ? "default" : "secondary"} className="text-xs">
                            {candidate.confidence}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{candidate.knownPrimaryUse}</p>
                        <p className="text-xs text-foreground">{candidate.reason}</p>
                        {candidate.cautions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {candidate.cautions.map((c, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/20">
                                {c}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No candidates found.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Use-Case Effects */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Use-Case Effects
              </CardTitle>
              <CardDescription>Analyze patient-specific applicability and effects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleUseCase} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Condition</Label>
                  <Input
                    placeholder="e.g., Neuroinflammation"
                    value={useCaseCondition}
                    onChange={(e) => setUseCaseCondition(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Symptoms (comma-separated)</Label>
                  <Input
                    placeholder="fatigue, pain"
                    value={useCaseSymptoms}
                    onChange={(e) => setUseCaseSymptoms(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Comorbidities (comma-separated)</Label>
                  <Input
                    placeholder="asthma, kidney disease"
                    value={useCaseComorbidities}
                    onChange={(e) => setUseCaseComorbidities(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={useCaseLoading} className="w-full">
                  {useCaseLoading ? "Analyzing..." : "Analyze Effects"}
                </Button>
              </form>
              {useCaseError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{useCaseError}</p>
                </div>
              )}
              {useCaseResult && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Analysis for <span className="font-medium text-foreground">{useCaseResult.condition}</span>
                  </p>
                  {useCaseResult.analysis?.length > 0 ? (
                    useCaseResult.analysis.map((item, idx) => (
                      <div key={idx} className="p-3 bg-muted/50 border border-border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground text-sm">{item.drug}</h4>
                          <Badge variant={item.fitScore >= 70 ? "default" : "secondary"} className="text-xs">
                            {item.fitScore}% fit
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.class}</p>
                        <p className="text-xs text-foreground">{item.rationale}</p>
                        {item.sideEffects.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.sideEffects.map((e, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/20">
                                {e}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {item.contraindicationsDetected.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.contraindicationsDetected.map((c, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                                {c}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No applicable drugs found.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Patient Drug Decision */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                AI Drug Decision
              </CardTitle>
              <CardDescription>AI-powered patient-specific drug recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleProviderDecision} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Primary condition</Label>
                  <Input
                    placeholder="e.g., Migraine"
                    value={providerCondition}
                    onChange={(e) => setProviderCondition(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Symptoms (comma-separated)</Label>
                  <Input
                    placeholder="headache, nausea"
                    value={providerSymptoms}
                    onChange={(e) => setProviderSymptoms(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Medical history (comma-separated)</Label>
                  <Input
                    placeholder="bradycardia, asthma"
                    value={providerHistory}
                    onChange={(e) => setProviderHistory(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={providerLoading} className="w-full">
                  {providerLoading ? "Analyzing..." : "Run AI Decision"}
                </Button>
              </form>
              {providerError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{providerError}</p>
                </div>
              )}
              {providerResult && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Decisions for <span className="font-medium text-foreground">{providerResult.condition}</span>
                  </p>
                  {providerResult.summary && (
                    <p className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">{providerResult.summary}</p>
                  )}
                  {providerResult.recommendations?.length > 0 ? (
                    providerResult.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-3 bg-muted/50 border border-border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground text-sm">{rec.drug}</h4>
                          <Badge
                            className={`text-xs ${
                              rec.fitScore >= 75
                                ? "bg-primary/20 text-primary"
                                : rec.fitScore >= 55
                                  ? "bg-amber-500/20 text-amber-700"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {rec.fitScore >= 75 ? <CheckCircle2 className="w-3 h-3 mr-1" /> : rec.fitScore >= 55 ? <AlertTriangle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                            {rec.fitScore}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{rec.recommendationLevel}</p>
                        <p className="text-xs text-foreground">{rec.rationale}</p>
                        {rec.sideEffects.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {rec.sideEffects.map((e, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/20">
                                {e}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No recommendations found.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
