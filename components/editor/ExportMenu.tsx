'use client'

import { useState, useRef } from 'react'
import { Download, Image, FileCode, Clipboard, Check, ChevronDown, X } from 'lucide-react'
import { exportDiagram, copyToClipboard, type ExportFormat, type ExportBackground } from '@/lib/mermaid/export'
import { EXPORT_SCALES } from '@/lib/constants'

interface ExportMenuProps {
  getSvgElement: () => SVGSVGElement | null
  filename?: string
}

const FORMATS: { id: ExportFormat; label: string; icon: React.ReactNode }[] = [
  { id: 'svg', label: 'SVG', icon: <FileCode size={14} /> },
  { id: 'png', label: 'PNG', icon: <Image size={14} /> },
  { id: 'jpg', label: 'JPG', icon: <Image size={14} /> },
]

const BG_OPTIONS: { id: ExportBackground; label: string }[] = [
  { id: 'transparent', label: 'Transparent' },
  { id: 'white', label: 'White' },
]

export function ExportMenu({ getSvgElement, filename = 'diagram' }: ExportMenuProps) {
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<ExportFormat>('png')
  const [scale, setScale] = useState<1 | 2 | 3>(2)
  const [background, setBackground] = useState<ExportBackground>('white')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleExport() {
    const svg = getSvgElement()
    if (!svg) { setError('No diagram to export'); return }
    setLoading(true)
    setError(null)
    try {
      await exportDiagram(svg, {
        format,
        scale,
        background: format === 'jpg' && background === 'transparent' ? 'white' : background,
        filename,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    const svg = getSvgElement()
    if (!svg) { setError('No diagram to copy'); return }
    try {
      await copyToClipboard(svg)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Copy failed')
    }
  }

  const isJpg = format === 'jpg'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] transition-colors"
      >
        <Download size={14} />
        Export
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Export</span>
            <button onClick={() => setOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text)]">
              <X size={14} />
            </button>
          </div>

          {/* Format */}
          <div className="mb-3">
            <p className="text-xs text-[var(--text-muted)] mb-1.5">Format</p>
            <div className="flex gap-1">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-md border transition-colors font-medium ${
                    format === f.id
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'border-[var(--border)] hover:bg-[var(--paper-100)]'
                  }`}
                >
                  {f.icon}
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          {format !== 'svg' && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-[var(--text-muted)]">Background</p>
                {isJpg && (
                  <span className="text-[10px] text-[var(--text-muted)] italic">
                    JPG requires a background
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {BG_OPTIONS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => !isJpg && setBackground(b.id)}
                    disabled={isJpg && b.id === 'transparent'}
                    title={isJpg && b.id === 'transparent' ? 'JPG cannot be transparent' : undefined}
                    className={`flex-1 py-1.5 text-xs rounded-md border transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed ${
                      background === b.id
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'border-[var(--border)] hover:bg-[var(--paper-100)]'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scale */}
          {format !== 'svg' && (
            <div className="mb-4">
              <p className="text-xs text-[var(--text-muted)] mb-1.5">Scale</p>
              <div className="flex gap-1">
                {EXPORT_SCALES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s as 1 | 2 | 3)}
                    className={`flex-1 py-1.5 text-xs rounded-md border transition-colors font-medium ${
                      scale === s
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'border-[var(--border)] hover:bg-[var(--paper-100)]'
                    }`}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 mb-2">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? 'Exporting…' : 'Download'}
            </button>
            <button
              onClick={handleCopy}
              title="Copy as PNG"
              className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] transition-colors"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Clipboard size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
