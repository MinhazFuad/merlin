'use client'

import React, { useState } from 'react'
import { Check, X, Minus } from 'lucide-react'

const TOOLS = [
  { id: 'merlin', name: 'Merlin', accent: true },
  { id: 'mermaidlive', name: 'Mermaid.live', accent: false },
  { id: 'lucidchart', name: 'Lucidchart', accent: false },
  { id: 'drawio', name: 'draw.io', accent: false },
  { id: 'excalidraw', name: 'Excalidraw', accent: false },
]

type Val = true | false | 'partial'

interface Row {
  category: string
  label: string
  sublabel?: string
  values: Record<string, Val>
}

const ROWS: Row[] = [
  {
    category: 'Speed',
    label: 'Zero-latency live preview',
    sublabel: 'Renders as you type, no button click needed',
    values: { merlin: true, mermaidlive: true, lucidchart: false, drawio: false, excalidraw: false },
  },
  {
    category: 'Speed',
    label: 'No server roundtrip',
    sublabel: '100% client-side rendering engine',
    values: { merlin: true, mermaidlive: true, lucidchart: false, drawio: 'partial', excalidraw: true },
  },
  {
    category: 'Speed',
    label: 'Works fully offline',
    sublabel: 'No internet connection required after load',
    values: { merlin: true, mermaidlive: false, lucidchart: false, drawio: true, excalidraw: true },
  },
  {
    category: 'Privacy',
    label: 'Zero data sent to servers',
    sublabel: 'Your diagram source code never leaves the browser',
    values: { merlin: true, mermaidlive: true, lucidchart: false, drawio: false, excalidraw: true },
  },
  {
    category: 'Privacy',
    label: 'No account required to use',
    sublabel: 'Open and start diagramming immediately',
    values: { merlin: true, mermaidlive: true, lucidchart: false, drawio: true, excalidraw: true },
  },
  {
    category: 'Export',
    label: 'SVG vector export',
    sublabel: 'Lossless scalable vector output',
    values: { merlin: true, mermaidlive: true, lucidchart: true, drawio: true, excalidraw: true },
  },
  {
    category: 'Export',
    label: 'PNG export at 1x/2x/3x',
    sublabel: 'Retina-quality rasterization',
    values: { merlin: true, mermaidlive: 'partial', lucidchart: true, drawio: true, excalidraw: 'partial' },
  },
  {
    category: 'Export',
    label: 'JPEG export',
    sublabel: 'Compressed raster for document embedding',
    values: { merlin: true, mermaidlive: false, lucidchart: true, drawio: true, excalidraw: false },
  },
  {
    category: 'Workflow',
    label: 'Cloud diagram sync',
    sublabel: 'Save and access diagrams across devices',
    values: { merlin: true, mermaidlive: false, lucidchart: true, drawio: 'partial', excalidraw: 'partial' },
  },
  {
    category: 'Workflow',
    label: 'Shareable public links',
    sublabel: 'Generate a URL anyone can open',
    values: { merlin: true, mermaidlive: true, lucidchart: true, drawio: true, excalidraw: true },
  },
  {
    category: 'Workflow',
    label: 'Theme & color customization',
    sublabel: 'Dark/light canvas, custom node fills and edge colors',
    values: { merlin: true, mermaidlive: 'partial', lucidchart: true, drawio: true, excalidraw: 'partial' },
  },
  {
    category: 'Code-First',
    label: 'Diagram-as-code (text syntax)',
    sublabel: 'Mermaid markdown syntax support',
    values: { merlin: true, mermaidlive: true, lucidchart: false, drawio: 'partial', excalidraw: false },
  },
  {
    category: 'Code-First',
    label: 'Syntax-highlighted editor',
    sublabel: 'CodeMirror-powered monospaced editor',
    values: { merlin: true, mermaidlive: 'partial', lucidchart: false, drawio: false, excalidraw: false },
  },
  {
    category: 'Code-First',
    label: 'Inline syntax error feedback',
    sublabel: 'Error shown in the preview pane immediately',
    values: { merlin: true, mermaidlive: true, lucidchart: false, drawio: false, excalidraw: false },
  },
]

const CATEGORIES = Array.from(new Set(ROWS.map(r => r.category)))

function Cell({ val }: { val: Val }) {
  if (val === true) return (
    <div className="flex justify-center">
      <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
        <Check size={13} className="text-emerald-500 stroke-[2.5]" />
      </span>
    </div>
  )
  if (val === false) return (
    <div className="flex justify-center">
      <span className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <X size={12} className="text-red-400/70 stroke-[2.5]" />
      </span>
    </div>
  )
  return (
    <div className="flex justify-center">
      <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
        <Minus size={12} className="text-amber-400/70 stroke-[2.5]" />
      </span>
    </div>
  )
}

export default function PrivacySection() {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', ...CATEGORIES]
  const visibleRows = activeCategory === 'All' ? ROWS : ROWS.filter(r => r.category === activeCategory)

  return (
    <section className="relative py-24 sm:py-32 border-b border-[var(--border)] overflow-hidden bg-[var(--surface)]">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-widest mb-4">Market analysis</p>
          <h2 className="text-4xl sm:text-6xl font-extrabold text-[var(--text)] tracking-tight leading-tight mb-5">
            Why engineers choose Merlin.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Merlin is purpose-built for code-first workflows. Here's how it stacks up against the tools your team is probably using today.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-[var(--text)] text-[var(--bg)] border-transparent shadow-xs'
                  : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--ink-300)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-5 py-4 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider w-[38%]">
                  Feature
                </th>
                {TOOLS.map(tool => (
                  <th key={tool.id} className={`text-center px-3 py-4 font-bold text-xs ${tool.accent ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                    {tool.accent && (
                      <span className="inline-block mb-1 px-1.5 py-0.5 rounded text-[9px] bg-[var(--accent)]/10 text-[var(--accent)] font-mono uppercase tracking-wider border border-[var(--accent)]/20 leading-none">
                        You're here
                      </span>
                    )}
                    <div>{tool.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, i) => {
                const isNewCategory = i === 0 || row.category !== visibleRows[i - 1].category
                return (
                  <React.Fragment key={row.label}>
                    {isNewCategory && (
                      <tr>
                        <td colSpan={6} className="px-5 pt-5 pb-2">
                          <span className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase tracking-widest">
                            {row.category}
                          </span>
                        </td>
                      </tr>
                    )}
                    <tr className={`border-t border-[var(--border)]/50 transition-colors hover:bg-[var(--bg)] group`}>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-[var(--text)] text-sm leading-snug">{row.label}</div>
                        {row.sublabel && (
                          <div className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">{row.sublabel}</div>
                        )}
                      </td>
                      {TOOLS.map(tool => (
                        <td key={tool.id} className={`px-3 py-3.5 ${tool.accent ? 'bg-[var(--accent)]/[0.03] group-hover:bg-[var(--accent)]/[0.06]' : ''}`}>
                          <Cell val={row.values[tool.id]} />
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-5 mt-5 text-[11px] text-[var(--text-muted)] font-mono">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Check size={10} className="text-emerald-500" />
            </span>
            Fully supported
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Minus size={10} className="text-amber-400/70" />
            </span>
            Partial / limited
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <X size={10} className="text-red-400/70" />
            </span>
            Not available
          </span>
        </div>
      </div>
    </section>
  )
}
