import { useCallback, useEffect, useState } from 'react'
import { Header } from './components/Header/Header'
import { TypeFilterBar } from './components/TypeFilterBar/TypeFilterBar'
import { PokemonGrid } from './components/PokemonGrid/PokemonGrid'
import { LoadMoreButton } from './components/LoadMoreButton/LoadMoreButton'
import { PokemonModal } from './components/PokemonModal/PokemonModal'
import { ErrorState } from './components/ui/ErrorState'
import { Spinner } from './components/ui/Spinner'
import { useFavoritePokemons } from './hooks/useFavoritePokemons'
import { usePokemonList } from './hooks/usePokemonList'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { toggleFavorite as toggleFavoriteAction } from './store/favoritesSlice'
import { toggleTheme as toggleThemeAction } from './store/themeSlice'
import { readUrlState, updateUrlState } from './utils/urlState'

const initialUrlState = readUrlState()

export default function App() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.value)
  const favorites = useAppSelector((state) => state.favorites.ids)

  const [selectedType, setSelectedType] = useState<string | null>(initialUrlState.type)
  const [showingFavorites, setShowingFavorites] = useState(initialUrlState.view === 'favorites')
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(initialUrlState.pokemon)

  const galleryList = usePokemonList(selectedType, initialUrlState.count)
  const favoritePokemons = useFavoritePokemons(favorites)

  const activeList = showingFavorites ? favoritePokemons : galleryList.pokemons

  // Redux reducers stay pure; applying the theme to the DOM is a side
  // effect of the value changing, so it lives here rather than in the slice.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Keeps ?count in sync as more pages load, without persisting it for the
  // favorites view (which isn't paginated).
  useEffect(() => {
    if (!showingFavorites) {
      updateUrlState({ count: String(galleryList.visibleCount) })
    }
  }, [galleryList.visibleCount, showingFavorites])

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites])
  const handleToggleFavorite = useCallback(
    (id: number) => dispatch(toggleFavoriteAction(id)),
    [dispatch],
  )
  const handleToggleTheme = useCallback(() => dispatch(toggleThemeAction()), [dispatch])

  const selectType = useCallback((type: string | null) => {
    setSelectedType(type)
    updateUrlState({ type })
  }, [])

  const toggleFavoritesView = useCallback(() => {
    setShowingFavorites((current) => {
      const next = !current
      updateUrlState({ view: next ? 'favorites' : null })
      return next
    })
  }, [])

  const openPokemon = useCallback((name: string) => {
    setSelectedPokemon(name)
    updateUrlState({ pokemon: name }, true)
  }, [])

  const closePokemon = useCallback(() => {
    setSelectedPokemon(null)
    updateUrlState({ pokemon: null }, true)
  }, [])

  useEffect(() => {
    const handlePopState = () => setSelectedPokemon(readUrlState().pokemon)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10">
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        showingFavorites={showingFavorites}
        favoritesCount={favorites.length}
        onToggleFavoritesView={toggleFavoritesView}
      />

      {!showingFavorites ? (
        <div className="mt-5">
          <h2 className="mb-2 text-sm font-semibold text-text-muted">Filter by type</h2>
          <TypeFilterBar selectedType={selectedType} onSelectType={selectType} />
        </div>
      ) : null}

      <div className="mt-6">
        {showingFavorites && favorites.length === 0 ? (
          <p className="py-16 text-center text-text-muted">
            No favorites yet — tap the “+” on any card to add one.
          </p>
        ) : galleryList.isError && !showingFavorites ? (
          <ErrorState message="Couldn't load Pokémon. Check your connection and try again." />
        ) : galleryList.isLoading && !showingFavorites ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <PokemonGrid
            pokemons={activeList}
            isFavorite={isFavorite}
            onSelect={openPokemon}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>

      {!showingFavorites && galleryList.hasMore ? (
        <LoadMoreButton onClick={galleryList.loadMore} isLoading={galleryList.isLoadingMore} />
      ) : null}

      <PokemonModal pokemonName={selectedPokemon} onClose={closePokemon} />
    </div>
  )
}
