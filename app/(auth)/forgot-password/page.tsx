'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=recovery`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
        <div className="max-w-sm w-full text-center">
          <div className="mb-4 text-3xl">✉️</div>
          <h2 className="text-lg font-semibold mb-2">Reset link sent</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Check <strong>{email}</strong> for a password reset link.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="font-semibold text-lg tracking-tight">Merlin</Link>
          <p className="text-sm text-[var(--text-muted)] mt-2">Reset your password</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Send reset link
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-5">
          Remembered it?{' '}
          <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
