import { describe, expect, it } from 'vitest'
import {
  capitalize,
  extractIdFromUrl,
  formatHeight,
  formatPokemonId,
  formatWeight,
  getEnglishFlavorText,
} from '../formatters'

describe('formatters', () => {
  it('capitalizes hyphenated names', () => {
    expect(capitalize('special-attack')).toBe('Special Attack')
    expect(capitalize('bulbasaur')).toBe('Bulbasaur')
  })

  it('pads the pokémon id', () => {
    expect(formatPokemonId(1)).toBe('#001')
    expect(formatPokemonId(150)).toBe('#150')
    expect(formatPokemonId(1024)).toBe('#1024')
  })

  it('converts decimetres/hectograms to metres/kilograms', () => {
    expect(formatHeight(7)).toBe('0.7 m')
    expect(formatWeight(69)).toBe('6.9 kg')
  })

  it('extracts the numeric id from a PokeAPI resource url', () => {
    expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon-species/25/')).toBe(25)
  })

  it('finds the english flavor text and strips control characters', () => {
    const text = getEnglishFlavorText([
      { flavor_text: 'texto en español', language: { name: 'es' } },
      { flavor_text: 'A wild\fPikachu\nappeared.', language: { name: 'en' } },
    ])
    expect(text).toBe('A wild Pikachu appeared.')
  })
})
