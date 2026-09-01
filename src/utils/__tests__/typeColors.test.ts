import { describe, expect, it } from 'vitest'
import { getTypeColor, TYPE_COLORS } from '../typeColors'

describe('getTypeColor', () => {
  it('returns the known color for a valid type', () => {
    expect(getTypeColor('grass')).toBe('#78c850')
  })

  it('is case-insensitive', () => {
    expect(getTypeColor('Fire')).toBe(TYPE_COLORS.fire)
  })

  it('falls back to a neutral color for unknown types', () => {
    expect(getTypeColor('made-up-type')).toBe('#6b6b7a')
  })

  it('defines a color for all 18 mainline types', () => {
    expect(Object.keys(TYPE_COLORS)).toHaveLength(18)
  })
})
