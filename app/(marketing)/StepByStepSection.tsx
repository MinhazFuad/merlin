'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  Layers,
  AlertTriangle,
  Palette,
  Share2,
  Download,
  Copy,
  Check,
  Eye,
  CheckCircle2,
  ExternalLink
} from 'lucide-react'

export default function StepByStepSection() {
  // Step 1 state
  const [selectedTemplate, setSelectedTemplate] = useState<'flow' | 'seq' | 'arch' | 'er'>('flow')

  // Step 2 state: Error simulation
  const [hasSyntaxError, setHasSyntaxError] = useState(false)

  // Step 3 state: Theme switcher
  const [activeTheme, setActiveTheme] = useState<'dark' | 'neutral' | 'forest' | 'default'>('dark')

  // Step 4 state: Export simulation
  const [exportSuccess, setExportSuccess] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  const handleSimulateExport = (format: string) => {
    setExportSuccess(format)
    setTimeout(() => setExportSuccess(null), 2200)
  }

  const handleCopyLink = () => {
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2200)
  }

  return (
    <section className="py-24 sm:py-32 border-b border-[var(--border)] bg-[var(--bg)] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--accent)] mb-4 shadow-2xs">
            <Layers size={13} />
            <span>03 · STEP BY STEP WITH MERLIN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text)] tracking-tight leading-tight mb-4">
            From rough idea to publishable graphic in 4 steps.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Merlin streamlines every friction point of the diagramming workflow: templates jumpstart your layout, the error-resilient editor protects your focus, and client-side rasterizers produce crisp presentation exports.
          </p>
        </div>

        {/* 4 Linear Step Cards */}
        <div className="space-y-12">
          {/* STEP 1 */}
          <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] p-6 sm:p-8 shadow-xs">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-mono text-[var(--accent)] font-semibold tracking-wider">
                  STEP 01 / START FAST
                </div>
                <h3 className="text-2xl font-bold text-[var(--text)]">Choose a blueprint or start clean</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Never stare at a blank prompt. Pick from over 10 production-ready templates covering decision flows, sequence calls, microservices, and database ER schemas.
                </p>

                {/* Interactive Template Selector */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    { id: 'flow', label: 'Flowchart' },
                    { id: 'seq', label: 'Sequence Diagram' },
                    { id: 'arch', label: 'Microservices' },
                    { id: 'er', label: 'Database Schema' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id as any)}
                      className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
                        selectedTemplate === t.id
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                          : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 1 Interactive Preview */}
              <div className="lg:col-span-7 bg-[var(--editor-bg)] rounded-xl border border-[var(--border)] p-4 font-mono text-xs text-[var(--editor-text)] overflow-hidden shadow-inner">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] text-[var(--editor-text)]/50">
                  <span>template_{selectedTemplate}.mmd</span>
                  <span className="text-emerald-400">ready to load</span>
                </div>
                <pre className="overflow-x-auto leading-relaxed text-[11px]">
                  {selectedTemplate === 'flow' &&
                    `flowchart LR\n  Start([Initiate Request]) --> Validate{Pass Auth?}\n  Validate -- Yes --> Svc[Microservice Handler]\n  Validate -- No --> 401([Reject Unauthorized])`}
                  {selectedTemplate === 'seq' &&
                    `sequenceDiagram\n  Client->>AuthService: Login(credentials)\n  AuthService-->>Client: JWT Session Token\n  Client->>API: GET /v1/diagrams (Bearer)`}
                  {selectedTemplate === 'arch' &&
                    `flowchart TB\n  subgraph Ingestion [Ingress Tier]\n    LB[Load Balancer] --> App1[App Node 1]\n    LB --> App2[App Node 2]\n  end`}
                  {selectedTemplate === 'er' &&
                    `erDiagram\n  USER ||--o{ DIAGRAM : creates\n  DIAGRAM ||--o{ SHARE_TOKEN : generates\n  DIAGRAM { uuid id, string title, string code }`}
                </pre>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] p-6 sm:p-8 shadow-xs">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-mono text-[var(--accent)] font-semibold tracking-wider">
                  STEP 02 / CODE WITH CONFIDENCE
                </div>
                <h3 className="text-2xl font-bold text-[var(--text)]">Write with non-blocking error shields</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  In standard Mermaid editors, a single missing bracket blanks out your entire canvas. Merlin isolates parser exceptions and preserves your last valid render, showing a subtle inline banner with the exact syntax mismatch.
                </p>

                {/* Interactive Error Toggle Simulator */}
                <div className="pt-2">
                  <button
                    onClick={() => setHasSyntaxError(!hasSyntaxError)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
                      hasSyntaxError
                        ? 'bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400'
                        : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text)] hover:border-[var(--ink-300)]'
                    }`}
                  >
                    <AlertTriangle size={14} className={hasSyntaxError ? 'text-red-500' : 'text-[var(--text-muted)]'} />
                    <span>{hasSyntaxError ? 'Fix Syntax Error' : 'Simulate Syntax Typo'}</span>
                  </button>
                </div>
              </div>

              {/* Step 2 Interactive Simulator Visual */}
              <div className="lg:col-span-7 bg-[var(--bg)] rounded-xl border border-[var(--border)] p-4 flex flex-col justify-between min-h-[220px]">
                {hasSyntaxError ? (
                  <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-mono mb-4 flex items-start gap-2.5">
                    <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Syntax error on line 3</div>
                      <div className="text-[11px] opacity-80 mt-0.5">Parse error: Unexpected token '---&gt;'. Retaining last valid preview.</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-mono mb-4 flex items-center gap-2">
                    <CheckCircle2 size={15} />
                    <span>Syntax valid · Debounced live preview active</span>
                  </div>
                )}

                {/* Simulated Diagram Box */}
                <div className="flex-1 border border-dashed border-[var(--border)] rounded-lg flex items-center justify-center p-6 bg-[var(--surface)] text-center">
                  <div className="space-y-2">
                    <div className="inline-block px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--paper-100)] text-xs font-medium text-[var(--text)]">
                      User Request → Auth Gate → Service Node
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {hasSyntaxError ? '(Last valid render stays visible)' : '(Live render updated)'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] p-6 sm:p-8 shadow-xs">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-mono text-[var(--accent)] font-semibold tracking-wider">
                  STEP 03 / THEME & CANVAS
                </div>
                <h3 className="text-2xl font-bold text-[var(--text)]">Switch themes without re-writing code</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Tailor your diagram aesthetics to match your documentation, slides, or IDE. Switch between Default, Dark, Forest, and Neutral color schemes in one click.
                </p>

                {/* Interactive Theme Switcher */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    { id: 'dark', label: 'Dark Mode', color: '#18181b' },
                    { id: 'neutral', label: 'Neutral Slate', color: '#64748b' },
                    { id: 'forest', label: 'Forest Green', color: '#059669' },
                    { id: 'default', label: 'Default Light', color: '#f4f4f5' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setActiveTheme(theme.id as any)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 cursor-pointer transition-all ${
                        activeTheme === theme.id
                          ? 'bg-[var(--surface)] border-[var(--accent)] ring-1 ring-[var(--accent)] text-[var(--text)] shadow-2xs'
                          : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: theme.color }} />
                      <span>{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3 Visual Swatch Display */}
              <div
                className={`lg:col-span-7 rounded-xl border p-8 flex items-center justify-center transition-all duration-300 min-h-[220px] ${
                  activeTheme === 'dark'
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-100'
                    : activeTheme === 'neutral'
                    ? 'bg-slate-900 border-slate-700 text-slate-100'
                    : activeTheme === 'forest'
                    ? 'bg-emerald-950 border-emerald-800 text-emerald-100'
                    : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="px-3.5 py-2 rounded-md border border-current/30 bg-current/5 font-semibold">
                    Client App
                  </div>
                  <span className="opacity-60">────────▶</span>
                  <div className="px-3.5 py-2 rounded-md border border-current/30 bg-current/5 font-semibold">
                    Merlin Runtime
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] p-6 sm:p-8 shadow-xs">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-mono text-[var(--accent)] font-semibold tracking-wider">
                  STEP 04 / EXPORT & SHARE
                </div>
                <h3 className="text-2xl font-bold text-[var(--text)]">Export at up to 3x scale or share via link</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Need a vector file for Figma? Download clean SVG. Need razor-sharp slides? Rasterize at 2x or 3x scale. Need peer feedback? Generate a shareable link that colleagues can clone in one click.
                </p>

                {/* Interactive Action Simulator */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleSimulateExport('SVG Vector')}
                    className="px-3.5 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs font-medium text-[var(--text)] hover:border-[var(--accent)] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download size={13} />
                    <span>SVG</span>
                  </button>
                  <button
                    onClick={() => handleSimulateExport('PNG (2x Retina)')}
                    className="px-3.5 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs font-medium text-[var(--text)] hover:border-[var(--accent)] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download size={13} />
                    <span>PNG (2x)</span>
                  </button>
                  <button
                    onClick={() => handleSimulateExport('PNG (3x Ultra)')}
                    className="px-3.5 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs font-medium text-[var(--text)] hover:border-[var(--accent)] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download size={13} />
                    <span>PNG (3x)</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:bg-[var(--accent-hover)] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedLink ? <Check size={13} /> : <Share2 size={13} />}
                    <span>{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
                  </button>
                </div>
              </div>

              {/* Step 4 Visual Feedback Box */}
              <div className="lg:col-span-7 bg-[var(--paper-100)] rounded-xl border border-[var(--border)] p-6 flex flex-col justify-center items-center min-h-[200px] text-center">
                {exportSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono space-y-1">
                    <div className="font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={14} />
                      <span>{exportSuccess} generated</span>
                    </div>
                    <div className="text-[11px] opacity-80">Rasterized in-memory via HTML5 Canvas</div>
                  </div>
                ) : copiedLink ? (
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[var(--accent)] text-xs font-mono space-y-1">
                    <div className="font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={14} />
                      <span>https://merlin.dev/s/7x9q2m1p</span>
                    </div>
                    <div className="text-[11px] opacity-80">Copied to clipboard · Read-only view with fork button</div>
                  </div>
                ) : (
                  <div className="space-y-1 text-xs text-[var(--text-muted)] font-mono">
                    <div className="text-[var(--text)] font-semibold">Ready for instantaneous client export</div>
                    <div className="text-[11px]">Click any format above to test rasterization speed</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
