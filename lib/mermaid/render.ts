'use client'

import type { Mermaid } from 'mermaid'
import { DEFAULT_LINE_COLOR, DEFAULT_FILL_COLOR, isLightColor } from '../constants'

let mermaidInstance: Mermaid | null = null

/** Lazily loads mermaid client-side only */
export async function loadMermaid(): Promise<Mermaid> {
  if (mermaidInstance) return mermaidInstance

  const mermaid = (await import('mermaid')).default
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    fontFamily: 'var(--font-mono, monospace)',
    maxTextSize: 100000,
    maxEdges: 2500,
  })
  mermaidInstance = mermaid
  return mermaid
}

export interface RenderOptions {
  theme?: string
  lineColor?: string
  fillColor?: string
  bg?: 'dark' | 'light'
}

let renderSeq = 0
let renderQueue: Promise<unknown> = Promise.resolve()

/**
 * Internal render execution that safely wraps mermaid.initialize and mermaid.render
 */
async function executeRender(
  source: string,
  id: string,
  opts: RenderOptions
): Promise<string> {
  const mermaid = await loadMermaid()

  // Clean and normalize line endings & whitespace
  const cleanSource = (source || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim()

  if (!cleanSource) return ''

  const isDark = opts.bg !== 'light'
  const lineColor = opts.lineColor || DEFAULT_LINE_COLOR
  const rawFill = opts.fillColor || (isDark ? '#1c1c20' : '#f8fafc')

  // When fill is outline/transparent, node adopts the canvas background brightness
  const isLightFill =
    rawFill === 'transparent'
      ? !isDark
      : isLightColor(rawFill)

  const resolvedFill =
    rawFill === 'transparent' ? (isDark ? '#121214' : '#ffffff') : rawFill

  // Build a unique, collision-proof DOM id
  const safePrefix = id.replace(/[^a-zA-Z0-9_-]/g, '_')
  const uniqueId = `mm_${safePrefix}_${Date.now()}_${++renderSeq}`
  const fallbackId = `${uniqueId}_fb`

  // Helper to remove any stray DOM elements created by Mermaid
  const cleanupDom = () => {
    if (typeof document === 'undefined') return
    const ids = [uniqueId, `d${uniqueId}`, fallbackId, `d${fallbackId}`]
    for (const domId of ids) {
      const el = document.getElementById(domId)
      if (el) el.remove()
    }
    // Also clean up any orphan containers created with matching prefix
    try {
      document.querySelectorAll(`[id*="${uniqueId}"]`).forEach((el) => el.remove())
    } catch {
      // Ignore if querySelector fails
    }
  }

  try {
    // 1. Configure Mermaid with stable base theme and custom variables
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'var(--font-mono, monospace)',
      maxTextSize: 100000,
      maxEdges: 2500,
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        useMaxWidth: true,
      },
      sequence: {
        useMaxWidth: true,
        wrap: true,
      },
      gantt: {
        useMaxWidth: true,
      },
      journey: {
        useMaxWidth: true,
      },
      mindmap: {
        useMaxWidth: true,
      },
      timeline: {
        useMaxWidth: true,
      },
      er: {
        useMaxWidth: true,
      },
      quadrantChart: {
        useMaxWidth: true,
      },
      xyChart: {
        useMaxWidth: true,
      },
      themeVariables: {
        darkMode: isDark,
        background: isDark ? '#121214' : '#ffffff',
        mainBkg: resolvedFill,
        nodeBkg: resolvedFill,
        nodeBorder: lineColor,
        lineColor: lineColor,
        textColor: isLightFill ? '#0f172a' : '#f4f4f5',
        primaryTextColor: isLightFill ? '#0f172a' : '#f4f4f5',
        nodeTextColor: isLightFill ? '#0f172a' : '#f4f4f5',
        primaryColor: resolvedFill,
        primaryBorderColor: lineColor,
        edgeLabelBackground: isDark ? '#121214' : '#ffffff',
        actorBkg: resolvedFill,
        actorBorder: lineColor,
        actorTextColor: isLightFill ? '#0f172a' : '#f4f4f5',
        actorLineColor: lineColor,
        signalColor: lineColor,
        signalTextColor: isDark ? '#f4f4f5' : '#0f172a',
        labelBoxBkgColor: resolvedFill,
        labelBoxBorderColor: lineColor,
        labelTextColor: isLightFill ? '#0f172a' : '#f4f4f5',
        loopTextColor: isDark ? '#f4f4f5' : '#0f172a',
        noteBorderColor: lineColor,
        noteBkgColor: resolvedFill,
        noteTextColor: isLightFill ? '#0f172a' : '#f4f4f5',
        classText: isLightFill ? '#0f172a' : '#f4f4f5',
        pieStrokeColor: isDark ? '#121214' : '#ffffff',
      },
    })

    const { svg } = await mermaid.render(uniqueId, cleanSource)
    return svg
  } catch (firstErr) {
    // 2. Fallback attempt with vanilla default/dark theme (without themeVariables)
    // to guarantee complex diagrams with exotic ASTs still render cleanly
    try {
      cleanupDom()
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'var(--font-mono, monospace)',
        maxTextSize: 100000,
        maxEdges: 2500,
      })
      const { svg } = await mermaid.render(fallbackId, cleanSource)
      return svg
    } catch {
      // Re-throw original error if syntax is truly invalid
      throw firstErr
    }
  } finally {
    cleanupDom()
  }
}

