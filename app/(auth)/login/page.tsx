'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { EmailPasswordForm } from '@/components/auth/EmailPasswordForm'
import Plasma from '@/components/landing/Plasma'
import GlassSurface from '@/components/landing/GlassSurface'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      if (errorParam === 'auth_callback_failed') {
        setError('Authentication callback failed. Please try signing in again.')
      } else {
        setError(decodeURIComponent(errorParam))
      }
    }
  }, [searchParams])

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
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <Link href="/" className="font-semibold text-xl tracking-tight text-[var(--text)] hover:opacity-85 transition-opacity">
          Merlin
        </Link>
        <p className="text-sm text-[var(--text-muted)] mt-1.5">Sign in to your account</p>
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

        <div className="mt-3.5 flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-[var(--accent)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </GlassSurface>

      <p className="text-center text-sm text-[var(--text-muted)] mt-5">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[var(--accent)] hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
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
        <Suspense fallback={<div className="w-full max-w-sm h-80 bg-[var(--surface)]/60 backdrop-blur-md animate-pulse rounded-2xl" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

