import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query'
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

/**
 * Resolves the ordered {name,url} list for the gallery: the default paginated
 * PokeAPI listing, or every pokémon of the selected type (PokeAPI's
 * /type/{name} has no pagination of its own, so "Load More" is applied
 * client-side over that full list to keep the same UX in both modes).
 */
function usePokemonNames(selectedType: string | null) {
  const defaultList = useInfiniteQuery({
    queryKey: ['pokemon-names', 'default'],
    queryFn: ({ pageParam }) => getPokemonList(PAGE_SIZE, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length * PAGE_SIZE : undefined,
    enabled: selectedType === null,
  })

  const typeList = useQuery({
    queryKey: ['pokemon-names', 'type', selectedType],
    queryFn: () => getPokemonByType(selectedType as string),
    enabled: selectedType !== null,
    select: (data) => data.pokemon.map((entry) => entry.pokemon),
  })

  if (selectedType === null) {
    const names = defaultList.data?.pages.flatMap((page) => page.results) ?? []
    return {
      names,
      isLoading: defaultList.isLoading,
      isError: defaultList.isError,
      hasMore: Boolean(defaultList.hasNextPage),
      loadMore: () => defaultList.fetchNextPage(),
      isLoadingMore: defaultList.isFetchingNextPage,
    }
  }

  const allNames = typeList.data ?? []
  return {
    names: allNames,
    isLoading: typeList.isLoading,
    isError: typeList.isError,
    // paginated further down by the visibleCount slice in usePokemonList
    hasMore: null as boolean | null,
    loadMore: null as (() => void) | null,
    isLoadingMore: false,
  }
}

export interface PokemonListItem {
  name: string
  detail: Pokemon | undefined
  isLoading: boolean
}

export function usePokemonList(selectedType: string | null) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [previousType, setPreviousType] = useState(selectedType)

  if (selectedType !== previousType) {
    setPreviousType(selectedType)
    setVisibleCount(PAGE_SIZE)
  }

  const namesResult = usePokemonNames(selectedType)

  const isTypeFiltered = selectedType !== null
  const visibleNames: NamedAPIResource[] = isTypeFiltered
    ? namesResult.names.slice(0, visibleCount)
    : namesResult.names

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

  const hasMore = isTypeFiltered
    ? visibleCount < namesResult.names.length
    : (namesResult.hasMore ?? false)

  const loadMore = () => {
    if (isTypeFiltered) {
      setVisibleCount((count) => count + PAGE_SIZE)
    } else {
      namesResult.loadMore?.()
    }
  }

  return {
    pokemons,
    hasMore,
    loadMore,
    isLoading: namesResult.isLoading,
    isError: namesResult.isError,
    isLoadingMore: isTypeFiltered ? false : namesResult.isLoadingMore,
  }
}
