import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'pocket-pokedex:theme'

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

interface ThemeState {
  value: Theme
}

const initialState: ThemeState = { value: readInitialTheme() }

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.value = action.payload
    },
    toggleTheme(state) {
      state.value = state.value === 'light' ? 'dark' : 'light'
    },
  },
})

export const { setTheme, toggleTheme } = themeSlice.actions
export default themeSlice.reducer
