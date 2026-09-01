import { useTypesQuery } from '../../hooks/usePokemonList'
import { getTypeColor } from '../../utils/typeColors'
import { capitalize } from '../../utils/formatters'

interface TypeFilterBarProps {
  selectedType: string | null
  onSelectType: (type: string | null) => void
}

// PokeAPI's /type list includes two non-visual legacy entries with no color
// or gameplay meaning in the mainline games; the design's filter row doesn't
// include them either.
const EXCLUDED_TYPES = new Set(['unknown', 'shadow'])

export function TypeFilterBar({ selectedType, onSelectType }: TypeFilterBarProps) {
  const { data: types } = useTypesQuery()
  const visibleTypes = (types ?? []).filter((type) => !EXCLUDED_TYPES.has(type.name))

  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 sm:flex-nowrap">
      {visibleTypes.map((type) => {
        const isActive = selectedType === type.name
        return (
          <button
            key={type.name}
            type="button"
            onClick={() => onSelectType(isActive ? null : type.name)}
            aria-pressed={isActive}
            className="type-chip shrink-0 cursor-pointer rounded-full border-2 border-transparent px-3 py-1 text-xs font-semibold transition"
            style={{
              '--chip-color': getTypeColor(type.name),
              backgroundColor: isActive ? 'var(--chip-color)' : 'var(--color-surface-muted)',
              color: isActive ? '#fff' : 'var(--color-text-muted)',
            } as React.CSSProperties}
          >
            {capitalize(type.name)}
          </button>
        )
      })}
    </div>
  )
}
