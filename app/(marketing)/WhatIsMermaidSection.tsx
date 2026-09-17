'use client'

import React, { useState, useEffect, useRef } from 'react'
import { renderToSvg } from '@/lib/mermaid/render'
import { Code2, Play, RotateCcw, Sparkles, Check, Copy } from 'lucide-react'
import DotField from './DotField'

interface DiagramPreset {
  id: string
  name: string
  badge: string
  code: string
  description: string
}

const PRESETS: DiagramPreset[] = [
  {
    id: 'flowchart',
    name: 'Flowchart',
    badge: 'Logic & Flow',
    description: 'Decision trees, conditionals, and execution branching.',
    code: `flowchart TD
  Start([User Request]) --> Check{Authorized?}
  Check -- Yes --> Process[Execute Query]
  Check -- No --> Auth[Prompt Login]
  Process --> Cache[(Cache Result)]
  Cache --> Return([Return Response])`,
  },
  {
    id: 'sequence',
    name: 'Sequence',
    badge: 'API & Systems',
    description: 'Message passing between microservices, clients, and databases.',
    code: `sequenceDiagram
  autonumber
  actor User
  participant Client as Browser
  participant API as Edge API
  participant DB as Supabase DB

  User->>Client: Click "Save Diagram"
  Client->>API: POST /api/diagrams/save
  API->>DB: INSERT diagram metadata
  DB-->>API: 200 OK (UUID)
  API-->>Client: Return share slug
  Client-->>User: Show copyable link`,
  },
  {
    id: 'state',
    name: 'State Machine',
    badge: 'Lifecycle',
    description: 'State transitions, guards, triggers, and terminating states.',
    code: `stateDiagram-v2
  [*] --> Draft
  Draft --> Rendering: Edit code
  Rendering --> Valid: Syntax passes
  Rendering --> SyntaxError: Parse failure
  SyntaxError --> Rendering: Fix syntax
  Valid --> Published: Share diagram
  Published --> [*]`,
  },
  {
    id: 'git',
    name: 'Git Graph',
    badge: 'Version Control',
    description: 'Branch merges, tags, commits, and release workflows.',
    code: `gitGraph
  commit id: "v1.0.0"
  branch feature/export
  checkout feature/export
  commit id: "add-svg-export"
  commit id: "add-canvas-raster"
  checkout main
  merge feature/export id: "merge-pr-12"
  commit id: "v1.1.0" tag: "release"`,
  },
  {
    id: 'class',
    name: 'Class Diagram',
    badge: 'Architecture',
    description: 'Object-oriented schema modeling, inheritance, and types.',
    code: `classDiagram
  class Diagram {
    +UUID id
    +String title
    +String code
    +Theme theme
    +Boolean is_public
    +render() SVG
    +export(format) Blob
  }
  class User {
    +UUID id
    +String email
    +createDiagram()
  }
  User "1" --> "*" Diagram : owns`,
  },
]

