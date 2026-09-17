'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Code2, Eye, Copy, Check, ArrowRight, Sparkles } from 'lucide-react'
import { renderToSvg } from '@/lib/mermaid/render'

const DIAGRAM_CODE = `flowchart TD
  Code["Markdown Syntax"] --> Engine["In-Browser Compiler"]
  Engine --> Preview["Live Vector Preview"]
  Engine --> Export["SVG & PNG Export"]`

export default function HeroDiagramWindow() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [svg, setSvg] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isRendering, setIsRendering] = useState(true)

  useEffect(() => {
    let isCancelled = false

    async function loadDiagram() {
      try {
        const isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        const rendered = await renderToSvg(DIAGRAM_CODE, 'hero_flowchart', {
          bg: isDark ? 'dark' : 'light',
          lineColor: '#2563eb',
        })
        if (!isCancelled) {
          setSvg(rendered)
          setIsRendering(false)
        }
      } catch {
        if (!isCancelled) {
          setIsRendering(false)
        }
      }
    }

    loadDiagram()

    return () => {
      isCancelled = true
    }
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(DIAGRAM_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-lg lg:max-w-none rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md shadow-xl dark:shadow-2xl overflow-hidden transition-all duration-300">
      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]/60">
        {/* Window controls & file name */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 border border-red-500/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 border border-amber-500/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 border border-emerald-500/20" />
          </div>
          <div className="h-3.5 w-px bg-[var(--border)] mx-0.5" />
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--text)]">
            <Code2 size={13} className="text-[var(--accent)]" />
            <span>how-it-works.mmd</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[var(--bg)]/80 p-0.5 rounded-lg border border-[var(--border)] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[var(--surface)] text-[var(--accent)] shadow-2xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Eye size={12} />
            <span>Diagram</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'code'
                ? 'bg-[var(--surface)] text-[var(--accent)] shadow-2xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Code2 size={12} />
            <span>Code</span>
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="min-h-[290px] sm:min-h-[320px] h-[290px] sm:h-[320px] flex flex-col relative bg-[var(--surface)]/40 overflow-hidden">
        {activeTab === 'preview' ? (
          <div className="w-full h-full p-5 sm:p-6 flex items-center justify-center flex-1">
            {svg ? (
              <div
                className="mermaid-preview w-full flex items-center justify-center [&>svg]:max-h-[250px] [&>svg]:w-auto [&>svg]:max-w-full"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ) : isRendering ? (
              <div className="flex flex-col items-center gap-2.5 text-xs font-mono text-[var(--text-muted)]">
                <Sparkles size={16} className="animate-spin text-[var(--accent)]" />
                <span>Compiling vector diagram...</span>
              </div>
            ) : (
              /* Static CSS/SVG Fallback so there is never an empty state */
              <div className="w-full flex flex-col items-center gap-3 py-4">
                <div className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--text)] shadow-xs">
                  Markdown Syntax
                </div>
                <div className="w-px h-5 bg-[var(--accent)]" />
                <div className="px-4 py-2 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-xs font-semibold text-[var(--accent)] shadow-xs">
                  In-Browser Compiler
                </div>
                <div className="w-px h-5 bg-[var(--accent)]" />
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text)] shadow-xs">
                    Live Vector Preview
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text)] shadow-xs">
                    SVG & PNG Export
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Full-Height Code Editor View */
          <div className="w-full h-full flex flex-col flex-1 bg-[var(--editor-bg)] text-[var(--editor-text)] relative text-left">
            {/* Editor Toolbar with Copy */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/25 border-b border-white/5 text-[11px] font-mono text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5 text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                <span>syntax: mermaid</span>
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Copy code"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Full-Height Code Lines with Line Numbers Gutter */}
            <div className="flex-1 p-4 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto flex items-stretch">
              <div className="select-none text-white/30 pr-3.5 text-right flex flex-col border-r border-white/10 font-mono text-xs">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
              <pre className="pl-3.5 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto flex-1">
                <code>
                  <span className="text-blue-400 font-semibold">flowchart</span>{' '}
                  <span className="text-amber-300">TD</span>{'\n'}
                  {'  '}Code[<span className="text-emerald-300">&quot;Markdown Syntax&quot;</span>]{' '}
                  <span className="text-blue-400">--&gt;</span>{' '}
                  Engine[<span className="text-emerald-300">&quot;In-Browser Compiler&quot;</span>]{'\n'}
                  {'  '}Engine{' '}
                  <span className="text-blue-400">--&gt;</span>{' '}
                  Preview[<span className="text-emerald-300">&quot;Live Vector Preview&quot;</span>]{'\n'}
                  {'  '}Engine{' '}
                  <span className="text-blue-400">--&gt;</span>{' '}
                  Export[<span className="text-emerald-300">&quot;SVG &amp; PNG Export&quot;</span>]
                </code>
              </pre>
            </div>

            {/* Editor Footer Bar */}
            <div className="px-4 py-2 bg-black/35 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/50">
              <span>UTF-8 · 4 lines · 0 errors</span>
              <span className="text-emerald-400 font-medium">✓ Valid syntax</span>
            </div>
          </div>
        )}
      </div>

      {/* Window Footer Status Bar */}
      <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--surface)]/60 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Client-Side Engine · 0ms Server Roundtrip</span>
        </div>
        <Link
          href="/editor"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--accent)] hover:underline cursor-pointer"
        >
          Try Live
          <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  )
}
