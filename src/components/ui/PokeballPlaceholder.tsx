interface PokeballPlaceholderProps {
  className?: string
}

// Shown in place of a sprite when PokeAPI has no image for a pokémon (some
// entries genuinely have a null sprite) or the image request itself fails —
// a muted pokéball silhouette instead of leaving the card looking broken.
export function PokeballPlaceholder({ className = 'h-16 w-16' }: PokeballPlaceholderProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M5 32h19M40 32h19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="32" r="8" fill="var(--color-surface)" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}
