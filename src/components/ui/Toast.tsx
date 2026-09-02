import { Heart, HeartCrack } from 'lucide-react'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  variant: 'added' | 'removed'
  onDismiss: () => void
}

const AUTO_DISMISS_MS = 2200

export function Toast({ message, variant, onDismiss }: ToastProps) {
  // The caller remounts this via a changing `key` whenever a new toast
  // fires, so this effect only ever needs to run once per mount — as long
  // as onDismiss itself stays referentially stable (it's a useCallback with
  // no deps in App), this dependency array is already exhaustive.
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className="toast-enter fixed bottom-5 left-1/2 z-[60] flex items-center gap-2 rounded-full bg-text px-4 py-2.5 text-sm font-medium text-surface shadow-lg"
    >
      {variant === 'added' ? (
        <Heart className="h-4 w-4 shrink-0 fill-current" />
      ) : (
        <HeartCrack className="h-4 w-4 shrink-0" />
      )}
      {message}
    </div>
  )
}
