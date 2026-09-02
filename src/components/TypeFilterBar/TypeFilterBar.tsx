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
    <>
      {/* Phones: a native dropdown instead of a horizontally-scrolling chip
          row — one thumb tap opens the OS's own picker, no swiping needed.
          Chips take over once there's enough width to lay them out flat
          (tablet/desktop, see the sm:flex block below). */}
      <div className="sm:hidden">
        <select
          value={selectedType ?? ''}
          onChange={(event) => onSelectType(event.target.value || null)}
          aria-label="Filter by type"
          className="w-full cursor-pointer rounded-full border-2 bg-surface px-4 py-2 text-sm font-semibold transition"
          style={
            {
              '--chip-color': selectedType ? getTypeColor(selectedType) : 'var(--color-border)',
              borderColor: 'var(--chip-color)',
              color: selectedType ? 'var(--chip-color)' : 'var(--color-text)',
            } as React.CSSProperties
          }
        >
          <option value="">All Types</option>
          {visibleTypes.map((type) => (
            <option
              key={type.name}
              value={type.name}
              style={{ backgroundColor: getTypeColor(type.name), color: '#fff' }}
            >
              {capitalize(type.name)}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden gap-2 sm:flex sm:flex-wrap sm:justify-between">
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
    </>
  )
}
