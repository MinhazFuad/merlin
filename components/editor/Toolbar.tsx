'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEditorStore } from '@/store/editorStore'
import { createClient } from '@/lib/supabase/client'
import { ThemeSwitcher } from './ThemeSwitcher'
import { ExportMenu } from './ExportMenu'
import { TemplatePicker } from './TemplatePicker'
import { diagramSchema } from '@/lib/validators/diagram'
import {
  Save, Share2, Home, Loader2,
  CheckCircle, X, Keyboard, ArrowLeft, LayoutDashboard,
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface ToolbarProps {
  user: User | null
  svgRef: React.RefObject<SVGSVGElement | null>
}

export function Toolbar({ user, svgRef }: ToolbarProps) {
  const router = useRouter()
  const {
    title, setTitle, code, theme, diagramId,
    isDirty, isSaving, setSaving, setDirty, setDiagramId, setTitle: storeSetTitle,
    setCode, forceRender,
  } = useEditorStore()

  const [savedFlash, setSavedFlash] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [shareLoading, setShareLoading] = useState(false)
  const [showCheatsheet, setShowCheatsheet] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  const handleSave = useCallback(async () => {
    if (!user) {
      router.push('/login')
      return
    }

    const validation = diagramSchema.safeParse({ title, code, theme, is_public: false })
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? 'Validation error')
      return
    }

    setSaving(true)
    setError(null)

    try {
      if (diagramId) {
        const { error } = await supabase
          .from('diagrams')
          .update({ title, code, theme })
          .eq('id', diagramId)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('diagrams')
          .insert({ title, code, theme, user_id: user.id })
          .select('id')
          .single()
        if (error) throw error
        setDiagramId(data.id)
        router.replace(`/editor/${data.id}`)
      }
      setDirty(false)
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }, [user, title, code, theme, diagramId, supabase, setSaving, setDirty, setDiagramId, router])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === 's') { e.preventDefault(); handleSave() }
      if (mod && e.key === 'Enter') { e.preventDefault(); forceRender() }
      if (mod && e.key === '/') { e.preventDefault(); setShowCheatsheet((v) => !v) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSave, forceRender])

  async function handleShare() {
    if (!user || !diagramId) return
    setShareLoading(true)
    try {
      const res = await fetch('/api/diagrams/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagramId }),
      })
      const data = await res.json()
      if (data.slug) {
        setShareUrl(`${process.env.NEXT_PUBLIC_SITE_URL}/s/${data.slug}`)
      }
    } finally {
      setShareLoading(false)
    }
  }

  const getSvg = () => svgRef.current

  return (
    <header className="h-12 border-b border-[var(--border)] bg-[var(--surface)] flex items-center gap-2 px-3 shrink-0">
      {/* Logo / Home */}
      <Link href={user ? '/dashboard' : '/'} className="font-semibold text-sm tracking-tight text-[var(--text)] hover:opacity-80 transition-opacity">
        Merlin
      </Link>

      {/* Back to Dashboard Button for Logged-in User */}
      {user && (
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] text-[var(--text)] transition-colors cursor-pointer shrink-0 ml-1"
          title="Go back to My Diagrams dashboard"
        >
          <ArrowLeft size={12} className="text-[var(--text-muted)]" />
          <LayoutDashboard size={13} className="text-[var(--accent)]" />
          <span className="hidden sm:inline">My Diagrams</span>
        </Link>
      )}

      {/* Separator */}
      {user && <span className="text-[var(--border)] select-none">/</span>}

      {/* Title */}
      <input
        ref={titleRef}
        type="text"
        maxLength={200}
        value={title}
        onChange={(e) => storeSetTitle(e.target.value)}
        className="flex-1 min-w-0 max-w-xs text-sm bg-transparent border-b border-transparent hover:border-[var(--border)] focus:border-[var(--accent)] focus:outline-none px-1 py-0.5 truncate"
        placeholder="Untitled diagram"
        aria-label="Diagram title"
      />

      {/* Dirty indicator */}
      {isDirty && (
        <span className="text-[10px] text-[var(--text-muted)] shrink-0">unsaved</span>
      )}
      {savedFlash && (
        <CheckCircle size={14} className="text-green-500 shrink-0" />
      )}

      <div className="flex-1" />

      {/* Templates */}
      <TemplatePicker />

      <ThemeSwitcher />

      <ExportMenu getSvgElement={getSvg} filename={title || 'diagram'} />

      {/* Share */}
      {user && diagramId && (
        <button
          onClick={handleShare}
          disabled={shareLoading}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] transition-colors disabled:opacity-60"
        >
          {shareLoading ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
          Share
        </button>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg font-medium transition-colors disabled:opacity-60"
      >
        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {user ? 'Save' : 'Sign in to save'}
      </button>

      {/* Cheatsheet toggle */}
      <button
        onClick={() => setShowCheatsheet(!showCheatsheet)}
        className="p-1.5 border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] transition-colors"
        title="Keyboard shortcuts (⌘/)"
      >
        <Keyboard size={14} />
      </button>

      {/* Share URL toast */}
      {shareUrl && (
        <div className="absolute top-14 right-4 bg-[var(--surface)] border border-[var(--border)] shadow-lg rounded-xl p-4 z-50 max-w-xs">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-sm font-medium">Share link ready</p>
            <button onClick={() => setShareUrl(null)} className="text-[var(--text-muted)]">
              <X size={14} />
            </button>
          </div>
          <input
            readOnly
            value={shareUrl}
            className="w-full text-xs bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1.5 select-all"
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}

      {/* Cheatsheet panel */}
      {showCheatsheet && (
        <div className="absolute top-14 right-4 bg-[var(--surface)] border border-[var(--border)] shadow-lg rounded-xl p-4 z-50 w-64">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Keyboard shortcuts</p>
            <button onClick={() => setShowCheatsheet(false)} className="text-[var(--text-muted)]">
              <X size={14} />
            </button>
          </div>
          {[
            ['⌘S', 'Save diagram'],
            ['⌘Enter', 'Force re-render'],
            ['⌘/', 'Toggle this panel'],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-[var(--text-muted)]">{desc}</span>
              <kbd className="text-xs bg-[var(--paper-100)] border border-[var(--border)] rounded px-1.5 py-0.5 font-mono">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-500 text-xs rounded-lg px-3 py-2 z-50 shadow">
          {error}
        </div>
      )}
    </header>
  )
}
