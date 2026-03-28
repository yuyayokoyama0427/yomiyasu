interface Props {
  score: number
}

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

function scoreLabel(score: number): string {
  if (score === 100) return '満点！'
  if (score >= 80) return '読みやすい'
  if (score >= 60) return '改善の余地あり'
  return '要改善'
}

export function ScoreCircle({ score }: Props) {
  const color = scoreColor(score)
  const r = 54
  const circumference = 2 * Math.PI * r
  const dash = (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        <text x="70" y="65" textAnchor="middle" fontSize="32" fontWeight="bold" fill={color}>
          {score}
        </text>
        <text x="70" y="85" textAnchor="middle" fontSize="12" fill="#6b7280">
          / 100
        </text>
      </svg>
      <span className="text-sm font-medium" style={{ color }}>{scoreLabel(score)}</span>
    </div>
  )
}
