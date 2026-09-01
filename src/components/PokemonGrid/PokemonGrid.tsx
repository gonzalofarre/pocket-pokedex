import type { PokemonListItem } from '../../hooks/usePokemonList'
import { PokemonCard } from '../PokemonCard/PokemonCard'

interface PokemonGridProps {
  pokemons: PokemonListItem[]
  isFavorite: (id: number) => boolean
  onSelect: (name: string) => void
  onToggleFavorite: (id: number) => void
}

export function PokemonGrid({ pokemons, isFavorite, onSelect, onToggleFavorite }: PokemonGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {pokemons.map((item) => (
        <PokemonCard
          key={item.name}
          pokemon={item.detail}
          isLoading={item.isLoading}
          isFavorite={item.detail ? isFavorite(item.detail.id) : false}
          onSelect={onSelect}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
