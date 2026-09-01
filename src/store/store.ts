import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer, { FAVORITES_STORAGE_KEY } from './favoritesSlice'
import themeReducer, { THEME_STORAGE_KEY } from './themeSlice'

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    theme: themeReducer,
  },
})

// Reducers stay pure (no localStorage/DOM access inside them); persistence
// is a side effect of state changing, handled once here via subscribe
// rather than duplicated per-action.
let previous = store.getState()
store.subscribe(() => {
  const state = store.getState()
  if (state.favorites.ids !== previous.favorites.ids) {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.favorites.ids))
  }
  if (state.theme.value !== previous.theme.value) {
    window.localStorage.setItem(THEME_STORAGE_KEY, state.theme.value)
  }
  previous = state
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
