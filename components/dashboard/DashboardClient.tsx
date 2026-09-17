'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DiagramGrid } from './DiagramGrid'
import { TemplateGallery } from './TemplateGallery'
import Cubes from './Cubes'
import { createClient } from '@/lib/supabase/client'
import type { DiagramTemplateItem } from '@/lib/constants'
import type { User } from '@supabase/supabase-js'
import {
  Plus,
  Search,
  LogOut,
  LayoutGrid,
  Sparkles,
  Loader2,
} from 'lucide-react'

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
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)

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
    setDiagrams((prev) =>
      prev.map((d) => (d.id === id ? { ...d, title: newTitle } : d))
    )
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleCreateFromTemplate(template: DiagramTemplateItem) {
    setIsCreatingTemplate(true)
    try {
      const { data, error } = await supabase
        .from('diagrams')
        .insert({
          user_id: user.id,
          title: template.label,
          code: template.code,
          theme: 'default',
        })
        .select('id, title, code, theme, is_public, share_slug, created_at, updated_at')
        .single()

      if (error) {
        console.error('Error creating template diagram:', error)
        setIsCreatingTemplate(false)
        return
      }

      if (data) {
        setIsTemplateModalOpen(false)
        router.push(`/editor/${data.id}`)
      }
    } catch (err) {
      console.error(err)
      setIsCreatingTemplate(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col relative overflow-x-hidden">
      {/* Subtle 3D Cubes Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-35 dark:opacity-25"
        style={{
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 85%)',
        }}
        aria-hidden="true"
      >
        <div className="w-[110vw] h-[110vh] max-w-[1500px] max-h-[1500px] flex items-center justify-center">
          <Cubes
            gridSize={10}
            maxAngle={28}
            radius={3.5}
            borderStyle="1px solid var(--border)"
            faceColor="transparent"
            rippleColor="rgba(37, 99, 235, 0.18)"
            rippleSpeed={1.5}
            autoAnimate={true}
            rippleOnClick={false}
          />
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="font-semibold text-sm tracking-tight text-[var(--text)] hover:opacity-80 transition-opacity"
          >
            Merlin
          </Link>
          <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
            <span>/</span>
            <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
              <LayoutGrid size={14} />
              My diagrams
            </span>
          </div>

          <div className="flex-1" />

          {diagrams.length > 0 && (
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] text-[var(--text)] transition-colors cursor-pointer mr-2"
            >
              <Sparkles size={13} className="text-[var(--accent)]" />
              Templates
            </button>
          )}

          <span className="text-xs text-[var(--text-muted)] hidden sm:block mr-2">
            {user.email}
          </span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 relative z-10">
        {/* Only show top search & action bar when user actually has diagrams */}
        {diagrams.length > 0 && (
          <div className="flex items-center gap-3 mb-8">
            <div className="relative flex-1 max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search diagrams…"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)] placeholder:text-[var(--text-muted)]"
              />
            </div>
            <div className="flex-1" />

            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] text-[var(--text)] font-medium transition-colors cursor-pointer"
            >
              <Sparkles size={14} className="text-[var(--accent)]" />
              Explore templates
            </button>

            <Link
              href="/editor"
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg font-medium transition-colors cursor-pointer"
            >
              <Plus size={15} />
              New diagram
            </Link>
          </div>
        )}

        <DiagramGrid
          diagrams={filtered}
          totalDiagramsCount={diagrams.length}
          searchQuery={search}
          onClearSearch={() => setSearch('')}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onRename={handleRename}
          onSelectTemplate={handleCreateFromTemplate}
          isCreating={isCreatingTemplate}
        />
      </main>

      {/* Modal for browsing templates when user already has diagrams */}
      {isTemplateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsTemplateModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <TemplateGallery
              mode="modal"
              onSelectTemplate={handleCreateFromTemplate}
              onCloseModal={() => setIsTemplateModalOpen(false)}
              isCreating={isCreatingTemplate}
            />
          </div>
        </div>
      )}
    </div>
  )
}
