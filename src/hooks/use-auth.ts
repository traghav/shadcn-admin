import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const { user, accessToken } = useAuthStore((state) => state.auth)
  
  const isAuthenticated = !!user && !!accessToken
  
  return {
    user,
    isAuthenticated,
    accessToken,
  }
}

export function useAuthGuard() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  useEffect(() => {
    if (!isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search
      navigate({ 
        to: '/sign-in', 
        search: { redirect: currentPath } 
      })
    }
  }, [isAuthenticated, navigate])
  
  return { isAuthenticated }
}