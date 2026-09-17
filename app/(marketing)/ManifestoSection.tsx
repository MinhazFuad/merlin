import React from 'react'


export default function ManifestoSection() {
  return (
    <section className="relative py-28 sm:py-36 border-b border-[var(--border)] overflow-hidden bg-[var(--surface)]">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Big Letters / Impactful Typography */}
        <div className="max-w-4xl">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[var(--text)] tracking-tight leading-[1.06]">
            Code is your design tool.
            <br />
            <span className="text-[var(--text-muted)] font-bold">
              Zero dragging. Zero alignment fiddling.
            </span>
          </h2>

          <p className="text-lg sm:text-2xl text-[var(--text-muted)] max-w-2xl mt-8 font-medium leading-relaxed">
            Describe nodes and relationships in plain text. Merlin calculates the layout, routes the connectors, and renders pure vector art.
          </p>
        </div>

        {/* 3 Large Stat Anchors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mt-16 pt-12 border-t border-[var(--border)]">
          <div>
            <div className="text-4xl sm:text-6xl font-black text-[var(--text)] tracking-tight font-mono">
              10+
            </div>
            <div className="text-sm font-semibold text-[var(--accent)] mt-2 uppercase tracking-wide font-mono">
              Diagram Dialects
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
              Flowcharts, sequences, state machines, class schemas, git trees, ERDs.
            </p>
          </div>

          <div>
            <div className="text-4xl sm:text-6xl font-black text-[var(--text)] tracking-tight font-mono">
              &lt; 16ms
            </div>
            <div className="text-sm font-semibold text-[var(--accent)] mt-2 uppercase tracking-wide font-mono">
              Render Latency
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
              Sub-millisecond parsing directly in your browser without network roundtrips.
            </p>
          </div>

          <div>
            <div className="text-4xl sm:text-6xl font-black text-[var(--text)] tracking-tight font-mono">
              0 B
            </div>
            <div className="text-sm font-semibold text-[var(--accent)] mt-2 uppercase tracking-wide font-mono">
              Server Overhead
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
              Pure client-side execution. Zero server pixels, zero tracking, total privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
