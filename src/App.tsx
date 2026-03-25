import { useState } from 'react'
import './index.css'
import { useAnalyzer } from './hooks/useAnalyzer'
import { usePro } from './hooks/usePro'
import { ScoreCircle } from './components/ScoreCircle'
import { StatCards } from './components/StatCards'
import { IssueList } from './components/IssueList'
import { LicenseModal } from './components/LicenseModal'

const PLACEHOLDER = `ここに文章を貼り付けてください。
読みやすさスコアや指摘事項が自動で表示されます。

例：
日本語の文章を書くとき、一文が長くなりすぎると読みにくくなることがありますので、適切な長さに区切ることが大切です。また、同じ語尾を繰り返したり、漢字が多すぎたりすることも読みにくさの原因になります。`

function stripUrls(text: string): string {
  return text.replace(/https?:\/\/\S+/g, '')
}

export default function App() {
  const [text, setText] = useState('')
  const [excludeUrls, setExcludeUrls] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { isPro, activate, loading, error } = usePro()
  const { result, run } = useAnalyzer(isPro)

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value
    setText(val)
    run(excludeUrls ? stripUrls(val) : val)
  }

  function handleToggleExcludeUrls() {
    const next = !excludeUrls
    setExcludeUrls(next)
    run(next ? stripUrls(text) : text)
  }

  async function handleActivate(key: string) {
    await activate(key)
    if (!error) {
      setShowModal(false)
      if (text) run(text)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Yomiyasu</span>
            <span className="text-xs text-gray-400">日本語文章チェック</span>
          </div>
          <div className="flex items-center gap-2">
            {isPro ? (
              <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-1 rounded-full">
                ✨ Pro
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="https://yomiyasu.lemonsqueezy.com/checkout/buy/8aa2fc52-0ac1-486b-86d8-6ae823b9a86a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-medium px-3 py-1.5 rounded-full transition"
                >
                  Pro版を購入（月額300円）
                </a>
                <button
                  className="text-xs text-purple-600 hover:underline"
                  onClick={() => setShowModal(true)}
                >
                  キー認証
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Editor */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">文章を入力</span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={excludeUrls}
                  onChange={handleToggleExcludeUrls}
                  className="w-3.5 h-3.5 accent-purple-600"
                />
                <span className="text-xs text-gray-500">URLを除外してチェック</span>
              </label>
              {text.length > 0 && (
                <button
                  className="text-xs text-gray-400 hover:text-gray-600"
                  onClick={() => { setText(''); run('') }}
                >
                  クリア
                </button>
              )}
            </div>
          </div>
          <textarea
            className="w-full px-4 py-4 text-base text-gray-800 resize-none focus:outline-none leading-relaxed"
            rows={12}
            placeholder={PLACEHOLDER}
            value={text}
            onChange={handleChange}
          />
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Score + Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ScoreCircle score={result.score} />
                <div className="flex-1 w-full">
                  <StatCards result={result} />
                </div>
              </div>
            </div>

            {/* Issues */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <IssueList issues={result.issues} isPro={isPro} />
              {!isPro && (
                <p className="text-xs text-gray-400 mt-4 text-center">
                  Pro版（月額300円）でさらに詳細なチェックが利用できます。{' '}
                  <button
                    className="text-purple-600 underline"
                    onClick={() => setShowModal(true)}
                  >
                    詳細を見る
                  </button>
                </p>
              )}
            </div>
          </>
        )}

        {/* Empty state */}
        {!result && (
          <div className="text-center text-gray-400 py-12 text-sm">
            上のエリアに文章を貼り付けると、自動でチェックが始まります
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-8">
        © 2026 Yomiyasu
      </footer>

      {showModal && (
        <LicenseModal
          onActivate={handleActivate}
          onClose={() => setShowModal(false)}
          loading={loading}
          error={error}
        />
      )}
    </div>
  )
}
