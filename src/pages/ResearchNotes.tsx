import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import {
  Plus,
  StickyNote,
  Trash2,
  Edit2,
  X,
  Check,
  Tag,
} from 'lucide-react'
import { useStore } from '@/store'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input, Textarea, Select } from '@/components/ui/FormFields'
import { TagBadge } from '@/components/ui/Badge'
import { parseKeywords } from '@/lib/utils'
import type { NoteFormData, ResearchNote } from '@/types'

interface NoteFormProps {
  note?: ResearchNote
  onSave: (data: NoteFormData) => void
  onCancel: () => void
}

function NoteForm({ note, onSave, onCancel }: NoteFormProps) {
  const papers = useStore((s) => s.papers)
  const paperOptions = [
    { value: '', label: 'No paper (general note)' },
    ...papers.map((p) => ({ value: p.id, label: p.title })),
  ]

  const { register, handleSubmit, formState: { errors } } = useForm<NoteFormData>({
    defaultValues: note
      ? {
          title: note.title,
          content: note.content,
          paperId: note.paperId || '',
          tags: note.tags.join(', '),
        }
      : { title: '', content: '', paperId: '', tags: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <Input
        label="Title *"
        placeholder="Note title"
        {...register('title', { required: 'Title is required' })}
        error={errors.title?.message}
      />
      <Textarea
        label="Content"
        placeholder="Write your research notes, observations, questions…"
        className="min-h-[150px]"
        {...register('content')}
      />
      <Select
        label="Link to Paper"
        options={paperOptions}
        {...register('paperId')}
      />
      <Input
        label="Tags"
        placeholder="attention, deep learning, limitations"
        hint="Separate with commas"
        {...register('tags')}
      />
      <div className="flex items-center gap-2">
        <button type="submit" className="btn-primary btn-sm">
          <Check className="w-3.5 h-3.5" /> {note ? 'Save Changes' : 'Add Note'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary btn-sm">
          Cancel
        </button>
      </div>
    </form>
  )
}

interface NoteCardProps {
  note: ResearchNote
  onEdit: () => void
  onDelete: () => void
  linkedPaperTitle?: string
}

function NoteCard({ note, onEdit, onDelete, linkedPaperTitle }: NoteCardProps) {
  const [expanded, setExpanded] = useState(false)
  const isLong = note.content.length > 240

  return (
    <div className="card-hover p-4 group flex flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[13px] font-semibold text-foreground leading-tight">{note.title}</h3>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 -mt-0.5 -mr-0.5">
          <button onClick={onEdit} className="btn-icon" title="Edit">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="btn-icon hover:text-destructive" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Paper link */}
      {linkedPaperTitle && (
        <div className="flex items-center gap-1.5 text-xs text-primary">
          <Tag className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{linkedPaperTitle}</span>
        </div>
      )}

      {/* Content */}
      <div
        className={`text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap ${
          !expanded && isLong ? 'line-clamp-4' : ''
        }`}
      >
        {note.content || <span className="italic">No content.</span>}
      </div>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary hover:underline self-start"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-0.5">
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <span className="text-[11px] text-muted-foreground flex-shrink-0 tabular-nums">
          {format(new Date(note.updatedAt), 'MMM d, yyyy')}
        </span>
      </div>
    </div>
  )
}

export default function ResearchNotes() {
  const notes = useStore((s) => s.notes)
  const papers = useStore((s) => s.papers)
  const addNote = useStore((s) => s.addNote)
  const updateNote = useStore((s) => s.updateNote)
  const deleteNote = useStore((s) => s.deleteNote)

  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<ResearchNote | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNotes = notes.filter((n) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    )
  })

  function handleSave(data: NoteFormData) {
    if (editingNote) {
      updateNote(editingNote.id, data)
      setEditingNote(null)
    } else {
      addNote(data)
      setShowForm(false)
    }
  }

  function handleDelete(id: string) {
    const note = notes.find((n) => n.id === id)
    if (note && confirm(`Delete "${note.title}"?`)) {
      deleteNote(id)
    }
  }

  function getPaperTitle(paperId?: string): string | undefined {
    if (!paperId) return undefined
    return papers.find((p) => p.id === paperId)?.title
  }

  return (
    <div className="page-container space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Research Notes</h2>
          <p className="section-description">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingNote(null) }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Note</span>
        </button>
      </div>

      {/* Add form */}
      {showForm && !editingNote && (
        <div className="card p-5 animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">New Note</h3>
            <button
              onClick={() => setShowForm(false)}
              className="btn-icon text-muted-foreground"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <NoteForm onSave={handleSave} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Search */}
      {notes.length > 0 && (
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes by title, content, or tag…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
          />
        </div>
      )}

      {/* Notes grid */}
      {notes.length === 0 ? (
        <EmptyState
          icon={<StickyNote className="w-6 h-6" />}
          title="No research notes yet"
          description="Create notes linked to papers or topics to organize your thoughts."
          action={
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Add Note
            </button>
          }
        />
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          icon={<StickyNote className="w-6 h-6" />}
          title="No notes match your search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredNotes.map((note) =>
            editingNote?.id === note.id ? (
              <div key={note.id} className="card p-4 col-span-full animate-slide-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Edit Note</h3>
                  <button onClick={() => setEditingNote(null)} className="btn-icon p-1.5 text-muted-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <NoteForm
                  note={editingNote}
                  onSave={handleSave}
                  onCancel={() => setEditingNote(null)}
                />
              </div>
            ) : (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => { setEditingNote(note); setShowForm(false) }}
                onDelete={() => handleDelete(note.id)}
                linkedPaperTitle={getPaperTitle(note.paperId)}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}
