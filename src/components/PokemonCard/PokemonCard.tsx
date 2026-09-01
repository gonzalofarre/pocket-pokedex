import type { Pokemon } from '../../api/types'
import { capitalize, formatPokemonId } from '../../utils/formatters'
import { TypeBadge } from '../ui/TypeBadge'
import { Spinner } from '../ui/Spinner'
import { CheckIcon, PlusIcon } from '../ui/icons'

interface PokemonCardProps {
  pokemon?: Pokemon
  isLoading: boolean
  isFavorite: boolean
  onSelect: () => void
  onToggleFavorite: () => void
}

export function PokemonCard({
  pokemon,
  isLoading,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: PokemonCardProps) {
  if (isLoading || !pokemon) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-2xl border border-border bg-surface">
        <Spinner />
      </div>
    )
  }

  const sprite = pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default

  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={onSelect}
        className="flex flex-col items-start text-left"
        aria-haspopup="dialog"
      >
        <div className="flex w-full items-start justify-between">
          <span className="font-semibold text-text">{capitalize(pokemon.name)}</span>
          <span className="text-sm text-text-muted">{formatPokemonId(pokemon.id)}</span>
        </div>
        <div className="my-2 flex h-24 w-full items-center justify-center">
          {sprite ? (
            <img src={sprite} alt={pokemon.name} className="h-24 w-24 object-contain" />
          ) : (
            <div className="h-24 w-24" />
          )}
        </div>
      </button>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {pokemon.types.map((slot) => (
            <TypeBadge key={slot.type.name} type={slot.type.name} />
          ))}
        </div>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${pokemon.name} from favorites` : `Add ${pokemon.name} to favorites`}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
            isFavorite
              ? 'border-brand bg-brand text-text-inverted'
              : 'border-border text-text-muted hover:border-brand hover:text-brand'
          }`}
        >
          {isFavorite ? <CheckIcon className="h-3.5 w-3.5" /> : <PlusIcon className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  )
}
