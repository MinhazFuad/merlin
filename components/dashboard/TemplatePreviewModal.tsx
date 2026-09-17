'use client'

import { useEffect, useState } from 'react'
import { renderToSvg } from '@/lib/mermaid/render'
import type { DiagramTemplateItem } from '@/lib/constants'
import {
  X,
  Code2,
  Eye,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react'

interface TemplatePreviewModalProps {
  template: DiagramTemplateItem | null
  onClose: () => void
  onUseTemplate: (template: DiagramTemplateItem) => Promise<void>
  isCreating: boolean
}

export function TemplatePreviewModal({
  template,
  onClose,
  onUseTemplate,
  isCreating,
}: TemplatePreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [svgHtml, setSvgHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  // Render SVG whenever the selected template changes
  useEffect(() => {
    if (!template) {
      setSvgHtml('')
      return
    }

    let isMounted = true
    setLoading(true)

    async function loadPreview() {
      try {
        const svg = await renderToSvg(
          template!.code,
          `modal-preview-${template!.id}`,
          { bg: 'dark', lineColor: '#ffffff' }
        )
        if (isMounted) {
          setSvgHtml(svg)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadPreview()
    return () => {
      isMounted = false
    }
  }, [template])

  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!template) return null

  async function handleCopyCode() {
    if (!template) return
    await navigator.clipboard.writeText(template.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--paper-50)]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/20">
              {template.badge}
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--text)]">
                {template.label}
              </h2>
              <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                {template.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex items-center bg-[var(--paper-200)] p-0.5 rounded-lg border border-[var(--border)]">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <Eye size={13} />
                Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'code'
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <Code2 size={13} />
                Mermaid Code
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--paper-200)] transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto min-h-[380px] p-6 bg-[var(--bg)] flex items-center justify-center">
          {activeTab === 'preview' ? (
            <div className="w-full h-full min-h-[340px] flex items-center justify-center">
              {loading ? (
                <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
                  <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
                  <span className="text-xs">Rendering diagram preview…</span>
                </div>
              ) : svgHtml ? (
                <div
                  className="mermaid-preview w-full flex items-center justify-center max-h-[55vh] overflow-auto p-6 bg-[#121214] border border-[var(--border)] rounded-xl shadow-xs"
                  style={{ '--mermaid-line-color': '#ffffff' } as React.CSSProperties}
                  dangerouslySetInnerHTML={{ __html: svgHtml }}
                />
              ) : (
                <p className="text-sm text-[var(--text-muted)]">
                  Preview not available for this template.
                </p>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  mermaid syntax
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] py-1 px-2 rounded hover:bg-[var(--paper-200)] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="flex-1 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--text)] overflow-auto max-h-[50vh] leading-relaxed select-all">
                {template.code}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)] bg-[var(--surface)]">
          <p className="text-xs text-[var(--text-muted)] hidden sm:block">
            Creates a new diagram in your account with this starter code.
          </p>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onUseTemplate(template)}
              disabled={isCreating}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-lg shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating diagram…
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Use this template
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
