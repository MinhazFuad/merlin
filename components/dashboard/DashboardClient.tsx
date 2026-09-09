'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DiagramGrid } from './DiagramGrid'
import { createClient } from '@/lib/supabase/client'
import { DIAGRAM_TEMPLATES } from '@/lib/constants'
import type { User } from '@supabase/supabase-js'
import { Plus, Search, LogOut, LayoutGrid } from 'lucide-react'

interface Diagram {
  id: string
  title: string
  code: string
  theme: string
  is_public: boolean
  share_slug: string | null
  created_at: string
  updated_at: string
}

interface DashboardClientProps {
  user: User
  initialDiagrams: Diagram[]
}

export function DashboardClient({ user, initialDiagrams }: DashboardClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [diagrams, setDiagrams] = useState<Diagram[]>(initialDiagrams)
  const [search, setSearch] = useState('')
  const [templateOpen, setTemplateOpen] = useState(false)

  const filtered = diagrams.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  )

  async function handleDelete(id: string) {
    await supabase.from('diagrams').delete().eq('id', id)
    setDiagrams((prev) => prev.filter((d) => d.id !== id))
  }

  async function handleDuplicate(diagram: Diagram) {
    const { data } = await supabase
      .from('diagrams')
      .insert({
        user_id: user.id,
        title: `${diagram.title} (copy)`,
        code: diagram.code,
        theme: diagram.theme,
      })
      .select('id, title, code, theme, is_public, share_slug, created_at, updated_at')
      .single()
    if (data) setDiagrams((prev) => [data, ...prev])
  }

  async function handleRename(id: string, newTitle: string) {
    await supabase.from('diagrams').update({ title: newTitle }).eq('id', id)
    setDiagrams((prev) => prev.map((d) => d.id === id ? { ...d, title: newTitle } : d))
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function createFromTemplate(code: string, title: string) {
    const { data } = await supabase
      .from('diagrams')
      .insert({ user_id: user.id, title, code })
      .select('id, title, code, theme, is_public, share_slug, created_at, updated_at')
      .single()
    if (data) {
      router.push(`/editor/${data.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="font-semibold text-sm tracking-tight">Merlin</Link>
          <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
            <span>/</span>
            <span className="flex items-center gap-1.5">
              <LayoutGrid size={14} />
              My diagrams
            </span>
          </div>
          <div className="flex-1" />
          <span className="text-xs text-[var(--text-muted)] hidden sm:block">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Actions row */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search diagrams…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            />
          </div>
          <div className="flex-1" />

          {/* New from template */}
          <div className="relative">
            <button
              onClick={() => setTemplateOpen(!templateOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] transition-colors"
            >
              <Plus size={14} />
              From template
            </button>
            {templateOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg p-1.5 z-50 max-h-80 overflow-y-auto">
                {DIAGRAM_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { createFromTemplate(t.code, t.label); setTemplateOpen(false) }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--paper-100)] transition-colors"
                  >
                    <span className="font-medium block">{t.label}</span>
                    <span className="text-xs text-[var(--text-muted)]">{t.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/editor"
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg font-medium transition-colors"
          >
            <Plus size={14} />
            New diagram
          </Link>
        </div>

        <DiagramGrid
          diagrams={filtered}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onRename={handleRename}
        />
      </main>
    </div>
  )
}
