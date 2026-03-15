import type { AnalysisResult } from '../lib/analyzer'

interface Props {
  result: AnalysisResult
}

export function StatCards({ result }: Props) {
  const stats = [
    { label: '文字数', value: result.charCountNoSpace.toLocaleString() },
    { label: '文の数', value: result.sentenceCount },
    { label: '平均文長', value: `${result.avgSentenceLength}字` },
    { label: 'ひらがな率', value: `${Math.round(result.hiraganaRatio * 100)}%` },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-gray-800">{s.value}</div>
          <div className="text-xs text-gray-500 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
