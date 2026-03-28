import { useState } from 'react'
import type { Issue } from '../lib/rules'

interface Props {
  issues: Issue[]
  isPro: boolean
  charCount?: number
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

const PRO_TEASERS = [
  { severity: 'warning' as const, message: '二重否定が含まれています', detail: '「〜でないわけではない」などの表現は読みにくくなります。' },
  { severity: 'info' as const, message: '文体が混在しています', detail: '「です・ます調」と「だ・である調」が混在しています。' },
]

export function IssueList({ issues, isPro, charCount = 0 }: Props) {
  const freeIssues = issues.filter(i => !i.pro)
  const proIssues = issues.filter(i => i.pro)
  const isShortText = charCount > 0 && charCount < 50

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-600">
        指摘事項
        {freeIssues.length > 0 && <span className="ml-1 text-gray-400">（{freeIssues.length}件）</span>}
      </h3>

      {isShortText && (
        <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          💡 文章が短いため、一部のチェックが正確に動作しない場合があります。100文字以上の文章でより正確な結果が得られます。
        </div>
      )}

      {freeIssues.length === 0 && !isShortText && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          ✅ 指摘事項はありません。読みやすい文章です！
        </div>
      )}

      {freeIssues.map((issue, i) => (
        <IssueCard key={i} issue={issue} />
      ))}

      {!isPro && (
        <>
          <h3 className="text-sm font-semibold text-gray-500 pt-1">
            Proチェック（プレビュー）
          </h3>
          {PRO_TEASERS.map((t, i) => (
            <div key={i} className={`border rounded-xl overflow-hidden relative ${severityStyle[t.severity]}`}>
              <div className={`px-4 py-3 text-sm blur-sm select-none ${severityTextStyle[t.severity]}`}>
                <div className="font-medium">{severityIcon[t.severity]} {t.message}</div>
                <div className="mt-1 opacity-80 text-xs">{t.detail}</div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-purple-600 bg-white/90 px-2 py-1 rounded-full border border-purple-200">
                  🔒 Pro版で確認
                </span>
              </div>
            </div>
          ))}
        </>
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
