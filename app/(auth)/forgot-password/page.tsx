'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import Plasma from '@/components/landing/Plasma'
import GlassSurface from '@/components/landing/GlassSurface'
import { emailSchema, MAX_EMAIL_LENGTH } from '@/lib/validators/auth'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const validation = emailSchema.safeParse(email)
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? 'Please enter a valid email address.')
      return
    }

    setLoading(true)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(validation.data, {
      redirectTo: `${siteUrl}/auth/callback?type=recovery`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--bg)] px-4 py-12">
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}
        >
          <Plasma 
            color="#2563eb"
            speed={0.6}
            direction="forward"
            scale={1.1}
            opacity={0.8}
            mouseInteractive={false}
            iterations={32}
            renderScale={0.45}
            maxDpr={1.2}
            targetFps={30}
          />
        </div>

        <div className="relative z-10 max-w-sm w-full">
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={20}
            backgroundOpacity={0.12}
            borderWidth={0.07}
            distortionScale={-160}
            redOffset={0}
            greenOffset={10}
            blueOffset={20}
            blur={12}
            brightness={50}
            opacity={0.93}
            saturation={1.4}
            className="shadow-2xl text-center"
            contentClassName="p-8 block text-center"
          >
            <div className="mb-4 text-3xl">✉️</div>
            <h2 className="text-lg font-semibold mb-2 text-[var(--text)]">Reset link sent</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Check <strong>{email}</strong> for a password reset link.
            </p>
            <Link href="/login" className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline font-medium">
              Back to sign in
            </Link>
          </GlassSurface>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--bg)] px-4 py-12">
      {/* Fullscreen Stationary Ambient Plasma Background */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}
      >
        <Plasma 
          color="#2563eb"
          speed={0.6}
          direction="forward"
          scale={1.1}
          opacity={0.8}
          mouseInteractive={false}
          iterations={32}
          renderScale={0.45}
          maxDpr={1.2}
          targetFps={30}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="font-semibold text-base tracking-tight text-[var(--text-muted)] hover:text-[var(--text)] transition-colors inline-block"
          >
            Merlin
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] mt-2">
            Reset your password
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Enter your email and we&apos;ll send you a recovery link
          </p>
        </div>

        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={20}
          backgroundOpacity={0.12}
          borderWidth={0.07}
          distortionScale={-160}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          blur={12}
          brightness={50}
          opacity={0.93}
          saturation={1.4}
          className="shadow-2xl"
          contentClassName="p-6 sm:p-7 block"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-[var(--text)]">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                maxLength={MAX_EMAIL_LENGTH}
                autoComplete="email"
                spellCheck={false}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
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
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Send reset link
            </button>
          </form>
        </GlassSurface>

        <p className="text-center text-sm text-[var(--text-muted)] mt-5">
          Remembered it?{' '}
          <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

