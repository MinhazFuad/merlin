'use client'

import type { Mermaid } from 'mermaid'

let mermaidInstance: Mermaid | null = null

/** Lazily loads mermaid client-side only */
export async function loadMermaid(): Promise<Mermaid> {
  if (mermaidInstance) return mermaidInstance

  const mermaid = (await import('mermaid')).default
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'var(--font-mono, monospace)',
  })
  mermaidInstance = mermaid
  return mermaid
}

/** Render mermaid source to an SVG string */
export async function renderToSvg(
  source: string,
  id: string,
  theme = 'default'
): Promise<string> {
  const mermaid = await loadMermaid()
  
  // Re-initialize with current theme
  mermaid.initialize({
    startOnLoad: false,
    theme: theme as 'default' | 'dark' | 'forest' | 'base' | 'neutral',
    securityLevel: 'loose',
    fontFamily: 'var(--font-mono, monospace)',
  })

  // Ensure safe DOM id
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '_')

  try {
    const { svg } = await mermaid.render(safeId, source)
    return svg
  } catch (err) {
    // Clean up any stray error elements Mermaid might have appended to document
    if (typeof document !== 'undefined') {
      const el = document.getElementById(safeId)
      if (el) el.remove()
      const dEl = document.getElementById(`d${safeId}`)
      if (dEl) dEl.remove()
    }
    throw err
  }
}
