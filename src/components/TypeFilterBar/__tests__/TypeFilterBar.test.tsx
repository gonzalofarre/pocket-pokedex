import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithQueryClient } from '../../../test/renderWithQueryClient'
import { TypeFilterBar } from '../TypeFilterBar'

vi.mock('../../../api/pokemon', () => ({
  getTypes: vi.fn().mockResolvedValue({
    results: [
      { name: 'fire', url: '' },
      { name: 'water', url: '' },
      { name: 'unknown', url: '' },
    ],
  }),
}))

// Both the phone dropdown and the tablet/desktop chip row render at once —
// CSS (`sm:hidden` / `hidden sm:flex`) picks one visually, but jsdom has no
// real layout, so both exist in the DOM for every test. The dropdown's
// trigger always has an accessible name of "Filter by type" (its aria-label
// wins over its visible text, which changes to the selected type), so it
// never collides with a same-named chip button.

describe('TypeFilterBar — desktop/tablet chips', () => {
  it('renders a chip per fetched type, excluding non-filterable ones like "unknown"', async () => {
    renderWithQueryClient(<TypeFilterBar selectedType={null} onSelectType={vi.fn()} />)
    expect(await screen.findByRole('button', { name: 'Fire' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Water' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Unknown' })).not.toBeInTheDocument()
  })

  it('selects a type when its chip is clicked', async () => {
    const onSelectType = vi.fn()
    renderWithQueryClient(<TypeFilterBar selectedType={null} onSelectType={onSelectType} />)
    await userEvent.click(await screen.findByRole('button', { name: 'Fire' }))
    expect(onSelectType).toHaveBeenCalledWith('fire')
  })

  it('deselects an already-active type when its chip is clicked again', async () => {
    const onSelectType = vi.fn()
    renderWithQueryClient(<TypeFilterBar selectedType="fire" onSelectType={onSelectType} />)
    const fireChip = await screen.findByRole('button', { name: 'Fire' })
    expect(fireChip).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(fireChip)
    expect(onSelectType).toHaveBeenCalledWith(null)
  })
})

describe('TypeFilterBar — phone dropdown', () => {
  it('shows "All Types" on the trigger and keeps the menu closed by default', () => {
    renderWithQueryClient(<TypeFilterBar selectedType={null} onSelectType={vi.fn()} />)
    const trigger = screen.getByRole('button', { name: /filter by type/i })
    expect(trigger).toHaveTextContent('All Types')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows the selected type on the trigger', () => {
    renderWithQueryClient(<TypeFilterBar selectedType="water" onSelectType={vi.fn()} />)
    expect(screen.getByRole('button', { name: /filter by type/i })).toHaveTextContent('Water')
  })

  it('opens on click and lists "All Types" plus every fetched type, excluding "unknown"', async () => {
    renderWithQueryClient(<TypeFilterBar selectedType={null} onSelectType={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /filter by type/i }))
    const listbox = await screen.findByRole('listbox')
    const options = within(listbox)
      .getAllByRole('option')
      .map((option) => option.textContent)
    expect(options).toEqual(['All Types', 'Fire', 'Water'])
  })

  it('calls onSelectType and closes the menu when an option is chosen', async () => {
    const onSelectType = vi.fn()
    renderWithQueryClient(<TypeFilterBar selectedType={null} onSelectType={onSelectType} />)
    await userEvent.click(screen.getByRole('button', { name: /filter by type/i }))
    const listbox = await screen.findByRole('listbox')
    await userEvent.click(within(listbox).getByRole('option', { name: 'Fire' }))
    expect(onSelectType).toHaveBeenCalledWith('fire')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('calls onSelectType with null when "All Types" is chosen', async () => {
    const onSelectType = vi.fn()
    renderWithQueryClient(<TypeFilterBar selectedType="fire" onSelectType={onSelectType} />)
    await userEvent.click(screen.getByRole('button', { name: /filter by type/i }))
    const listbox = await screen.findByRole('listbox')
    await userEvent.click(within(listbox).getByRole('option', { name: 'All Types' }))
    expect(onSelectType).toHaveBeenCalledWith(null)
  })

  it('closes on Escape without changing the selection', async () => {
    const onSelectType = vi.fn()
    renderWithQueryClient(<TypeFilterBar selectedType={null} onSelectType={onSelectType} />)
    await userEvent.click(screen.getByRole('button', { name: /filter by type/i }))
    await screen.findByRole('listbox')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(onSelectType).not.toHaveBeenCalled()
  })

  it('closes when clicking outside', async () => {
    renderWithQueryClient(
      <div>
        <TypeFilterBar selectedType={null} onSelectType={vi.fn()} />
        <button type="button">outside</button>
      </div>,
    )
    await userEvent.click(screen.getByRole('button', { name: /filter by type/i }))
    await screen.findByRole('listbox')
    await userEvent.click(screen.getByRole('button', { name: 'outside' }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
