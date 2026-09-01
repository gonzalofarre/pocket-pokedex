import { Spinner } from '../ui/Spinner'

interface LoadMoreButtonProps {
  onClick: () => void
  isLoading: boolean
}

export function LoadMoreButton({ onClick, isLoading }: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center py-8">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="flex cursor-pointer items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-text-inverted transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? <Spinner className="h-4 w-4 text-current" /> : null}
        Load More Pokémon
      </button>
    </div>
  )
}
