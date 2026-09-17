import { create } from 'zustand'
import type { DiagramTheme } from '@/lib/validators/diagram'
import {
  DEFAULT_DIAGRAM_CODE,
  DEFAULT_THEME,
  DEFAULT_LINE_COLOR,
  DEFAULT_FILL_COLOR,
  DEFAULT_CANVAS_BG,
  isLightColor,
} from '@/lib/constants'

export interface ToastNotification {
  id: number
  message: string
}

interface EditorState {
  code: string
  theme: DiagramTheme
  lineColor: string
  fillColor: string
  canvasBg: 'dark' | 'light'
  isDirty: boolean
  isSaving: boolean
  diagramId: string | null
  title: string
  forceRenderTrigger: number
  toast: ToastNotification | null
  // Actions
  setCode: (code: string) => void
  setTheme: (theme: DiagramTheme) => void
  setLineColor: (color: string) => void
  setFillColor: (color: string) => void
  setCanvasBg: (bg: 'dark' | 'light') => void
  showToast: (message: string) => void
  clearToast: () => void
  setDirty: (dirty: boolean) => void
  setSaving: (saving: boolean) => void
  setDiagramId: (id: string | null) => void
  setTitle: (title: string) => void
  forceRender: () => void
  reset: () => void
  loadDiagram: (diagram: {
    id: string
    title: string
    code: string
    theme: DiagramTheme
  }) => void
}

const initialState = {
  code: DEFAULT_DIAGRAM_CODE,
  theme: 'dark' as DiagramTheme,
  lineColor: DEFAULT_LINE_COLOR,
  fillColor: DEFAULT_FILL_COLOR,
  canvasBg: DEFAULT_CANVAS_BG,
  isDirty: false,
  isSaving: false,
  diagramId: null,
  title: 'Untitled diagram',
  forceRenderTrigger: 0,
  toast: null,
}

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,
  setCode: (code) => set({ code, isDirty: true }),
  setTheme: (theme) => set({ theme, isDirty: true }),
  setLineColor: (lineColor) => set({ lineColor, isDirty: true }),
  setFillColor: (fillColor) => set({ fillColor, isDirty: true }),
  setCanvasBg: (canvasBg) =>
    set((state) => {
      if (state.canvasBg === canvasBg) return state

      let newLineColor = state.lineColor
      let toast = state.toast

      // When switching to dark canvas: if lines were dark, smartly switch to white lines
      if (canvasBg === 'dark' && (state.lineColor === '#000000' || !isLightColor(state.lineColor))) {
        newLineColor = '#ffffff'
        toast = {
          id: Date.now(),
          message: 'Lines color was adjusted for visibility',
        }
      }
      // When switching to light canvas: if lines were white, smartly switch to black lines
      else if (canvasBg === 'light' && state.lineColor.toLowerCase() === '#ffffff') {
        newLineColor = '#000000'
        toast = {
          id: Date.now(),
          message: 'Lines color was adjusted for visibility',
        }
      }

      return {
        canvasBg,
        lineColor: newLineColor,
        toast,
        isDirty: true,
      }
    }),
  showToast: (message) =>
    set({
      toast: {
        id: Date.now(),
        message,
      },
    }),
  clearToast: () => set({ toast: null }),
  setDirty: (isDirty) => set({ isDirty }),
  setSaving: (isSaving) => set({ isSaving }),
  setDiagramId: (diagramId) => set({ diagramId }),
  setTitle: (title) => set({ title, isDirty: true }),
  forceRender: () => set((s) => ({ forceRenderTrigger: s.forceRenderTrigger + 1 })),
  reset: () => set(initialState),
  loadDiagram: (diagram) =>
    set({
      diagramId: diagram.id,
      title: diagram.title,
      code: diagram.code,
      theme: diagram.theme as DiagramTheme,
      canvasBg: diagram.theme === 'default' ? 'light' : 'dark',
      lineColor: DEFAULT_LINE_COLOR,
      fillColor: DEFAULT_FILL_COLOR,
      isDirty: false,
    }),
}))
