'use client'

import { useState, useRef, useEffect } from 'react'
import { LINE_COLOR_PRESETS, FILL_COLOR_PRESETS, isLightColor } from '@/lib/constants'
import { useEditorStore } from '@/store/editorStore'
import {
  Sun,
  Moon,
  Check,
  ChevronDown,
  Pipette,
  Layers,
  Sparkles,
} from 'lucide-react'

export function ThemeSwitcher() {
  const {
    lineColor,
    setLineColor,
    fillColor,
    setFillColor,
    canvasBg,
    setCanvasBg,
  } = useEditorStore()

  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  function handleSelectLineColor(color: string) {
    setLineColor(color)
    // If black lines selected on dark canvas, switch to light canvas for contrast
    if (color === '#000000' && canvasBg === 'dark') {
      setCanvasBg('light')
    }
  }

  function handleSelectCanvasBg(bg: 'dark' | 'light') {
    setCanvasBg(bg)
  }

  const isLightCanvas = canvasBg === 'light'
  const isLightFill =
    fillColor === 'transparent'
      ? isLightCanvas
      : isLightColor(fillColor)

  const sampleTextColor = isLightFill ? '#0f172a' : '#f4f4f5'

  return (
    <div className="relative" ref={menuRef}>
      {/* Modern Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--paper-100)] text-[var(--text)] transition-colors cursor-pointer"
        title="Customize line color, node fill & canvas background"
      >
        {/* Two-tone style preview capsule */}
        <div className="flex items-center -space-x-1">
          <span
            className="w-3 h-3 rounded-full border border-black/20 z-10 shadow-2xs"
            style={{ backgroundColor: lineColor }}
          />
          <span
            className="w-3 h-3 rounded-full border border-black/20"
            style={{
              backgroundColor:
                fillColor === 'transparent' ? '#71717a' : fillColor,
            }}
          />
        </div>

        <span>Appearance</span>

        <ChevronDown
          size={12}
          className={`text-[var(--text-muted)] transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Modern Popover Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-[var(--accent)]" />
              <span className="text-xs font-semibold text-[var(--text)]">
                Diagram Styling
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
              {canvasBg} canvas
            </span>
          </div>

          {/* Live Node Preview Card */}
          <div
            className={`w-full rounded-xl p-3.5 mb-4 border border-[var(--border)] transition-colors flex items-center justify-center select-none ${
              canvasBg === 'dark' ? 'bg-[#121214]' : 'bg-[#f8fafc]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-0.5 rounded-full"
                style={{ backgroundColor: lineColor }}
              />
              <div
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border shadow-xs transition-all flex items-center gap-1.5"
                style={{
                  borderColor: lineColor,
                  backgroundColor:
                    fillColor === 'transparent'
                      ? 'transparent'
                      : fillColor,
                  color: sampleTextColor,
                }}
              >
                <span>Sample Node</span>
              </div>
              <span
                className="w-4 h-0.5 rounded-full"
                style={{ backgroundColor: lineColor }}
              />
            </div>
          </div>

          {/* Section 1: Line & Border (Stroke) */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[var(--text)] flex items-center gap-1.5">
                <span>Line & Border</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                {lineColor}
              </span>
            </div>

            {/* Sleek Horizontal Swatch Strip */}
            <div className="flex items-center justify-between gap-1 p-1 bg-[var(--paper-100)] rounded-xl border border-[var(--border)]">
              {LINE_COLOR_PRESETS.map((preset) => {
                const isSelected =
                  lineColor.toLowerCase() === preset.color.toLowerCase()
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectLineColor(preset.color)}
                    className={`w-6 h-6 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'scale-110 ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface)]'
                        : 'hover:scale-105 opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: preset.color }}
                    title={preset.label}
                  >
                    {isSelected && (
                      <Check
                        size={11}
                        className={
                          preset.color === '#ffffff'
                            ? 'text-black'
                            : 'text-white'
                        }
                      />
                    )}
                  </button>
                )
              })}

              {/* Custom Line Color Pipette */}
              <label
                className="w-6 h-6 rounded-full border border-[var(--border)] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white cursor-pointer relative hover:scale-105 transition-transform"
                title="Choose custom line color"
              >
                <Pipette size={10} />
                <input
                  type="color"
                  value={lineColor}
                  onChange={(e) => setLineColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>
            </div>
          </div>

          {/* Section 2: Node Fill Color */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[var(--text)] flex items-center gap-1.5">
                <Layers size={12} className="text-[var(--text-muted)]" />
                <span>Node Fill Color</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                {fillColor === 'transparent' ? 'None' : fillColor}
              </span>
            </div>

            {/* Pill chips for fill options */}
            <div className="grid grid-cols-3 gap-1.5">
              {FILL_COLOR_PRESETS.map((preset) => {
                const isSelected =
                  fillColor.toLowerCase() === preset.color.toLowerCase()
                return (
                  <button
                    key={preset.id}
                    onClick={() => setFillColor(preset.color)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--text)] font-semibold shadow-2xs'
                        : 'border-[var(--border)] hover:bg-[var(--paper-100)] text-[var(--text)]'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full border border-black/20 shrink-0 ${
                        preset.color === 'transparent'
                          ? 'border-dashed border-zinc-400 bg-transparent'
                          : ''
                      }`}
                      style={{
                        backgroundColor:
                          preset.color !== 'transparent'
                            ? preset.color
                            : undefined,
                      }}
                    />
                    <span className="text-[10px] truncate">{preset.label.split(' ')[0]}</span>
                  </button>
                )
              })}

              {/* Custom Fill Color */}
              <label
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--paper-100)] text-[var(--text)] text-xs cursor-pointer relative"
                title="Choose custom node fill color"
              >
                <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-400 shrink-0" />
                <span className="text-[10px] text-[var(--text-muted)] truncate">Custom</span>
                <input
                  type="color"
                  value={fillColor === 'transparent' ? '#1c1c20' : fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Canvas Background Mode */}
          <div className="pt-3 border-t border-[var(--border)]">
            <span className="block text-[11px] font-semibold text-[var(--text)] mb-2">
              Canvas Background
            </span>
            <div className="grid grid-cols-2 gap-1.5 bg-[var(--paper-100)] p-1 rounded-xl border border-[var(--border)]">
              <button
                onClick={() => handleSelectCanvasBg('dark')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  canvasBg === 'dark'
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <Moon size={12} className="text-blue-400" />
                <span>Dark Canvas</span>
              </button>

              <button
                onClick={() => handleSelectCanvasBg('light')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  canvasBg === 'light'
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <Sun size={12} className="text-amber-500" />
                <span>Light Canvas</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
