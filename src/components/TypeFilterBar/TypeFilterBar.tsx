import { useTypesQuery } from '../../hooks/usePokemonList'
import { getTypeColor } from '../../utils/typeColors'
import { capitalize } from '../../utils/formatters'

interface TypeFilterBarProps {
  selectedType: string | null
  onSelectType: (type: string | null) => void
}

// PokeAPI's /type list includes a few entries that aren't real filterable
// types: "unknown" and "shadow" are non-visual legacy entries with no
// gameplay meaning in the mainline games, and "stellar" (Gen 9 Terastal)
// has zero pokémon associated via /type/stellar — filtering by it would
// always show an empty grid. None of the three appear in the Figma mockup
// either, which only modeled the 18 classic types.
const EXCLUDED_TYPES = new Set(['unknown', 'shadow', 'stellar'])

export function TypeFilterBar({ selectedType, onSelectType }: TypeFilterBarProps) {
  const { data: types } = useTypesQuery()
  const visibleTypes = (types ?? []).filter((type) => !EXCLUDED_TYPES.has(type.name))

  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto pr-4 pb-1 sm:flex-wrap sm:overflow-visible sm:pr-0">
      {visibleTypes.map((type) => {
        const isActive = selectedType === type.name
        return (
          <button
            key={type.name}
            type="button"
            onClick={() => onSelectType(isActive ? null : type.name)}
            aria-pressed={isActive}
            className="type-chip shrink-0 cursor-pointer rounded-full border-2 px-3 py-1 text-xs font-semibold transition"
            style={
              {
                '--chip-color': getTypeColor(type.name),
                borderColor: 'var(--chip-color)',
              } as React.CSSProperties
            }
          >
            {capitalize(type.name)}
          </button>
        )
      })}
    </div>
  )
}
