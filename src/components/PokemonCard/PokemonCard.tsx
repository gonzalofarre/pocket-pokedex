import { Check, Plus } from 'lucide-react'
import { memo, useCallback, useState } from 'react'
import type { Pokemon } from '../../api/types'
import { capitalize, formatPokemonId } from '../../utils/formatters'
import { PokeballBurst } from '../ui/PokeballBurst'
import { PokeballPlaceholder } from '../ui/PokeballPlaceholder'
import { Spinner } from '../ui/Spinner'
import { TypeBadge } from '../ui/TypeBadge'

interface PokemonCardProps {
  pokemon?: Pokemon
  isLoading: boolean
  isFavorite: boolean
  onSelect: (name: string) => void
  onToggleFavorite: (id: number) => void
}

// Memoized because the grid can hold hundreds of these (Load More, or the
// full ~1350-entry list) — without it, every card re-renders on any
// unrelated App-level state change (theme, favorites elsewhere, filter),
// not just the one that actually changed. This only pays off because
// onSelect/onToggleFavorite are stable callbacks passed straight through
// by PokemonGrid rather than a new closure per item on every render.
export const PokemonCard = memo(function PokemonCard({
  pokemon,
  isLoading,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: PokemonCardProps) {
  const [showBurst, setShowBurst] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  // Stable regardless of re-renders: PokeballBurst's own completion timer
  // is keyed off this in a useEffect dependency array, so a fresh closure
  // here on every render would reset that timer if the card re-rendered
  // mid-animation.
  const dismissBurst = useCallback(() => setShowBurst(false), [])

  if (isLoading || !pokemon) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-2xl border border-border bg-surface">
        <Spinner />
      </div>
    )
  }

  const sprite = pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default

  const handleToggleFavorite = () => {
    if (!isFavorite) setShowBurst(true)
    onToggleFavorite(pokemon.id)
  }

  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={() => onSelect(pokemon.name)}
        className="flex cursor-pointer flex-col items-start text-left"
        aria-haspopup="dialog"
      >
        <div className="flex w-full items-start justify-between gap-2">
          <span
            className="line-clamp-2 min-h-[2lh] min-w-0 font-semibold text-text"
            title={capitalize(pokemon.name)}
          >
            {capitalize(pokemon.name)}
          </span>
          <span className="shrink-0 text-sm text-text-muted">{formatPokemonId(pokemon.id)}</span>
        </div>
        <div className="my-2 flex h-24 w-full items-center justify-center">
          {sprite && !imageFailed ? (
            <img
              src={sprite}
              alt={pokemon.name}
              className="h-24 w-24 object-contain"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <PokeballPlaceholder className="h-14 w-14 text-border" />
          )}
        </div>
      </button>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {pokemon.types.map((slot) => (
            <TypeBadge key={slot.type.name} type={slot.type.name} />
          ))}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Remove ${pokemon.name} from favorites` : `Add ${pokemon.name} to favorites`}
            className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border transition ${
              isFavorite
                ? 'border-brand bg-brand text-text-inverted'
                : 'border-border text-text-muted hover:border-brand hover:text-brand'
            }`}
          >
            {isFavorite ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
          {showBurst ? <PokeballBurst onComplete={dismissBurst} /> : null}
        </div>
      </div>
    </div>
  )
})
