import { useState } from 'react'
import { PokeballPlaceholder } from './PokeballPlaceholder'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

// Pikachu's own sprite from the same PokeAPI-adjacent source used everywhere
// else in the app (raw.githubusercontent.com/PokeAPI/sprites) — grayscaled
// and flipped upside-down, the same way a fainted Pokémon's sprite renders
// in the mainline games. No new asset/license to worry about, and since
// GitHub-hosted sprites are a different service than the PokeAPI REST API,
// this still loads even during a PokeAPI outage.
const FAINTED_PIKACHU_SPRITE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'

export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      {imageFailed ? (
        <PokeballPlaceholder className="h-20 w-20 text-border" />
      ) : (
        <img
          src={FAINTED_PIKACHU_SPRITE}
          alt=""
          aria-hidden="true"
          className="h-20 w-20 rotate-180 object-contain opacity-50 grayscale"
          onError={() => setImageFailed(true)}
        />
      )}
      <p className="text-text-muted">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-semibold text-text-inverted transition hover:bg-brand-hover"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
