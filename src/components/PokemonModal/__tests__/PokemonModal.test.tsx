import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { EvolutionChain, Pokemon, PokemonSpecies } from '../../../api/types'
import { renderWithQueryClient } from '../../../test/renderWithQueryClient'
import { PokemonModal } from '../PokemonModal'

// vi.mock's factory is hoisted above the file's top-level statements, so
// the mock data it closes over has to be declared via vi.hoisted rather
// than a plain const — otherwise it's a temporal-dead-zone reference error.
const { mockPokemon, mockSpecies, mockEvolutionChain } = vi.hoisted(() => {
  const mockPokemon: Pokemon = {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    sprites: {
      front_default: 'https://example.com/bulbasaur.png',
      other: { 'official-artwork': { front_default: 'https://example.com/bulbasaur-art.png' } },
    },
    types: [{ slot: 1, type: { name: 'grass', url: '' } }],
    stats: [
      { base_stat: 45, stat: { name: 'hp', url: '' } },
      { base_stat: 49, stat: { name: 'attack', url: '' } },
    ],
    abilities: [{ is_hidden: false, slot: 1, ability: { name: 'overgrow', url: '' } }],
    moves: [
      {
        move: { name: 'tackle', url: '' },
        version_group_details: [
          {
            level_learned_at: 1,
            move_learn_method: { name: 'level-up', url: '' },
            version_group: { name: 'red-blue', url: '' },
          },
        ],
      },
    ],
  }

  const mockSpecies: PokemonSpecies = {
    id: 1,
    capture_rate: 45,
    base_happiness: 50,
    growth_rate: { name: 'medium-slow', url: '' },
    genera: [{ genus: 'Seed Pokémon', language: { name: 'en', url: '' } }],
    flavor_text_entries: [
      {
        flavor_text: 'A strange seed was planted on its back.',
        language: { name: 'en', url: '' },
        version: { name: 'red', url: '' },
      },
    ],
    evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
  }

  const mockEvolutionChain: EvolutionChain = {
    id: 1,
    chain: { species: { name: 'bulbasaur', url: '' }, evolves_to: [], evolution_details: [] },
  }

  return { mockPokemon, mockSpecies, mockEvolutionChain }
})

vi.mock('../../../api/pokemon', () => ({
  getPokemonDetail: vi.fn().mockResolvedValue(mockPokemon),
  getPokemonSpecies: vi.fn().mockResolvedValue(mockSpecies),
  getEvolutionChain: vi.fn().mockResolvedValue(mockEvolutionChain),
}))

describe('PokemonModal', () => {
  it('renders nothing when no pokémon is selected', () => {
    renderWithQueryClient(<PokemonModal pokemonName={null} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows pokémon details with the Stats tab active by default', async () => {
    renderWithQueryClient(<PokemonModal pokemonName="bulbasaur" onClose={vi.fn()} />)
    // The dialog shell renders immediately with a loading spinner; the
    // pokémon/species/evolution queries resolve after, so wait for content
    // that only exists once loaded rather than just the dialog role.
    expect(await screen.findByText('Bulbasaur')).toBeInTheDocument()
    expect(screen.getByText('HP')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
  })

  it('switches to the Moves tab and shows level-up moves', async () => {
    renderWithQueryClient(<PokemonModal pokemonName="bulbasaur" onClose={vi.fn()} />)
    await screen.findByText('Bulbasaur')
    await userEvent.click(screen.getByRole('tab', { name: 'Moves' }))
    expect(await screen.findByText('Tackle')).toBeInTheDocument()
  })

  it('switches to the About tab and shows species info', async () => {
    renderWithQueryClient(<PokemonModal pokemonName="bulbasaur" onClose={vi.fn()} />)
    await screen.findByText('Bulbasaur')
    await userEvent.click(screen.getByRole('tab', { name: 'About' }))
    expect(await screen.findByText(/strange seed was planted/i)).toBeInTheDocument()
    expect(screen.getByText('Seed Pokémon')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    renderWithQueryClient(<PokemonModal pokemonName="bulbasaur" onClose={onClose} />)
    await screen.findByRole('dialog')
    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn()
    renderWithQueryClient(<PokemonModal pokemonName="bulbasaur" onClose={onClose} />)
    await screen.findByRole('dialog')
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the backdrop is clicked', async () => {
    const onClose = vi.fn()
    renderWithQueryClient(<PokemonModal pokemonName="bulbasaur" onClose={onClose} />)
    await screen.findByRole('dialog')
    await userEvent.click(screen.getByRole('presentation'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when clicking inside the dialog content', async () => {
    const onClose = vi.fn()
    renderWithQueryClient(<PokemonModal pokemonName="bulbasaur" onClose={onClose} />)
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(dialog)
    expect(onClose).not.toHaveBeenCalled()
  })
})
