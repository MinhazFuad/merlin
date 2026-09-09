'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface AuthGuardProps {
  children: React.ReactNode | ((user: User) => React.ReactNode)
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!currentUser) {
        router.push('/login')
      } else {
        setUser(currentUser)
        setLoading(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push('/login')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  if (loading) {
    return (
      fallback ?? (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
          <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
        </div>
      )
    )
  }

  if (!user) return null

  return typeof children === 'function' ? children(user) : children
}
