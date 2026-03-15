const STORAGE_KEY = 'yomiyasu_license'

export function getLicenseKey(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export async function validateLicense(key: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.lemonsqueezy.com/v1/licenses/validate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: key }),
      }
    )
    const data = await res.json()
    if (data?.activated) {
      localStorage.setItem(STORAGE_KEY, key)
      return true
    }
    return false
  } catch {
    return false
  }
}

export function clearLicense(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function isProFromStorage(): boolean {
  return !!localStorage.getItem(STORAGE_KEY)
}
