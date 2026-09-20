import React from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, Download } from 'lucide-react'

const PROOF_POINTS = [
  { icon: Zap, text: 'No signup required' },
  { icon: Shield, text: '100% client-side — zero data sent' },
  { icon: Download, text: 'Export SVG, PNG, JPEG' },
]

export default function CtaBannerSection() {
  return (
    <section className="relative py-28 sm:py-36 border-b border-[var(--border)] overflow-hidden bg-[var(--surface)]">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-left sm:text-center">
        <p className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-widest mb-5 sm:text-center">
          Get started now
        </p>
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[var(--text)] tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Start building diagrams at the speed of code.
        </h2>

        <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-xl mx-auto mt-6 leading-relaxed">
          Open the editor immediately with zero signup, or create a free account to sync diagrams across your devices.
        </p>

        {/* Proof points */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 justify-start sm:justify-center mt-8">
          {PROOF_POINTS.map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Icon size={14} className="text-[var(--accent)]" />
              {text}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 justify-start sm:justify-center mt-10">
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-7 py-3.5 rounded-xl font-medium text-sm transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            Launch Editor
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 border border-[var(--border)] hover:border-[var(--ink-300)] bg-[var(--bg)] text-[var(--text)] px-7 py-3.5 rounded-xl font-medium text-sm transition-colors cursor-pointer"
          >
            Create free account
          </Link>
        </div>
      </div>
    </section>
  )
}
