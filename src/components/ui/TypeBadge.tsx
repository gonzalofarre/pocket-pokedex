import { getTypeColor } from '../../utils/typeColors'
import { capitalize } from '../../utils/formatters'

interface TypeBadgeProps {
  type: string
  size?: 'sm' | 'md'
}

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold text-white ${sizeClasses}`}
      style={{ backgroundColor: getTypeColor(type) }}
    >
      {capitalize(type)}
    </span>
  )
}
