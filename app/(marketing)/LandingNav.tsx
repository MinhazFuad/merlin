'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import GlassSurface from './GlassSurface'

export default function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let ticking = false
    let lastState = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const next = window.scrollY > 25
          if (next !== lastState) {
            lastState = next
            setIsScrolled(next)
          }
          ticking = false
        })
        ticking = true
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none transition-all duration-300 transform-gpu">
      <GlassSurface
        width={isScrolled ? 'min(960px, calc(100vw - 32px))' : 'min(1200px, calc(100vw - 32px))'}
        height={isScrolled ? 52 : 58}
        borderRadius={isScrolled ? 999 : 20}
        backgroundOpacity={isScrolled ? 0.15 : 0.05}
        borderWidth={0.07}
        distortionScale={isScrolled ? -140 : -180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        blur={11}
        brightness={50}
        opacity={0.93}
        saturation={1.4}
        className="pointer-events-auto shadow-xs hover:shadow-md"
        style={{
          transition: 'width 0.38s cubic-bezier(0.16, 1, 0.3, 1), height 0.38s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.38s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.38s cubic-bezier(0.16, 1, 0.3, 1), background 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className={`w-full h-full flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'px-3 sm:px-3.5' : 'px-4 sm:px-5'
          }`}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className={`flex items-center group cursor-pointer transition-transform duration-300 ${
              isScrolled ? 'translate-x-[2.5px]' : 'translate-x-0'
            }`}
          >
            <span className="font-semibold text-[var(--text)] tracking-tight text-sm sm:text-base group-hover:opacity-85 transition-opacity">
              Merlin
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5 sm:gap-2.5">
            <Link
              href="/editor"
              className={`text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 border transition-all duration-300 ease-out ${
                isScrolled
                  ? 'rounded-full border-transparent bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]/40 shadow-none'
                  : 'rounded-xl border-[var(--border)] dark:border-white/15 bg-[var(--surface)]/70 dark:bg-white/[0.08] text-[var(--text)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] hover:bg-[var(--surface)] dark:hover:bg-white/[0.14] shadow-2xs backdrop-blur-xs'
              }`}
            >
              Editor
            </Link>
            <Link
              href="/login"
              className={`text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 border transition-all duration-300 ease-out ${
                isScrolled
                  ? 'rounded-full border-transparent bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]/40 shadow-none'
                  : 'rounded-xl border-[var(--border)] dark:border-white/15 bg-[var(--surface)]/70 dark:bg-white/[0.08] text-[var(--text)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] hover:bg-[var(--surface)] dark:hover:bg-white/[0.14] shadow-2xs backdrop-blur-xs'
              }`}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={`text-xs sm:text-sm font-medium px-3 sm:px-3.5 py-1.5 border transition-all duration-300 ease-out ml-0.5 sm:ml-1 ${
                isScrolled
                  ? 'rounded-full border-[var(--accent)] text-[var(--accent)] bg-transparent hover:bg-[var(--accent)]/10 shadow-none'
                  : 'rounded-xl border-transparent bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-xs hover:shadow-sm'
              }`}
            >
              Get started
            </Link>
          </nav>
        </div>
      </GlassSurface>
    </header>
  )
}
