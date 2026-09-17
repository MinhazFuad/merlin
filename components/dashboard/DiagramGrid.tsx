'use client'

import { DiagramCard } from './DiagramCard'
import { TemplateGallery } from './TemplateGallery'
import type { DiagramTemplateItem } from '@/lib/constants'
import { SearchX } from 'lucide-react'

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
  totalDiagramsCount: number
  searchQuery: string
  onClearSearch: () => void
  onDelete: (id: string) => void
  onDuplicate: (diagram: Diagram) => void
  onRename: (id: string, title: string) => void
  onSelectTemplate: (template: DiagramTemplateItem) => Promise<void>
  isCreating?: boolean
}

export function DiagramGrid({
  diagrams,
  totalDiagramsCount,
  searchQuery,
  onClearSearch,
  onDelete,
  onDuplicate,
  onRename,
  onSelectTemplate,
  isCreating = false,
}: DiagramGridProps) {
  // Case 1: Account has 0 diagrams -> Render rich category-wise Template Gallery
  if (totalDiagramsCount === 0) {
    return (
      <TemplateGallery
        mode="page"
        onSelectTemplate={onSelectTemplate}
        isCreating={isCreating}
      />
    )
  }

  // Case 2: Account has diagrams, but search query returned 0 matches
  if (diagrams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--paper-200)] flex items-center justify-center text-[var(--text-muted)] mb-3">
          <SearchX size={22} />
        </div>
        <p className="text-sm font-semibold text-[var(--text)] mb-1">
          No diagrams found matching &ldquo;{searchQuery}&rdquo;
        </p>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          Check your spelling or clear your search to view all your diagrams.
        </p>
        <button
          onClick={onClearSearch}
          className="text-xs font-medium text-[var(--accent)] hover:underline cursor-pointer"
        >
          Clear search filter
        </button>
      </div>
    )
  }

  // Case 3: User has diagrams matching current filter
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
