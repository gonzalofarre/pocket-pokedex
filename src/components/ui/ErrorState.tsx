import { useState } from 'react'
import { PokeballPlaceholder } from './PokeballPlaceholder'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

// Pikachu's own sprite from the same PokeAPI-adjacent source used everywhere
// else in the app (raw.githubusercontent.com/PokeAPI/sprites) — grayscaled,
// with a few hand-drawn "dizzy spiral" icons orbiting its head for the
// fainted/dazed read. Deliberately not a screenshot from the
// anime: that's someone else's copyrighted animation, and this project is
// a job-application submission that may get reviewed or shared — not worth
// having ripped media sitting in the source for a placeholder icon. The
// spiral itself is a generic, non-copyrightable "dizzy" convention, and the
// sprite is the same PokeAPI source already used everywhere else in the
// app, so nothing new to license here either. GitHub-hosted sprites are
// also a separate service from the PokeAPI REST API, so this keeps loading
// even during a PokeAPI outage.
const FAINTED_PIKACHU_SPRITE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'

function DizzySpiral({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3a9 9 0 1 0 9 9 7 7 0 1 0-7 7 5 5 0 1 0-5-5 3 3 0 1 0 3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      {imageFailed ? (
        <PokeballPlaceholder className="h-20 w-20 text-border" />
      ) : (
        <div className="relative h-24 w-20 pt-4">
          <img
            src={FAINTED_PIKACHU_SPRITE}
            alt=""
            aria-hidden="true"
            className="h-20 w-20 object-contain opacity-50 grayscale"
            onError={() => setImageFailed(true)}
          />
          {/* A little cluster of spirals orbiting above the head — the
              classic cartoon "seeing stars" shorthand for dizzy/fainted. */}
          <DizzySpiral className="absolute top-0 left-5 h-3 w-3 -rotate-12 text-text-muted" />
          <DizzySpiral className="absolute top-1 left-10 h-4 w-4 rotate-6 text-text-muted" />
          <DizzySpiral className="absolute top-0 right-5 h-3 w-3 rotate-12 text-text-muted" />
        </div>
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
