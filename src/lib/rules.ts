export type Severity = 'error' | 'warning' | 'info'

export interface Issue {
  id: string
  severity: Severity
  message: string
  detail: string
  suggestedFix?: string
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
        suggestedFix: '文の途中で意味が切れる箇所を探し、「。」で区切りましょう。\n例：「〜であり、〜です。」→「〜です。〜です。」',
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
          suggestedFix: '「〜です。」→「〜となっています。」「〜でしょう。」「〜と言えます。」などに言い換えてみてください。',
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
        suggestedFix: '接続詞（「そして」「しかし」「また」）の後や、条件節（「〜ので」「〜が」）の後に「、」を入れましょう。',
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
      suggestedFix: '難しい漢字をひらがなに開くことを検討しましょう。\n例：「致します」→「いたします」、「頂く」→「いただく」',
      pro: false,
    }]
  }
  return []
}

// R008: 助詞の書き間違い
const PARTICLE_MISTAKES: { wrong: RegExp; right: string; example: string }[] = [
  {
    wrong: /([^\n]{0,4})(わ)([がをにもはへで、。！？\s])/g,
    right: 'は',
    example: '「今日わ」→「今日は」',
  },
  {
    wrong: /([^\n]{0,4})(お)([食飲見聞持買作使送持受与取渡])/g,
    right: 'を',
    example: '「ご飯お食べた」→「ご飯を食べた」',
  },
  {
    wrong: /([^\n]{0,4})(え)([行向進帰来戻])/g,
    right: 'へ',
    example: '「学校え行く」→「学校へ行く」',
  },
]

export function checkParticleMistake(text: string): Issue[] {
  const issues: Issue[] = []
  const seen = new Set<string>()

  PARTICLE_MISTAKES.forEach(({ wrong, right, example }) => {
    const matches = [...text.matchAll(wrong)]
    matches.forEach(m => {
      const key = `${m[2]}-${right}`
      if (seen.has(key)) return
      seen.add(key)
      issues.push({
        id: 'R008',
        severity: 'error',
        message: `助詞の誤りの可能性があります（「${m[2]}」→「${right}」）`,
        detail: `「${m[2]}」は「${right}」の誤りかもしれません。文脈を確認してください。`,
        suggestedFix: example,
        pro: false,
      })
    })
  })
  return issues
}

// R005: 二重否定（Pro）
export function checkDoubleNegative(text: string): Issue[] {
  const patterns: { re: RegExp; fix: string }[] = [
    { re: /ないわけではない/g, fix: '「〜ないわけではない」→「〜ある」または「〜できる」' },
    { re: /なくはない/g, fix: '「〜なくはない」→「〜ある」' },
    { re: /ないこともない/g, fix: '「〜ないこともない」→「〜できる」' },
    { re: /ないとは言えない/g, fix: '「〜ないとは言えない」→「〜と言える」' },
  ]
  const issues: Issue[] = []
  patterns.forEach(({ re, fix }) => {
    if (re.test(text)) {
      issues.push({
        id: 'R005',
        severity: 'warning',
        message: '二重否定が含まれています',
        detail: '二重否定は肯定表現に書き換えると明確になります。',
        suggestedFix: fix,
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
      suggestedFix: desu >= da
        ? '「〜だ。」「〜である。」→「〜です。」「〜ます。」に統一しましょう。'
        : '「〜です。」「〜ます。」→「〜だ。」「〜である。」に統一しましょう。',
      pro: true,
    }]
  }
  return []
}

// R007: 冗長表現（Pro）
export function checkRedundancy(text: string): Issue[] {
  const patterns: { pattern: RegExp; message: string; fix: string }[] = [
    {
      pattern: /することができ/g,
      message: '冗長な表現「することができ〜」',
      fix: '「〜することができます」→「〜できます」',
    },
    {
      pattern: /していただく/g,
      message: '冗長な表現「していただく」',
      fix: '「〜していただく」→「〜もらう」または「〜いただく」',
    },
    {
      pattern: /という形で/g,
      message: '冗長な表現「という形で」',
      fix: '「〜という形で行います」→「〜します」',
    },
  ]
  const issues: Issue[] = []
  patterns.forEach(({ pattern, message, fix }) => {
    if (pattern.test(text)) {
      issues.push({
        id: 'R007',
        severity: 'info',
        message,
        detail: 'より簡潔な表現に言い換えましょう。',
        suggestedFix: fix,
        pro: true,
      })
    }
  })
  return issues
}
