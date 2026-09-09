'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { PreviewPane } from '@/components/editor/PreviewPane'
import { ExportMenu } from '@/components/editor/ExportMenu'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { Copy } from 'lucide-react'

interface Diagram {
  id: string
  title: string
  code: string
  theme: string
  share_slug: string | null
}

interface SharedViewProps {
  diagram: Diagram
  user: User | null
}

export function SharedView({ diagram, user }: SharedViewProps) {
  const router = useRouter()
  const supabase = createClient()
  const svgRef = useRef<SVGSVGElement | null>(null)

  const getSvg = () => document.querySelector<SVGSVGElement>('.mermaid-preview svg')

  async function handleDuplicate() {
    if (!user) {
      router.push('/login')
      return
    }
    const { data } = await supabase
      .from('diagrams')
      .insert({ user_id: user.id, title: diagram.title, code: diagram.code, theme: diagram.theme })
      .select('id')
      .single()
    if (data) router.push(`/editor/${data.id}`)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--bg)]">
      {/* Header */}
      <header className="h-12 border-b border-[var(--border)] bg-[var(--surface)] flex items-center gap-3 px-4 shrink-0">
        <Link href="/" className="font-semibold text-sm tracking-tight">Merlin</Link>
        <span className="text-[var(--text-muted)] text-sm">/</span>
        <span className="text-sm font-medium truncate max-w-xs">{diagram.title}</span>
        <div className="flex-1" />
        <ExportMenu getSvgElement={getSvg} filename={diagram.title} />
        <button
          onClick={handleDuplicate}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] transition-colors"
        >
          <Copy size={14} />
          {user ? 'Duplicate to my account' : 'Sign in to duplicate'}
        </button>
      </header>

      {/* Preview (read-only, full-screen) */}
      <div className="flex-1 overflow-hidden">
        <PreviewPane code={diagram.code} theme={diagram.theme} readOnly />
      </div>
    </div>
  )
}
