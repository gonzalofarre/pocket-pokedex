import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Pokemon } from '../../../api/types'
import { PokemonCard } from '../PokemonCard'

// PokeballBurst does its own network fetch + Lottie playback on mount,
// which is irrelevant to what this file tests (that the right callback
// fires with the right argument) and would just make the tests slower and
// dependent on things outside this component's own logic.
vi.mock('../../ui/PokeballBurst', () => ({
  PokeballBurst: () => null,
}))

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    front_default: 'https://example.com/bulbasaur.png',
    other: { 'official-artwork': { front_default: 'https://example.com/bulbasaur-art.png' } },
  },
  types: [
    { slot: 1, type: { name: 'grass', url: '' } },
    { slot: 2, type: { name: 'poison', url: '' } },
  ],
  stats: [],
  abilities: [],
  moves: [],
}

describe('PokemonCard', () => {
  it('renders the name, id, and type badges', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isLoading={false}
        isFavorite={false}
        onSelect={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    )
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    expect(screen.getByText('#001')).toBeInTheDocument()
    expect(screen.getByText('Grass')).toBeInTheDocument()
    expect(screen.getByText('Poison')).toBeInTheDocument()
  })

  it('shows a spinner instead of content while loading', () => {
    render(<PokemonCard isLoading={true} isFavorite={false} onSelect={vi.fn()} onToggleFavorite={vi.fn()} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument()
  })

  it('calls onSelect with the pokémon name when the card body is clicked', async () => {
    const onSelect = vi.fn()
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isLoading={false}
        isFavorite={false}
        onSelect={onSelect}
        onToggleFavorite={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByText('Bulbasaur').closest('button')!)
    expect(onSelect).toHaveBeenCalledWith('bulbasaur')
  })

  it('calls onToggleFavorite with the pokémon id and name when the favorite button is clicked', async () => {
    const onToggleFavorite = vi.fn()
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isLoading={false}
        isFavorite={true}
        onSelect={vi.fn()}
        onToggleFavorite={onToggleFavorite}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /remove bulbasaur from favorites/i }))
    expect(onToggleFavorite).toHaveBeenCalledWith(1, 'bulbasaur')
  })

  it('reflects favorite state via the button label and pressed state', () => {
    const { rerender } = render(
      <PokemonCard
        pokemon={mockPokemon}
        isLoading={false}
        isFavorite={false}
        onSelect={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /add bulbasaur to favorites/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )

    rerender(
      <PokemonCard
        pokemon={mockPokemon}
        isLoading={false}
        isFavorite={true}
        onSelect={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /remove bulbasaur from favorites/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
