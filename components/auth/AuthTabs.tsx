'use client'

import { LogIn, UserPlus } from 'lucide-react'

interface AuthTabsProps {
  activeMode: 'login' | 'signup'
  onModeChange: (mode: 'login' | 'signup') => void
}

export function AuthTabs({ activeMode, onModeChange }: AuthTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Authentication mode"
      className="relative flex p-1 bg-[var(--bg)]/70 backdrop-blur-xs border border-[var(--border)] rounded-xl mb-6 shadow-inner select-none overflow-hidden"
    >
      {/* GPU-composited sliding indicator pill */}
      <div
        className="absolute inset-y-1 rounded-lg bg-[var(--surface)] shadow-xs border border-[var(--border)]/60 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none will-change-transform"
        style={{
          width: 'calc(50% - 4px)',
          transform: activeMode === 'signup' ? 'translate3d(100%, 0, 0)' : 'translate3d(0%, 0, 0)',
          left: '4px',
        }}
        aria-hidden="true"
      />

      <button
        type="button"
        role="tab"
        aria-selected={activeMode === 'login'}
        onClick={() => onModeChange('login')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm rounded-lg transition-colors duration-200 cursor-pointer ${
          activeMode === 'login'
            ? 'text-[var(--text)] font-semibold'
            : 'text-[var(--text-muted)] hover:text-[var(--text)] font-medium'
        }`}
      >
        <LogIn
          size={15}
          className={`transition-colors duration-200 ${
            activeMode === 'login' ? 'text-[var(--text)]' : 'opacity-60'
          }`}
        />
        <span>Sign in</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeMode === 'signup'}
        onClick={() => onModeChange('signup')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm rounded-lg transition-colors duration-200 cursor-pointer ${
          activeMode === 'signup'
            ? 'text-[var(--text)] font-semibold'
            : 'text-[var(--text-muted)] hover:text-[var(--text)] font-medium'
        }`}
      >
        <UserPlus
          size={15}
          className={`transition-colors duration-200 ${
            activeMode === 'signup' ? 'text-[var(--text)]' : 'opacity-60'
          }`}
        />
        <span>Create account</span>
      </button>
    </div>
  )
}
