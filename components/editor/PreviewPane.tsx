'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { renderToSvg } from '@/lib/mermaid/render'
import { useEditorStore } from '@/store/editorStore'
import { DEBOUNCE_MS, isLightColor } from '@/lib/constants'
import {
  AlertCircle,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react'

interface PreviewPaneProps {
  /** Source code to render (if not using store) */
  code?: string
  theme?: string
  readOnly?: boolean
}

export function PreviewPane({ code: codeProp, theme: themeProp, readOnly = false }: PreviewPaneProps) {
  const {
    code: storeCode,
    theme: storeTheme,
    forceRenderTrigger,
    lineColor,
    fillColor,
    canvasBg,
    setCanvasBg,
  } = useEditorStore()

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

  const render = useCallback(
    async (
      source: string,
      currentTheme: string,
      currentLineColor: string,
      currentFillColor: string,
      currentBg: 'dark' | 'light'
    ) => {
      if (!source.trim()) {
        setSvgContent('')
        setError(null)
        setLoading(false)
        return
      }

      const id = ++renderId.current
      setLoading(true)

      try {
        const svg = await renderToSvg(source, `merlin-preview-${id}`, {
          theme: currentTheme,
          lineColor: currentLineColor,
          fillColor: currentFillColor,
          bg: currentBg,
        })
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
    },
    []
  )

  // Immediate re-render when forceRender is triggered
  useEffect(() => {
    if (forceRenderTrigger > 0) {
      render(code, theme, lineColor, fillColor, canvasBg)
    }
  }, [forceRenderTrigger, code, theme, lineColor, fillColor, canvasBg, render])

  // Debounced render on code, theme, lineColor, fillColor, or canvasBg change
  useEffect(() => {
    const timer = setTimeout(
      () => render(code, theme, lineColor, fillColor, canvasBg),
      DEBOUNCE_MS
    )
    return () => clearTimeout(timer)
  }, [code, theme, lineColor, fillColor, canvasBg, render])

  // Zoom via scroll
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale((s) => Math.min(Math.max(s * delta, 0.1), 10))
  }, [])

  // Pan via drag with RAF throttling for 60-120fps smooth motion
  const panRaf = useRef<number | null>(null)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    isPanning.current = true
    panStart.current = { x: e.clientX - translate.x, y: e.clientY - translate.y }
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return
    const nextX = e.clientX - panStart.current.x
    const nextY = e.clientY - panStart.current.y
    if (panRaf.current !== null) return
    panRaf.current = requestAnimationFrame(() => {
      setTranslate({ x: nextX, y: nextY })
      panRaf.current = null
    })
  }
  const handleMouseUp = () => {
    isPanning.current = false
    if (panRaf.current !== null) {
      cancelAnimationFrame(panRaf.current)
      panRaf.current = null
    }
  }

  const fitToScreen = () => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
  }
  const resetZoom = () => {
    setScale(1)
  }

  const isDarkCanvas = canvasBg === 'dark'
  const isEffectiveLight =
    fillColor === 'transparent' ? !isDarkCanvas : isLightColor(fillColor)
  const mermaidTextColor = isEffectiveLight ? '#0f172a' : '#f4f4f5'

  return (
    <div
      className={`relative h-full flex flex-col transition-colors duration-200 overflow-hidden ${
        isDarkCanvas ? 'bg-[#121214] text-zinc-100' : 'bg-white text-zinc-900'
      }`}
      style={
        {
          '--mermaid-line-color': lineColor,
          '--mermaid-fill-color':
            fillColor === 'transparent'
              ? isDarkCanvas
                ? '#121214'
                : '#ffffff'
              : fillColor,
          '--mermaid-text-color': mermaidTextColor,
        } as React.CSSProperties
      }
    >
      {/* Canvas Toolbar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setScale((s) => Math.min(s * 1.25, 10))}
          className="p-1.5 rounded hover:bg-[var(--paper-100)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          title="Zoom in"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(s * 0.8, 0.1))}
          className="p-1.5 rounded hover:bg-[var(--paper-100)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          title="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
        <div className="w-px h-4 bg-[var(--border)]" />
        <button
          onClick={fitToScreen}
          className="p-1.5 rounded hover:bg-[var(--paper-100)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          title="Fit to screen"
        >
          <Maximize2 size={14} />
        </button>
        <button
          onClick={resetZoom}
          className="p-1.5 rounded hover:bg-[var(--paper-100)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          title="Reset zoom (100%)"
        >
          <RotateCcw size={14} />
        </button>
        <div className="w-px h-4 bg-[var(--border)]" />
        <button
          onClick={() => setCanvasBg(isDarkCanvas ? 'light' : 'dark')}
          className="p-1.5 rounded hover:bg-[var(--paper-100)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          title={`Switch canvas to ${isDarkCanvas ? 'light' : 'dark'} background`}
        >
          {isDarkCanvas ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <span className="text-[10px] text-[var(--text-muted)] px-1 tabular-nums min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-3 left-3 z-10">
          <Loader2 size={14} className="animate-spin text-[var(--accent)]" />
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
          className="w-full h-full flex items-center justify-center p-6 transform-gpu"
          style={{
            transform: `translate3d(${translate.x}px, ${translate.y}px, 0) scale(${scale})`,
            transformOrigin: 'center center',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            // Keep willChange always-on so the browser never demotes this layer
            // mid-pan, which causes the jank "pop" visible during drag start.
            willChange: 'transform',
            transition: isPanning.current ? 'none' : 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)',
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
