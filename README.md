# Pocket Pokédex

A frontend take-home exercise for Caylent: browse Pokémon, filter by type, view detailed stats,
and manage a favorites list — built against the live [PokeAPI](https://pokeapi.co) and the
provided Figma design.

## Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** for styling
- **@tanstack/react-query** for data fetching/caching against PokeAPI
- **Vitest + React Testing Library** for unit tests

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
- Filter by type, with color-coded chips
- Pokémon detail modal with Stats / Moves / About tabs
- Favorites: toggle from any card, dedicated favorites view
- Light/dark theme
- Responsive layout (desktop → tablet → mobile)

## Decisions on the open-ended parts

The brief deliberately left several things undefined to see how they'd be approached. Here's
what was decided and why:

**Favorites toggle & list** — The Figma dashboard cards already include a "+" button with no
defined behavior; it's used here as the favorite toggle (swapping to a checkmark when active),
since the brief only left the *list* undefined, not that affordance. The list itself reuses the
exact same grid/card components behind a "Favorites" toggle in the header — no new UI surface,
just a different data source (favorited IDs vs. the paginated gallery). This keeps the feature
consistent with the rest of the app instead of introducing a new pattern for one feature.

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
Tailwind breakpoints (3 columns on tablet, 1 on small phones); the type-filter row scrolls
horizontally instead of wrapping on narrow screens; the detail modal keeps the same layout but
takes the full viewport height on small screens instead of floating as a centered dialog.

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

## Design tokens

Type-badge colors follow the standard Pokémon type-color palette (the convention used across
Bulbapedia/veekun-derived Pokédex UIs) — confirmed against the Figma file by sampling the
"grass" badge, which returned `#78C850`, an exact match. Figma's Dev Mode code inspector was
paywalled on this file's plan, so the rest of the 18 colors are trusted to follow the same
well-established convention rather than being hand-sampled one by one. Neutral tokens
(backgrounds, text, borders) are matched visually against the Figma screens; see
`src/styles/tokens.css`.
