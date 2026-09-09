'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit({ email, password })
  }

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            minLength={mode === 'signup' ? 8 : 1}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
            className="w-full px-3 py-2 pr-10 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
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
        {mode === 'login' ? 'Sign in' : 'Create account'}
      </button>
    </form>
  )
}
