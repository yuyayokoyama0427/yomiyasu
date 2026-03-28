import { useState } from 'react'
import { isProFromStorage, validateLicense, clearLicense } from '../lib/license'

export function usePro() {
  const [isPro, setIsPro] = useState<boolean>(isProFromStorage)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function activate(key: string): Promise<boolean> {
    setLoading(true)
    setError(null)
    let success = false
    try {
      const ok = await validateLicense(key)
      if (ok) {
        setIsPro(true)
        success = true
      } else {
        setError('ライセンスキーが無効です。再確認してください。')
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      if (msg === 'network') {
        setError('通信エラーが発生しました。インターネット接続を確認してください。')
      } else {
        setError('ライセンスキーが無効です。再確認してください。')
      }
    }
    setLoading(false)
    return success
  }

  function deactivate() {
    clearLicense()
    setIsPro(false)
  }

  return { isPro, activate, deactivate, loading, error }
}
