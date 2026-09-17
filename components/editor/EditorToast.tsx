'use client'

import { useEffect, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { Sparkles, X } from 'lucide-react'

export function EditorToast() {
  const { toast, clearToast } = useEditorStore()
  const [activeToast, setActiveToast] = useState(toast)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (toast) {
      setActiveToast(toast)
      // Guarantee initial state is painted before animating in
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true)
        })
      })

      const dismissTimer = setTimeout(() => {
        setVisible(false)
      }, 3500)

      return () => {
        cancelAnimationFrame(raf)
        clearTimeout(dismissTimer)
      }
    } else {
      setVisible(false)
    }
  }, [toast?.id])

  // Clean up store and state after leave animation completes
  useEffect(() => {
    if (!visible && activeToast) {
      const exitTimer = setTimeout(() => {
        setActiveToast(null)
        clearToast()
      }, 300)
      return () => clearTimeout(exitTimer)
    }
  }, [visible, activeToast, clearToast])

  function handleDismiss() {
    setVisible(false)
  }

  if (!activeToast) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
        visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-2.5 scale-95 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-2.5 px-4 py-2 bg-zinc-900/95 dark:bg-zinc-800/95 backdrop-blur-md text-zinc-100 text-xs font-medium rounded-xl border border-zinc-700/60 shadow-2xl">
        <Sparkles size={14} className="text-zinc-300 shrink-0" />
        <span>{activeToast.message}</span>
        <button
          onClick={handleDismiss}
          className="ml-1 text-zinc-400 hover:text-zinc-200 transition-colors p-0.5 rounded cursor-pointer"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
