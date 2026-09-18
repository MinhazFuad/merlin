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
import { sanitizeEmail, sanitizeErrorMessage } from '@/lib/validators/auth'

const MERLIN_PERKS = [
  'Instant AI-assisted Mermaid rendering',
  'Cloud auto-save, versions & live share links',
  'Flowcharts, sequence, class & ER diagrams',
  'Export high quality up to 3x',
  'Free forever • No credit card required',
] as const

interface AuthPageLayoutProps {
  initialMode: 'login' | 'signup'
}

export function AuthPageLayout({ initialMode }: AuthPageLayoutProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      const newMode = path.includes('/signup') ? 'signup' : 'login'
      setMode(newMode)
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

  async function handleLogin({ email: loginEmail, password: loginPassword }: { email: string; password: string }) {
    setLoading(true)
    setError(null)

    const cleanEmail = sanitizeEmail(loginEmail)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: loginPassword,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  async function handleSignup({ email: signupEmail, password: signupPassword }: { email: string; password: string }) {
    setLoading(true)
    setError(null)
    const cleanEmail = sanitizeEmail(signupEmail)
    setSubmittedEmail(cleanEmail)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: signupPassword,
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

  async function handleSubmit(credentials: { email: string; password: string }) {
    if (mode === 'login') {
      await handleLogin(credentials)
    } else {
      await handleSignup(credentials)
    }
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

  const isSignup = mode === 'signup'

  return (
    <div className="relative h-screen max-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-4 py-2 sm:py-4 select-none">
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

      {/* Smoothly expanding container that shifts left to create space for perks on signup */}
      <div
        className="relative z-10 w-full transition-[max-width] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ maxWidth: isSignup ? '720px' : '400px' }}
      >
        {/* Clean Editorial Header with synchronized vertical roll */}
        <div className="mb-3 sm:mb-4 text-center">
          <Link
            href="/"
            className="font-bold text-lg sm:text-xl tracking-tight text-[var(--text-muted)] hover:text-[var(--text)] dark:hover:text-white transition-colors duration-200 inline-block"
          >
            Merlin
          </Link>
          <div className="relative mt-1 h-7 overflow-hidden">
            <div
              className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
              style={{
                transform: mode === 'login' ? 'translate3d(0, 0%, 0)' : 'translate3d(0, -50%, 0)',
              }}
            >
              <h1 className="h-7 flex items-center justify-center text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text)]">
                Welcome back
              </h1>
              <h1 className="h-7 flex items-center justify-center text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text)]">
                Create your account
              </h1>
            </div>
          </div>
          <div className="relative mt-0.5 h-4 overflow-hidden">
            <div
              className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
              style={{
                transform: mode === 'login' ? 'translate3d(0, 0%, 0)' : 'translate3d(0, -50%, 0)',
              }}
            >
              <p className="h-4 flex items-center justify-center text-xs text-[var(--text-muted)]">
                Sign in to your diagrams and workspace
              </p>
              <p className="h-4 flex items-center justify-center text-xs text-[var(--text-muted)]">
                Start crafting diagrams from markdown in seconds
              </p>
            </div>
          </div>
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
          contentClassName="p-4 sm:p-5 sm:px-6 block overflow-hidden"
        >
          {/* Animated sliding tab switcher */}
          <div className="w-full max-w-[320px] mx-auto mb-3 sm:mb-4">
            <AuthTabs activeMode={mode} onModeChange={handleModeChange} />
          </div>

          {/* Unified layout: Left drawer panel + Form */}
          <div className="flex flex-col sm:flex-row items-stretch justify-center">
            {/* Left Column (Desktop): 4 minimal points, 1 sentence each in big fonts */}
            <div
              className={`hidden sm:flex transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                isSignup
                  ? 'sm:w-[320px] sm:opacity-100 sm:pr-6 sm:mr-6 sm:border-r sm:border-[var(--border)]/50 pointer-events-auto'
                  : 'sm:w-0 sm:opacity-0 sm:pr-0 sm:mr-0 sm:border-r-0 pointer-events-none'
              }`}
            >
              <div className="w-[290px] shrink-0 h-full flex flex-col justify-between py-0.5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
                    Why Merlin?
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium mt-1 mb-3 leading-snug">
                    Turn ideas and code into production diagrams in seconds.
                  </p>
                </div>

                <ul className="space-y-2.5 sm:space-y-3">
                  {MERLIN_PERKS.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-1.5"
                        aria-hidden="true"
                      />
                      <span className="text-[13px] sm:text-[13.5px] font-medium text-[var(--text)] leading-snug">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3.5 pt-3 border-t border-[var(--border)]/50 flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>Supported formats</span>
                  <span className="font-mono text-xs text-[var(--text)] tracking-wider">SVG &bull; PNG &bull; JPEG</span>
                </div>
              </div>
            </div>

            {/* Right Column (or Center in Login): Unified Auth Form */}
            <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center">
              <GoogleButton
                onError={(err) => setError(err)}
                disabled={loading}
                text={mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
              />

              <div className="my-3 sm:my-3.5 flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-xs text-[var(--text-muted)]">or</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>

              <EmailPasswordForm
                mode={mode}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            </div>
          </div>

          {/* Mobile-only minimal 1-sentence points for signup */}
          <div
            className={`sm:hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
              isSignup ? 'max-h-60 opacity-100 mt-5 pt-3.5 border-t border-[var(--border)]/40' : 'max-h-0 opacity-0 mt-0 pt-0 border-t-0 pointer-events-none'
            }`}
          >
            <p className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider mb-2">
              Why Merlin?
            </p>
            <ul className="space-y-2 px-1 text-xs text-[var(--text)]">
              {MERLIN_PERKS.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <span className="leading-snug">{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2.5 pt-2 border-t border-[var(--border)]/40 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
              <span>Supported formats</span>
              <span className="font-mono text-[11px] text-[var(--text)] tracking-wider">SVG &bull; PNG &bull; JPEG</span>
            </div>
          </div>
        </GlassSurface>

        {/* Footer Mode Switcher with synchronized vertical roll */}
        <div className="relative mt-3 sm:mt-4 h-5 overflow-hidden text-center text-xs sm:text-sm text-[var(--text-muted)]">
          <div
            className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
            style={{
              transform: mode === 'login' ? 'translate3d(0, 0%, 0)' : 'translate3d(0, -50%, 0)',
            }}
          >
            <div className="h-5 flex items-center justify-center">
              <span>Don&apos;t have an account?&nbsp;</span>
              <button
                type="button"
                onClick={() => handleModeChange('signup')}
                className="text-[var(--accent)] hover:underline font-medium cursor-pointer"
              >
                Create free account
              </button>
            </div>
            <div className="h-5 flex items-center justify-center">
              <span>Already have an account?&nbsp;</span>
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="text-[var(--accent)] hover:underline font-medium cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
