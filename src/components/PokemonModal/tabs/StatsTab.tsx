import { useEffect, useState } from 'react'
import type { Pokemon } from '../../../api/types'
import { capitalize } from '../../../utils/formatters'

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

const MAX_STAT = 180

export function StatsTab({ pokemon }: { pokemon: Pokemon }) {
  const total = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)

  return (
    <div className="flex flex-col gap-4">
      {pokemon.stats.map((stat, index) => {
        const label = STAT_LABELS[stat.stat.name] ?? capitalize(stat.stat.name)
        const percent = Math.min(100, (stat.base_stat / MAX_STAT) * 100)
        return (
          <div key={stat.stat.name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-text">{label}</span>
              <span className="font-semibold text-text">{stat.base_stat}</span>
            </div>
            <StatBar percent={percent} delayMs={index * 80} />
          </div>
        )
      })}

      <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-sm">
        <span className="font-semibold text-text">Total</span>
        <span className="font-bold text-text">{total}</span>
      </div>
    </div>
  )
}

interface StatBarProps {
  percent: number
  delayMs: number
}

// Starts at 0 and animates up to its real value on mount (with a small
// per-row stagger) instead of appearing already full — reads as the bars
// "filling in" rather than just popping onto the screen.
function StatBar({ percent, delayMs }: StatBarProps) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => setWidth(percent), delayMs)
    return () => window.clearTimeout(timer)
  }, [percent, delayMs])

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
      <div
        className="h-full rounded-full bg-text transition-[width] duration-700 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
