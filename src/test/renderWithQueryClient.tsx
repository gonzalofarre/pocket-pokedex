import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'

// Shared by any component test that (transitively) uses react-query hooks —
// a fresh, retry-disabled client per render keeps tests isolated and fast
// (no cross-test cache bleed, no waiting through retry backoff on a
// deliberately-rejected mock).
export function renderWithQueryClient(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}
