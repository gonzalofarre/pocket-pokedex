import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const FAVORITES_STORAGE_KEY = 'pocket-pokedex:favorites'

function readInitialFavorites(): number[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'number') : []
  } catch {
    return []
  }
}

interface FavoritesState {
  ids: number[]
}

const initialState: FavoritesState = { ids: readInitialFavorites() }

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<number>) {
      const id = action.payload
      const index = state.ids.indexOf(id)
      if (index === -1) {
        state.ids.push(id)
      } else {
        state.ids.splice(index, 1)
      }
    },
  },
})

export const { toggleFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer
