import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' }
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizes[size])} />
      {text && <p className="text-xs text-muted-foreground">{text}</p>}
    </div>
  )
}

export function PageLoading({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[320px]">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}

export function InlineLoading({ text = 'Processing…' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
      <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
      <span>{text}</span>
    </div>
  )
}

export function AnalysisLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Analyzing paper…</p>
        <p className="text-xs text-muted-foreground mt-0.5">Extracting research structure with AI</p>
      </div>
    </div>
  )
}
