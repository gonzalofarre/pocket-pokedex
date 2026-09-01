import { useQueries } from '@tanstack/react-query'
import { getPokemonDetail } from '../api/pokemon'
import type { PokemonListItem } from './usePokemonList'

export function useFavoritePokemons(favoriteIds: number[]): PokemonListItem[] {
  const queries = useQueries({
    queries: favoriteIds.map((id) => ({
      queryKey: ['pokemon-detail', String(id)],
      queryFn: () => getPokemonDetail(id),
      staleTime: Infinity,
    })),
  })

  return favoriteIds.map((id, index) => ({
    name: String(id),
    detail: queries[index]?.data,
    isLoading: queries[index]?.isLoading ?? true,
  }))
}
