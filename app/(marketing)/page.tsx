import Link from 'next/link'
import { ArrowRight, GitBranch, Zap, Shield, Download } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Merlin — Mermaid Diagram Editor',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text)] tracking-tight">Merlin</span>
            <span className="text-xs text-[var(--text-muted)] border border-[var(--border)] rounded px-1.5 py-0.5">
              beta
            </span>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/editor"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              Editor
            </Link>
            <Link
              href="/login"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-3 py-1.5 rounded-md font-medium transition-colors"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 py-24 text-center">
          <p className="text-sm font-medium text-[var(--accent)] mb-4 uppercase tracking-widest">
            Open Source · Self-Hostable
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] leading-tight mb-6">
            Mermaid diagrams,{' '}
            <span className="text-[var(--accent)]">done properly.</span>
          </h1>
          <p className="text-lg text-[var(--text-muted)] max-w-xl mx-auto mb-10 leading-relaxed">
            Write diagram source, see a live preview, export as SVG / PNG / JPG.
            Save to your account, share with a link.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors"
            >
              Open editor
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 border border-[var(--border)] hover:border-[var(--ink-300)] text-[var(--text)] px-5 py-2.5 rounded-md font-medium text-sm transition-colors"
            >
              Create free account
            </Link>
          </div>
        </section>

        {/* Features grid */}
        <section className="max-w-5xl mx-auto px-4 pb-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <Zap size={18} />,
                title: 'Live preview',
                body: 'Renders as you type with a 300ms debounce. Errors shown inline — never a blank pane.',
              },
              {
                icon: <Download size={18} />,
                title: 'Client-side export',
                body: 'SVG, PNG, JPG at 1×/2×/3×. All rendering is in your browser — nothing hits a server.',
              },
              {
                icon: <GitBranch size={18} />,
                title: 'Share by link',
                body: 'Generate a short URL for any public diagram. Viewers can duplicate it to their account.',
              },
              {
                icon: <Shield size={18} />,
                title: 'Privacy-first',
                body: 'Only diagram source is stored — never a rendered image. Your diagrams stay yours.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="border border-[var(--border)] rounded-lg p-5 bg-[var(--surface)]"
              >
                <div className="text-[var(--accent)] mb-3">{f.icon}</div>
                <h3 className="font-semibold text-sm text-[var(--text)] mb-1.5">{f.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text-muted)]">
        Merlin is open source.{' '}
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-[var(--text)] underline underline-offset-2"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  )
}
