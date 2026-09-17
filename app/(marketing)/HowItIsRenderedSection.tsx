'use client'

import React, { useState } from 'react'
import { Cpu, ShieldCheck, Zap, Lock, Terminal, ArrowRight, FileCode2, Layers, Image as ImageIcon } from 'lucide-react'

interface PipelineStage {
  id: string
  step: string
  title: string
  shortDesc: string
  tag: string
  latency: string
  privacyNote: string
  codeSnippet: string
  details: string[]
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'source',
    step: 'STAGE 01',
    title: 'Diagram Source Text',
    shortDesc: 'Raw Markdown DSL stored in client state or Postgres metadata',
    tag: 'Payload: < 2 KB',
    latency: '0 ms',
    privacyNote: 'Only text strings are stored. No image files or telemetry.',
    codeSnippet: `// 1. Text payload stored in database
const diagram = {
  id: "d83f2a1b",
  title: "Auth Gateway",
  code: "flowchart TD\\n  Client --> Gateway\\n  Gateway --> Service",
  theme: "dark"
};`,
    details: [
      'Postgres never stores rendered pixels or cached blobs',
      'Minimizes bandwidth and guarantees complete diagram confidentiality',
      'Enables lightning-fast full-text searches and instant git diffs',
    ],
  },
  {
    id: 'parser',
    step: 'STAGE 02',
    title: 'Client-Side AST Parsing',
    shortDesc: 'Browser runs Mermaid tokenizer without external server pings',
    tag: 'Zero Network Traffic',
    latency: '~4 ms',
    privacyNote: 'Parsing runs entirely within your device memory.',
    codeSnippet: `// 2. Browser executes local Mermaid parser
import { loadMermaid } from '@/lib/mermaid/render';

const mermaid = await loadMermaid();
// Validates grammar and builds internal node graph
const { svg, bindFunctions } = await mermaid.render(
  'viewport_id',
  diagram.code
);`,
    details: [
      'Executes asynchronously inside a debounced 300ms queue',
      'Syntactical errors caught instantly without refreshing the page',
      'No external APIs or 3rd-party servers ever receive your source code',
    ],
  },
  {
    id: 'svg',
    step: 'STAGE 03',
    title: 'Vector DOM Generation',
    shortDesc: 'Direct synthesis of scalable SVG vectors inside the DOM tree',
    tag: 'Infinite Resolution',
    latency: '~8 ms',
    privacyNote: 'SVG paths are computed in browser geometry engine.',
    codeSnippet: `// 3. Browser synthesizes vector nodes
<svg viewBox="0 0 800 600" class="mermaid-svg">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" orient="auto">...</marker>
  </defs>
  <g class="nodes">
    <rect x="120" y="40" width="140" height="48" rx="6" />
    <text x="190" y="70">API Gateway</text>
  </g>
</svg>`,
    details: [
      'Hardware-accelerated pan, zoom, and fit-to-screen transforms',
      'Theme variables adapt instantly to dark/light canvas backgrounds',
      'Preserves crisp typography at any display scaling or zoom level',
    ],
  },
  {
    id: 'rasterizer',
    step: 'STAGE 04',
    title: 'In-Memory Rasterization',
    shortDesc: 'Native HTML5 Canvas exports crisp 1x/2x/3x PNG & JPG on demand',
    tag: 'Client-Side Export',
    latency: '~12 ms',
    privacyNote: 'Canvas exports convert to Blobs locally; zero upload.',
    codeSnippet: `// 4. Native Canvas rasterization on demand
const serializer = new XMLSerializer();
const svgStr = serializer.serializeToString(svgElement);
const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });

// Draw onto off-screen <canvas> scaled by 2x or 3x
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0, width * scale, height * scale);
canvas.toBlob(pngBlob => download(pngBlob));`,
    details: [
      'Exports high-DPI 2x and 3x retina images for slides and docs',
      'Supports transparent background or solid matte fills',
      'One-click "Copy Image" writes straight to the OS clipboard API',
    ],
  },
]

export default function HowItIsRenderedSection() {
  const [activeStage, setActiveStage] = useState<PipelineStage>(PIPELINE_STAGES[0])

  return (
    <section className="py-24 sm:py-32 border-b border-[var(--border)] bg-[var(--surface)] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[var(--border)] bg-[var(--bg)] text-xs font-mono text-[var(--accent)] mb-4 shadow-2xs">
            <Cpu size={13} />
            <span>02 · HOW IT'S RENDERED</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text)] tracking-tight leading-tight mb-4">
            Zero server roundtrips. 100% in your browser.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Most online diagram apps send your confidential architecture diagrams to a cloud server to render images. Merlin's architecture is radically different: the entire rendering and export pipeline runs strictly in your browser runtime.
          </p>
        </div>

        {/* Pipeline Stepper Buttons */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {PIPELINE_STAGES.map((stage) => {
            const isSelected = activeStage.id === stage.id
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[var(--bg)] border-[var(--accent)] shadow-xs ring-1 ring-[var(--accent)]'
                    : 'bg-[var(--paper-50)] border-[var(--border)] hover:border-[var(--ink-300)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-semibold text-[var(--accent)] tracking-wider">
                      {stage.step}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                      {stage.latency}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-[var(--text)] mb-1">{stage.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{stage.shortDesc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border)]/60 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[var(--text)]">{stage.tag}</span>
                  <ArrowRight
                    size={12}
                    className={`transition-transform ${isSelected ? 'translate-x-1 text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Active Stage Deep Dive Inspector */}
        <div className="border border-[var(--border)] rounded-2xl bg-[var(--bg)] p-6 sm:p-8 shadow-xs">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left: Technical Highlights */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] mb-2">
                  <span>STAGE DETAILS</span>
                  <span>/</span>
                  <span>{activeStage.step}</span>
                </div>
                <h4 className="text-2xl font-bold text-[var(--text)] mb-3">{activeStage.title}</h4>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{activeStage.shortDesc}</p>
              </div>

              {/* Guarantees List */}
              <div className="space-y-2.5">
                {activeStage.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[var(--text)]">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* Privacy Badge Banner */}
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--text)]">Privacy Guarantee</div>
                  <div className="text-xs text-[var(--text-muted)]">{activeStage.privacyNote}</div>
                </div>
              </div>
            </div>

            {/* Right: Under-the-hood Code Implementation */}
            <div className="lg:col-span-6 bg-[var(--editor-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="px-4 py-2.5 bg-black/30 border-b border-white/5 flex items-center justify-between text-xs font-mono text-[var(--editor-text)]/60">
                <span className="flex items-center gap-1.5">
                  <Terminal size={12} />
                  <span>pipeline_execution.ts</span>
                </span>
                <span className="text-[10px] text-emerald-400">client_only</span>
              </div>
              <div className="p-5 overflow-x-auto">
                <pre className="font-mono text-xs text-[var(--editor-text)] leading-relaxed">
                  <code>{activeStage.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
