import { NextResponse } from 'next/server'
import drugs from '@/data/drugs.json'

interface RepurposingSignal {
  disease: string
  signalStrength: number
  reason: string
}

interface Drug {
  name: string
  class: string
  effects: string[]
  sideEffects: string[]
  contraindications: string[]
  repurposingSignals: RepurposingSignal[]
}

const textIncludesAny = (text: string, list: string[]) =>
  list.some((entry) => text.toLowerCase().includes(entry.toLowerCase()))

function analyzeUseCase({
  condition,
  symptoms = [],
  comorbidities = [],
}: {
  condition: string
  symptoms?: string[]
  comorbidities?: string[]
}) {
  const patientProfileText = `${condition} ${symptoms.join(' ')} ${comorbidities.join(' ')}`.toLowerCase()

  const candidates = (drugs as Drug[])
    .map((drug) => {
      let fit = 40
      const effectsHits = drug.effects.filter((effect) =>
        textIncludesAny(patientProfileText, effect.split(' '))
      ).length
      fit += effectsHits * 8

      const repurposeMatch = drug.repurposingSignals.find((signal) =>
        patientProfileText.includes(signal.disease.toLowerCase())
      )
      if (repurposeMatch) {
        fit += Math.round(repurposeMatch.signalStrength * 35)
      }

      const contraindicationFlag = drug.contraindications.filter((contra) =>
        patientProfileText.includes(contra.toLowerCase())
      )

      if (contraindicationFlag.length > 0) {
        fit -= 30
      }

      return {
        drug: drug.name,
        class: drug.class,
        fitScore: Math.max(0, Math.min(100, fit)),
        rationale: repurposeMatch
          ? `Potentially relevant for ${repurposeMatch.disease}; ${repurposeMatch.reason}`
          : `Based on mechanistic effects: ${drug.effects.join(', ')}`,
        sideEffects: drug.sideEffects,
        contraindicationsDetected: contraindicationFlag,
      }
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 4)

  return candidates
}

function patientDrugDecision({
  condition,
  symptoms = [],
  medicalHistory = [],
}: {
  condition: string
  symptoms?: string[]
  medicalHistory?: string[]
}) {
  const useCase = analyzeUseCase({ condition, symptoms, comorbidities: medicalHistory })

  const recommendations = useCase.map((rec) => ({
    ...rec,
    recommendationLevel:
      rec.fitScore >= 75
        ? 'Strong candidate for clinician review'
        : rec.fitScore >= 55
          ? 'Moderate candidate for clinician review'
          : 'Low relevance currently',
  }))

  return {
    summary: `Analyzed ${symptoms.length} symptom(s) and ${medicalHistory.length} medical history item(s) for ${condition}.`,
    recommendations,
  }
}

export async function POST(request: Request) {
  try {
    const { condition, symptoms, medicalHistory } = await request.json()

    if (!condition) {
      return NextResponse.json({ error: 'condition is required' }, { status: 400 })
    }

    const decision = patientDrugDecision({ condition, symptoms, medicalHistory })
    return NextResponse.json({ condition, ...decision })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
