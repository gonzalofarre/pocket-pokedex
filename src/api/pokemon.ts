import { API_BASE, apiFetch } from './client'
import type {
  EvolutionChain,
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  TypeDetailResponse,
  TypeListResponse,
} from './types'

export function getPokemonList(limit: number, offset: number) {
  return apiFetch<PokemonListResponse>(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`)
}

export function getPokemonByType(typeName: string) {
  return apiFetch<TypeDetailResponse>(`${API_BASE}/type/${typeName}`)
}

export function getTypes() {
  return apiFetch<TypeListResponse>(`${API_BASE}/type`)
}

export function getPokemonDetail(nameOrId: string | number) {
  return apiFetch<Pokemon>(`${API_BASE}/pokemon/${nameOrId}`)
}

export function getPokemonSpecies(nameOrId: string | number) {
  return apiFetch<PokemonSpecies>(`${API_BASE}/pokemon-species/${nameOrId}`)
}

export function getEvolutionChain(url: string) {
  return apiFetch<EvolutionChain>(url)
}
