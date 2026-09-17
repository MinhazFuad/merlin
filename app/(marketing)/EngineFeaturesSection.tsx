'use client'

import React from 'react'
import Link from 'next/link'
import { Terminal, Download, Share2, ArrowRight, Zap, Code2, Check, FileCode2 } from 'lucide-react'
import DotField from './DotField'

export default function EngineFeaturesSection() {
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
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Built for developer speed.
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
            Eliminate friction between system design and documentation. Merlin provides a specialized code-first environment tuned for engineering teams.
          </p>
        </div>

        {/* 3 Developer Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Module 1: Code-First Editor */}
          <div className="p-7 rounded-2xl border border-neutral-800 bg-neutral-950/90 shadow-2xl backdrop-blur-xs flex flex-col justify-between hover:border-neutral-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[var(--accent)] mb-5">
                <Terminal size={18} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">
                Monospaced Code Engine
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                CodeMirror-powered editor with auto-formatting, bracket matching, syntax coloring, and instant syntax validation as you type.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-800 space-y-2 font-mono text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Check size={13} className="text-emerald-500 shrink-0" />
                <span>Zero-flicker debounced compiler</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={13} className="text-emerald-500 shrink-0" />
                <span>Instant visual error inline markers</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={13} className="text-emerald-500 shrink-0" />
                <span>Monospaced font pairing</span>
              </div>
            </div>
          </div>

          {/* Module 2: Export Pipeline */}
          <div className="p-7 rounded-2xl border border-neutral-800 bg-neutral-950/90 shadow-2xl backdrop-blur-xs flex flex-col justify-between hover:border-neutral-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[var(--accent)] mb-5">
                <Download size={18} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">
                Multi-Scale Vector Export
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                Generate clean, scalable vector SVG files for Figma and web docs, or render retina-ready PNGs at 1x, 2x, and 3x resolution.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-800 space-y-2 font-mono text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Check size={13} className="text-emerald-500 shrink-0" />
                <span>Standards-compliant vector SVG</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={13} className="text-emerald-500 shrink-0" />
                <span>1x, 2x, 3x Retina PNG rasterization</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={13} className="text-emerald-500 shrink-0" />
                <span>One-click clipboard image copy</span>
              </div>
            </div>
          </div>

          {/* Module 3: Deep-Link Sharing */}
          <div className="p-7 rounded-2xl border border-neutral-800 bg-neutral-950/90 shadow-2xl backdrop-blur-xs flex flex-col justify-between hover:border-neutral-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[var(--accent)] mb-5">
                <Share2 size={18} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">
                Zero-Friction Sharing
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                Share diagrams with teammates via direct URL links. The recipient can immediately inspect, fork, and edit without creating an account.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-800 space-y-2 font-mono text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Check size={13} className="text-emerald-500 shrink-0" />
                <span>Self-contained shareable links</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={13} className="text-emerald-500 shrink-0" />
                <span>Markdown embed snippet generator</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={13} className="text-emerald-500 shrink-0" />
                <span>Optional Supabase cloud sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launch CTA Strip */}
        <div className="mt-12 p-6 rounded-2xl border border-neutral-800 bg-neutral-950/90 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Zap size={18} className="text-[var(--accent)]" />
            <span className="text-sm font-semibold text-white">
              Ready to write your first diagram?
            </span>
            <span className="text-xs text-neutral-400 hidden md:inline">
              No registration or setup needed.
            </span>
          </div>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <span>Open Editor</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

