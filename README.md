# Pocket Pokédex

A frontend take-home exercise for Caylent: browse Pokémon, filter by type, view detailed stats,
and manage a favorites list — built against the live [PokeAPI](https://pokeapi.co) and the
provided Figma design.

## Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** for styling
- **@tanstack/react-query** for server state — fetching/caching all PokeAPI data
- **Redux Toolkit** for client state — favorites and theme, the two pieces of state that
  actually need to live outside a component and persist across reloads (`src/store/`).
  Deliberately not used for anything React Query already owns, or for the filter/view/modal
  state in `App.tsx` (kept as local state synced to the URL) — a global store for state that's
  either server data or already URL-addressable would just be two sources of truth for the same
  thing.
- **lucide-react** for icons
- **lottie-react** for the Pokéball favorite-toggle animation
- **Vitest + React Testing Library** for tests — unit tests for pure logic (formatters, type
  colors, the favorites/theme reducers) plus interaction tests for the components with real
  user-facing behavior (`PokemonCard`, `TypeFilterBar`, `PokemonModal`): clicking a card opens
  it, toggling favorite fires with the right id, tab switching, and every way the modal closes
  (X, backdrop, Escape) — not just that the pure functions underneath are correct

No backend — all data is fetched client-side directly from `pokeapi.co`.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build
npm run lint       # oxlint
npm test           # vitest
```

## Features

- Grid of Pokémon cards with "Load More" (40 at a time)
- Filter by type — color-coded chips on tablet/desktop, a custom color-coded dropdown on phones
- Pokémon detail modal with Stats / Moves / About tabs, animated on open
- Favorites: toggle from any card, dedicated favorites view, a toast confirms each add/remove
- Light/dark theme
- Responsive layout (desktop → tablet → mobile), down to very small (320px) phones
- Retry-able error states for every fetch boundary (gallery, modal, "Load More")

## Decisions on the open-ended parts

The brief deliberately left several things undefined to see how they'd be approached. Here's
what was decided and why:

**Favorites toggle & list** — The Figma dashboard cards already include a "+" button with no
defined behavior; it's used here as the favorite toggle (swapping to a checkmark when active),
since the brief only left the *list* undefined, not that affordance. The list itself reuses the
exact same grid/card components behind a "Favorites" toggle in the header — no new UI surface,
just a different data source (favorited IDs vs. the paginated gallery). This keeps the feature
consistent with the rest of the app instead of introducing a new pattern for one feature. A short
toast (`Bulbasaur added to favorites` / `removed from favorites`, with a filled or broken heart
icon) confirms the action — the toggle button itself changes state instantly, but on a dense grid
it's easy to miss which of forty near-identical "+" buttons you just clicked, especially once the
list view or a filter changes right after.

**Modal overlay & scroll lock** — A semi-transparent, blurred dark backdrop; `<body>` gets
`overflow: hidden` while the modal is open. Closes via the X button, a backdrop click, or
`Escape`. The selected Pokémon is also synced to a `?pokemon=name` URL query param (no router
needed for one param), so the modal is bookmarkable/shareable and the browser Back button closes
it — a small addition since it was effectively free once close-on-Escape existed.

**Theme / dark mode** — The design's header shows a theme-dropdown affordance with no defined
states, so it was implemented as a two-state Light/Dark toggle, defaulting to the OS's
`prefers-color-scheme` and persisted in `localStorage`. A fuller theme system (more than two
modes, per-component overrides) felt like scope beyond what a "Default Theme" label in the
mockup implies.

**Responsive** — Only desktop mockups were provided. The 5-column card grid scales down through
Tailwind breakpoints: 3 columns on tablet, 2 on phones from 360px up (covers the current iPhone SE
and a Galaxy S8 alike), 1 column only below that (the 320px iPhone-5 class). The type-filter row
wraps into extra rows on tablet/desktop instead of scrolling off-screen; on phones it collapses
into a single dropdown instead, since a horizontally-scrolling chip row is easy to miss entirely
on a small screen. That dropdown is a custom `role="listbox"` component rather than a native
`<select>` — iOS Safari's picker wheel ignores per-`<option>` background color entirely (a
platform limitation, not a styling bug), so a native element can't reproduce the color-coded
options the chips already have. The detail modal is a centered dialog at every breakpoint, capped
at 85% of the viewport height on phones (90% on tablet/desktop) with the backdrop visible around
it on all sides — not full-screen — so it still reads as a modal rather than a full page
navigation. It animates in on open: a slide-up on phones, a subtler rise-and-scale on
tablet/desktop, matching each layout's shape.

## Data-fetching notes

- The default gallery paginates through `/pokemon?limit=40&offset=N`. That endpoint only returns
  `{name, url}` pairs, so each card's sprite/types are fetched individually via
  `/pokemon/{name}`, cached per-Pokémon by react-query — switching filters or paging further
  never re-fetches a Pokémon already seen.
- The type filter uses `/type/{name}`, which returns every Pokémon of that type with no
  pagination of its own; "Load More" paginates that list client-side in chunks of 40 to keep the
  same UX as the default view.
- The modal's About tab needs `/pokemon-species/{id}` (flavor text, growth rate, catch rate) plus
  one further fetch to `/evolution-chain/{id}` (linked from the species response) to render the
  evolution chain.

## Error handling

Every place the app fetches from PokeAPI has a distinct failure story, since "just show a spinner
forever" is the default if you don't think about it:

- **Initial gallery load** — a full-width error state (with a fainted-Pikachu illustration and a
  drawn-from-scratch "dizzy spiral" overlay, not a reused anime frame) and a **Try again** button
  that calls the query's `refetch`.
- **Pokémon detail modal** — same error state and retry, shown in place of the tab content instead
  of leaving the loading spinner running forever if the detail/species fetch fails.
- **"Load More"** — the trickiest case, because bumping the page size is a *new* react-query key
  (`['pokemon-names', 'default', visibleCount]`), which starts out with no data of its own. Without
  `placeholderData: keepPreviousData`, a slow or failed "Load More" would either flash the whole
  grid to a spinner (success case) or wipe out the cards already on screen (failure case) — both
  are jarring for something that's supposed to be additive. With it, the existing cards stay put
  while the next page loads or fails, and the button itself is the only thing that shows the
  loading/retry state.

## Accessibility

- The detail modal traps `Tab`/`Shift+Tab` focus while open, remembers what had focus before it
  opened, and restores it on close — keyboard and screen-reader users don't get dropped back at
  the top of the page.
- The phone type-filter dropdown follows the `aria-haspopup`/`aria-expanded`/`role="listbox"` +
  `role="option"` pattern, closes on `Escape` or an outside click, and its trigger's accessible
  name ("Filter by type") stays constant even though its visible label changes with the selection.
- The favorites toast is `role="status"` with `aria-live="polite"`, so it's announced without
  stealing focus from whatever the user was doing.

## Performance

`React.memo` on `PokemonCard` matters here because the grid can hold hundreds of cards (Load More,
or the ~1300-entry unfiltered list) — without it, any unrelated state change anywhere in `App`
(theme, a filter, another card being favorited) would re-render every card in the grid. It only
pays off because the callbacks passed down (`onSelect`, `onToggleFavorite`) are kept referentially
stable with `useCallback`, favorites-toggle handling included — that one reads the current
favorites list from a ref instead of a dependency specifically so toggling one card's favorite
status doesn't change the callback's identity and defeat the memoization for every other card.
`useMemo`/`useCallback` weren't applied blanket everywhere; components that don't sit inside a
large repeated list (the modal, the header, the filter bar) don't get the same treatment, since
the re-render cost there is negligible and the extra hooks would just be noise.

## Design tokens

Type-badge colors follow the standard Pokémon type-color palette (the convention used across
Bulbapedia/veekun-derived Pokédex UIs) — confirmed against the Figma file by sampling the
"grass" badge, which returned `#78C850`, an exact match. Figma's Dev Mode code inspector was
paywalled on this file's plan, so the rest of the 18 colors are trusted to follow the same
well-established convention rather than being hand-sampled one by one. Neutral tokens
(backgrounds, text, borders) are matched visually against the Figma screens; see
`src/styles/tokens.css`.
