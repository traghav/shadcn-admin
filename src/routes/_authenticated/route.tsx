import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthGuard } from '@/hooks/use-auth'

function ProtectedLayout() {
  const { isAuthenticated } = useAuthGuard()
  
  if (!isAuthenticated) {
    return null // Will redirect in useAuthGuard
  }
  
  return <AuthenticatedLayout />
}

export const Route = createFileRoute('/_authenticated')({
  component: ProtectedLayout,
})
