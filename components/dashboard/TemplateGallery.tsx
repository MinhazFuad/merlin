'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  DIAGRAM_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type DiagramTemplateItem,
  type TemplateCategoryId,
} from '@/lib/constants'
import { renderToSvg } from '@/lib/mermaid/render'
import { TemplatePreviewModal } from './TemplatePreviewModal'
import {
  Plus,
  Search,
  Eye,
  ArrowRight,
  Sparkles,
  Layers,
  GitFork,
  Network,
  Calendar,
  PieChart as PieIcon,
  X,
  Loader2,
} from 'lucide-react'

interface TemplateGalleryProps {
  mode?: 'page' | 'modal'
  onSelectTemplate: (template: DiagramTemplateItem) => Promise<void>
  onCloseModal?: () => void
  isCreating?: boolean
}

export function TemplateGallery({
  mode = 'page',
  onSelectTemplate,
  onCloseModal,
  isCreating = false,
}: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategoryId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [previewTemplate, setPreviewTemplate] = useState<DiagramTemplateItem | null>(null)

  // Filter templates by category and search
  const filteredTemplates = DIAGRAM_TEMPLATES.filter((t) => {
    const matchesCategory =
      selectedCategory === 'all' || t.category === selectedCategory
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch =
      query === '' ||
      t.label.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.badge.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })

  // Category counts
  const getCategoryCount = (catId: TemplateCategoryId) => {
    if (catId === 'all') return DIAGRAM_TEMPLATES.length
    return DIAGRAM_TEMPLATES.filter((t) => t.category === catId).length
  }

  const getCategoryIcon = (catId: TemplateCategoryId) => {
    switch (catId) {
      case 'flows':
        return <GitFork size={14} />
      case 'architecture':
        return <Network size={14} />
      case 'planning':
        return <Calendar size={14} />
      case 'analytics':
        return <PieIcon size={14} />
      default:
        return <Layers size={14} />
    }
  }

  return (
    <div className={mode === 'modal' ? 'p-6 max-h-[85vh] overflow-y-auto' : 'w-full'}>
      {/* Header section (different styles depending on mode) */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[var(--accent-muted)] text-[var(--accent)]">
                <Sparkles size={14} />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">
                {mode === 'modal' ? 'Template Explorer' : 'Explore Starter Templates'}
              </h2>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xl">
              Jumpstart your diagram with curated, industry-standard blueprints.
              Select any chart type below to preview or start editing immediately.
            </p>
          </div>

          {mode === 'modal' && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--paper-100)] transition-colors"
              aria-label="Close template modal"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Category tabs & Search bar */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {TEMPLATE_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[var(--text)] text-[var(--bg)] shadow-xs font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--paper-100)]'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  {cat.label}
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                      active
                        ? 'bg-[var(--bg)]/20 text-[var(--bg)]'
                        : 'bg-[var(--border)] text-[var(--text-muted)]'
                    }`}
                  >
                    {getCategoryCount(cat.id)}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search within templates */}
          <div className="relative min-w-[220px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter templates…"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-[var(--text)] placeholder:text-[var(--text-muted)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Blank Canvas Tile (Always first when in All or Flows) */}
        {(selectedCategory === 'all' || selectedCategory === 'flows') && !searchQuery && (
          <div className="group flex flex-col justify-between border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] rounded-xl p-5 bg-[var(--surface)]/50 hover:bg-[var(--surface)] transition-all">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[var(--paper-100)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:bg-[var(--accent-muted)] transition-colors mb-4">
                <Plus size={20} />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text)] mb-1">
                Blank Canvas
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Start from a clean slate and type custom Mermaid syntax with live rendering.
              </p>
            </div>
            <Link
              href="/editor"
              className="mt-6 flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] text-[var(--text)] transition-colors"
            >
              Open empty editor
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Template Cards */}
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onPreview={() => setPreviewTemplate(template)}
            onUse={() => onSelectTemplate(template)}
            isCreating={isCreating}
          />
        ))}
      </div>

      {/* No results from search */}
      {filteredTemplates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-[var(--text)] mb-1">
            No templates found matching &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Try searching for other terms like &ldquo;sequence&rdquo;, &ldquo;flow&rdquo;, or &ldquo;database&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="text-xs text-[var(--accent)] hover:underline font-medium"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Quick-Look Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={onSelectTemplate}
        isCreating={isCreating}
      />
    </div>
  )
}

interface TemplateCardProps {
  template: DiagramTemplateItem
  onPreview: () => void
  onUse: () => void
  isCreating: boolean
}

function TemplateCard({
  template,
  onPreview,
  onUse,
  isCreating,
}: TemplateCardProps) {
  const [svg, setSvg] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Render thumbnail on mount
  useEffect(() => {
    let isMounted = true

    async function loadThumb() {
      try {
        const rendered = await renderToSvg(
          template.code,
          `thumb-${template.id}`,
          { bg: 'dark', lineColor: '#ffffff' }
        )
        if (isMounted) {
          setSvg(rendered)
          setLoading(false)
        }
      } catch {
        if (isMounted) setLoading(false)
      }
    }

    loadThumb()
    return () => {
      isMounted = false
    }
  }, [template.code, template.id])

  return (
    <div className="group flex flex-col border border-[var(--border)] rounded-xl bg-[var(--surface)] overflow-hidden hover:border-[var(--ink-300)] hover:shadow-xs transition-all">
      {/* Thumbnail visual with interactive overlay */}
      <div
        onClick={onPreview}
        className="relative h-36 bg-[#121214] flex items-center justify-center overflow-hidden p-3 cursor-pointer border-b border-[var(--border)] select-none"
        style={{ '--mermaid-line-color': '#ffffff' } as React.CSSProperties}
        title="Click to preview"
      >
        {loading ? (
          <div className="flex items-center justify-center w-full h-full text-[var(--text-muted)]">
            <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : svg ? (
          <div
            className="mermaid-preview w-full h-full flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200"
            dangerouslySetInnerHTML={{ __html: svg }}
            style={{ transform: 'scale(0.48)', transformOrigin: 'center center' }}
          />
        ) : (
          <div className="w-full h-full bg-[var(--paper-200)] rounded flex items-center justify-center text-xs text-[var(--text-muted)]">
            Preview
          </div>
        )}

        {/* Hover preview pill */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <span className="flex items-center gap-1 text-[11px] font-medium bg-[var(--surface)] text-[var(--text)] px-2.5 py-1 rounded-full shadow-sm border border-[var(--border)]">
            <Eye size={12} />
            Quick Preview
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--paper-200)] text-[var(--text-muted)]">
              {template.badge}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-[var(--text)] line-clamp-1 mb-1">
            {template.label}
          </h4>
          <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
          <button
            onClick={onPreview}
            className="p-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--paper-100)] rounded-md transition-colors"
            title="Inspect code and preview"
          >
            <Eye size={14} />
          </button>

          <button
            onClick={onUse}
            disabled={isCreating}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
          >
            Use template
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
