'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Download,
  Image,
  FileCode,
  Clipboard,
  Check,
  ChevronDown,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react'
import {
  exportDiagram,
  copyToClipboard,
  type ExportFormat,
  type ExportBackground,
} from '@/lib/mermaid/export'
import { EXPORT_SCALES } from '@/lib/constants'
import { useEditorStore } from '@/store/editorStore'

interface ExportMenuProps {
  getSvgElement: () => SVGSVGElement | null
  filename?: string
}

const FORMATS: { id: ExportFormat; label: string; icon: React.ReactNode }[] = [
  { id: 'svg', label: 'SVG', icon: <FileCode size={13} /> },
  { id: 'png', label: 'PNG', icon: <Image size={13} /> },
  { id: 'jpg', label: 'JPG', icon: <Image size={13} /> },
]

const BG_OPTIONS: { id: ExportBackground; label: string; hint: string }[] = [
  { id: 'transparent', label: 'Transparent', hint: 'No background' },
  { id: 'white', label: 'White', hint: '#ffffff' },
  { id: 'dark', label: 'Dark', hint: '#121214' },
  { id: 'preview', label: 'Same as Preview', hint: 'Current canvas' },
]

export function ExportMenu({ getSvgElement, filename = 'diagram' }: ExportMenuProps) {
  const { canvasBg } = useEditorStore()
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<ExportFormat>('png')
  const [scale, setScale] = useState<1 | 2 | 3>(2)
  const [background, setBackground] = useState<ExportBackground>('transparent')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  function handleFormatChange(newFormat: ExportFormat) {
    setFormat(newFormat)
    // If JPG is selected, automatically move selection from transparent to white
    if (newFormat === 'jpg' && background === 'transparent') {
      setBackground('white')
    }
  }

  async function handleExport() {
    const svg = getSvgElement()
    if (!svg) {
      setError('No diagram to export')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await exportDiagram(svg, {
        format,
        scale,
        background: format === 'jpg' && background === 'transparent' ? 'white' : background,
        filename,
        currentCanvasBg: canvasBg,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    const svg = getSvgElement()
    if (!svg) {
      setError('No diagram to copy')
      return
    }
    try {
      await copyToClipboard(svg, canvasBg)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Copy failed')
    }
  }

  const isJpg = format === 'jpg'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] text-[var(--text)] transition-colors cursor-pointer"
        title="Export diagram as image or vector"
      >
        <Download size={13} />
        <span>Export</span>
        <ChevronDown
          size={11}
          className={`text-[var(--text-muted)] transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[var(--accent)]" />
              <span className="text-xs font-semibold text-[var(--text)]">
                Export Options
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text)] p-0.5 rounded transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Format Selection */}
          <div className="mb-3">
            <span className="block text-[11px] font-semibold text-[var(--text)] mb-1.5">
              Format
            </span>
            <div className="grid grid-cols-3 gap-1">
              {FORMATS.map((f) => {
                const active = format === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => handleFormatChange(f.id)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs rounded-lg border transition-all font-medium cursor-pointer ${
                      active
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-2xs'
                        : 'border-[var(--border)] hover:bg-[var(--paper-100)] text-[var(--text)]'
                    }`}
                  >
                    {f.icon}
                    <span>{f.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Background Selection */}
          <div className="mb-3">
            <span className="block text-[11px] font-semibold text-[var(--text)] mb-1.5">
              Background
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              {BG_OPTIONS.map((b) => {
                const isDisabled = isJpg && b.id === 'transparent'
                const active = background === b.id && !isDisabled

                return (
                  <button
                    key={b.id}
                    onClick={() => !isDisabled && setBackground(b.id)}
                    disabled={isDisabled}
                    className={`flex items-center gap-2 p-1.5 text-left rounded-lg border transition-all ${
                      isDisabled
                        ? 'opacity-40 border-[var(--border)] cursor-not-allowed bg-[var(--paper-100)] text-[var(--text-muted)]'
                        : active
                        ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)] font-medium cursor-pointer'
                        : 'border-[var(--border)] hover:bg-[var(--paper-100)] text-[var(--text)] cursor-pointer'
                    }`}
                    title={
                      isDisabled ? 'JPG format cannot have a transparent background' : undefined
                    }
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 ${
                        b.id === 'white'
                          ? 'bg-white'
                          : b.id === 'dark'
                          ? 'bg-[#121214]'
                          : b.id === 'preview'
                          ? canvasBg === 'dark'
                            ? 'bg-[#121214]'
                            : 'bg-white'
                          : 'bg-transparent border-dashed'
                      }`}
                    />
                    <div className="truncate">
                      <span className="text-xs block leading-tight truncate">
                        {b.label}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Resolution Scale */}
          {format !== 'svg' && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-[var(--text)]">
                  Resolution Scale
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {scale === 1 ? 'Standard (1×)' : scale === 2 ? 'Retina (2×)' : 'Ultra (3×)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {EXPORT_SCALES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s as 1 | 2 | 3)}
                    className={`py-1 text-xs rounded-lg border transition-all font-medium cursor-pointer ${
                      scale === s
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-2xs'
                        : 'border-[var(--border)] hover:bg-[var(--paper-100)] text-[var(--text)]'
                    }`}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 mb-2 p-1.5 rounded bg-red-50 dark:bg-red-950/20 border border-red-200">
              {error}
            </p>
          )}

          {/* Download & Copy Buttons */}
          <div className="flex gap-2 pt-1 border-t border-[var(--border)]">
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold py-2 rounded-lg transition-colors disabled:opacity-60 cursor-pointer shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Exporting…</span>
                </>
              ) : (
                <>
                  <Download size={13} />
                  <span>Download {format.toUpperCase()}</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              title="Copy diagram as PNG to clipboard"
              className="px-2.5 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] text-[var(--text)] transition-colors cursor-pointer"
            >
              {copied ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <Clipboard size={14} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
