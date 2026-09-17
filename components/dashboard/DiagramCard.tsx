'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { renderToSvg } from '@/lib/mermaid/render'
import {
  MoreHorizontal, Edit3, Copy, Trash2, Share2, Globe, Lock
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

interface DiagramCardProps {
  diagram: Diagram
  onDelete: (id: string) => void
  onDuplicate: (diagram: Diagram) => void
  onRename: (id: string, title: string) => void
}

export function DiagramCard({ diagram, onDelete, onDuplicate, onRename }: DiagramCardProps) {
  const [svg, setSvg] = useState<string>('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [newTitle, setNewTitle] = useState(diagram.title)
  const renameRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Render preview SVG on mount
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const result = await renderToSvg(diagram.code, `card-${diagram.id}`, {
          bg: 'dark',
          lineColor: '#ffffff',
        })
        if (!cancelled) setSvg(result)
      } catch {
        // invalid diagram — no preview
      }
    }
    load()
    return () => { cancelled = true }
  }, [diagram.id, diagram.code, diagram.theme])

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  function startRename() {
    setMenuOpen(false)
    setRenaming(true)
    setTimeout(() => renameRef.current?.focus(), 10)
  }

  function commitRename() {
    const trimmed = newTitle.trim()
    if (trimmed && trimmed !== diagram.title) onRename(diagram.id, trimmed)
    setRenaming(false)
  }

  const updatedAt = formatDistanceToNow(new Date(diagram.updated_at), { addSuffix: true })

  return (
    <div className="group border border-[var(--border)] rounded-xl bg-[var(--surface)] overflow-hidden hover:border-[var(--ink-300)] transition-colors">
      {/* Preview thumbnail */}
      <Link href={`/editor/${diagram.id}`} className="block">
        <div
          className="h-36 bg-[#121214] flex items-center justify-center overflow-hidden p-3 border-b border-[var(--border)]"
          style={{ '--mermaid-line-color': '#ffffff' } as React.CSSProperties}
        >
          {svg ? (
            <div
              className="mermaid-preview w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svg }}
              style={{ transform: 'scale(0.5)', transformOrigin: 'center center' }}
            />
          ) : (
            <div className="w-full h-full bg-[var(--paper-200)] rounded animate-pulse" />
          )}
        </div>
      </Link>

      {/* Card body */}
      <div className="px-3 py-3">
        {renaming ? (
          <input
            ref={renameRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') { setNewTitle(diagram.title); setRenaming(false) }
            }}
            className="w-full text-sm font-medium bg-transparent border-b border-[var(--accent)] focus:outline-none"
          />
        ) : (
          <p className="text-sm font-medium truncate">{diagram.title}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            {diagram.is_public ? (
              <Globe size={12} className="text-[var(--accent)]" />
            ) : (
              <Lock size={12} className="text-[var(--text-muted)]" />
            )}
            <span className="text-[11px] text-[var(--text-muted)]">{updatedAt}</span>
          </div>

          {/* Context menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen) }}
              className="p-1 rounded hover:bg-[var(--paper-100)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-1 w-40 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg p-1 z-50">
                <button onClick={startRename} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg hover:bg-[var(--paper-100)] transition-colors">
                  <Edit3 size={12} /> Rename
                </button>
                <button onClick={() => { onDuplicate(diagram); setMenuOpen(false) }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg hover:bg-[var(--paper-100)] transition-colors">
                  <Copy size={12} /> Duplicate
                </button>
                {diagram.share_slug && (
                  <Link href={`/s/${diagram.share_slug}`} target="_blank" className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg hover:bg-[var(--paper-100)] transition-colors">
                    <Share2 size={12} /> View shared
                  </Link>
                )}
                <div className="h-px bg-[var(--border)] my-1" />
                <button
                  onClick={() => { onDelete(diagram.id); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
