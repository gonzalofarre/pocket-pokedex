import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getPokemonByType, getPokemonDetail, getPokemonList, getTypes } from '../api/pokemon'
import type { NamedAPIResource, Pokemon } from '../api/types'

export const PAGE_SIZE = 40

export function useTypesQuery() {
  return useQuery({
    queryKey: ['types'],
    queryFn: getTypes,
    staleTime: Infinity,
    select: (data) => data.results,
  })
}

export interface PokemonListItem {
  name: string
  detail: Pokemon | undefined
  isLoading: boolean
}

/**
 * Gallery pagination is expressed as a single `visibleCount` (a multiple of
 * PAGE_SIZE) rather than an incremental page cursor, so a caller can restore
 * "3 pages in" after a reload by just seeding the initial count — no need to
 * replay "Load More" clicks. The default listing re-requests
 * `/pokemon?limit=visibleCount&offset=0` on growth; that endpoint only
 * returns {name,url} pairs so the payload stays tiny, and the per-pokémon
 * detail fetches below are cached individually, so growing the limit never
 * re-fetches a pokémon already on screen.
 */
export function usePokemonList(selectedType: string | null, initialVisibleCount = PAGE_SIZE) {
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount)
  const [previousType, setPreviousType] = useState(selectedType)

  if (selectedType !== previousType) {
    setPreviousType(selectedType)
    setVisibleCount(PAGE_SIZE)
  }

  const isTypeFiltered = selectedType !== null

  const defaultQuery = useQuery({
    queryKey: ['pokemon-names', 'default', visibleCount],
    queryFn: () => getPokemonList(visibleCount, 0),
    enabled: !isTypeFiltered,
    // Growing visibleCount is a brand-new query key, so without this it'd
    // briefly have no data of its own and "Load More" would blank the
    // whole grid down to a spinner instead of just growing it. Keeping the
    // previous page's data around while the bigger page fetches fixes that.
    placeholderData: keepPreviousData,
  })

  const typeQuery = useQuery({
    queryKey: ['pokemon-names', 'type', selectedType],
    queryFn: () => getPokemonByType(selectedType as string),
    enabled: isTypeFiltered,
    select: (data) => data.pokemon.map((entry) => entry.pokemon),
    placeholderData: keepPreviousData,
  })

  const visibleNames: NamedAPIResource[] = isTypeFiltered
    ? (typeQuery.data ?? []).slice(0, visibleCount)
    : (defaultQuery.data?.results ?? [])

  const totalCount = isTypeFiltered ? (typeQuery.data?.length ?? 0) : (defaultQuery.data?.count ?? 0)

  const detailQueries = useQueries({
    queries: visibleNames.map((entry) => ({
      queryKey: ['pokemon-detail', entry.name],
      queryFn: () => getPokemonDetail(entry.name),
      staleTime: Infinity,
    })),
  })

  const pokemons: PokemonListItem[] = visibleNames.map((entry, index) => ({
    name: entry.name,
    detail: detailQueries[index]?.data,
    isLoading: detailQueries[index]?.isLoading ?? true,
  }))

  const isLoading = isTypeFiltered ? typeQuery.isLoading : defaultQuery.isLoading
  const isError = isTypeFiltered ? typeQuery.isError : defaultQuery.isError
  const isLoadingMore = !isLoading && (isTypeFiltered ? false : defaultQuery.isFetching)

  return {
    pokemons,
    visibleCount,
    hasMore: visibleCount < totalCount,
    loadMore: () => setVisibleCount((count) => count + PAGE_SIZE),
    isLoading,
    isError,
    isLoadingMore,
    retry: () => (isTypeFiltered ? typeQuery.refetch() : defaultQuery.refetch()),
  }
}
