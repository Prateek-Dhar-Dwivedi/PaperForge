import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import PaperForm from '@/components/papers/PaperForm'
import { EmptyState } from '@/components/ui/EmptyState'
import { FileText } from 'lucide-react'
import type { PaperFormData } from '@/types'

export default function EditPaper() {
  const { id } = useParams<{ id: string }>()
  const getPaper = useStore((s) => s.getPaper)
  const updatePaper = useStore((s) => s.updatePaper)
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const paper = getPaper(id!)

  if (!paper) {
    return (
      <div className="page-container">
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
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

  async function handleSubmit(data: PaperFormData) {
    setIsSubmitting(true)
    try {
      updatePaper(id!, data)
      navigate(`/library/${id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-container max-w-2xl">
      <div className="mb-6">
        <h2 className="section-title">Edit Paper</h2>
        <p className="section-description truncate">{paper.title}</p>
      </div>
      <div className="card p-6">
        <PaperForm paper={paper} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
