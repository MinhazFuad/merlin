'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DiagramCard } from './DiagramCard'
import { FileX2 } from 'lucide-react'

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

interface DiagramGridProps {
  diagrams: Diagram[]
  onDelete: (id: string) => void
  onDuplicate: (diagram: Diagram) => void
  onRename: (id: string, title: string) => void
}

export function DiagramGrid({ diagrams, onDelete, onDuplicate, onRename }: DiagramGridProps) {
  if (diagrams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <FileX2 size={40} className="text-[var(--text-muted)] mb-4 opacity-40" />
        <p className="text-[var(--text-muted)] text-sm mb-4">No diagrams yet</p>
        <Link
          href="/editor"
          className="text-sm text-[var(--accent)] hover:underline font-medium"
        >
          Create your first diagram →
        </Link>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {diagrams.map((d) => (
        <DiagramCard
          key={d.id}
          diagram={d}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onRename={onRename}
        />
      ))}
    </div>
  )
}
