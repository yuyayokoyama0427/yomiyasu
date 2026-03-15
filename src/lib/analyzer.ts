import {
  checkLongSentence,
  checkRepeatedEnding,
  checkMissingComma,
  checkHiraganaRatio,
  checkDoubleNegative,
  checkStyleMix,
  checkRedundancy,
  type Issue,
} from './rules'

export interface AnalysisResult {
  charCount: number
  charCountNoSpace: number
  sentenceCount: number
  paragraphCount: number
  avgSentenceLength: number
  hiraganaRatio: number
  score: number
  issues: Issue[]
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[。！？\n])/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
}

function countHiragana(text: string): number {
  return (text.match(/[\u3041-\u3096]/g) || []).length
}

function countJapanese(text: string): number {
  return (text.match(/[\u3000-\u9fff\uff00-\uffef]/g) || []).length
}

function calcScore(
  avgSentenceLength: number,
  hiraganaRatio: number,
  issueCount: number
): number {
  let score = 100
  if (avgSentenceLength > 40) score -= (avgSentenceLength - 40) * 1.5
  if (hiraganaRatio < 0.3) score -= (0.3 - hiraganaRatio) * 50
  score -= issueCount * 4
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function analyze(text: string, isPro: boolean): AnalysisResult {
  const sentences = splitSentences(text)
  const paragraphs = text.split(/\n{2,}/).filter(p => p.trim().length > 0)

  const charCount = text.length
  const charCountNoSpace = text.replace(/[\s\n]/g, '').length
  const sentenceCount = sentences.length
  const paragraphCount = Math.max(1, paragraphs.length)

  const totalSentenceChars = sentences.reduce(
    (sum, s) => sum + s.replace(/\s/g, '').length, 0
  )
  const avgSentenceLength = sentenceCount > 0
    ? Math.round(totalSentenceChars / sentenceCount)
    : 0

  const hiraganaCount = countHiragana(text)
  const japaneseCount = countJapanese(text)
  const hiraganaRatio = japaneseCount > 0
    ? Math.round((hiraganaCount / japaneseCount) * 100) / 100
    : 0

  // 無料チェック
  const issues: Issue[] = [
    ...checkLongSentence(sentences),
    ...checkRepeatedEnding(sentences),
    ...checkMissingComma(sentences),
    ...checkHiraganaRatio(text, hiraganaRatio),
  ]

  // Proチェック
  if (isPro) {
    issues.push(
      ...checkDoubleNegative(text),
      ...checkStyleMix(sentences),
      ...checkRedundancy(text),
    )
  }

  const score = calcScore(avgSentenceLength, hiraganaRatio, issues.length)

  return {
    charCount,
    charCountNoSpace,
    sentenceCount,
    paragraphCount,
    avgSentenceLength,
    hiraganaRatio,
    score,
    issues,
  }
}
