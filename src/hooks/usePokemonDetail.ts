import { useQuery } from '@tanstack/react-query'
import { getEvolutionChain, getPokemonDetail, getPokemonSpecies } from '../api/pokemon'

export function usePokemonDetail(nameOrId: string | null) {
  const detailQuery = useQuery({
    // Same key used by usePokemonList's per-card fetch, so opening the modal
    // for a card already on screen reuses that cached data instantly.
    queryKey: ['pokemon-detail', nameOrId],
    queryFn: () => getPokemonDetail(nameOrId as string),
    enabled: nameOrId !== null,
    staleTime: Infinity,
  })

  const speciesQuery = useQuery({
    queryKey: ['pokemon-species', nameOrId],
    queryFn: () => getPokemonSpecies(nameOrId as string),
    enabled: nameOrId !== null,
    staleTime: Infinity,
  })

  const evolutionChainUrl = speciesQuery.data?.evolution_chain.url ?? null

  const evolutionQuery = useQuery({
    queryKey: ['evolution-chain', evolutionChainUrl],
    queryFn: () => getEvolutionChain(evolutionChainUrl as string),
    enabled: evolutionChainUrl !== null,
    staleTime: Infinity,
  })

  return {
    pokemon: detailQuery.data,
    species: speciesQuery.data,
    evolutionChain: evolutionQuery.data,
    isLoading: detailQuery.isLoading || speciesQuery.isLoading,
    isError: detailQuery.isError || speciesQuery.isError,
  }
}
