import { useCallback, useEffect, useState } from 'react'
import { Header } from './components/Header/Header'
import { TypeFilterBar } from './components/TypeFilterBar/TypeFilterBar'
import { PokemonGrid } from './components/PokemonGrid/PokemonGrid'
import { LoadMoreButton } from './components/LoadMoreButton/LoadMoreButton'
import { PokemonModal } from './components/PokemonModal/PokemonModal'
import { ErrorState } from './components/ui/ErrorState'
import { Spinner } from './components/ui/Spinner'
import { useFavorites } from './hooks/useFavorites'
import { useFavoritePokemons } from './hooks/useFavoritePokemons'
import { usePokemonList } from './hooks/usePokemonList'
import { useTheme } from './hooks/useTheme'

function readPokemonFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('pokemon')
}

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showingFavorites, setShowingFavorites] = useState(false)
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(() => readPokemonFromUrl())

  const galleryList = usePokemonList(selectedType)
  const favoritePokemons = useFavoritePokemons(favorites)

  const activeList = showingFavorites ? favoritePokemons : galleryList.pokemons

  const openPokemon = useCallback((name: string) => {
    setSelectedPokemon(name)
    const params = new URLSearchParams(window.location.search)
    params.set('pokemon', name)
    window.history.pushState({}, '', `?${params.toString()}`)
  }, [])

  const closePokemon = useCallback(() => {
    setSelectedPokemon(null)
    const params = new URLSearchParams(window.location.search)
    params.delete('pokemon')
    const query = params.toString()
    window.history.pushState({}, '', query ? `?${query}` : window.location.pathname)
  }, [])

  useEffect(() => {
    const handlePopState = () => setSelectedPokemon(readPokemonFromUrl())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        showingFavorites={showingFavorites}
        favoritesCount={favorites.length}
        onToggleFavoritesView={() => setShowingFavorites((value) => !value)}
      />

      {!showingFavorites ? (
        <div className="mt-5">
          <h2 className="mb-2 text-sm font-semibold text-text-muted">Filter by type</h2>
          <TypeFilterBar selectedType={selectedType} onSelectType={setSelectedType} />
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
            onToggleFavorite={toggleFavorite}
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
