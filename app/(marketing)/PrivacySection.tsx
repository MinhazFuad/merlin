import React from 'react'

import { Shield, Lock, Cpu } from 'lucide-react'

export default function PrivacySection() {
  return (
    <section className="relative py-28 sm:py-36 border-b border-[var(--border)] overflow-hidden bg-[var(--surface)]">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Big Letters / Impactful Typography */}
        <div className="max-w-4xl">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[var(--text)] tracking-tight leading-[1.06]">
            Your architecture stays on your machine.
            <br />
            <span className="text-[var(--accent)]">
              Air-gapped by design.
            </span>
          </h2>

          <p className="text-lg sm:text-2xl text-[var(--text-muted)] max-w-2xl mt-8 font-medium leading-relaxed">
            Proprietary microservice architectures, enterprise database schemas, and confidential flows never touch a backend server.
          </p>
        </div>

        {/* 3 Architectural Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mt-16 pt-12 border-t border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-[var(--text)]">
              <Cpu size={18} className="text-[var(--accent)]" />
              <span>Local Tokenizer</span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
              The Mermaid grammar parser executes strictly inside your browser sandbox. No telemetry pings, no external dependencies.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-[var(--text)]">
              <Lock size={18} className="text-[var(--accent)]" />
              <span>Zero-Storage Sharing</span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
              Share diagrams through self-contained compressed URL hashes. Teammates render the graphic on their own CPU with zero database footprint.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-[var(--text)]">
              <Shield size={18} className="text-[var(--accent)]" />
              <span>GPU-Accelerated Raster</span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
              High-resolution PNG and vector SVG generation happens directly on an HTML5 canvas in your local VRAM.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
