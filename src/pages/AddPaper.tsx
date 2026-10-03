import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import PaperForm from '@/components/papers/PaperForm'
import type { PaperFormData } from '@/types'

export default function AddPaper() {
  const addPaper = useStore((s) => s.addPaper)
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(data: PaperFormData) {
    setIsSubmitting(true)
    try {
      const paper = addPaper(data)
      navigate(`/library/${paper.id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <div className="max-w-2xl">
        <div className="mb-5">
          <h2 className="section-title">Add Paper</h2>
          <p className="section-description">Add a new research paper to your library.</p>
        </div>
        <div className="card p-6">
          <PaperForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  )
}
