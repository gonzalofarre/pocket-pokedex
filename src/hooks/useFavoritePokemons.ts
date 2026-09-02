import { useQueries } from '@tanstack/react-query'
import { getPokemonDetail } from '../api/pokemon'
import type { PokemonListItem } from './usePokemonList'

export function useFavoritePokemons(favoriteIds: number[]): PokemonListItem[] {
  // favoritesSlice appends new ids to the end, so reversing here shows the
  // most recently favorited pokémon first instead of the order they were
  // originally added.
  const orderedIds = [...favoriteIds].reverse()

  const queries = useQueries({
    queries: orderedIds.map((id) => ({
      queryKey: ['pokemon-detail', String(id)],
      queryFn: () => getPokemonDetail(id),
      staleTime: Infinity,
    })),
  })

  return orderedIds.map((id, index) => ({
    name: String(id),
    detail: queries[index]?.data,
    isLoading: queries[index]?.isLoading ?? true,
  }))
}
