'use client'

import React, { useState } from 'react'
import {
  Zap,
  Download,
  Share2,
  Shield,
  Keyboard,
  Maximize2,
  Database,
  Sliders,
  Sparkles,
  Command,
  FileCheck,
  Check
} from 'lucide-react'

export default function FeaturesGridSection() {
  const [activeHotkey, setActiveHotkey] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleTestHotkey = (key: string) => {
    setActiveHotkey(key)
    setTimeout(() => setActiveHotkey(null), 1500)
  }

  return (
    <section className="py-24 sm:py-32 border-b border-[var(--border)] bg-[var(--surface)] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[var(--border)] bg-[var(--bg)] text-xs font-mono text-[var(--accent)] mb-4 shadow-2xs">
            <Sliders size={13} />
            <span>04 · FEATURES OF MERLIN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text)] tracking-tight leading-tight mb-4">
            Engineered for developers who demand speed.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Every feature in Merlin is designed to eliminate friction between your thought process and your architecture documentation.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: 300ms Debounced Engine */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--ink-300)] transition-all flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-4">
                <Zap size={18} />
              </div>
              <h3 className="font-bold text-base text-[var(--text)] mb-2">Zero-Flicker Debounce</h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                An intelligent 300ms render buffer recalculates layouts seamlessly as you type without stuttering the canvas or locking your thread.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>BUFFER LATENCY</span>
              <span className="text-emerald-500 font-semibold">300ms adaptive</span>
            </div>
          </div>

          {/* Card 2: 1x/2x/3x Retina Rasterizer */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--ink-300)] transition-all flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-4">
                <Download size={18} />
              </div>
              <h3 className="font-bold text-base text-[var(--text)] mb-2">Retina Canvas Rasterizer</h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Export vector SVG or rasterize to PNG & JPG at 1x, 2x, or 3x pixel density. Perfect for slide decks, blog posts, and technical whitepapers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>MAX RESOLUTION</span>
              <span className="text-[var(--accent)] font-semibold">3× Ultra DPI</span>
            </div>
          </div>

          {/* Card 3: Keyboard-First Shortcuts */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--ink-300)] transition-all flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-4">
                <Keyboard size={18} />
              </div>
              <h3 className="font-bold text-base text-[var(--text)] mb-2">Keyboard Hotkeys</h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-3">
                Keep your hands on the keyboard. Click any shortcut to preview the command:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'Cmd + S', label: 'Save' },
                  { key: 'Cmd + Enter', label: 'Force Render' },
                  { key: 'Cmd + /', label: 'Syntax Cheat Sheet' },
                ].map((hk) => (
                  <button
                    key={hk.key}
                    onClick={() => handleTestHotkey(hk.label)}
                    className={`px-2 py-1 rounded text-[10px] font-mono border cursor-pointer transition-colors ${
                      activeHotkey === hk.label
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text)] hover:border-[var(--ink-300)]'
                    }`}
                  >
                    {hk.key}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)] flex justify-between">
              <span>TRIGGERED ACTION</span>
              <span className="text-[var(--accent)] font-semibold">{activeHotkey || 'None (click key)'}</span>
            </div>
          </div>

          {/* Card 4: Strict Privacy Boundary */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--ink-300)] transition-all flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-emerald-500 mb-4">
                <Shield size={18} />
              </div>
              <h3 className="font-bold text-base text-[var(--text)] mb-2">Zero-Image Privacy Boundary</h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Supabase Postgres strictly stores diagram text and metadata. We never render, cache, or process your architecture drawings on our servers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>CLOUD STORAGE</span>
              <span className="text-emerald-500 font-semibold">Source text only</span>
            </div>
          </div>

          {/* Card 5: Public Permalinks & Forking */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--ink-300)] transition-all flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-4">
                <Share2 size={18} />
              </div>
              <h3 className="font-bold text-base text-[var(--text)] mb-2">Shareable URLs & 1-Click Fork</h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Generate clean, random permalinks like <code className="text-xs font-mono bg-[var(--surface)] px-1 py-0.5 rounded border border-[var(--border)]">/s/x7a9m2</code>. Viewers can view read-only or fork directly into their account.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>PERMALINK SLUG</span>
              <span className="text-[var(--text)] font-semibold">Nanoid collision-proof</span>
            </div>
          </div>

          {/* Card 6: Pan, Zoom & Fit-to-Screen */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--ink-300)] transition-all flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-4">
                <Maximize2 size={18} />
              </div>
              <h3 className="font-bold text-base text-[var(--text)] mb-2">Infinite Pan & Zoom Canvas</h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Fluid mouse wheel zoom, trackpad pinch, click-and-drag panning, and instant 100% or "Fit to Screen" camera resets for large system architectures.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>CAMERA CONTROLS</span>
              <span className="text-[var(--text)] font-semibold">Trackpad & Mouse</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
