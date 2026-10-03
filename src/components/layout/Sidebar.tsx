import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  GitCompare,
  Compass,
  StickyNote,
  X,
  BookMarked,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'

interface SidebarProps {
  onClose?: () => void
}

const NAV_GROUPS = [
  {
    label: 'Workspace',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/library', label: 'Paper Library', icon: BookOpen },
      { to: '/notes', label: 'Research Notes', icon: StickyNote },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { to: '/library/add', label: 'Add Paper', icon: PlusCircle },
      { to: '/compare', label: 'Compare Papers', icon: GitCompare },
      { to: '/gaps', label: 'Research Gaps', icon: Compass },
    ],
  },
]

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()
  const papers = useStore((s) => s.papers)
  const notes = useStore((s) => s.notes)
  const reading = papers.filter((p) => p.status === 'reading').length

  function isActive(to: string) {
    if (to === '/library') {
      // Active on /library and /library/:id and /library/:id/edit — but NOT /library/add
      return (
        location.pathname === '/library' ||
        (location.pathname.startsWith('/library/') &&
          location.pathname !== '/library/add' &&
          !location.pathname.startsWith('/library/add/'))
      )
    }
    if (to === '/library/add') {
      return location.pathname === '/library/add'
    }
    return location.pathname === to || location.pathname.startsWith(to + '/')
  }

  return (
    <div className="flex flex-col w-[220px] h-full bg-[hsl(220,20%,98%)] border-r border-border">
      {/* Brand */}
      <div className="flex items-center justify-between h-[52px] px-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <BookMarked className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-[13px] tracking-[-0.01em] text-foreground">
            PaperForge
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="btn-icon lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon }) => {
                const active = isActive(to)
                return (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-[7px] rounded text-[13px] transition-colors relative',
                      active
                        ? 'bg-primary/8 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />
                    )}
                    <Icon
                      className={cn('w-[15px] h-[15px] flex-shrink-0', active ? 'text-primary' : 'text-muted-foreground')}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    {label}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom stats strip */}
      <div className="px-3 pb-3 pt-2 border-t border-border">
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1">
            <div className="text-[11px] text-muted-foreground">Papers</div>
            <div className="text-sm font-semibold text-foreground tabular-nums">{papers.length}</div>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex-1">
            <div className="text-[11px] text-muted-foreground">Reading</div>
            <div className="text-sm font-semibold text-foreground tabular-nums">{reading}</div>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex-1">
            <div className="text-[11px] text-muted-foreground">Notes</div>
            <div className="text-sm font-semibold text-foreground tabular-nums">{notes.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
