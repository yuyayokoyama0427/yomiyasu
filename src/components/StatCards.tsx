import type { AnalysisResult } from '../lib/analyzer'

interface Props {
  result: AnalysisResult
}

const STAT_TIPS: Record<string, string> = {
  '文字数': 'スペース・改行を除いた文字数',
  '文の数': '句点（。！？）で区切った文の数',
  '平均文長': '1文あたりの平均文字数。40字以下が目安',
  'ひらがな率': '日本語文字中のひらがな割合。30%以上が読みやすい目安',
}

export function StatCards({ result }: Props) {
  const stats = [
    { label: '文字数', value: result.charCountNoSpace.toLocaleString(), sub: `全体 ${result.charCount.toLocaleString()}字` },
    { label: '文の数', value: result.sentenceCount, sub: null },
    { label: '平均文長', value: `${result.avgSentenceLength}字`, sub: null },
    { label: 'ひらがな率', value: `${Math.round(result.hiraganaRatio * 100)}%`, sub: null },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center" title={STAT_TIPS[s.label]}>
          <div className="text-2xl font-bold text-gray-800">{s.value}</div>
          <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          {s.sub && <div className="text-[10px] text-gray-400 mt-0.5">{s.sub}</div>}
        </div>
      ))}
    </div>
  )
}