const MAX_CACHE_SIZE = 150
const svgRenderCache = new Map<string, string>()

function getCacheKey(cleanSource: string, opts: RenderOptions): string {
  return `${cleanSource}__${opts.bg || 'dark'}__${opts.lineColor || DEFAULT_LINE_COLOR}__${opts.fillColor || DEFAULT_FILL_COLOR}__${opts.theme || ''}`
}

/**
 * Clear the in-memory SVG render cache.
 */
export function clearRenderCache(): void {
  svgRenderCache.clear()
}

/**
 * Render mermaid source to an SVG string.
 * Uses an in-memory LRU cache to return instant 0ms renders on repeated or identical sources.
 * All fresh render calls are queued sequentially to eliminate race conditions and DOM corruption.
 */
export function renderToSvg(
  source: string,
  id: string,
  optionsOrTheme: string | RenderOptions = { bg: 'dark', lineColor: DEFAULT_LINE_COLOR, fillColor: DEFAULT_FILL_COLOR }
): Promise<string> {
  const cleanSource = (source || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim()

  if (!cleanSource) return Promise.resolve('')

  const opts: RenderOptions =
    typeof optionsOrTheme === 'string'
      ? { theme: optionsOrTheme, lineColor: DEFAULT_LINE_COLOR, fillColor: DEFAULT_FILL_COLOR, bg: 'dark' }
      : {
          lineColor: DEFAULT_LINE_COLOR,
          fillColor: DEFAULT_FILL_COLOR,
          bg: 'dark',
          ...optionsOrTheme,
        }

  const cacheKey = getCacheKey(cleanSource, opts)
  const cached = svgRenderCache.get(cacheKey)
  if (cached) {
    return Promise.resolve(cached)
  }

  return new Promise<string>((resolve, reject) => {
    renderQueue = renderQueue
      .catch(() => {}) // Don't break the queue if previous render failed
      .then(async () => {
        const queuedCached = svgRenderCache.get(cacheKey)
        if (queuedCached) {
          resolve(queuedCached)
          return
        }

        try {
          const svg = await executeRender(cleanSource, id, opts)
          if (svgRenderCache.size >= MAX_CACHE_SIZE) {
            const oldestKey = svgRenderCache.keys().next().value
            if (oldestKey) svgRenderCache.delete(oldestKey)
          }
          svgRenderCache.set(cacheKey, svg)
          resolve(svg)
        } catch (err) {
          reject(err)
        }
      })
  })
}

