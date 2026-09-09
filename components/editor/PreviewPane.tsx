'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { renderToSvg } from '@/lib/mermaid/render'
import { useEditorStore } from '@/store/editorStore'
import { DEBOUNCE_MS } from '@/lib/constants'
import { AlertCircle, Loader2, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react'

interface PreviewPaneProps {
  /** Source code to render (if not using store) */
  code?: string
  theme?: string
  readOnly?: boolean
}

export function PreviewPane({ code: codeProp, theme: themeProp, readOnly = false }: PreviewPaneProps) {
  const { code: storeCode, theme: storeTheme, forceRenderTrigger } = useEditorStore()
  const code = codeProp ?? storeCode
  const theme = themeProp ?? storeTheme

  const [svgContent, setSvgContent] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Pan/zoom state
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const isPanning = useRef(false)
  const panStart = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const renderId = useRef(0)

  const render = useCallback(async (source: string, currentTheme: string) => {
    if (!source.trim()) {
      setSvgContent('')
      setError(null)
      setLoading(false)
      return
    }

    const id = ++renderId.current
    setLoading(true)

    try {
      const svg = await renderToSvg(source, `merlin-preview-${id}`, currentTheme)
      if (id !== renderId.current) return // stale
      setSvgContent(svg)
      setError(null)
    } catch (err) {
      if (id !== renderId.current) return
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
      // Keep the previous valid SVG shown — don't blank it
    } finally {
      if (id === renderId.current) setLoading(false)
    }
  }, [])

  // Immediate re-render when forceRender is triggered
  useEffect(() => {
    if (forceRenderTrigger > 0) {
      render(code, theme)
    }
  }, [forceRenderTrigger, code, theme, render])

  // Debounced render on code/theme change
  useEffect(() => {
    const timer = setTimeout(() => render(code, theme), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [code, theme, render])

  // Zoom via scroll
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale((s) => Math.min(Math.max(s * delta, 0.1), 10))
  }, [])

  // Pan via drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    isPanning.current = true
    panStart.current = { x: e.clientX - translate.x, y: e.clientY - translate.y }
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return
    setTranslate({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y })
  }
  const handleMouseUp = () => { isPanning.current = false }

  const fitToScreen = () => { setScale(1); setTranslate({ x: 0, y: 0 }) }
  const resetZoom = () => { setScale(1) }

  return (
    <div className="relative h-full flex flex-col bg-[var(--paper-100)] overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setScale((s) => Math.min(s * 1.25, 10))}
          className="p-1.5 rounded hover:bg-[var(--paper-100)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          title="Zoom in"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(s * 0.8, 0.1))}
          className="p-1.5 rounded hover:bg-[var(--paper-100)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          title="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
        <div className="w-px h-4 bg-[var(--border)]" />
        <button
          onClick={fitToScreen}
          className="p-1.5 rounded hover:bg-[var(--paper-100)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          title="Fit to screen"
        >
          <Maximize2 size={14} />
        </button>
        <button
          onClick={resetZoom}
          className="p-1.5 rounded hover:bg-[var(--paper-100)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          title="Reset zoom (100%)"
        >
          <RotateCcw size={14} />
        </button>
        <span className="text-[10px] text-[var(--text-muted)] px-1 tabular-nums min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-3 left-3 z-10">
          <Loader2 size={14} className="animate-spin text-[var(--text-muted)]" />
        </div>
      )}

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isPanning.current ? 'none' : 'transform 0ms',
          }}
        >
          {svgContent ? (
            <div
              className="mermaid-preview"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : !loading && !error ? (
            <p className="text-sm text-[var(--text-muted)]">
              Start typing to see your diagram…
            </p>
          ) : null}
        </div>
      </div>

      {/* Error panel */}
      {error && (
        <div className="border-t border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 px-4 py-2.5 flex items-start gap-2.5 text-xs">
          <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-red-600 dark:text-red-400">Syntax error </span>
            <span className="text-red-500">{error}</span>
          </div>
        </div>
      )}
    </div>
  )
}
