'use client'

import { useState, useRef, useEffect } from 'react'
import {
  DIAGRAM_TEMPLATES,
  TEMPLATE_CATEGORIES,
  DEFAULT_DIAGRAM_CODE,
  type DiagramTemplateItem,
  type TemplateCategoryId,
} from '@/lib/constants'
import { useEditorStore } from '@/store/editorStore'
import {
  LayoutTemplate,
  ChevronDown,
  Search,
  AlertTriangle,
  Layers,
  GitFork,
  Network,
  Calendar,
  PieChart as PieIcon,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export function TemplatePicker() {
  const { code, isDirty, setCode, setTitle, showToast } = useEditorStore()

  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategoryId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmTemplate, setConfirmTemplate] = useState<DiagramTemplateItem | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on click outside or Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
        setConfirmTemplate(null)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        setConfirmTemplate(null)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  // Filter templates
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

  function handleSelectTemplate(template: DiagramTemplateItem) {
    // If the user has modified code that is different from default, prompt confirmation
    const hasCustomCode = isDirty && code.trim() !== '' && code.trim() !== DEFAULT_DIAGRAM_CODE.trim()
    if (hasCustomCode) {
      setConfirmTemplate(template)
    } else {
      applyTemplate(template)
    }
  }

  function applyTemplate(template: DiagramTemplateItem) {
    setCode(template.code)
    setTitle(template.label)
    showToast(`Template applied: ${template.label}`)
    setConfirmTemplate(null)
    setOpen(false)
  }

  const getCategoryIcon = (catId: TemplateCategoryId) => {
    switch (catId) {
      case 'flows':
        return <GitFork size={12} />
      case 'architecture':
        return <Network size={12} />
      case 'planning':
        return <Calendar size={12} />
      case 'analytics':
        return <PieIcon size={12} />
      default:
        return <Layers size={12} />
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          setOpen(!open)
          setConfirmTemplate(null)
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] transition-colors cursor-pointer"
        title="Insert starter templates (replaces current design)"
      >
        <LayoutTemplate size={14} />
        <span>Templates</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Modern Templates Popover */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[440px] max-w-[92vw] bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 text-[var(--text)]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[var(--accent-muted)] text-[var(--accent)]">
                <Sparkles size={14} />
              </span>
              <div>
                <h3 className="text-xs font-bold text-[var(--text)]">
                  Diagram Templates
                </h3>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {DIAGRAM_TEMPLATES.length} blueprints from template gallery
                </span>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 rounded-md transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Replacement Notice Banner */}
          <div className="mb-3 p-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-500" />
            <div className="leading-tight">
              <span className="font-semibold block mb-0.5">
                Replaces current design
              </span>
              <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90">
                Selecting a template will insert it into the editor and replace your existing diagram code.
              </p>
            </div>
          </div>

          {/* Confirmation Overlay when user has unsaved work */}
          {confirmTemplate ? (
            <div className="p-3.5 bg-[var(--paper-100)] border border-amber-500/30 rounded-xl my-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[var(--text)]">
                    Overwrite current diagram?
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    Inserting <strong className="text-[var(--text)]">{confirmTemplate.label}</strong> will replace all code and unsaved changes currently in the editor.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-[var(--border)]">
                <button
                  onClick={() => setConfirmTemplate(null)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => applyTemplate(confirmTemplate)}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer shadow-xs"
                >
                  <span>Replace & Insert</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Search input */}
              <div className="relative mb-2.5">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates (flowchart, sequence, ERD, gantt...)"
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-[var(--paper-100)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] text-[var(--text)] placeholder:text-[var(--text-muted)]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-2.5 scrollbar-none">
                {TEMPLATE_CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                        active
                          ? 'bg-[var(--accent)] text-white font-semibold shadow-2xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--paper-100)] border border-transparent'
                      }`}
                    >
                      {getCategoryIcon(cat.id)}
                      <span>{cat.label.split(' ')[0]}</span>
                    </button>
                  )
                })}
              </div>

              {/* Template Items List */}
              <div className="max-h-72 overflow-y-auto space-y-1.5 pr-0.5">
                {filteredTemplates.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[var(--text-muted)]">
                    No templates found matching &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  filteredTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTemplate(t)}
                      className="w-full group text-left p-2.5 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--paper-100)] transition-all cursor-pointer flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-[var(--paper-200)] text-[var(--text-muted)]">
                            {t.badge}
                          </span>
                          <span className="text-xs font-semibold text-[var(--text)] truncate">
                            {t.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                          {t.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-medium text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-0.5">
                        <span>Insert</span>
                        <ArrowRight size={12} />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
