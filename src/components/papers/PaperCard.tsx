import { useNavigate } from 'react-router-dom'
import { Calendar, Users, ExternalLink, Trash2, Edit2, Sparkles } from 'lucide-react'
import type { Paper } from '@/types'
import { StatusBadge, DomainBadge } from '@/components/ui/Badge'
import { formatRelativeDate, DOMAIN_COLORS } from '@/lib/utils'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'

interface PaperCardProps {
  paper: Paper
  selectable?: boolean
  selected?: boolean
  onSelect?: (id: string) => void
}

export default function PaperCard({ paper, selectable, selected, onSelect }: PaperCardProps) {
  const navigate = useNavigate()
  const deletePaper = useStore((s) => s.deletePaper)
  const domainColor = DOMAIN_COLORS[paper.domain] || '#868e96'

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (confirm(`Delete "${paper.title}"?\nThis cannot be undone.`)) {
      deletePaper(paper.id)
    }
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation()
    navigate(`/library/${paper.id}/edit`)
  }

  function handleCardClick() {
    if (selectable && onSelect) {
      onSelect(paper.id)
    } else {
      navigate(`/library/${paper.id}`)
    }
  }

  return (
    <div
      onClick={handleCardClick}
      role={selectable ? 'checkbox' : 'button'}
      aria-checked={selectable ? selected : undefined}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick() }}
      className={cn(
        'card-hover p-4 cursor-pointer group flex flex-col gap-3 outline-none',
        selected && 'border-primary/50 bg-primary/[0.03]'
      )}
    >
      {/* Selection row */}
      {selectable && (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0',
              selected ? 'bg-primary border-primary' : 'border-border'
            )}
          >
            {selected && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                <path
                  d="M1.5 5L4 7.5L8.5 2.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {selected ? 'Selected' : 'Click to select'}
          </span>
        </div>
      )}

      {/* Title row */}
      <div className="flex items-start gap-2">
        {/* Domain color bar */}
        <div
          className="w-1 mt-1 rounded-full flex-shrink-0 self-stretch min-h-[2rem]"
          style={{ background: domainColor, opacity: 0.7 }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {paper.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 truncate">
              <Users className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {paper.authors.slice(0, 2).join(', ')}
                {paper.authors.length > 2 && ` +${paper.authors.length - 2}`}
              </span>
            </span>
            <span className="flex items-center gap-1 flex-shrink-0">
              <Calendar className="w-3 h-3" />
              {paper.year}
            </span>
            {paper.url && (
              <a
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 hover:text-primary transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-3 h-3" />
                PDF
              </a>
            )}
          </div>
        </div>

        {/* Actions (hover) */}
        {!selectable && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 -mt-0.5 -mr-0.5">
            <button
              onClick={handleEdit}
              className="btn-icon"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="btn-icon hover:text-destructive"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Abstract */}
      {paper.abstract && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {paper.abstract}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={paper.status} />
          <DomainBadge domain={paper.domain} />
          {paper.id.startsWith('demo-') && (
            <span className="badge" style={{ background: 'hsl(232 72% 96%)', color: 'hsl(232 72% 45%)' }}>
              demo
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
          {paper.analysis && (
            <span className="flex items-center gap-0.5 text-emerald-600 font-medium">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          )}
          <span>{formatRelativeDate(paper.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
