'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2, LogIn, Sparkles } from 'lucide-react'
import {
  MAX_EMAIL_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  loginSchema,
  signupSchema,
} from '@/lib/validators/auth'

interface EmailPasswordFormProps {
  mode: 'login' | 'signup'
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>
  loading: boolean
  error: string | null
}

export function EmailPasswordForm({
  mode,
  onSubmit,
  loading,
  error,
}: EmailPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setValidationError(null)

    const schema = mode === 'signup' ? signupSchema : loginSchema
    const validation = schema.safeParse({ email, password })

    if (!validation.success) {
      setValidationError(validation.error.issues[0]?.message ?? 'Please check your inputs.')
      return
    }

    await onSubmit(validation.data)
  }

  const displayError = validationError || error

  return (
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
            if (validationError) setValidationError(null)
          }}
          placeholder="you@example.com"
          className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-[var(--text)]">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={mode === 'signup' ? MIN_PASSWORD_LENGTH : 1}
            maxLength={MAX_PASSWORD_LENGTH}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (validationError) setValidationError(null)
            }}
            placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
            className="w-full px-3 py-2 pr-10 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div
          className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
            mode === 'signup' ? 'max-h-8 opacity-100 mt-1.5' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
          }`}
        >
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
            Must be at least 8 characters
          </p>
        </div>
      </div>

      {displayError && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
          {displayError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : mode === 'login' ? (
          <LogIn size={16} />
        ) : (
          <Sparkles size={16} />
        )}
        <span>{mode === 'login' ? 'Sign in' : 'Create free account'}</span>
      </button>

      <div
        className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
          mode === 'signup' ? 'max-h-12 opacity-100 pt-0.5' : 'max-h-0 opacity-0 pt-0 pointer-events-none'
        }`}
      >
        <p className="text-[11px] leading-relaxed text-center text-[var(--text-muted)]">
          By continuing, you agree to Merlin&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>
    </form>
  )
}
