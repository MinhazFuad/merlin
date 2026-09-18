'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { EmailPasswordForm } from '@/components/auth/EmailPasswordForm'
import { AuthTabs } from '@/components/auth/AuthTabs'
import Plasma from '@/components/landing/Plasma'
import GlassSurface from '@/components/landing/GlassSurface'
import { Zap, Cloud, ShieldCheck } from 'lucide-react'
import { sanitizeEmail, sanitizeErrorMessage } from '@/lib/validators/auth'

interface AuthPageLayoutProps {
  initialMode: 'login' | 'signup'
}

export function AuthPageLayout({ initialMode }: AuthPageLayoutProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  // Read error query param if present
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      if (errorParam === 'auth_callback_failed') {
        setError('Authentication callback failed. Please try signing in again.')
      } else {
        setError(sanitizeErrorMessage(errorParam))
      }
    }
  }, [searchParams])

  // Sync mode with browser back/forward history
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      if (path.includes('/signup')) {
        setMode('signup')
      } else if (path.includes('/login')) {
        setMode('login')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function handleModeChange(newMode: 'login' | 'signup') {
    if (newMode === mode) return
    setMode(newMode)
    setError(null)

    // Update browser URL smoothly without triggering a page reload
    const currentQuery = searchParams?.toString() ? `?${searchParams.toString()}` : ''
    window.history.replaceState(null, '', `/${newMode}${currentQuery}`)
  }

  async function handleLogin({ email, password }: { email: string; password: string }) {
    setLoading(true)
    setError(null)

    const cleanEmail = sanitizeEmail(email)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  async function handleSignup({ email, password }: { email: string; password: string }) {
    setLoading(true)
    setError(null)
    const cleanEmail = sanitizeEmail(email)
    setSubmittedEmail(cleanEmail)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
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

    if (data?.session) {
      router.push('/dashboard')
      router.refresh()
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
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
            <h2 className="text-xl font-semibold mb-2 text-[var(--text)]">Check your email</h2>
            <p className="text-sm text-[var(--text-muted)]">
              We sent a confirmation link to <strong className="text-[var(--text)]">{submittedEmail}</strong>. Click it to activate your account.
            </p>
            <button
              type="button"
              onClick={() => {
                setSuccess(false)
                handleModeChange('login')
              }}
              className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline font-medium cursor-pointer"
            >
              Back to sign in
            </button>
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

      <div className="relative z-10 w-full max-w-[420px] transition-all duration-300">
        {/* Clean Editorial Header (No pill badge) */}
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="font-semibold text-base tracking-tight text-[var(--text-muted)] hover:text-[var(--text)] transition-colors inline-block"
          >
            Merlin
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] mt-2 transition-all duration-200">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 transition-all duration-200">
            {mode === 'login'
              ? 'Sign in to your diagrams and workspace'
              : 'Start crafting diagrams from markdown in seconds'}
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
          {/* Animated sliding tab switcher */}
          <AuthTabs activeMode={mode} onModeChange={handleModeChange} />

          {/* Smoothly expanding/collapsing monochrome perks highlight box */}
          <div
            className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
              mode === 'signup'
                ? 'max-h-48 opacity-100 mb-5 translate-y-0'
                : 'max-h-0 opacity-0 mb-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <div className="p-3 rounded-xl bg-[var(--bg)]/50 border border-[var(--border)] text-xs text-[var(--text-muted)] space-y-2">
              <div className="flex items-center gap-2.5 text-[var(--text)] font-medium">
                <Zap size={14} className="text-[var(--text-muted)] shrink-0" />
                <span>Instant AI-assisted Mermaid rendering</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Cloud size={14} className="text-[var(--text-muted)] shrink-0" />
                <span>Cloud auto-save, versions & live share links</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={14} className="text-[var(--text-muted)] shrink-0" />
                <span>Free forever &bull; No credit card required</span>
              </div>
            </div>
          </div>

          <GoogleButton
            onError={(err) => setError(err)}
            disabled={loading}
            text={mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
          />

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-muted)]">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <EmailPasswordForm
            mode={mode}
            onSubmit={mode === 'login' ? handleLogin : handleSignup}
            loading={loading}
            error={error}
          />

          {/* Smoothly collapsing 'Forgot password?' link */}
          <div
            className={`transition-all duration-200 overflow-hidden flex items-center justify-end ${
              mode === 'login' ? 'max-h-8 opacity-100 mt-3.5' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
            }`}
          >
            <Link
              href="/forgot-password"
              className="text-xs text-[var(--accent)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </GlassSurface>

        {/* Footer Mode Switcher link */}
        <p className="text-center text-sm text-[var(--text-muted)] mt-5">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeChange('signup')}
                className="text-[var(--accent)] hover:underline font-medium cursor-pointer"
              >
                Create free account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="text-[var(--accent)] hover:underline font-medium cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
