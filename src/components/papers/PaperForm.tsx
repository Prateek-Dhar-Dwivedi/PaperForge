import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import type { Paper, PaperFormData } from '@/types'
import { Input, Textarea, Select } from '@/components/ui/FormFields'
import { RESEARCH_DOMAINS, READING_STATUSES, STATUS_LABELS } from '@/lib/utils'

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  authors: z.string().min(2, 'At least one author is required'),
  year: z.coerce
    .number()
    .int()
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  domain: z.enum([
    'Computer Science', 'Machine Learning', 'Natural Language Processing',
    'Computer Vision', 'Data Science', 'Bioinformatics', 'Cybersecurity',
    'Human-Computer Interaction', 'Robotics', 'Quantum Computing',
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Medicine',
    'Economics', 'Psychology', 'Sociology', 'Other',
  ]),
  abstract: z.string().optional().default(''),
  keywords: z.string().optional().default(''),
  url: z.string().optional().default(''),
  status: z.enum(['unread', 'reading', 'completed', 'archived']),
  personalNotes: z.string().optional().default(''),
})

interface PaperFormProps {
  paper?: Paper
  onSubmit: (data: PaperFormData) => void
  isSubmitting?: boolean
}

export default function PaperForm({ paper, onSubmit, isSubmitting }: PaperFormProps) {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaperFormData>({
    resolver: zodResolver(schema),
    defaultValues: paper
      ? {
          title: paper.title,
          authors: paper.authors.join(', '),
          year: paper.year,
          domain: paper.domain,
          abstract: paper.abstract,
          keywords: paper.keywords.join(', '),
          url: paper.url || '',
          status: paper.status,
          personalNotes: paper.personalNotes,
        }
      : {
          year: new Date().getFullYear(),
          status: 'unread',
          domain: 'Computer Science',
          abstract: '',
          keywords: '',
          url: '',
          personalNotes: '',
        },
  })

  const domainOptions = RESEARCH_DOMAINS.map((d) => ({ value: d, label: d }))
  const statusOptions = READING_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Bibliographic info ── */}
      <fieldset className="space-y-4">
        <legend className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Bibliographic Information
        </legend>

        <Input
          label="Title"
          required
          placeholder="Full paper title"
          error={errors.title?.message}
          {...register('title')}
        />

        <Input
          label="Authors"
          required
          placeholder="Author One, Author Two, Author Three"
          hint="Separate multiple authors with commas"
          error={errors.authors?.message}
          {...register('authors')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Year"
            required
            type="number"
            placeholder={String(new Date().getFullYear())}
            error={errors.year?.message}
            {...register('year')}
          />
          <Select
            label="Domain"
            options={domainOptions}
            error={errors.domain?.message}
            {...register('domain')}
          />
          <Select
            label="Reading Status"
            options={statusOptions}
            {...register('status')}
          />
        </div>
      </fieldset>

      {/* ── Content ── */}
      <fieldset className="space-y-4">
        <legend className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Content
        </legend>

        <Textarea
          label="Abstract"
          placeholder="Paste or type the paper abstract…"
          className="min-h-[120px]"
          {...register('abstract')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Keywords"
            placeholder="machine learning, NLP, transformers"
            hint="Separate with commas or semicolons"
            {...register('keywords')}
          />
          <Input
            label="Paper URL"
            type="text"
            placeholder="https://arxiv.org/abs/…"
            error={errors.url?.message}
            {...register('url')}
          />
        </div>
      </fieldset>

      {/* ── Notes ── */}
      <fieldset>
        <legend className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Personal Notes
        </legend>
        <Textarea
          placeholder="Your thoughts, key takeaways, questions to follow up on…"
          className="min-h-[100px]"
          {...register('personalNotes')}
        />
      </fieldset>

      {/* ── Actions ── */}
      <div className="flex items-center gap-3 pt-1">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : paper ? 'Save Changes' : 'Add Paper'}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
