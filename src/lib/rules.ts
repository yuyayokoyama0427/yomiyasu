export type Severity = 'error' | 'warning' | 'info'

export interface Issue {
  id: string
  severity: Severity
  message: string
  detail: string
  pro: boolean
}

export interface RuleResult {
  triggered: boolean
  issues: Issue[]
}

// R001: 一文が60字超
export function checkLongSentence(sentences: string[]): Issue[] {
  const issues: Issue[] = []
  sentences.forEach((s, i) => {
    const len = s.replace(/\s/g, '').length
    if (len > 60) {
      issues.push({
        id: 'R001',
        severity: 'warning',
        message: `${i + 1}文目が長すぎます（${len}字）`,
        detail: '一文は60字以内を目安にすると読みやすくなります。',
        pro: false,
      })
    }
  })
  return issues
}

// R002: 同じ語尾が3文以上連続
export function checkRepeatedEnding(sentences: string[]): Issue[] {
  const issues: Issue[] = []
  if (sentences.length < 3) return issues

  let streak = 1
  for (let i = 1; i < sentences.length; i++) {
    const prev = sentences[i - 1].trim().slice(-3)
    const curr = sentences[i].trim().slice(-3)
    if (prev === curr) {
      streak++
      if (streak >= 3) {
        issues.push({
          id: 'R002',
          severity: 'warning',
          message: `語尾「${curr}」が${streak}文連続しています`,
          detail: '同じ語尾が続くとリズムが単調になります。語尾を変えてみましょう。',
          pro: false,
        })
        streak = 1
      }
    } else {
      streak = 1
    }
  }
  return issues
}

// R003: 40字以上で読点なし
export function checkMissingComma(sentences: string[]): Issue[] {
  const issues: Issue[] = []
  sentences.forEach((s, i) => {
    const clean = s.replace(/\s/g, '')
    if (clean.length > 40 && !clean.includes('、')) {
      issues.push({
        id: 'R003',
        severity: 'info',
        message: `${i + 1}文目に読点がありません（${clean.length}字）`,
        detail: '長い文には読点「、」を入れると読みやすくなります。',
        pro: false,
      })
    }
  })
  return issues
}

// R004: ひらがな率が30%未満
export function checkHiraganaRatio(_text: string, ratio: number): Issue[] {
  if (ratio < 0.3) {
    return [{
      id: 'R004',
      severity: 'info',
      message: `ひらがな率が低いです（${Math.round(ratio * 100)}%）`,
      detail: 'ひらがなが少ないと漢字が多くなり読みにくくなる場合があります。目安は30%以上です。',
      pro: false,
    }]
  }
  return []
}

// R005: 二重否定（Pro）
export function checkDoubleNegative(text: string): Issue[] {
  const patterns = [
    /ないわけではない/g,
    /なくはない/g,
    /ないこともない/g,
    /ないとは言えない/g,
  ]
  const issues: Issue[] = []
  patterns.forEach(p => {
    if (p.test(text)) {
      issues.push({
        id: 'R005',
        severity: 'warning',
        message: '二重否定が含まれています',
        detail: '「〜ないわけではない」などの二重否定は肯定表現に書き換えると明確になります。',
        pro: true,
      })
    }
  })
  return issues
}

// R006: 文体混在（です/だ調）（Pro）
export function checkStyleMix(sentences: string[]): Issue[] {
  if (sentences.length < 3) return []
  let desu = 0
  let da = 0
  sentences.forEach(s => {
    if (/です[。！？]?$|ます[。！？]?$/.test(s.trim())) desu++
    else if (/だ[。！？]?$|である[。！？]?$/.test(s.trim())) da++
  })
  if (desu > 0 && da > 0) {
    return [{
      id: 'R006',
      severity: 'warning',
      message: 'です・ます調とだ・である調が混在しています',
      detail: '文体を統一するとより読みやすい文章になります。',
      pro: true,
    }]
  }
  return []
}

// R007: 冗長表現（Pro）
export function checkRedundancy(text: string): Issue[] {
  const patterns: { pattern: RegExp; suggestion: string }[] = [
    { pattern: /することができ/g, suggestion: '「できる」に言い換えられます' },
    { pattern: /していただく/g, suggestion: '「もらう」に言い換えると簡潔になります' },
    { pattern: /という形で/g, suggestion: '「という形で」は省略できます' },
    { pattern: /〜的な/g, suggestion: '「〜的な」は言い換えを検討してください' },
  ]
  const issues: Issue[] = []
  patterns.forEach(({ pattern, suggestion }) => {
    if (pattern.test(text)) {
      issues.push({
        id: 'R007',
        severity: 'info',
        message: '冗長な表現が含まれています',
        detail: suggestion,
        pro: true,
      })
    }
  })
  return issues
}
