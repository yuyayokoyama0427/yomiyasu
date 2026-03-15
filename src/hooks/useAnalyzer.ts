import { useState, useCallback } from 'react'
import { analyze, type AnalysisResult } from '../lib/analyzer'

export function useAnalyzer(isPro: boolean) {
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const run = useCallback(
    (text: string) => {
      if (text.trim().length === 0) {
        setResult(null)
        return
      }
      setResult(analyze(text, isPro))
    },
    [isPro]
  )

  return { result, run }
}
