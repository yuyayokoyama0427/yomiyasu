import { useState } from 'react'
import type { Issue } from '../lib/rules'

interface Props {
  issues: Issue[]
  isPro: boolean
}

const severityStyle: Record<string, string> = {
  error: 'bg-red-50 border-red-200',
  warning: 'bg-amber-50 border-amber-200',
  info: 'bg-blue-50 border-blue-200',
}

const severityTextStyle: Record<string, string> = {
  error: 'text-red-700',
  warning: 'text-amber-700',
  info: 'text-blue-700',
}

const severityIcon: Record<string, string> = {
  error: '🔴',
  warning: '🟡',
  info: '🔵',
}

function IssueCard({ issue }: { issue: Issue }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!issue.suggestedFix) return
    navigator.clipboard.writeText(issue.suggestedFix).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className={`border rounded-xl overflow-hidden ${severityStyle[issue.severity]}`}>
      <div className={`px-4 py-3 text-sm ${severityTextStyle[issue.severity]}`}>
        <div className="font-medium flex items-center gap-1">
          {issue.pro && (
            <span className="text-purple-600 text-xs font-bold bg-purple-100 px-1.5 py-0.5 rounded">Pro</span>
          )}
          <span>{severityIcon[issue.severity]} {issue.message}</span>
        </div>
        <div className="mt-1 opacity-80 text-xs">{issue.detail}</div>
      </div>

      {issue.suggestedFix && (
        <div className="border-t border-dashed border-current/20 bg-white/60 px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-1">修正例</div>
              <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                {issue.suggestedFix}
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="shrink-0 text-xs border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 px-2 py-1 rounded-md transition"
            >
              {copied ? '✓ コピー済' : 'コピー'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function IssueList({ issues, isPro }: Props) {
  const freeIssues = issues.filter(i => !i.pro)
  const proIssues = issues.filter(i => i.pro)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-600">
        指摘事項
        {freeIssues.length > 0 && <span className="ml-1 text-gray-400">（{freeIssues.length}件）</span>}
      </h3>

      {freeIssues.length === 0 && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          ✅ 指摘事項はありません。読みやすい文章です！
        </div>
      )}

      {freeIssues.map((issue, i) => (
        <IssueCard key={i} issue={issue} />
      ))}

      {!isPro && (
        <div className="border border-dashed border-purple-300 rounded-xl px-4 py-3 text-sm text-purple-600 bg-purple-50">
          🔒 Pro版では詳細チェック（二重否定・文体混在・冗長表現など）も利用できます
        </div>
      )}

      {isPro && proIssues.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-600 pt-1">
            Proチェック
            <span className="ml-1 text-gray-400">（{proIssues.length}件）</span>
          </h3>
          {proIssues.map((issue, i) => (
            <IssueCard key={`pro-${i}`} issue={issue} />
          ))}
        </>
      )}
    </div>
  )
}
