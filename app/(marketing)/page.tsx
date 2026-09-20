import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

import Plasma from './Plasma'
import LandingNav from './LandingNav'
import HeroDiagramWindow from './HeroDiagramWindow'
import ManifestoSection from './ManifestoSection'
import WhatIsMermaidSection from './WhatIsMermaidSection'
import PrivacySection from './PrivacySection'
import EngineFeaturesSection from './EngineFeaturesSection'
import CtaBannerSection from './CtaBannerSection'

export const metadata: Metadata = {
  title: 'Merlin — Mermaid Diagram Editor',
  description: 'An open-source, client-side Mermaid diagram editor. Live preview, instant export, and shareable links.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] selection:bg-[var(--accent)]/20">
      {/* Floating Dynamic Glass Navigation Bar */}
      <LandingNav />

      {/* 
        Fullscreen Landing Hero:
        Takes up fullscreen with the Plasma background.
      */}
      <div
        className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden border-b border-[var(--border)] pt-20 pb-8"
        style={{ width: '100%', minHeight: '100vh', position: 'relative' }}
      >
        {/* Fullscreen Plasma Background */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}
        >
          <Plasma 
            color="#2563eb"
            speed={0.6}
            direction="forward"
            scale={1.1}
            opacity={0.8}
            mouseInteractive={false}
            iterations={32}
            renderScale={0.45}
            maxDpr={1.2}
            targetFps={30}
          />
        </div>

        {/* Hero Content: Two-Column Product-First Layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 pointer-events-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Subtitle, CTA buttons, and Value Props */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-start text-left">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[var(--text)] leading-[1.12] mb-6 max-w-2xl tracking-tight">
                Mermaid diagrams,{' '}
                <span className="text-[var(--accent)]">
                  done properly.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-xl mb-8 leading-relaxed">
                Write diagram source, see a live preview, export as SVG / PNG / JPG.
                Save to your account, share with a link. No server roundtrips.
              </p>

              <div className="flex flex-wrap gap-3.5 justify-start mb-10">
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-lg font-medium text-sm transition-all shadow-xs hover:shadow-md cursor-pointer"
                >
                  Open editor
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 border border-[var(--border)] hover:border-[var(--ink-300)] bg-[var(--surface)]/90 backdrop-blur-xs text-[var(--text)] px-6 py-3 rounded-lg font-medium text-sm transition-colors cursor-pointer"
                >
                  Create free account
                </Link>
              </div>

              {/* User-Oriented Product Marketing Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 pt-6 border-t border-[var(--border)]/70 text-left w-full">
                <div>
                  <div className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider">Zero Friction</div>
                  <div className="text-sm sm:text-base font-bold text-[var(--text)] mt-1">No Sign-Up Needed</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5 leading-snug">Open and start diagramming immediately</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider">Live Rendering</div>
                  <div className="text-sm sm:text-base font-bold text-[var(--text)] mt-1">Instant Keystroke Sync</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5 leading-snug">Real-time visual feedback with zero lag</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider">Total Privacy</div>
                  <div className="text-sm sm:text-base font-bold text-[var(--text)] mt-1">100% Local Processing</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5 leading-snug">Your source code never leaves your browser</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider">Production Export</div>
                  <div className="text-sm sm:text-base font-bold text-[var(--text)] mt-1">Lossless SVG & Ultra HD</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5 leading-snug">Crisp vectors ready for docs, decks & PRs</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Diagram Preview Window */}
            <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end w-full">
              <HeroDiagramWindow />
            </div>
          </div>
        </div>

        {/* Soft fade at bottom edge into border */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none bg-gradient-to-t from-[var(--bg)] to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Editorial Content Sections with Alternating Cadence: Grey -> Black+Dots -> Grey -> Black+Dots -> Grey */}
      <main className="flex-1 relative z-10 bg-[var(--bg)]">
        {/* 01: Grey Section (No dots) — Manifesto & Scale */}
        <ManifestoSection />

        {/* 02: Black Section (With DotField) — Interactive Editor Workbench */}
        <WhatIsMermaidSection />

        {/* 03: Grey Section (No dots) — Architecture & Privacy */}
        <PrivacySection />

        {/* 04: Black Section (With DotField) — Developer Engine & Workflow */}
        <EngineFeaturesSection />

        {/* 05: Grey Section (No dots) — Final Action CTA Banner */}
        <CtaBannerSection />
      </main>

      {/* Minimalist Developer Footer */}
      <footer className="border-t border-[var(--border)] py-12 bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[var(--text)]">Merlin</span>
            <span>·</span>
            <span>Open-source client-side Mermaid editor</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/editor" className="hover:text-[var(--text)] transition-colors">
              Editor
            </Link>
            <Link href="/dashboard" className="hover:text-[var(--text)] transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-[var(--text)] transition-colors">
              Sign In
            </Link>
            <a
              href="https://mermaid.js.org/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--text)] transition-colors"
            >
              Mermaid Docs
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--text)] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
