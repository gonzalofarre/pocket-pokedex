import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFavorites } from './useFavorites'

describe('useFavorites', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('starts empty when nothing is stored', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
    expect(result.current.isFavorite(1)).toBe(false)
  })

  it('toggles a pokémon in and out of favorites', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => result.current.toggleFavorite(25))
    expect(result.current.favorites).toEqual([25])
    expect(result.current.isFavorite(25)).toBe(true)

    act(() => result.current.toggleFavorite(25))
    expect(result.current.favorites).toEqual([])
    expect(result.current.isFavorite(25)).toBe(false)
  })

  it('persists favorites to localStorage across mounts', () => {
    const first = renderHook(() => useFavorites())
    act(() => first.result.current.toggleFavorite(1))
    first.unmount()

    const second = renderHook(() => useFavorites())
    expect(second.result.current.favorites).toEqual([1])
  })
})
