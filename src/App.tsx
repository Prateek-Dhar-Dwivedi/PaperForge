import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from '@/store'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import PaperLibrary from '@/pages/PaperLibrary'
import AddPaper from '@/pages/AddPaper'
import EditPaper from '@/pages/EditPaper'
import PaperDetail from '@/pages/PaperDetail'
import PaperComparison from '@/pages/PaperComparison'
import ResearchGapExplorer from '@/pages/ResearchGapExplorer'
import ResearchNotes from '@/pages/ResearchNotes'

export default function App() {
  const initializeWithSeedData = useStore((s) => s.initializeWithSeedData)

  useEffect(() => {
    initializeWithSeedData()
  }, [initializeWithSeedData])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="library" element={<PaperLibrary />} />
          <Route path="library/add" element={<AddPaper />} />
          <Route path="library/:id" element={<PaperDetail />} />
          <Route path="library/:id/edit" element={<EditPaper />} />
          <Route path="compare" element={<PaperComparison />} />
          <Route path="gaps" element={<ResearchGapExplorer />} />
          <Route path="notes" element={<ResearchNotes />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
