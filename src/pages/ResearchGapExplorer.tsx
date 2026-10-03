import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Compass,
  Sparkles,
  BookOpen,
  Plus,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  FileText,
} from 'lucide-react'
import { useStore } from '@/store'
import { EmptyState } from '@/components/ui/EmptyState'
import { InlineLoading } from '@/components/ui/Loading'
import { synthesizeResearchGaps } from '@/lib/analysis'
import type { GapAnalysis } from '@/lib/analysis'

export default function ResearchGapExplorer() {
  const papers = useStore((s) => s.papers)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSynthesize() {
    setLoading(true)
    setError(null)
    try {
      const result = await synthesizeResearchGaps(papers)
      setGapAnalysis(result)
    } catch {
      setError('Synthesis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title">Research Gap Explorer</h2>
          <p className="section-description">
            Synthesize insights from {papers.length} paper{papers.length !== 1 ? 's' : ''} in your library.
          </p>
        </div>
        <button
          onClick={handleSynthesize}
          disabled={loading || papers.length === 0}
          className="btn-primary flex-shrink-0"
        >
          {loading ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing…</>
          ) : gapAnalysis ? (
            <><RefreshCw className="w-4 h-4" /> Re-synthesize</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Synthesize Gaps</>
          )}
        </button>
      </div>

      {/* Empty library */}
      {papers.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-6 h-6" />}
          title="No papers in your library"
          description="Add papers to your library first, then synthesize research gaps."
          action={
            <button onClick={() => navigate('/library/add')} className="btn-primary">
              <Plus className="w-4 h-4" /> Add Paper
            </button>
          }
        />
      ) : !gapAnalysis && !loading ? (
        /* Idle prompt */
        <div className="card p-8 text-center">
          <Compass className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm font-medium text-foreground mb-2">Ready to explore research gaps</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
            Click "Synthesize Gaps" to analyze your {papers.length} paper{papers.length !== 1 ? 's' : ''} and
            identify recurring limitations and potential research directions.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="w-3.5 h-3.5" />
            Results are AI-synthesized and intended for research ideation only.
          </div>
        </div>
      ) : loading ? (
        <div className="card p-8">
          <InlineLoading text={`Synthesizing insights from ${papers.length} papers…`} />
        </div>
      ) : gapAnalysis ? (
        <div className="space-y-4 animate-slide-in">

          {/* Error */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          {/* Stat bar */}
          <div className="card px-5 py-4 flex items-center gap-3">
            <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <span className="text-xl font-bold text-foreground">{gapAnalysis.analyzedCount}</span>
              <span className="text-sm text-muted-foreground ml-2">Analyzed Papers</span>
            </div>
            <div className="ml-auto text-xs text-muted-foreground">
              {new Set(papers.map((p) => p.domain)).size} domain{new Set(papers.map((p) => p.domain)).size !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Main two-column results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Recurring Limitations */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Recurring Limitations</h3>
              <div className="space-y-3">
                {gapAnalysis.frequentLimitations.map((item) => {
                  const pct = Math.round((item.count / gapAnalysis.analyzedCount) * 100)
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">{item.label}</span>
                        <span className="text-sm font-medium text-muted-foreground tabular-nums">
                          {item.count} paper{item.count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/70 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Potential Research Directions */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Potential Research Directions</h3>
              <ul className="space-y-2.5">
                {gapAnalysis.potentialDirections.map((dir, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{dir}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground border border-border rounded-md px-4 py-3 bg-muted/40">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{gapAnalysis.disclaimer}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
