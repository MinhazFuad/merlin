'use client'

import React, { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: 10, suffix: '+', label: 'Diagram Types', sublabel: 'Flowchart · Sequence · State · Class · Git · ER · Gantt · Mindmap · Timeline · Quadrant' },
  { value: 0, suffix: ' B', label: 'Data Sent to Servers', sublabel: 'Every render happens entirely inside your browser. Your code never leaves.' },
  { value: 100, suffix: '%', label: 'Client-Side', sublabel: 'Pure in-browser compilation. No runtime server, no telemetry, no cost.' },
]

function useCountUp(target: number, duration: number, active: boolean): number {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    if (target === 0) { setCount(0); return }
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])
  return count
}

interface StatCardProps {
  value: number
  suffix: string
  label: string
  sublabel: string
  active: boolean
}

function StatCard({ value, suffix, label, sublabel, active }: StatCardProps) {
  const count = useCountUp(value, 1200, active)
  return (
    <div className="flex flex-col">
      <div className="text-5xl sm:text-7xl font-black text-[var(--text)] tracking-tight tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-xs font-bold text-[var(--accent)] mt-3 uppercase tracking-widest">
        {label}
      </div>
      <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed max-w-xs">
        {sublabel}
      </p>
    </div>
  )
}

const DIAGRAM_TYPES = [
  'Flowchart', 'Sequence Diagram', 'State Machine', 'Class Diagram',
  'Git Graph', 'ER Diagram', 'Gantt Chart', 'Quadrant Chart',
  'Mindmap', 'Timeline', 'Block Diagram', 'Sankey Diagram',
]

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect() } },
      { threshold: 0.25 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-28 sm:py-36 border-b border-[var(--border)] overflow-hidden bg-[var(--surface)]"
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mb-20">
          <p className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-widest mb-4">The philosophy</p>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[var(--text)] tracking-tight leading-[1.06]">
            Code is your design tool.
            <br />
            <span className="text-[var(--text-muted)] font-bold">Zero dragging. Zero alignment fiddling.</span>
          </h2>
          <p className="text-lg sm:text-2xl text-[var(--text-muted)] max-w-2xl mt-8 font-medium leading-relaxed">
            Describe your nodes and relationships in plain text. Merlin calculates the layout, routes the connectors, and produces pure vector art — all inside your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-16 pt-12 border-t border-[var(--border)]">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} active={active} />
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-[var(--border)]">
          <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Supported diagram syntax</p>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--surface)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--surface)] to-transparent z-10 pointer-events-none" />
            <div className="flex gap-3 whitespace-nowrap w-max" style={{ animation: 'marquee 28s linear infinite' }}>
              {[...DIAGRAM_TYPES, ...DIAGRAM_TYPES].map((type, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)] text-xs font-medium text-[var(--text-muted)] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  )
}
