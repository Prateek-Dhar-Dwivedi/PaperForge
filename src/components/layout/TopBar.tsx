import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Plus } from 'lucide-react'
import { useStore } from '@/store'

interface TopBarProps {
  onMenuClick: () => void
}

const ROUTE_META: Record<string, { title: string; description?: string }> = {
  '/dashboard': { title: 'Dashboard' },
  '/library': { title: 'Paper Library' },
  '/library/add': { title: 'Add Paper', description: 'New entry' },
  '/compare': { title: 'Compare Papers' },
  '/gaps': { title: 'Research Gap Explorer' },
  '/notes': { title: 'Research Notes' },
}

function getMeta(pathname: string): { title: string; description?: string } {
  if (ROUTE_META[pathname]) return ROUTE_META[pathname]
  if (pathname.match(/^\/library\/.+\/edit$/)) return { title: 'Edit Paper' }
  if (pathname.match(/^\/library\/.+$/)) return { title: 'Paper' }
  return { title: 'PaperForge' }
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const meta = getMeta(location.pathname)
  const papers = useStore((s) => s.papers)

  // On paper detail, show paper title
  const isPaperDetail = location.pathname.match(/^\/library\/([^/]+)$/)
  const paperId = isPaperDetail?.[1]
  const getPaper = useStore((s) => s.getPaper)
  const detailPaper = paperId ? getPaper(paperId) : undefined

  const displayTitle = detailPaper ? detailPaper.title : meta.title

  return (
    <header className="h-[52px] border-b border-border bg-background flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="btn-icon lg:hidden flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-foreground truncate leading-none">
            {displayTitle}
          </h1>
          {detailPaper && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {detailPaper.authors[0]}{detailPaper.authors.length > 1 ? ' et al.' : ''} · {detailPaper.year}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="hidden sm:inline text-xs text-muted-foreground tabular-nums mr-1">
          {papers.length} paper{papers.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => navigate('/library/add')}
          className="btn-primary btn-sm"
          aria-label="Add paper"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Paper</span>
        </button>
      </div>
    </header>
  )
}
