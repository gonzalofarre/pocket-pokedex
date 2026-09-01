import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import favoritesReducer, { toggleFavorite } from './favoritesSlice'

describe('favoritesSlice', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('starts empty when nothing is stored', () => {
    const state = favoritesReducer(undefined, { type: '@@INIT' })
    expect(state.ids).toEqual([])
  })

  it('adds an id on toggle when not already favorited', () => {
    const state = favoritesReducer({ ids: [] }, toggleFavorite(25))
    expect(state.ids).toEqual([25])
  })

  it('removes an id on toggle when already favorited', () => {
    const state = favoritesReducer({ ids: [1, 25, 6] }, toggleFavorite(25))
    expect(state.ids).toEqual([1, 6])
  })

  describe('initial state from localStorage', () => {
    afterEach(() => {
      vi.resetModules()
    })

    it('reads pre-existing favorites on module load', async () => {
      window.localStorage.setItem('pocket-pokedex:favorites', JSON.stringify([1, 4, 7]))
      vi.resetModules()
      const { default: freshReducer } = await import('./favoritesSlice')
      const state = freshReducer(undefined, { type: '@@INIT' })
      expect(state.ids).toEqual([1, 4, 7])
    })
  })
})
