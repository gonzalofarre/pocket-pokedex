import type { Pokemon } from '../../../api/types'
import { capitalize } from '../../../utils/formatters'

interface LevelUpMove {
  name: string
  level: number
}

function getLevelUpMoves(pokemon: Pokemon): LevelUpMove[] {
  const moves: LevelUpMove[] = []

  for (const move of pokemon.moves) {
    const levelUpDetail = move.version_group_details.find(
      (detail) => detail.move_learn_method.name === 'level-up',
    )
    if (levelUpDetail) {
      moves.push({ name: move.move.name, level: levelUpDetail.level_learned_at })
    }
  }

  return moves.sort((a, b) => a.level - b.level)
}

export function MovesTab({ pokemon }: { pokemon: Pokemon }) {
  const moves = getLevelUpMoves(pokemon)

  if (moves.length === 0) {
    return <p className="text-sm text-text-muted">No level-up moves found.</p>
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-text-muted">Level-up Moves</h3>
      <ul className="flex flex-col divide-y divide-border">
        {moves.map((move) => (
          <li key={move.name} className="flex items-center justify-between py-2 text-sm">
            <span className="text-text">{capitalize(move.name)}</span>
            <span className="text-text-muted">
              {move.level === 0 ? 'Evolve' : `Level ${move.level}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
