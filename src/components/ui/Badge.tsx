import { cn } from '@/lib/utils'
import type { ReadingStatus } from '@/types'
import { STATUS_LABELS, STATUS_BADGE_CLASS } from '@/lib/utils'

interface StatusBadgeProps {
  status: ReadingStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(STATUS_BADGE_CLASS[status], className)}>
      {STATUS_LABELS[status]}
    </span>
  )
}

interface DomainBadgeProps {
  domain: string
  className?: string
}

export function DomainBadge({ domain, className }: DomainBadgeProps) {
  return (
    <span className={cn('badge badge-purple', className)}>{domain}</span>
  )
}

interface TagBadgeProps {
  tag: string
  className?: string
}

export function TagBadge({ tag, className }: TagBadgeProps) {
  return (
    <span className={cn('badge badge-gray', className)}>{tag}</span>
  )
}
