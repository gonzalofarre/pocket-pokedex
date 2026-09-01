export interface NamedAPIResource {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NamedAPIResource[]
}

export interface PokemonTypeSlot {
  slot: number
  type: NamedAPIResource
}

export interface PokemonStat {
  base_stat: number
  stat: NamedAPIResource
}

export interface PokemonAbilitySlot {
  is_hidden: boolean
  slot: number
  ability: NamedAPIResource
}

export interface PokemonMoveVersionDetail {
  level_learned_at: number
  move_learn_method: NamedAPIResource
  version_group: NamedAPIResource
}

export interface PokemonMove {
  move: NamedAPIResource
  version_group_details: PokemonMoveVersionDetail[]
}

export interface PokemonSprites {
  front_default: string | null
  other?: {
    'official-artwork'?: {
      front_default: string | null
    }
  }
}

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  sprites: PokemonSprites
  types: PokemonTypeSlot[]
  stats: PokemonStat[]
  abilities: PokemonAbilitySlot[]
  moves: PokemonMove[]
}

export interface FlavorTextEntry {
  flavor_text: string
  language: NamedAPIResource
  version: NamedAPIResource
}

export interface GenusEntry {
  genus: string
  language: NamedAPIResource
}

export interface PokemonSpecies {
  id: number
  capture_rate: number
  base_happiness: number
  growth_rate: NamedAPIResource
  genera: GenusEntry[]
  flavor_text_entries: FlavorTextEntry[]
  evolution_chain: { url: string }
}

export interface ChainLink {
  species: NamedAPIResource
  evolves_to: ChainLink[]
  evolution_details: { min_level: number | null }[]
}

export interface EvolutionChain {
  id: number
  chain: ChainLink
}

export interface TypeListResponse {
  results: NamedAPIResource[]
}

export interface TypePokemonEntry {
  pokemon: NamedAPIResource
  slot: number
}

export interface TypeDetailResponse {
  name: string
  pokemon: TypePokemonEntry[]
}
