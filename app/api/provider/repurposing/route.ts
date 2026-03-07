import { NextResponse } from 'next/server'
import drugs from '@/data/drugs.json'

interface RepurposingSignal {
  disease: string
  signalStrength: number
  reason: string
}

interface Drug {
  name: string
  commonUse: string
  frequencyScore: number
  contraindications: string[]
  repurposingSignals: RepurposingSignal[]
}

function scoreRepurposingDrug(drug: Drug, disease: string) {
  const match = drug.repurposingSignals.find(
    (signal) => signal.disease.toLowerCase() === disease.toLowerCase()
  )

  if (!match) return null

  const noveltyBoost = Math.max(0, 1 - drug.frequencyScore)
  const score = (match.signalStrength * 0.75 + noveltyBoost * 0.25) * 100

  return {
    drug: drug.name,
    knownPrimaryUse: drug.commonUse,
    disease,
    confidence: Math.round(score),
    reason: match.reason,
    signalStrength: match.signalStrength,
    noveltyScore: Number(noveltyBoost.toFixed(2)),
    cautions: drug.contraindications,
  }
}

export async function POST(request: Request) {
  try {
    const { disease } = await request.json()

    if (!disease) {
      return NextResponse.json({ error: 'disease is required' }, { status: 400 })
    }

    const results = (drugs as Drug[])
      .map((drug) => scoreRepurposingDrug(drug, disease))
      .filter(Boolean)
      .sort((a, b) => (b?.confidence ?? 0) - (a?.confidence ?? 0))

    return NextResponse.json({ disease, results })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
