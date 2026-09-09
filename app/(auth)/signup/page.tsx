'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { EmailPasswordForm } from '@/components/auth/EmailPasswordForm'

export default function SignupPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  async function handleSignup({ email, password }: { email: string; password: string }) {
    setLoading(true)
    setError(null)
    setSubmittedEmail(email)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
        <div className="max-w-sm w-full text-center bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 shadow-sm">
          <div className="mb-4 text-3xl">✉️</div>
          <h2 className="text-lg font-semibold mb-2 text-[var(--text)]">Check your email</h2>
          <p className="text-sm text-[var(--text-muted)]">
            We sent a confirmation link to <strong className="text-[var(--text)]">{submittedEmail}</strong>. Click it to activate your account.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline font-medium"
          >
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
          <Link href="/" className="font-semibold text-lg tracking-tight text-[var(--text)]">
            Merlin
          </Link>
          <p className="text-sm text-[var(--text-muted)] mt-2">Create your account</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <GoogleButton onError={(err) => setError(err)} disabled={loading} text="Sign up with Google" />

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-muted)]">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <EmailPasswordForm
            mode="signup"
            onSubmit={handleSignup}
            loading={loading}
            error={error}
          />
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
