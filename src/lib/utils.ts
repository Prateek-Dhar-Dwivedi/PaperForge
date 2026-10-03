import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import type { ReadingStatus, ResearchDomain } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'MMM d, yyyy')
  } catch {
    return dateString
  }
}

export function formatRelativeDate(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  } catch {
    return dateString
  }
}

export function parseAuthors(authorString: string): string[] {
  return authorString
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)
}

export function parseKeywords(keywordString: string): string[] {
  return keywordString
    .split(/[,;]/)
    .map((k) => k.trim())
    .filter(Boolean)
}

export const STATUS_LABELS: Record<ReadingStatus, string> = {
  unread: 'Unread',
  reading: 'Reading',
  completed: 'Completed',
  archived: 'Archived',
}

export const STATUS_BADGE_CLASS: Record<ReadingStatus, string> = {
  unread: 'badge badge-gray',
  reading: 'badge badge-info',
  completed: 'badge badge-success',
  archived: 'badge badge-warning',
}

export const DOMAIN_COLORS: Record<string, string> = {
  'Computer Science': '#3b5bdb',
  'Machine Learning': '#7048e8',
  'Natural Language Processing': '#0c8599',
  'Computer Vision': '#2f9e44',
  'Data Science': '#e8590c',
  'Bioinformatics': '#5c7cfa',
  'Cybersecurity': '#e03131',
  'Human-Computer Interaction': '#f59f00',
  'Robotics': '#1971c2',
  'Quantum Computing': '#862e9c',
  Mathematics: '#495057',
  Physics: '#364fc7',
  Chemistry: '#087f5b',
  Biology: '#2b8a3e',
  Medicine: '#c2255c',
  Economics: '#a61e4d',
  Psychology: '#6741d9',
  Sociology: '#3d9970',
  Other: '#868e96',
}

export const RESEARCH_DOMAINS: ResearchDomain[] = [
  'Computer Science',
  'Machine Learning',
  'Natural Language Processing',
  'Computer Vision',
  'Data Science',
  'Bioinformatics',
  'Cybersecurity',
  'Human-Computer Interaction',
  'Robotics',
  'Quantum Computing',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Medicine',
  'Economics',
  'Psychology',
  'Sociology',
  'Other',
]

export const READING_STATUSES: ReadingStatus[] = ['unread', 'reading', 'completed', 'archived']

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}
