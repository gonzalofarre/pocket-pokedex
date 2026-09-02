import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTypesQuery } from '../../hooks/usePokemonList'
import { getTypeColor } from '../../utils/typeColors'
import { capitalize } from '../../utils/formatters'
import type { NamedAPIResource } from '../../api/types'
import { TypeBadge } from '../ui/TypeBadge'

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

// justify-content applies per flex line, not to the row as a whole, so a
// short leftover row wraps to and a full row can't both get "spread edge to
// edge" from one CSS rule — a full single row should stretch to line up
// with the card grid below it, but doing that to a half-empty wrapped row
// is what produced the huge, uneven gaps. Measuring whether the chips
// actually wrapped and toggling the class is the only way to get both.
function useIsSingleRow(rowKey: unknown) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSingleRow, setIsSingleRow] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const checkWrap = () => {
      const children = Array.from(container.children) as HTMLElement[]
      if (children.length === 0) return
      const firstTop = children[0].offsetTop
      setIsSingleRow(children.every((child) => child.offsetTop === firstTop))
    }

    checkWrap()
    const observer = new ResizeObserver(checkWrap)
    observer.observe(container)
    return () => observer.disconnect()
  }, [rowKey])

  return { containerRef, isSingleRow }
}

export function TypeFilterBar({ selectedType, onSelectType }: TypeFilterBarProps) {
  const { data: types } = useTypesQuery()
  const visibleTypes = (types ?? []).filter((type) => !EXCLUDED_TYPES.has(type.name))
  const { containerRef, isSingleRow } = useIsSingleRow(visibleTypes.length)

  return (
    <>
      {/* Phones: a custom dropdown instead of a horizontally-scrolling chip
          row. Not a native <select> — iOS's picker wheel ignores per-option
          background color entirely (a platform limit, not a styling bug),
          so a native element can't give the color-filled options we want.
          Chips take over once there's enough width to lay them out flat
          (tablet/desktop, see the sm:flex block below). */}
      <div className="sm:hidden">
        <TypeDropdown visibleTypes={visibleTypes} selectedType={selectedType} onSelectType={onSelectType} />
      </div>

      <div
        ref={containerRef}
        className={`hidden gap-2 sm:flex sm:flex-wrap ${isSingleRow ? 'sm:justify-between' : ''}`}
      >
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

interface TypeDropdownProps {
  visibleTypes: NamedAPIResource[]
  selectedType: string | null
  onSelectType: (type: string | null) => void
}

function TypeDropdown({ visibleTypes, selectedType, onSelectType }: TypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const selectOption = (type: string | null) => {
    onSelectType(type)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Filter by type"
        className="flex w-full cursor-pointer items-center justify-between rounded-full border-2 bg-surface px-4 py-2 text-sm font-semibold transition"
        style={
          {
            '--chip-color': selectedType ? getTypeColor(selectedType) : 'var(--color-border)',
            borderColor: 'var(--chip-color)',
            color: selectedType ? 'var(--chip-color)' : 'var(--color-text)',
          } as React.CSSProperties
        }
      >
        {selectedType ? capitalize(selectedType) : 'All Types'}
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen ? (
        <ul
          role="listbox"
          aria-label="Type options"
          className="absolute z-20 mt-1.5 max-h-72 w-full overflow-y-auto rounded-2xl border border-border bg-surface p-1.5 shadow-lg"
        >
          <li>
            <button
              type="button"
              role="option"
              aria-selected={selectedType === null}
              onClick={() => selectOption(null)}
              className="w-full cursor-pointer rounded-xl px-3 py-1.5 text-left text-sm font-semibold text-text transition hover:bg-surface-muted"
            >
              All Types
            </button>
          </li>
          {visibleTypes.map((type) => (
            <li key={type.name} className="mt-0.5">
              <button
                type="button"
                role="option"
                aria-selected={selectedType === type.name}
                onClick={() => selectOption(type.name)}
                className="w-full cursor-pointer rounded-xl px-3 py-1 text-left transition hover:bg-surface-muted"
              >
                <TypeBadge type={type.name} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
