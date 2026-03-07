"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

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
  const [repurposingOutput, setRepurposingOutput] = useState("")
  const [repurposingLoading, setRepurposingLoading] = useState(false)

  const [useCaseCondition, setUseCaseCondition] = useState("")
  const [useCaseSymptoms, setUseCaseSymptoms] = useState("")
  const [useCaseComorbidities, setUseCaseComorbidities] = useState("")
  const [useCaseOutput, setUseCaseOutput] = useState("")
  const [useCaseLoading, setUseCaseLoading] = useState(false)

  const [providerCondition, setProviderCondition] = useState("")
  const [providerSymptoms, setProviderSymptoms] = useState("")
  const [providerHistory, setProviderHistory] = useState("")
  const [providerOutput, setProviderOutput] = useState("")
  const [providerLoading, setProviderLoading] = useState(false)

  const [patientMedication, setPatientMedication] = useState("")
  const [patientSymptoms, setPatientSymptoms] = useState("")
  const [patientOutput, setPatientOutput] = useState("")
  const [patientLoading, setPatientLoading] = useState(false)

  async function handleRepurposing(e: React.FormEvent) {
    e.preventDefault()
    setRepurposingLoading(true)
    setRepurposingOutput("Analyzing repurposing candidates...")

    try {
      const data = await postJson("/api/provider/repurposing", { disease: repurposingDisease })
      setRepurposingOutput(JSON.stringify(data, null, 2))
    } catch (error) {
      setRepurposingOutput(error instanceof Error ? error.message : "Request failed")
    } finally {
      setRepurposingLoading(false)
    }
  }

  async function handleUseCase(e: React.FormEvent) {
    e.preventDefault()
    setUseCaseLoading(true)
    setUseCaseOutput("Evaluating use cases and effects...")

    try {
      const data = await postJson("/api/provider/use-case", {
        condition: useCaseCondition,
        symptoms: splitCSV(useCaseSymptoms),
        comorbidities: splitCSV(useCaseComorbidities),
      })
      setUseCaseOutput(JSON.stringify(data, null, 2))
    } catch (error) {
      setUseCaseOutput(error instanceof Error ? error.message : "Request failed")
    } finally {
      setUseCaseLoading(false)
    }
  }

  async function handleProviderDecision(e: React.FormEvent) {
    e.preventDefault()
    setProviderLoading(true)
    setProviderOutput("Running patient-specific drug decision analysis...")

    try {
      const data = await postJson("/api/provider/patient-drug-decision", {
        condition: providerCondition,
        symptoms: splitCSV(providerSymptoms),
        medicalHistory: splitCSV(providerHistory),
      })
      setProviderOutput(JSON.stringify(data, null, 2))
    } catch (error) {
      setProviderOutput(error instanceof Error ? error.message : "Request failed")
    } finally {
      setProviderLoading(false)
    }
  }

  async function handlePatientOTC(e: React.FormEvent) {
    e.preventDefault()
    setPatientLoading(true)
    setPatientOutput("Matching OTC alternatives by symptom and ingredient profile...")

    try {
      const data = await postJson("/api/patient/otc-alternatives", {
        currentMedication: patientMedication,
        symptoms: splitCSV(patientSymptoms),
      })
      setPatientOutput(JSON.stringify(data, null, 2))
    } catch (error) {
      setPatientOutput(error instanceof Error ? error.message : "Request failed")
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
                  Analyze low-frequency use potential
                </Button>
              </form>
              {repurposingOutput && (
                <pre className="mt-4 p-4 bg-muted rounded-lg text-sm text-foreground overflow-auto max-h-64 whitespace-pre-wrap">
                  {repurposingOutput}
                </pre>
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
                  Analyze applicability and effects
                </Button>
              </form>
              {useCaseOutput && (
                <pre className="mt-4 p-4 bg-muted rounded-lg text-sm text-foreground overflow-auto max-h-64 whitespace-pre-wrap">
                  {useCaseOutput}
                </pre>
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
                  Run AI applicability decision
                </Button>
              </form>
              {providerOutput && (
                <pre className="mt-4 p-4 bg-muted rounded-lg text-sm text-foreground overflow-auto max-h-64 whitespace-pre-wrap">
                  {providerOutput}
                </pre>
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
                  Find OTC ingredient alternatives
                </Button>
              </form>
              {patientOutput && (
                <pre className="mt-4 p-4 bg-muted rounded-lg text-sm text-foreground overflow-auto max-h-64 whitespace-pre-wrap">
                  {patientOutput}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
