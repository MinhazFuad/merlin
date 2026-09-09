'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { EmailPasswordForm } from '@/components/auth/EmailPasswordForm'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin({ email, password }: { email: string; password: string }) {
    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="font-semibold text-lg tracking-tight text-[var(--text)]">
            Merlin
          </Link>
          <p className="text-sm text-[var(--text-muted)] mt-2">Sign in to your account</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <GoogleButton onError={(err) => setError(err)} disabled={loading} />

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-muted)]">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <EmailPasswordForm
            mode="login"
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />

          <div className="mt-3 flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-[var(--accent)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-5">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--accent)] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
