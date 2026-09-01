import { useEffect, useState } from 'react'
import { usePokemonDetail } from '../../hooks/usePokemonDetail'
import { capitalize, formatHeight, formatPokemonId, formatWeight } from '../../utils/formatters'
import { TypeBadge } from '../ui/TypeBadge'
import { Spinner } from '../ui/Spinner'
import { CloseIcon } from '../ui/icons'
import { StatsTab } from './tabs/StatsTab'
import { MovesTab } from './tabs/MovesTab'
import { AboutTab } from './tabs/AboutTab'

type TabKey = 'stats' | 'moves' | 'about'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'stats', label: 'Stats' },
  { key: 'moves', label: 'Moves' },
  { key: 'about', label: 'About' },
]

interface PokemonModalProps {
  pokemonName: string | null
  onClose: () => void
}

export function PokemonModal({ pokemonName, onClose }: PokemonModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('stats')
  const [previousPokemonName, setPreviousPokemonName] = useState(pokemonName)
  const { pokemon, species, evolutionChain, isLoading } = usePokemonDetail(pokemonName)

  if (pokemonName !== previousPokemonName) {
    setPreviousPokemonName(pokemonName)
    if (pokemonName) setActiveTab('stats')
  }

  useEffect(() => {
    if (!pokemonName) return

    document.body.classList.add('modal-open')
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
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
        role="dialog"
        aria-modal="true"
        aria-label={pokemon ? `${capitalize(pokemon.name)} details` : 'Pokémon details'}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl sm:max-h-[90vh]"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold text-text">Pokémon Details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition hover:bg-surface-muted hover:text-text"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto">
          {isLoading || !pokemon ? (
            <div className="flex justify-center py-16">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <>
              <div className="flex gap-4 border-b border-border p-5">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-surface-muted">
                  {sprite ? <img src={sprite} alt={pokemon.name} className="h-20 w-20 object-contain" /> : null}
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
                    className={`flex-1 border-b-2 px-3 py-2.5 text-sm font-semibold transition ${
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
