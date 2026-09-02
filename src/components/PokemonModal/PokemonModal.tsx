import { useEffect, useRef, useState } from 'react'
import { usePokemonDetail } from '../../hooks/usePokemonDetail'
import { capitalize, formatHeight, formatPokemonId, formatWeight } from '../../utils/formatters'
import { TypeBadge } from '../ui/TypeBadge'
import { PokeballPlaceholder } from '../ui/PokeballPlaceholder'
import { Spinner } from '../ui/Spinner'
import { X } from 'lucide-react'
import { StatsTab } from './tabs/StatsTab'
import { MovesTab } from './tabs/MovesTab'
import { AboutTab } from './tabs/AboutTab'

type TabKey = 'stats' | 'moves' | 'about'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'stats', label: 'Stats' },
  { key: 'moves', label: 'Moves' },
  { key: 'about', label: 'About' },
]

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface PokemonModalProps {
  pokemonName: string | null
  onClose: () => void
}

export function PokemonModal({ pokemonName, onClose }: PokemonModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('stats')
  const [previousPokemonName, setPreviousPokemonName] = useState(pokemonName)
  const [imageFailed, setImageFailed] = useState(false)
  const { pokemon, species, evolutionChain, isLoading } = usePokemonDetail(pokemonName)
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)

  if (pokemonName !== previousPokemonName) {
    setPreviousPokemonName(pokemonName)
    if (pokemonName) setActiveTab('stats')
    setImageFailed(false)
  }

  useEffect(() => {
    if (!pokemonName) return

    // Standard dialog a11y pattern: remember what had focus, move focus
    // into the dialog on open, and give it back on close — otherwise
    // keyboard/screen-reader users get dropped back at the top of the
    // page instead of where they were (the card that opened this).
    previouslyFocusedElement.current = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()

    document.body.classList.add('modal-open')

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return

      const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      // Trap Tab/Shift+Tab inside the dialog instead of letting focus
      // escape to the page underneath.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedElement.current?.focus()
    }
  }, [pokemonName, onClose])

  if (!pokemonName) return null

  const sprite = pokemon?.sprites.other?.['official-artwork']?.front_default ?? pokemon?.sprites.front_default

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-6"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-label={pokemon ? `${capitalize(pokemon.name)} details` : 'Pokémon details'}
        onClick={(event) => event.stopPropagation()}
        className="modal-panel flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl outline-none sm:max-h-[90vh] sm:max-w-lg"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold text-text">Pokémon Details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-muted transition hover:bg-surface-muted hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading || !pokemon ? (
            <div className="flex justify-center py-16">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <>
              <div className="flex gap-4 border-b border-border p-5">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-surface-muted">
                  {sprite && !imageFailed ? (
                    <img
                      src={sprite}
                      alt={pokemon.name}
                      className="h-20 w-20 object-contain"
                      onError={() => setImageFailed(true)}
                    />
                  ) : (
                    <PokeballPlaceholder className="h-14 w-14 text-border" />
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm text-text-muted">{formatPokemonId(pokemon.id)}</span>
                  <span className="text-xl font-bold text-text">{capitalize(pokemon.name)}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pokemon.types.map((slot) => (
                      <TypeBadge key={slot.type.name} type={slot.type.name} />
                    ))}
                  </div>
                  <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-text-muted">
                    <div>
                      <dt className="inline">Height: </dt>
                      <dd className="inline font-medium text-text">{formatHeight(pokemon.height)}</dd>
                    </div>
                    <div>
                      <dt className="inline">Weight: </dt>
                      <dd className="inline font-medium text-text">{formatWeight(pokemon.weight)}</dd>
                    </div>
                    {pokemon.abilities.map((slot) => (
                      <div key={slot.ability.name}>
                        <dt className="inline">{slot.is_hidden ? 'Hidden Ability: ' : 'Ability: '}</dt>
                        <dd className="inline font-medium text-text">{capitalize(slot.ability.name)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <div className="flex border-b border-border px-2">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    aria-selected={activeTab === tab.key}
                    role="tab"
                    className={`flex-1 cursor-pointer border-b-2 px-3 py-2.5 text-sm font-semibold transition ${
                      activeTab === tab.key
                        ? 'border-brand text-brand'
                        : 'border-transparent text-text-muted hover:text-text'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {activeTab === 'stats' ? <StatsTab pokemon={pokemon} /> : null}
                {activeTab === 'moves' ? <MovesTab pokemon={pokemon} /> : null}
                {activeTab === 'about' ? (
                  <AboutTab pokemon={pokemon} species={species} evolutionChain={evolutionChain} />
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
