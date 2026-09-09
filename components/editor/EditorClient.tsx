'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { PreviewPane } from '@/components/editor/PreviewPane'
import { Toolbar } from '@/components/editor/Toolbar'
import { useEditorStore } from '@/store/editorStore'
import type { User } from '@supabase/supabase-js'

// Lazy-load CodeEditor (CodeMirror is heavy)
const CodeEditor = dynamic(
  () => import('@/components/editor/CodeEditor').then((m) => m.CodeEditor),
  { ssr: false, loading: () => <div className="flex-1 bg-[var(--editor-bg)] animate-pulse" /> }
)

interface EditorClientProps {
  user: User | null
  initialCode?: string
  initialTitle?: string
  initialTheme?: string
  diagramId?: string
}

export function EditorClient({
  user,
  initialCode,
  initialTitle,
  initialTheme,
  diagramId,
}: EditorClientProps) {
  const { loadDiagram, reset } = useEditorStore()
  const svgRef = useRef<SVGSVGElement | null>(null)

  // Mobile pane toggle
  const [activePane, setActivePane] = useState<'code' | 'preview'>('code')
  const isMobile = useWindowWidth() < 768

  useEffect(() => {
    if (diagramId && initialCode !== undefined && initialTitle && initialTheme) {
      loadDiagram({
        id: diagramId,
        title: initialTitle,
        code: initialCode,
        theme: initialTheme as 'default',
      })
    } else if (!diagramId) {
      reset()
    }
  }, [diagramId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Hook up svgRef to the rendered SVG in PreviewPane
  useEffect(() => {
    const el = document.querySelector<SVGSVGElement>('.mermaid-preview svg')
    if (el) svgRef.current = el
  })

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Toolbar user={user} svgRef={svgRef} />

      {/* Mobile pane toggle */}
      {isMobile && (
        <div className="flex border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
          {(['code', 'preview'] as const).map((pane) => (
            <button
              key={pane}
              onClick={() => setActivePane(pane)}
              className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                activePane === pane
                  ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {pane}
            </button>
          ))}
        </div>
      )}

      {/* Split pane layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code pane */}
        <div
          className={`${
            isMobile
              ? activePane === 'code'
                ? 'flex-1'
                : 'hidden'
              : 'w-1/2'
          } border-r border-[var(--border)] overflow-hidden`}
        >
          <CodeEditor />
        </div>

        {/* Preview pane */}
        <div
          className={`${
            isMobile
              ? activePane === 'preview'
                ? 'flex-1'
                : 'hidden'
              : 'w-1/2'
          } overflow-hidden`}
        >
          <PreviewPane />
        </div>
      </div>
    </div>
  )
}

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}