export default function WhatIsMermaidSection() {
  const [activePreset, setActivePreset] = useState<DiagramPreset>(PRESETS[0])
  const [code, setCode] = useState(PRESETS[0].code)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isRendering, setIsRendering] = useState(false)
  const [renderTime, setRenderTime] = useState<number>(0)
  const [copied, setCopied] = useState(false)
  const renderIdRef = useRef(0)

  // Switch preset
  const handleSelectPreset = (preset: DiagramPreset) => {
    setActivePreset(preset)
    setCode(preset.code)
    setError(null)
  }

  // Reset to original preset code
  const handleReset = () => {
    setCode(activePreset.code)
    setError(null)
  }

  // Copy code
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Re-render debounced
  useEffect(() => {
    const currentId = ++renderIdRef.current
    // Render immediately when switching presets (0ms delay), debounce 250ms while actively typing
    const isPresetDefault = code === activePreset.code
    const delay = isPresetDefault ? 0 : 250

    const timer = setTimeout(async () => {
      const startTime = performance.now()
      try {
        const renderedSvg = await renderToSvg(code, `hero_demo_${activePreset.id}_${currentId}`, {
          bg: 'dark',
        })
        if (currentId === renderIdRef.current) {
          setSvg(renderedSvg)
          setError(null)
          setRenderTime(Math.round(performance.now() - startTime))
          setIsRendering(false)
        }
      } catch (err: unknown) {
        if (currentId === renderIdRef.current) {
          const message = err instanceof Error ? err.message : 'Invalid Mermaid syntax'
          setError(message)
          setIsRendering(false)
        }
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [code, activePreset.id])

  return (
    <section
      className="py-24 sm:py-32 border-b border-neutral-800 bg-black text-white relative overflow-hidden"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}
    >
      {/* Interactive DotField Background Layer */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          contain: 'strict',
        }}
      >
        <DotField
          dotRadius={2.2}
          dotSpacing={16}
          bulgeStrength={67}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="rgba(255, 255, 255, 0.32)"
          gradientTo="rgba(255, 255, 255, 0.14)"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6" style={{ position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Try the syntax in real time.
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
            Select a diagram dialect below. Edit any node or relationship in the editor pane and watch the vector canvas compile instantaneously.
          </p>
        </div>

        {/* Preset Diagram Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-2 border-b border-neutral-800">
          {PRESETS.map((preset) => {
            const isActive = activePreset.id === preset.id
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-neutral-800 border-neutral-700 text-white shadow-xs'
                    : 'border-neutral-800/80 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <span>{preset.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-white/10 text-white' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {preset.badge}
                </span>
              </button>
            )
          })}
        </div>

        {/* Interactive Playground Split View */}
        <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/90 shadow-2xl backdrop-blur-xs">
          {/* Header Bar */}
          <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="font-mono text-white font-semibold">{activePreset.name}</span>
              <span className="text-neutral-400 hidden sm:inline">— {activePreset.description}</span>
            </div>

            <div className="flex items-center gap-2">
              {renderTime > 0 && !error && (
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  rendered in {renderTime}ms
                </span>
              )}
              {isRendering && (
                <span className="text-[11px] font-mono text-[var(--accent)] animate-pulse">
                  rendering...
                </span>
              )}
              <button
                onClick={handleCopy}
                title="Copy code"
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              </button>
              <button
                onClick={handleReset}
                title="Reset example"
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* Editor & Preview Panes */}
          <div className="grid lg:grid-cols-12 min-h-[380px] divide-y lg:divide-y-0 lg:divide-x divide-neutral-800">
            {/* Left: Interactive Editable Code Pane */}
            <div className="lg:col-span-5 bg-[var(--editor-bg)] flex flex-col">
              <div className="px-4 py-2 text-[11px] font-mono text-[var(--editor-text)]/60 border-b border-white/5 flex items-center justify-between">
                <span>SOURCE INPUT (EDITABLE)</span>
                <span className="text-[10px] text-[var(--editor-text)]/40">Try editing text</span>
              </div>
              <div className="flex-1 p-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  rows={14}
                  className="w-full h-full bg-transparent text-[var(--editor-text)] font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-[var(--accent)]/30"
                />
              </div>
            </div>

            {/* Right: Live Rendered SVG Pane */}
            <div className="lg:col-span-7 bg-neutral-900/60 p-6 flex flex-col justify-center items-center relative overflow-hidden">
              {error ? (
                <div className="w-full max-w-md p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span>⚠ Syntax Error</span>
                  </div>
                  <div className="text-[11px] leading-relaxed opacity-90">{error}</div>
                </div>
              ) : svg ? (
                <div
                  className="w-full h-full flex items-center justify-center p-2 max-h-[460px] overflow-auto [&>svg]:max-h-[400px] [&>svg]:w-auto [&>svg]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              ) : (
                <div className="text-xs text-neutral-400 font-mono flex items-center gap-2">
                  <Play size={14} className="animate-spin" />
                  <span>Synthesizing vector paths...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
