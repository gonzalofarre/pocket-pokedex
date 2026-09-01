interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-text-muted">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-text-inverted transition hover:bg-brand-hover"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
