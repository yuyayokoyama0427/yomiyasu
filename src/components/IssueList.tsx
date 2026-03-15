import type { Issue } from '../lib/rules'

interface Props {
  issues: Issue[]
  isPro: boolean
}

const severityStyle: Record<string, string> = {
  error: 'bg-red-50 border-red-200 text-red-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
}

const severityIcon: Record<string, string> = {
  error: '🔴',
  warning: '🟡',
  info: '🔵',
}

export function IssueList({ issues, isPro }: Props) {
  const freeIssues = issues.filter(i => !i.pro)
  const proIssues = issues.filter(i => i.pro)

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-600">
        指摘事項 {issues.length > 0 ? `（${freeIssues.length}件）` : ''}
      </h3>

      {freeIssues.length === 0 && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          ✅ 指摘事項はありません。読みやすい文章です！
        </div>
      )}

      {freeIssues.map((issue, i) => (
        <div
          key={i}
          className={`border rounded-lg px-4 py-3 text-sm ${severityStyle[issue.severity]}`}
        >
          <div className="font-medium">{severityIcon[issue.severity]} {issue.message}</div>
          <div className="mt-1 opacity-80">{issue.detail}</div>
        </div>
      ))}

      {!isPro && proIssues.length > 0 && (
        <div className="border border-dashed border-purple-300 rounded-lg px-4 py-3 text-sm text-purple-600 bg-purple-50">
          🔒 Pro版では詳細チェック（二重否定・文体混在・冗長表現など）も利用できます
        </div>
      )}

      {isPro && proIssues.map((issue, i) => (
        <div
          key={`pro-${i}`}
          className={`border rounded-lg px-4 py-3 text-sm ${severityStyle[issue.severity]}`}
        >
          <span className="text-purple-600 text-xs font-bold mr-1">Pro</span>
          <span className="font-medium">{severityIcon[issue.severity]} {issue.message}</span>
          <div className="mt-1 opacity-80">{issue.detail}</div>
        </div>
      ))}
    </div>
  )
}
