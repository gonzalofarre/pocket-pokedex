import { Lottie } from 'lottie-react'

// The source file (public/animations/pokeball-favorite.json) is a 10s/602-frame
// idle-wobble loop; frames 0-430 are a static, invisible-stars idle shake.
// The actual "pop open, stars flash, center turns red" payoff is a ~1.2s
// window from frame 410 to 485 — that's the only part worth playing for a
// quick favorite-toggle acknowledgment, so playback is clipped to it via
// `segment` rather than trimming/re-authoring the source JSON.
const BURST_SEGMENT: [number, number] = [410, 485]

interface PokeballBurstProps {
  onComplete: () => void
}

export function PokeballBurst({ onComplete }: PokeballBurstProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="h-16 w-16">
        <Lottie
          src="/animations/pokeball-favorite.json"
          autoplay
          loop={false}
          segment={BURST_SEGMENT}
          subscriptions={{ complete: onComplete }}
        />
      </div>
    </div>
  )
}
