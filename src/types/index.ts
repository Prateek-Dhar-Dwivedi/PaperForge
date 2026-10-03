// ─── Core Types ─────────────────────────────────────────────────────────────

export type ReadingStatus = 'unread' | 'reading' | 'completed' | 'archived'

export type ResearchDomain =
  | 'Computer Science'
  | 'Machine Learning'
  | 'Natural Language Processing'
  | 'Computer Vision'
  | 'Data Science'
  | 'Bioinformatics'
  | 'Cybersecurity'
  | 'Human-Computer Interaction'
  | 'Robotics'
  | 'Quantum Computing'
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Medicine'
  | 'Economics'
  | 'Psychology'
  | 'Sociology'
  | 'Other'

export interface Paper {
  id: string
  title: string
  authors: string[]
  year: number
  domain: ResearchDomain
  abstract: string
  keywords: string[]
  url?: string
  status: ReadingStatus
  personalNotes: string
  analysis?: PaperAnalysis
  createdAt: string
  updatedAt: string
}

export interface PaperAnalysis {
  researchProblem: string
  researchObjective: string
  methodology: string
  dataset: string
  evaluationMetrics: string
  keyFindings: string
  limitations: string
  futureWork: string
  importantKeywords: string[]
  generatedAt: string
}

export interface ResearchNote {
  id: string
  title: string
  content: string
  paperId?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ComparisonResult {
  papers: Paper[]
  dimensions: ComparisonDimension[]
}

export interface ComparisonDimension {
  key: keyof PaperAnalysis
  label: string
}

// ─── Form Types ──────────────────────────────────────────────────────────────

export interface PaperFormData {
  title: string
  authors: string
  year: number
  domain: ResearchDomain
  abstract: string
  keywords: string
  url: string
  status: ReadingStatus
  personalNotes: string
}

export interface NoteFormData {
  title: string
  content: string
  paperId: string
  tags: string
}

// ─── UI Types ────────────────────────────────────────────────────────────────

export interface FilterState {
  search: string
  domain: string
  year: string
  status: string
}

export interface DashboardStats {
  totalPapers: number
  totalTopics: number
  currentlyReading: number
  completed: number
  recentPapers: Paper[]
  domainDistribution: { name: string; value: number; color: string }[]
}
