import { Lottie } from 'lottie-react'
import { useEffect } from 'react'

// The source file (public/animations/pokeball-favorite.json) is a 10s/602-frame,
// 60fps idle-wobble loop; frames 0-430 are a static, invisible-stars idle
// shake. The actual "pop open, stars flash, center turns red" payoff is a
// ~1.2s window from frame 410 to 485 — that's the only part worth playing
// for a quick favorite-toggle acknowledgment, so playback is clipped to it
// via `segment` rather than trimming/re-authoring the source JSON.
const FPS = 60
const BURST_SEGMENT: [number, number] = [410, 485]
const BURST_DURATION_MS = ((BURST_SEGMENT[1] - BURST_SEGMENT[0]) / FPS) * 1000

interface PokeballBurstProps {
  onComplete: () => void
}

export function PokeballBurst({ onComplete }: PokeballBurstProps) {
  // lottie-react 3.x's `complete` subscription doesn't reliably fire when
  // combined with `segment` in this version (the player stalls after the
  // first frame event instead of progressing) — a timer sized to the
  // segment's own duration sidesteps that instead of depending on it.
  useEffect(() => {
    const timer = window.setTimeout(onComplete, BURST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="pokeball-jump h-16 w-16">
        <Lottie src="/animations/pokeball-favorite.json" autoplay loop={false} segment={BURST_SEGMENT} />
      </div>
    </div>
  )
}
