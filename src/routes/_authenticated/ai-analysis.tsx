import { createFileRoute } from '@tanstack/react-router'
import AIAnalysis from '@/features/ai-analysis'

export const Route = createFileRoute('/_authenticated/ai-analysis')({
  component: AIAnalysis,
})