import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'pocket-pokedex:favorites'

function readStoredFavorites(): number[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'number') : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => readStoredFavorites())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites])

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((favId) => favId !== id) : [...current, id],
    )
  }, [])

  return { favorites, isFavorite, toggleFavorite }
}
