import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import {
  BookOpen, CheckCircle2, Library,
  TrendingUp, ArrowRight, FileText, X, FlaskConical,
} from 'lucide-react'
import { useStore } from '@/store'
import { StatusBadge, DomainBadge } from '@/components/ui/Badge'
import { formatRelativeDate, DOMAIN_COLORS } from '@/lib/utils'
import type { Paper } from '@/types'

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
}: {
  label: string
  value: number | string
  sub?: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  trend?: string
}) {
  return (
    <div className="stat-card flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        <Icon className={`w-[18px] h-[18px] ${iconColor}`} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-foreground tabular-nums leading-none">{value}</span>
          {trend && (
            <span className="text-xs text-muted-foreground">{trend}</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
        {sub && <div className="text-[11px] text-muted-foreground/70">{sub}</div>}
      </div>
    </div>
  )
}

// ─── Recent paper row ─────────────────────────────────────────────────────────

function RecentPaperRow({ paper, index }: { paper: Paper; index: number }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/library/${paper.id}`)}
      className="flex items-center gap-3 py-2 px-2 -mx-2 rounded cursor-pointer transition-colors hover:bg-muted group"
    >
      {/* Rank */}
      <span className="w-5 text-center text-xs text-muted-foreground/50 font-medium tabular-nums flex-shrink-0">
        {index + 1}
      </span>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors leading-tight">
          {paper.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {paper.authors[0]}{paper.authors.length > 1 ? ' et al.' : ''} · {paper.year}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <DomainBadge domain={paper.domain} className="hidden md:inline-flex" />
        <StatusBadge status={paper.status} />
        {paper.analysis && (
          <FileText className="w-3.5 h-3.5 text-emerald-500 hidden sm:block" aria-label="Analyzed" />
        )}
      </div>
    </div>
  )
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: { value: number; name: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-2.5 py-2 text-xs shadow-md">
      {label && <div className="font-medium text-foreground mb-0.5">{label}</div>}
      {payload.map((p) => (
        <div key={p.name} className="text-muted-foreground">
          {p.name}: <span className="font-semibold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const papers = useStore((s) => s.papers)
  const notes = useStore((s) => s.notes)
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const total = papers.length
    const topics = new Set(papers.map((p) => p.domain)).size
    const reading = papers.filter((p) => p.status === 'reading').length
    const completed = papers.filter((p) => p.status === 'completed').length
    const analyzed = papers.filter((p) => p.analysis).length
    const unread = papers.filter((p) => p.status === 'unread').length

    const recent = [...papers]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)

    const domainCounts = papers.reduce<Record<string, number>>((acc, p) => {
      acc[p.domain] = (acc[p.domain] || 0) + 1
      return acc
    }, {})
    const domainDist = Object.entries(domainCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value, color: DOMAIN_COLORS[name] || '#868e96' }))

    const yearCounts = papers.reduce<Record<number, number>>((acc, p) => {
      acc[p.year] = (acc[p.year] || 0) + 1
      return acc
    }, {})
    const yearDist = Object.entries(yearCounts)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .slice(-8)
      .map(([year, count]) => ({ year, count }))

    return { total, topics, reading, completed, analyzed, unread, recent, domainDist, yearDist }
  }, [papers])

  const progressItems = [
    { label: 'Completed', count: stats.completed, color: '#10b981' },
    { label: 'Reading', count: stats.reading, color: '#3b82f6' },
    { label: 'Unread', count: stats.unread, color: '#d1d5db' },
    { label: 'Archived', count: papers.filter((p) => p.status === 'archived').length, color: '#f59e0b' },
  ]

  const [demoBannerDismissed, setDemoBannerDismissed] = useState(false)
  const hasDemoData = papers.some((p) => p.id.startsWith('demo-'))

  return (
    <div className="page-container space-y-4">
      {/* ── Demo dataset notice ── */}
      {hasDemoData && !demoBannerDismissed && (
        <div className="flex items-start justify-between gap-3 rounded border border-primary/20 bg-primary/5 px-4 py-3 text-sm animate-fade-in">
          <div className="flex items-start gap-2.5">
            <FlaskConical className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-primary">Demo dataset loaded.</span>
              <span className="text-muted-foreground ml-1.5">
                These are fictional sample papers created to showcase PaperForge features.
                They are not real published research and should not be cited.
              </span>
            </div>
          </div>
          <button
            onClick={() => setDemoBannerDismissed(true)}
            className="btn-icon flex-shrink-0 text-muted-foreground mt-0.5"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Stat row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total Papers"
          value={stats.total}
          icon={Library}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          sub={`${stats.topics} domain${stats.topics !== 1 ? 's' : ''}`}
        />
        <StatCard
          label="Currently Reading"
          value={stats.reading}
          icon={BookOpen}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          sub={`${stats.unread} unread`}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          sub={stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% of total` : undefined}
        />
        <StatCard
          label="Analyzed"
          value={stats.analyzed}
          icon={TrendingUp}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          sub={`${notes.length} note${notes.length !== 1 ? 's' : ''}`}
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* Domain donut */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Domains</h2>
            <span className="text-xs text-muted-foreground tabular-nums">
              {stats.domainDist.length} field{stats.domainDist.length !== 1 ? 's' : ''}
            </span>
          </div>
          {stats.domainDist.length === 0 ? (
            <div className="flex items-center justify-center h-36 text-xs text-muted-foreground">
              No data yet
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0" style={{ width: 120, height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.domainDist}
                      cx="50%"
                      cy="50%"
                      innerRadius={34}
                      outerRadius={56}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {stats.domainDist.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-[5px] min-w-0">
                {stats.domainDist.slice(0, 5).map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <div
                      className="w-2 h-2 rounded-sm flex-shrink-0"
                      style={{ background: d.color }}
                    />
                    <span className="text-muted-foreground truncate">{d.name}</span>
                    <span className="ml-auto font-semibold text-foreground tabular-nums">{d.value}</span>
                  </div>
                ))}
                {stats.domainDist.length > 5 && (
                  <div className="text-[11px] text-muted-foreground">
                    +{stats.domainDist.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Year bar chart */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">By Year</h2>
          </div>
          {stats.yearDist.length === 0 ? (
            <div className="flex items-center justify-center h-[120px] text-xs text-muted-foreground">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={130}>
              <BarChart
                data={stats.yearDist}
                margin={{ top: 2, right: 0, bottom: 0, left: -22 }}
                barSize={18}
              >
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="hsl(220 16% 91%)" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10, fill: 'hsl(220 12% 50%)' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'hsl(220 12% 50%)' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(220 16% 95%)' }} />
                <Bar
                  dataKey="count"
                  name="Papers"
                  fill="hsl(232 72% 50%)"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Reading progress */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Progress</h2>
            <span className="text-xs text-muted-foreground tabular-nums">{stats.total} total</span>
          </div>
          <div className="space-y-3">
            {progressItems.map(({ label, count, color }) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="tabular-nums font-medium text-foreground">
                      {count}
                      <span className="text-muted-foreground font-normal ml-1">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Research notes</span>
            <span className="font-semibold text-foreground tabular-nums">{notes.length}</span>
          </div>
        </div>
      </div>

      {/* ── Recent papers ── */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Recently Added</h2>
          <button
            onClick={() => navigate('/library')}
            className="btn-ghost btn-sm text-xs text-muted-foreground"
          >
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {stats.recent.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No papers yet.{' '}
              <button
                onClick={() => navigate('/library/add')}
                className="text-primary hover:underline font-medium"
              >
                Add your first paper
              </button>
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border -mx-0">
            {stats.recent.map((paper, i) => (
              <RecentPaperRow key={paper.id} paper={paper} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
