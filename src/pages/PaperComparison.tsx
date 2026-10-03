import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { GitCompare, Plus, X, AlertCircle, BookOpen, Info } from 'lucide-react'
import { useStore } from '@/store'
import PaperCard from '@/components/papers/PaperCard'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Paper } from '@/types'

const COMPARISON_DIMENSIONS: { key: keyof NonNullable<Paper['analysis']>; label: string }[] = [
  { key: 'researchProblem', label: 'Research Problem' },
  { key: 'methodology', label: 'Methodology' },
  { key: 'dataset', label: 'Dataset' },
  { key: 'evaluationMetrics', label: 'Evaluation Metrics' },
  { key: 'keyFindings', label: 'Key Findings' },
  { key: 'limitations', label: 'Limitations' },
  { key: 'futureWork', label: 'Future Work' },
]

// ─── Comparison table ─────────────────────────────────────────────────────────

function ComparisonTable({ papers }: { papers: Paper[] }) {
  const analyzedPapers = papers.filter((p) => p.analysis)
  const unanalyzed = papers.filter((p) => !p.analysis)

  if (analyzedPapers.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">No analyzed papers selected</p>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          Open each paper and click "Analyze Paper" to generate AI analysis, then return here to compare.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {unanalyzed.length > 0 && (
        <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>
            <strong>{unanalyzed.map((p) => p.title).join(', ')}</strong>{' '}
            {unanalyzed.length === 1 ? 'has' : 'have'} not been analyzed yet and will not appear in the comparison table.
          </span>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted border-b border-border px-4 py-2">
          <Info className="w-3.5 h-3.5 flex-shrink-0" />
          AI-generated comparison — for research ideation only. Verify findings independently.
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-[hsl(220,16%,96%)]">
                {/* Sticky dimension label column header */}
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-[140px] sticky left-0 bg-[hsl(220,16%,96%)] z-10">
                  Dimension
                </th>
                {analyzedPapers.map((p) => (
                  <th key={p.id} className="text-left px-4 py-3 min-w-[240px] align-top">
                    <p className="text-xs font-semibold text-foreground line-clamp-2">{p.title}</p>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">
                      {p.authors[0]}{p.authors.length > 1 ? ' et al.' : ''} · {p.year}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DIMENSIONS.map(({ key, label }, i) => {
                const rowBg = i % 2 === 0 ? 'hsl(0,0%,100%)' : 'hsl(220,16%,98%)'
                return (
                  <tr key={key} className="border-b border-border last:border-0">
                    {/* Sticky row label — explicit bg matching row bg */}
                    <td
                      className="px-4 py-3 text-xs font-semibold text-muted-foreground sticky left-0 align-top z-10"
                      style={{ background: rowBg }}
                    >
                      {label}
                    </td>
                    {analyzedPapers.map((p) => (
                      <td
                        key={p.id}
                        className="px-4 py-3 text-xs text-foreground leading-relaxed align-top"
                        style={{ background: rowBg }}
                      >
                        {p.analysis ? (p.analysis[key] as string) || '—' : '—'}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PaperComparison() {
  const papers = useStore((s) => s.papers)
  const navigate = useNavigate()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const selectedPapers = useMemo(
    () => selectedIds.map((id) => papers.find((p) => p.id === id)).filter(Boolean) as Paper[],
    [selectedIds, papers]
  )

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
    // If we're removing a paper while in results view and drop below 2, exit results
    setShowResults((prev) => {
      if (prev && selectedIds.includes(id) && selectedIds.length <= 2) return false
      return prev
    })
  }

  function removeChip(id: string) {
    setSelectedIds((prev) => {
      const next = prev.filter((i) => i !== id)
      if (next.length < 2) setShowResults(false)
      return next
    })
  }

  function clearAll() {
    setSelectedIds([])
    setShowResults(false)
  }

  return (
    <div className="page-container space-y-4">
      <div>
        <h2 className="section-title">Compare Papers</h2>
        <p className="section-description">Select 2–4 papers to compare them side by side.</p>
      </div>

      {papers.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-6 h-6" />}
          title="No papers in your library"
          description="Add papers first, then compare them here."
          action={
            <button onClick={() => navigate('/library/add')} className="btn-primary">
              <Plus className="w-4 h-4" /> Add Paper
            </button>
          }
        />
      ) : (
        <>
          {/* ── Selection bar ── */}
          {selectedIds.length > 0 && (
            <div className="card p-4 animate-slide-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">
                    {selectedIds.length} of 4 selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={clearAll} className="btn-ghost btn-sm text-xs">
                    Clear all
                  </button>
                  {selectedIds.length >= 2 && !showResults && (
                    <button onClick={() => setShowResults(true)} className="btn-primary btn-sm">
                      <GitCompare className="w-3.5 h-3.5" /> Compare
                    </button>
                  )}
                  {showResults && (
                    <button onClick={() => setShowResults(false)} className="btn-secondary btn-sm">
                      ← Back to selection
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPapers.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-1.5 bg-muted rounded px-2.5 py-1 text-xs"
                  >
                    <span className="font-medium max-w-[220px] truncate">{p.title}</span>
                    <button
                      onClick={() => removeChip(p.id)}
                      className="text-muted-foreground hover:text-foreground flex-shrink-0"
                      aria-label={`Remove ${p.title}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Comparison result ── */}
          {showResults && selectedIds.length >= 2 && (
            <div className="animate-slide-in">
              <ComparisonTable papers={selectedPapers} />
            </div>
          )}

          {/* ── Paper selection grid — always visible ── */}
          {!showResults && (
            <div className="space-y-2">
              {selectedIds.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Click papers to select them for comparison (2–4 papers):
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {papers.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    selectable
                    selected={selectedIds.includes(paper.id)}
                    onSelect={toggleSelect}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
