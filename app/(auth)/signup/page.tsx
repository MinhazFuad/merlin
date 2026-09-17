'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { EmailPasswordForm } from '@/components/auth/EmailPasswordForm'
import Plasma from '@/components/landing/Plasma'
import GlassSurface from '@/components/landing/GlassSurface'

export default function SignupPage() {
  const router = useRouter()
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
    const { data, error: signUpError } = await supabase.auth.signUp({
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
          <Link href="/" className="font-semibold text-xl tracking-tight text-[var(--text)] hover:opacity-85 transition-opacity">
            Merlin
          </Link>
          <p className="text-sm text-[var(--text-muted)] mt-1.5">Create your account</p>
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
        </GlassSurface>

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

