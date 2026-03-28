const STORAGE_KEY = 'yomiyasu_license'

export function getLicenseKey(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export async function validateLicense(key: string): Promise<boolean> {
  try {
    const res = await fetch('/api/validate-license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey: key }),
    })
    const data = await res.json() as { valid: boolean }
    if (data.valid) {
      localStorage.setItem(STORAGE_KEY, key)
      return true
    }
    return false
  } catch {
    throw new Error('network')
  }
}

export function clearLicense(): void {
  localStorage.removeItem(STORAGE_KEY)
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isProFromStorage(): boolean {
  const key = localStorage.getItem(STORAGE_KEY)
  return key !== null && UUID_REGEX.test(key)
}
