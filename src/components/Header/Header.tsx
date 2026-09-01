import type { Theme } from '../../hooks/useTheme'
import { HeartIcon, MoonIcon, SunIcon } from '../ui/icons'

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
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleFavoritesView}
          aria-pressed={showingFavorites}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
            showingFavorites
              ? 'border-brand bg-brand text-text-inverted'
              : 'border-border bg-surface text-text hover:border-brand hover:text-brand'
          }`}
        >
          <HeartIcon className="h-4 w-4" filled={showingFavorites} />
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
          className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text transition hover:border-brand"
        >
          {theme === 'light' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          {theme === 'light' ? 'Default Theme' : 'Dark Theme'}
        </button>
      </div>
    </header>
  )
}
