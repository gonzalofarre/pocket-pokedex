import { PAGE_SIZE } from '../hooks/usePokemonList'

export interface UrlState {
  pokemon: string | null
  type: string | null
  view: 'gallery' | 'favorites'
  count: number
}

export function readUrlState(): UrlState {
  if (typeof window === 'undefined') {
    return { pokemon: null, type: null, view: 'gallery', count: PAGE_SIZE }
  }

  const params = new URLSearchParams(window.location.search)
  const rawCount = Number(params.get('count'))
  // Only trust a positive multiple of PAGE_SIZE — anything else falls back
  // to the first page rather than passing a bogus limit to the API.
  const count =
    Number.isInteger(rawCount) && rawCount > 0 && rawCount % PAGE_SIZE === 0 ? rawCount : PAGE_SIZE

  return {
    pokemon: params.get('pokemon'),
    type: params.get('type'),
    view: params.get('view') === 'favorites' ? 'favorites' : 'gallery',
    count,
  }
}

/**
 * Merges `updates` into the current query string (a null value removes that
 * key) and writes it back without touching keys it doesn't mention. Use
 * `push: true` for a navigation the Back button should undo (opening the
 * detail modal); the default `replaceState` is for view-configuration state
 * (filter, favorites view, load-more position) that shouldn't clutter
 * history.
 */
export function updateUrlState(updates: Partial<Record<keyof UrlState, string | null>>, push = false) {
  const params = new URLSearchParams(window.location.search)

  for (const [key, value] of Object.entries(updates)) {
    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
  }

  const query = params.toString()
  const url = query ? `?${query}` : window.location.pathname
  if (push) {
    window.history.pushState({}, '', url)
  } else {
    window.history.replaceState({}, '', url)
  }
}
