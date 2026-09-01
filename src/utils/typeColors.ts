// Standard Pokémon type-color palette. Confirmed against the Figma design:
// the "grass" badge sampled to #78C850, an exact match, so the rest of the
// convention is trusted rather than hand-sampled (see src/styles/tokens.css).
export const TYPE_COLORS: Record<string, string> = {
  normal: '#a8a878',
  fire: '#f08030',
  water: '#6890f0',
  electric: '#f8d030',
  grass: '#78c850',
  ice: '#98d8d8',
  fighting: '#c03028',
  poison: '#a040a0',
  ground: '#e0c068',
  flying: '#a890f0',
  psychic: '#f85888',
  bug: '#a8b820',
  rock: '#b8a038',
  ghost: '#705898',
  dragon: '#7038f8',
  dark: '#705848',
  steel: '#b8b8d0',
  fairy: '#ee99ac',
}

const FALLBACK_COLOR = '#6b6b7a'

export function getTypeColor(typeName: string): string {
  return TYPE_COLORS[typeName.toLowerCase()] ?? FALLBACK_COLOR
}
