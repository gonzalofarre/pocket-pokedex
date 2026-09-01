import { Heart, Moon, Sun } from 'lucide-react'
import type { Theme } from '../../store/themeSlice'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
  showingFavorites: boolean
  favoritesCount: number
  onToggleFavoritesView: () => void
}

export function Header({
  theme,
  onToggleTheme,
  showingFavorites,
  favoritesCount,
  onToggleFavoritesView,
}: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold text-text sm:text-3xl">Pocket Pokédex</h1>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleFavoritesView}
          aria-pressed={showingFavorites}
          className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
            showingFavorites
              ? 'border-brand bg-brand text-text-inverted'
              : 'border-border bg-surface text-text hover:border-brand hover:text-brand'
          }`}
        >
          <Heart className="h-4 w-4" fill={showingFavorites ? 'currentColor' : 'none'} />
          Favorites
          <span
            className={`rounded-full px-1.5 text-xs ${
              showingFavorites ? 'bg-white/20' : 'bg-surface-muted'
            }`}
          >
            {favoritesCount}
          </span>
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle color theme"
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text transition hover:border-brand"
        >
          {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === 'light' ? 'Default Theme' : 'Dark Theme'}
        </button>
      </div>
    </header>
  )
}
