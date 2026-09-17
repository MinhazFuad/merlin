import React from 'react'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CtaBannerSection() {
  return (
    <section className="relative py-28 sm:py-36 border-b border-[var(--border)] overflow-hidden bg-[var(--surface)]">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-left sm:text-center">
        {/* Big Letters / Minimal Writing */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[var(--text)] tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Start building diagrams at the speed of code.
        </h2>

        <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-xl mx-auto mt-6 leading-relaxed">
          Open the editor immediately with zero signup, or create a free account to sync diagrams across your devices.
        </p>

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
