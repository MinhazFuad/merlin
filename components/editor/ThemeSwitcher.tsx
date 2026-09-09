'use client'

import { DIAGRAM_THEMES } from '@/lib/constants'
import { useEditorStore } from '@/store/editorStore'
import type { DiagramTheme } from '@/lib/validators/diagram'
import { Palette } from 'lucide-react'
import { useState } from 'react'

export function ThemeSwitcher() {
  const { theme, setTheme } = useEditorStore()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] transition-colors capitalize"
        title="Change theme"
      >
        <Palette size={14} />
        {theme}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg p-1.5 z-50">
          {DIAGRAM_THEMES.map((t) => (
            <button
              key={t}
              onClick={() => { setTheme(t as DiagramTheme); setOpen(false) }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors capitalize ${
                theme === t
                  ? 'bg-[var(--accent-muted)] text-[var(--accent)] font-medium'
                  : 'hover:bg-[var(--paper-100)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
