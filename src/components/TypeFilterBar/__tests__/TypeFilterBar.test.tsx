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
// real layout, so both exist in the DOM for every test. Role-based queries
// (combobox vs. button) disambiguate instead of relying on which is "shown".

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
  it('lists "All Types" plus every fetched type, excluding non-filterable ones', async () => {
    renderWithQueryClient(<TypeFilterBar selectedType={null} onSelectType={vi.fn()} />)
    const select = screen.getByRole('combobox', { name: /filter by type/i })
    // The <select> itself is there immediately; its options only populate
    // once the types query resolves, so wait for one before asserting.
    await within(select).findByRole('option', { name: 'Water' })
    const options = within(select)
      .getAllByRole('option')
      .map((option) => option.textContent)
    expect(options).toEqual(['All Types', 'Fire', 'Water'])
  })

  it('reflects the selected type as the dropdown value', async () => {
    renderWithQueryClient(<TypeFilterBar selectedType="water" onSelectType={vi.fn()} />)
    const select = screen.getByRole('combobox', { name: /filter by type/i })
    await within(select).findByRole('option', { name: 'Water' })
    expect(select).toHaveValue('water')
  })

  it('calls onSelectType with the chosen type when changed', async () => {
    const onSelectType = vi.fn()
    renderWithQueryClient(<TypeFilterBar selectedType={null} onSelectType={onSelectType} />)
    const select = screen.getByRole('combobox', { name: /filter by type/i })
    await within(select).findByRole('option', { name: 'Fire' })
    await userEvent.selectOptions(select, 'fire')
    expect(onSelectType).toHaveBeenCalledWith('fire')
  })

  it('calls onSelectType with null when "All Types" is chosen', async () => {
    const onSelectType = vi.fn()
    renderWithQueryClient(<TypeFilterBar selectedType="fire" onSelectType={onSelectType} />)
    const select = screen.getByRole('combobox', { name: /filter by type/i })
    await within(select).findByRole('option', { name: 'Fire' })
    await userEvent.selectOptions(select, 'All Types')
    expect(onSelectType).toHaveBeenCalledWith(null)
  })
})
