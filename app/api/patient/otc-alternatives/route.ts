import { NextResponse } from 'next/server'
import otcMap from '@/data/otc_map.json'

interface OTCItem {
  name: string
  ingredients: string[]
  effects: string[]
}

interface OTCEntry {
  symptom: string
  otc: OTCItem[]
}

function otcAlternatives({
  symptoms = [],
  currentMedication = '',
}: {
  symptoms?: string[]
  currentMedication?: string
}) {
  const symptomSet = symptoms.map((s) => s.trim().toLowerCase()).filter(Boolean)
  const matches = (otcMap as OTCEntry[]).filter((entry) =>
    symptomSet.some((sym) => sym.includes(entry.symptom) || entry.symptom.includes(sym))
  )

  const options = matches.reduce<
    Array<{
      forSymptom: string
      option: string
      matchedIngredients: string[]
      expectedEffects: string[]
    }>
  >((acc, entry) => {
    const mapped = entry.otc.map((item) => ({
      forSymptom: entry.symptom,
      option: item.name,
      matchedIngredients: item.ingredients,
      expectedEffects: item.effects,
    }))

    return acc.concat(mapped)
  }, [])

  const ingredientPlan = options.map(
    (opt) => `${opt.option}: ${opt.matchedIngredients.join(', ')} -> ${opt.expectedEffects.join(', ')}`
  )

  return {
    currentMedication,
    matchedCount: options.length,
    alternatives: options,
    genericPlan:
      ingredientPlan.length > 0
        ? ingredientPlan
        : ['No close OTC ingredient match found for the entered symptoms. Consult a pharmacist or clinician.'],
  }
}

export async function POST(request: Request) {
  try {
    const { symptoms, currentMedication } = await request.json()

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json({ error: 'symptoms array is required' }, { status: 400 })
    }

    const output = otcAlternatives({ symptoms, currentMedication })
    return NextResponse.json(output)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
