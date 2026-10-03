import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Edit2, Trash2, ExternalLink, Calendar, Users,
  Sparkles, RefreshCw, FileText, AlertCircle, ChevronRight, Info,
} from 'lucide-react'
import { useStore } from '@/store'
import { StatusBadge, DomainBadge, TagBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { AnalysisLoadingState } from '@/components/ui/Loading'
import { analyzePaper } from '@/lib/analysis'
import { formatDate, DOMAIN_COLORS } from '@/lib/utils'

// ─── Analysis section card ────────────────────────────────────────────────────

function AnalysisBlock({ label, content }: { label: string; content: string }) {
  return (
    <div className="space-y-1">
      <div className="analysis-label">{label}</div>
      <p className="text-sm text-foreground leading-relaxed">{content || '—'}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PaperDetail() {
  const { id } = useParams<{ id: string }>()
  const getPaper = useStore((s) => s.getPaper)
  const deletePaper = useStore((s) => s.deletePaper)
  const setAnalysis = useStore((s) => s.setAnalysis)
  const notes = useStore((s) => s.notes)
  const navigate = useNavigate()
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const paper = getPaper(id!)
  const paperNotes = notes.filter((n) => n.paperId === id)

  if (!paper) {
    return (
      <div className="page-container">
        <EmptyState
          icon={<FileText className="w-5 h-5" />}
          title="Paper not found"
          description="This paper may have been deleted."
          action={
            <button onClick={() => navigate('/library')} className="btn-secondary">
              Back to Library
            </button>
          }
        />
      </div>
    )
  }

  const p = paper
  const domainColor = DOMAIN_COLORS[p.domain] || '#868e96'

  async function handleAnalyze() {
    setAnalyzing(true)
    setAnalysisError(null)
    try {
      const result = await analyzePaper(p)
      setAnalysis(p.id, result)
    } catch {
      setAnalysisError('Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  function handleDelete() {
    if (confirm(`Delete "${p.title}"?\nThis cannot be undone.`)) {
      deletePaper(p.id)
      navigate('/library')
    }
  }

  return (
    <div className="page-container space-y-4 animate-fade-in">
      {/* Back nav */}
      <button
        onClick={() => navigate('/library')}
        className="btn-ghost btn-sm text-muted-foreground -ml-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Library
      </button>

      {/* ── Paper header ── */}
      <div className="card p-5">
        <div className="flex items-start gap-4">
          {/* Domain color accent */}
          <div
            className="w-1 self-stretch rounded-full flex-shrink-0 min-h-[3rem]"
            style={{ background: domainColor }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-[15px] font-semibold text-foreground leading-snug flex-1 min-w-0">
                {paper.title}
              </h2>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => navigate(`/library/${paper.id}/edit`)}
                  className="btn-secondary btn-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-icon text-muted-foreground hover:text-destructive"
                  title="Delete paper"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {paper.authors.join(', ')}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {paper.year}
              </span>
              {paper.url && (
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-primary hover:underline font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View paper
                </a>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <StatusBadge status={paper.status} />
              <DomainBadge domain={paper.domain} />
              {paper.keywords.map((k) => (
                <TagBadge key={k} tag={k} />
              ))}
            </div>

            {/* Abstract */}
            {paper.abstract && (
              <div>
                <div className="analysis-label mb-1">Abstract</div>
                <p className="text-sm text-foreground leading-relaxed">{paper.abstract}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Analysis panel */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="section-title">AI Analysis</h3>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="btn-secondary btn-sm"
            >
              {analyzing ? (
                <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing…</>
              ) : paper.analysis ? (
                <><RefreshCw className="w-3.5 h-3.5" /> Re-analyze</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5" /> Analyze Paper</>
              )}
            </button>
          </div>

          {analysisError && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/8 rounded px-3 py-2 mb-4 border border-destructive/15">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {analysisError}
            </div>
          )}

          {analyzing ? (
            <AnalysisLoadingState />
          ) : !paper.analysis ? (
            <div className="text-center py-10">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No analysis yet</p>
              <p className="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
                Click "Analyze Paper" to extract structured research information using AI.
              </p>
            </div>
          ) : (
            <div className="space-y-5 animate-slide-in">
              {/* Disclaimer */}
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted rounded px-3 py-2">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                AI-generated — verify independently before citing.
              </div>

              {/* Analysis grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <AnalysisBlock label="Research Problem" content={paper.analysis.researchProblem} />
                <AnalysisBlock label="Research Objective" content={paper.analysis.researchObjective} />
                <AnalysisBlock label="Methodology" content={paper.analysis.methodology} />
                <AnalysisBlock label="Dataset" content={paper.analysis.dataset} />
                <AnalysisBlock label="Evaluation Metrics" content={paper.analysis.evaluationMetrics} />
                <AnalysisBlock label="Key Findings" content={paper.analysis.keyFindings} />
                <AnalysisBlock label="Limitations" content={paper.analysis.limitations} />
                <AnalysisBlock label="Future Work" content={paper.analysis.futureWork} />
              </div>

              {paper.analysis.importantKeywords.length > 0 && (
                <div className="pt-1">
                  <div className="analysis-label mb-2">Important Keywords</div>
                  <div className="flex flex-wrap gap-1.5">
                    {paper.analysis.importantKeywords.map((k) => (
                      <TagBadge key={k} tag={k} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Personal notes */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Personal Notes
              </h3>
              <button
                onClick={() => navigate(`/library/${paper.id}/edit`)}
                className="text-xs text-primary hover:underline"
              >
                Edit
              </button>
            </div>
            {paper.personalNotes ? (
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {paper.personalNotes}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">No notes added.</p>
            )}
          </div>

          {/* Linked notes */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Research Notes
              </h3>
              <button
                onClick={() => navigate('/notes')}
                className="text-xs text-primary hover:underline"
              >
                View all
              </button>
            </div>
            {paperNotes.length === 0 ? (
              <p className="text-xs text-muted-foreground">No notes linked to this paper.</p>
            ) : (
              <div className="space-y-2">
                {paperNotes.slice(0, 3).map((note) => (
                  <div key={note.id} className="text-sm">
                    <p className="font-medium text-foreground text-[13px] leading-tight">{note.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('/notes')}
              className="mt-3 text-xs text-primary hover:underline flex items-center gap-1"
            >
              Add note <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Meta details */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Details
            </h3>
            <dl className="space-y-2">
              {[
                { label: 'Added', value: formatDate(paper.createdAt) },
                { label: 'Updated', value: formatDate(paper.updatedAt) },
                {
                  label: 'Analysis',
                  value: paper.analysis ? formatDate(paper.analysis.generatedAt) : 'Not run',
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-baseline gap-2">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-xs font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
