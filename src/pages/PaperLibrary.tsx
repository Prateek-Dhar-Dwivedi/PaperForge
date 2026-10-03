import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, X, BookOpen, SlidersHorizontal } from 'lucide-react'
import { useStore } from '@/store'
import PaperCard from '@/components/papers/PaperCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { RESEARCH_DOMAINS, READING_STATUSES, STATUS_LABELS } from '@/lib/utils'
import type { FilterState } from '@/types'

export default function PaperLibrary() {
  const papers = useStore((s) => s.papers)
  const navigate = useNavigate()

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    domain: '',
    year: '',
    status: '',
  })

  const years = useMemo(() => {
    return [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a)
  }, [papers])

  const filtered = useMemo(() => {
    return papers.filter((p) => {
      const q = filters.search.toLowerCase()
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.authors.join(' ').toLowerCase().includes(q) &&
        !p.abstract.toLowerCase().includes(q) &&
        !p.keywords.join(' ').toLowerCase().includes(q)
      )
        return false
      if (filters.domain && p.domain !== filters.domain) return false
      if (filters.year && String(p.year) !== filters.year) return false
      if (filters.status && p.status !== filters.status) return false
      return true
    })
  }, [papers, filters])

  const hasFilters = Boolean(filters.search || filters.domain || filters.year || filters.status)
  const activeFilterCount = [filters.domain, filters.year, filters.status].filter(Boolean).length

  function clearFilters() {
    setFilters({ search: '', domain: '', year: '', status: '' })
  }

  return (
    <div className="page-container space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Paper Library</h2>
          <p className="section-description">
            {hasFilters
              ? `${filtered.length} of ${papers.length} paper${papers.length !== 1 ? 's' : ''}`
              : `${papers.length} paper${papers.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={() => navigate('/library/add')} className="btn-primary">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Paper</span>
        </button>
      </div>

      {/* Search + Filters */}
      <div className="card p-3 space-y-2.5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, author, keyword…"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="input pl-8"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((f) => ({ ...f, search: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 btn-icon p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="badge badge-primary px-1.5">{activeFilterCount}</span>
            )}
          </div>

          <select
            value={filters.domain}
            onChange={(e) => setFilters((f) => ({ ...f, domain: e.target.value }))}
            className="input py-1.5 text-xs h-8 w-auto min-w-0"
          >
            <option value="">All Domains</option>
            {RESEARCH_DOMAINS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={filters.year}
            onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}
            className="input py-1.5 text-xs h-8 w-auto min-w-0"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="input py-1.5 text-xs h-8 w-auto min-w-0"
          >
            <option value="">All Statuses</option>
            {READING_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="btn-ghost btn-sm text-xs text-muted-foreground"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {papers.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-6 h-6" />}
          title="No papers yet"
          description="Start building your research library by adding your first paper."
          action={
            <button onClick={() => navigate('/library/add')} className="btn-primary">
              <Plus className="w-4 h-4" /> Add Paper
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="w-6 h-6" />}
          title="No papers match your filters"
          description="Try adjusting your search or filter criteria."
          action={
            <button onClick={clearFilters} className="btn-secondary">
              <X className="w-4 h-4" /> Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}
    </div>
  )
}
