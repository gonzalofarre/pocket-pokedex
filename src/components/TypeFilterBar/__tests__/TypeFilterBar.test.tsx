import { screen } from '@testing-library/react'
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

describe('TypeFilterBar', () => {
  it('renders fetched types, excluding non-filterable ones like "unknown"', async () => {
    renderWithQueryClient(<TypeFilterBar selectedType={null} onSelectType={vi.fn()} />)
    expect(await screen.findByText('Fire')).toBeInTheDocument()
    expect(screen.getByText('Water')).toBeInTheDocument()
    expect(screen.queryByText('Unknown')).not.toBeInTheDocument()
  })

  it('selects a type when its chip is clicked', async () => {
    const onSelectType = vi.fn()
    renderWithQueryClient(<TypeFilterBar selectedType={null} onSelectType={onSelectType} />)
    await userEvent.click(await screen.findByText('Fire'))
    expect(onSelectType).toHaveBeenCalledWith('fire')
  })

  it('deselects an already-active type when its chip is clicked again', async () => {
    const onSelectType = vi.fn()
    renderWithQueryClient(<TypeFilterBar selectedType="fire" onSelectType={onSelectType} />)
    const fireChip = await screen.findByText('Fire')
    expect(fireChip.closest('button')).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(fireChip)
    expect(onSelectType).toHaveBeenCalledWith(null)
  })
})
